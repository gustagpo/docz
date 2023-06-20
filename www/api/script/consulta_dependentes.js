docz.script.consulta_dependentes = class ConsultaDependentes extends (
  docz.script.generic_consulta
) {
  constructor($el) {
    super("consulta_dependentes", $el);

    this.$tabela = this.$html.find("[data-ref=tabela]");
    this.$tbody = this.$tabela.find("tbody");
    this.$info = this.$html.find("[data-ref=info]");
    this.$item = this.$html.find("[data-ref=item]");
    this.$loading = this.$html.find("[data-ref=loading]");

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
    this.$html.find('[data-ref="containerMostraObjetosContainer"]').hide();
    this.$html
      .find('[data-ref="containerMostraObjetosContainerClienteSelecao"]')
      .hide();

    if (this.isObjetoSOS(cod.toUpperCase())) {
      return new Promise((resolve, reject) => {
        this.$tbody.html("");
        this.$info.html("");
        this.$item.html(cod);
        this.item_pesquisado = cod;

        this.$loading.show();

        this.rest
          .docz("getObjetosContainer", { idSOS: cod, app: "APP_ANDROID_SOS" })
          .then((rs) => {
            let obj = null;
            if (rs["getObjetosContainerReturn"]) {
              obj = JSON.parse(rs["getObjetosContainerReturn"]);
              if (obj["documentos"] && obj["documentos"].length > 0) {
                $.each(obj["documentos"], (i, documento) => {
                  const $tr = $("<tr></tr>");
                  $(
                    "<td>" + documento.valores["Identificador SOS"] + "</td>"
                  ).appendTo($tr);

                  $(
                    "<td>" +
                      documento.valores["Identificador Cliente"] +
                      "</td>"
                  ).appendTo($tr);

                  const $td_link = $("<td></td>");
                  const $link = $(
                    '<span class="highlighted bg-blue-dark color-white">Detalhar</span>'
                  );
                  $link.unbind("click").click(() => {
                    console.log(documento);
                    let msg = "";
                    const keys = Object.keys(documento.valores);
                    keys.sort();
                    $.each(keys, (i, key) => {
                      msg += key + ": " + documento.valores[key] + "\n";
                    });
                    navigator.notification.alert(msg, () => {}, "Docz", "Ok");
                  });
                  $link.appendTo($td_link);
                  $td_link.appendTo($tr);
                  $tr.appendTo(this.$tbody);
                });
                this.$loading.hide();
                this.$info.html("");
                this.$html
                  .find('[data-ref="containerMostraObjetosContainer"]')
                  .show();
              } else {
                this.$loading.hide();
                this.$info.html(
                  "Nenhum objeto encontrado para o identificador informado."
                );
              }
            } else {
              this.$loading.hide();
              this.$info.html(
                "Nenhum objeto encontrado para o identificador informado."
              );
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

              $("#listaItensClienteConsultaContainer").empty();

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
                      this.$html.find(
                        '[data-ref="listaItensClienteConsultaContainer"]'
                      )
                    );

                    temItens = true;
                  }

                  if (!temItens) {
                    navigator.notification.alert(
                      "Nenhum objeto encontrado para o identificador informado."
                    );
                  } else {
                    this.$html
                      .find(
                        '[data-ref="containerMostraObjetosContainerClienteSelecao"]'
                      )
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
                "Ocorreu um erro ao tentar incluir o item: " +
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
};
