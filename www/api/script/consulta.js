docz.script.consulta = class Consulta extends docz.script.generic_consulta {
  constructor($el) {
    super("consulta", $el);

    this.$tabela = this.$html.find("[data-ref=tabela]");
    this.$tbody = this.$tabela.find("tbody");
    this.$info = this.$html.find("[data-ref=info]");
    this.$item = this.$html.find("[data-ref=item]");
    this.$loading = this.$html.find("[data-ref=loading]");

    this.$btn_historico = this.$html.find("[data-ref=btn-historico]");

    this.$html.find('[data-ref="containerMostraObjetoConsultado"]').hide();
    this.$html.find('[data-ref="containerMostraObjetosClienteSelecao"]').hide();

    this.$btn_historico.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_historico)) {
        this.historico()
          .then(() => {
            this.stopLoadingAction(this.$btn_historico);
          })
          .catch((err) => {
            this.stopLoadingAction(this.$btn_historico);
          });
      }
    });

    this.$btn_expurgo = this.$html.find("[data-ref=btn-expurgo]");
    this.$btn_expurgo.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_expurgo)) {
        navigator.notification.confirm(
          "Deseja Realizar o Expurgo",
          (buttonIndex) => {
            if (buttonIndex === 1) {
              this.expurgo()
                .then(() => {
                  this.stopLoadingAction(this.$btn_expurgo);
                })
                .catch((err) => {
                  this.stopLoadingAction(this.$btn_expurgo);
                });
            } else {
              this.stopLoadingAction(this.$btn_expurgo);
            }
          },
          "Docz",
          ["Ok", "Cancelar"]
        );
      }
      e.preventDefault();
    });

    this.item_pesquisado = null;
  }

  isObjetoSOS(codigo) {
    var retorno = false;
    if (codigo.length > 3) {
      if (codigo.endsWith("SOS")) {
        if (
          codigo.startsWith("CX") ||
          codigo.startsWith("LM") ||
          codigo.startsWith("CB") ||
          codigo.startsWith("DC")
        ) {
          retorno = true;
        }
      }
    }
    return retorno;
  }

  pegaDescricaoObjeto(objeto) {
    let descricaoObjetoSelecionado = "";

    if (objeto.tipo == 1) {
      if (docz.util.storage.get("camposOS") != null) {
        let campos = docz.util.storage.get("camposOS").split(";");

        for (var i = 0; i < campos.length; i++) {
          let campo = campos[i].split("|");
          descricaoObjetoSelecionado +=
            (campo[0] != null ? campo[0] : "") +
            " " +
            (objeto.valores[campo[1]] != null ? objeto.valores[campo[1]] : "") +
            " | ";
        }
      } else {
        descricaoObjetoSelecionado = objeto.valores["c1"];
      }
    } else {
      descricaoObjetoSelecionado =
        objeto.valores["c5"] +
        (typeof objeto.valores["c6"] !== "undefined"
          ? " - " + objeto.valores["c6"]
          : "");
    }

    return descricaoObjetoSelecionado;
  }

  pesquisar(cod, tipo) {
    this.$html.find('[data-ref="containerMostraObjetoConsultado"]').hide();
    this.$html.find('[data-ref="containerMostraObjetosClienteSelecao"]').hide();

    if (this.isObjetoSOS(cod.toUpperCase())) {
      return new Promise((resolve, reject) => {
        this.$tbody.html("");
        this.$info.html("");

        this.$item.html(cod);
        this.item_pesquisado = cod;

        this.$btn_expurgo.hide();
        this.$loading.show();

        this.rest
          .docz("getObjeto", { idSOS: cod, app: "APP_ANDROID_SOS" })
          .then((rs) => {
            let obj = null;
            if (rs["getObjetoReturn"]) {
              obj = JSON.parse(rs["getObjetoReturn"]);

              if (obj.documento.valores != null) {
                const dados = obj["documento"]["valores"];
                const keys = Object.keys(dados);
                keys.sort();

                $.each(keys, (i, key) => {
                  $(
                    "<tr><td>" + key + "</td><td>" + dados[key] + "</td></tr>"
                  ).appendTo(this.$tbody);
                });

                this.$loading.hide();
                this.$html
                  .find('[data-ref="containerMostraObjetoConsultado"]')
                  .show();

                if (docz.util.storage.get("cliente").toLowerCase() != "guarda")
                  this.$btn_expurgo.show();
              } else {
                this.$loading.hide();
                this.$info.html("N�o Encontrado");
              }
            } else {
              this.$loading.hide();
              this.$info.html("N�o Encontrado");
            }
            resolve(obj);
          })
          .catch((err) => {
            this.$loading.hide();
            this.$info.html("Problema na consulta");
            console.log(err);
            reject(err);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.$loading.show();
        let idObjeto = cod;

        if (idObjeto != null && idObjeto != "") {
          this.rest
            .docz("pegaObjetosPeloIdCliente", {
              idCliente: idObjeto,
              codigoGuarda: docz.util.storage.get("codigoGuarda"),
              login: docz.util.storage.get("user"),
              app: "APP_ANDROID_SOS",
            })
            .then((rs) => {
              var obj = rs.pegaObjetosPeloIdClienteReturn;
              obj = JSON.parse(obj);

              $("#listaItensCliente_Crud").empty();

              if (obj.status == "success") {
                if (obj.objetos == null) {
                  navigator.notification.alert(
                    "Nenhum objeto encontrado para o identificador informado."
                  );
                } else {
                  let temItens = false;

                  for (var i in obj.objetos) {
                    let item = obj.objetos[i];

                    const $tr = $("<tr></tr>");

                    $("<td>" + item.valores.c1 + "</td>").appendTo($tr);
                    $(
                      "<td>" + this.pegaDescricaoObjeto(item) + "</td>"
                    ).appendTo($tr);

                    const $td_link = $("<td></td>");

                    const $link = $("<img src='images/icons/add.png'></img>");
                    $link.unbind("click").click(() => {
                      this.pesquisar(item.valores.c1, "Direto");
                    });

                    $link.appendTo($td_link);

                    $td_link.appendTo($tr);
                    $tr.appendTo(
                      this.$html.find('[data-ref="listaItensCliente_Crud"]')
                    );

                    temItens = true;
                  }

                  if (!temItens) {
                    navigator.notification.alert(
                      "Nenhum objeto encontrado para o identificador informado."
                    );
                  } else {
                    this.$html
                      .find('[data-ref="containerMostraObjetosClienteSelecao"]')
                      .show();
                  }
                }
              } else {
                navigator.notification.alert(obj.mensagem);
              }

              this.$loading.hide();
              resolve();
            })
            .catch((err) => {
              var msg = null;
              if (typeof err == "object") msg = err.statusText;
              else msg = JSON.parse(err).mensagem;

              navigator.notification.alert(
                "Ocorreu um erro ao tentar consultar o item: " +
                  cod +
                  ".\nTente novamente ou entre em contato com a Guarda SOSDocs." +
                  "\n" +
                  msg
              );

              this.$loading.hide();
              reject();
            });
        } else {
          navigator.notification.alert("Informar um item para pesquisa.");
          this.$loading.hide();
          reject();
        }
      });
    }
  }

  expurgo() {
    return new Promise((resolve, reject) => {
      const user = docz.util.storage.get("user");
      console.log("expurgo", this.item_pesquisado, user);
      this.$info.html("");
      this.$loading.show();
      this.rest
        .docz("solicitarExpurgo", {
          idSOS: this.item_pesquisado,
          login: user,
          app: "APP_ANDROID_SOS",
        })
        .then((rs) => {
          this.$loading.hide();
          this.$info.html("Expurgo solicitado com sucesso");
          resolve();
        })
        .catch((err) => {
          this.$loading.hide();
          this.$info.html("Problema ao fazer o Expurgo");
          reject(err);
        });
    });
  }

  historico() {
    console.log("historico", this.item_pesquisado);
    //const rs = {"status":"sucess","mensagem":"","historico":[{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Atualização de Identificador Cliente","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Atualização de Tipo de Objeto","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Atualização de Identificador Cliente","dataCriacao":"Aug 10, 2015 2:49:12 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM","dataAtualizacao":"Oct 2, 2015 5:05:11 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM","dataAtualizacao":"Oct 2, 2015 5:05:11 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM","dataAtualizacao":"Oct 2, 2015 5:05:11 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM","dataAtualizacao":"Oct 2, 2015 5:05:11 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM","dataAtualizacao":"Oct 2, 2015 5:05:11 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM","dataAtualizacao":"Oct 2, 2015 5:05:11 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM","dataAtualizacao":"Oct 2, 2015 5:05:11 PM"},{"documento":"CX0000800016860SOS","status":"Alteração de Metadados","dataCriacao":"Aug 10, 2015 2:49:12 PM","dataAtualizacao":"Oct 2, 2015 5:05:11 PM"},{"documento":"CX0000800016860SOS","status":"Atualização de Tipo de Objeto","dataCriacao":"Aug 10, 2015 2:49:12 PM","dataAtualizacao":"Oct 21, 2016 2:15:04 PM"}]};
    return new Promise((resolve, reject) => {
      this.$tabela.hide();
      this.$tbody.html("");
      this.$info.html("");
      this.$loading.show();

      this.rest
        .docz("getHistoricoObjeto", {
          idSOS: this.item_pesquisado,
          app: "APP_ANDROID_SOS",
        })
        .then((rs) => {
          console.log(rs);

          var objHistorico = JSON.parse(rs["getHistoricoObjetoReturn"]);
          if (objHistorico["historico"] != null) {
            $.each(objHistorico["historico"], (i, item) => {
              $(
                "<tr><td>" +
                  item.dataCriacao +
                  "</td><td>" +
                  item.status +
                  "</td><td>" +
                  item.localizacao +
                  "</td></tr>"
              ).appendTo(this.$tbody);
            });
            this.$loading.hide();
            this.$tabela.show();
          } else {
            this.$loading.hide();
            this.$info.html("Historico N�o Encontrado");
          }
          resolve();
        })
        .catch((err) => {
          this.$loading.hide();
          this.$info.html("Problema ao buscar o Historico");
          reject(err);
        });
    });
  }
};
