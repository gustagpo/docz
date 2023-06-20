docz.script.consulta_os = class Consulta_os extends docz.script.generic_scan {
  constructor($el) {
    super("consulta_os", $el);

    this.$loading = this.$html.find("[data-ref=loading]");

    // Consulta de O.S
    this.$btn_consulta_os_limpar = null;
    this.$btn_consulta_os_texto = null;
    this.$btn_consulta_os_leitor = null;
    this.$btn_consulta_os_scan = null;
    this.$btn_nova_os_emprestimo = null;
    this.$btn_nova_os_devolucao = null;
    this.$btn_nova_os_implantacao = null;
    this.$btn_confirmar_os = null;
    this.$btn_cancelar_os = null;
    this.btn_observacao_os_texto = null;

    //Consulta de O.S
    this.$btn_consulta_os_texto = this.$html.find(
      "[data-ref=btn-texto-consulta-os]"
    );
    this.$btn_consulta_os_scan = this.$html.find(
      "[data-ref=btn-scan-consulta-os]"
    );
    this.$btn_consulta_os_leitor = this.$html.find(
      "[data-ref=btn-leitor-consulta-os]"
    );
    this.$btn_consulta_os_limpar = this.$html.find(
      "[data-ref=btn-limpar-consulta-os]"
    );
    this.$btn_nova_os_emprestimo = this.$html.find(
      "[data-ref=btn-nova-os-emprestimo]"
    );
    this.$btn_nova_os_devolucao = this.$html.find(
      "[data-ref=btn-nova-os-devolucao]"
    );
    this.$btn_nova_os_implantacao = this.$html.find(
      "[data-ref=btn-nova-os-implantacao]"
    );
    this.$btn_cancelar_os = this.$html.find("[data-ref=btn-cancelar-os]");
    this.$btn_confirmar_os = this.$html.find("[data-ref=btn-confirmar-os]");
    this.$btn_voltar_para_os = this.$html.find("[data-ref=btn-voltar-para-os]");
    this.$btn_observacao_os_texto = this.$html.find(
      "[data-ref=btn-observacao-os]"
    );

    this.$tabela_consulta_os = this.$html.find("[data-ref=tabela-consulta-os]");

    this.implementaRecursosConsultaOS();

    this.$tabela_listaOS = this.$html.find(
      "[data-ref=tabela-lista-os-disponiveis]"
    );
    this.$body_listaOS = this.$html.find("[data-ref=listaOS_Crud]");

    this.$listaOS = null;
    this.$osCorrente = null;
  }

  carregar() {
    /*return new Promise((resolve,reject) => {
            buscaOSEmAndamento();
            resolve();
        })*/

    return new Promise((resolve, reject) => {
      docz.util.loading.show();

      $("#containerConsultaOS").hide();
      $("#containerMostraOSConsultada").hide();
      $("#labelConsultaSolicitacoes").html("Solicita&ccedil;&otilde;es");
      this.$tabela_listaOS.find("tbody").empty();

      this.rest
        .docz("buscarSolicitacoesCliente", {
          cliente: docz.util.storage.get("cliente"),
          app: "APP_ANDROID_SOS",
        })
        .then((rs) => {
          var obj = rs.buscarSolicitacoesClienteReturn;
          obj = JSON.parse(obj);

          if (obj.status == "success") {
            var txtMsg = "";

            this.$listaOS = obj.items;

            for (var i in this.$listaOS) {
              let OS = this.$listaOS[i];
              const $tr = $("<tr></tr>");

              const $td_link = $("<td></td>");

              const $link = $("<a>" + OS.nome + "</a>");
              $link.unbind("click").click(() => {
                this.consultaItensOS(OS);
              });

              $link.appendTo($td_link);
              $td_link.appendTo($tr);

              $("<td>" + OS.status + "</td>").appendTo($tr);
              $("<td>" + OS.tipo + "</td>").appendTo($tr);

              $tr.appendTo(this.$body_listaOS);
            }

            $("#tableListaOS").show();
          } else {
            this.$error.html("Erro: " + obj.mensagem);
            if (
              obj.mensagem.includes(
                "Solicita&ccedil;&atilde;o n&atilde;o encontrada"
              )
            )
              this.ultima_os = null;
          }

          $("#containerConsultaOS").show();

          docz.util.loading.stop();
          resolve();
        })
        .catch((err) => {
          var msg = null;
          if (typeof err == "object") msg = err.statusText;
          else msg = JSON.parse(err).mensagem;

          this.$error.html("Erro: " + msg);

          docz.util.loading.stop();

          reject();
        });
    });
  }

  consultaItensOS(OS) {
    return new Promise((resolve, reject) => {
      docz.util.loading.show();

      this.$lista.html("");
      this.$error.html("");
      if (OS != null) {
        this.$osCorrente = OS;
        this.$tabela_consulta_os.find("tbody").empty();

        this.rest
          .docz("buscarSolicitacao", {
            solicitacao: OS.id,
            app: "APP_ANDROID_SOS",
          })
          .then((rs) => {
            var obj = rs.buscarSolicitacaoReturn;
            obj = JSON.parse(obj);

            if (obj.status == "success") {
              this.m$success.play();

              var validado = true;
              let cancelados = 0;
              $("#listaItemOS_Crud").empty();

              for (var i in obj.items) {
                let item = obj.items[i];

                const $tr = $("<tr></tr>");

                //$('<td>' + (Number(i) + 1) + '</td>').appendTo($tr);
                $("<td>" + item.item + "</td>").appendTo($tr);

                /*let msg = '';
                            
                            const keys = Object.keys(item.valores);
                            
                            keys.sort();
                            
                            $.each(keys,(k,key)=>{
                                msg += key+': '+documento.valores[key]+'\n';
                            });

                            navigator.notification.alert(
                                msg,
                                ()=>{},
                                'Docz',
                                'Ok'
                            );*/

                $("<td>" + item.descricao + "</td>").appendTo($tr);

                const $td_link = $("<td></td>");

                if (
                  item.statusItem != "CANCELADO" &&
                  (OS.status == "ABERTA" || OS.status == "RASCUNHO")
                ) {
                  const $link = $('<i class="fa fa-ban"></i>');
                  $link.unbind("click").click(() => {
                    this.cancelarItemOS(OS, item);
                  });

                  $link.appendTo($td_link);
                } else if (item.statusItem == "CANCELADO") {
                  $td_link.html("CANCELADO");
                }

                if (item.statusItem == "CANCELADO") {
                  cancelados++;
                }

                $td_link.appendTo($tr);
                $tr.appendTo(this.$html.find('[data-ref="listaItemOS_Crud"]'));
              }

              $("#div-itens-cancelados").html(
                "Itens cancelados: " + cancelados
              );

              if (obj.items.length > 0) this.$status.hide();
              else this.$status.show();

              $("#btns-consulta-os-carregada").hide();
              if (
                OS.tipo == "EMPRESTIMO" ||
                OS.tipo == "DEVOLUCAO" ||
                OS.tipo == "IMPLANTACAO"
              ) {
                if (OS.status == "ABERTA" || OS.status == "RASCUNHO") {
                  this.$html.find('[data-ref="btn-confirmar-os"]').show();

                  if (OS.status == "ABERTA") {
                    this.$html.find('[data-ref="btn-confirmar-os"]').hide();
                  }

                  $("#btns-consulta-os-carregada").show();
                  $("#btns-rodapeOS").show();
                } else {
                  $("#btns-rodapeOS").hide();
                }
              }

              $("#labelConsultaSolicitacoes").html(
                "OS: " + OS.nome + " - " + OS.prioridade
              );

              $("#div-data-consulta-os").html("Data: " + OS.data);

              $("#div-usuario-consulta-os").html(
                "Solicitante: " + OS.nomeUsuario
              );

              $("#div-tipo-consulta-os").html(
                "Tipo: " + OS.tipo + " | Status: " + OS.status
              );

              $("#containerItemsSelecaoCliente").hide();
              $("#viewCorpoOS").show();

              this.$tabela_consulta_os.show();
              $("#containerConsultaOS").hide();
              $("#containerMostraOSConsultada").show();
            } else {
              this.$error.html("Erro: " + obj.mensagem);
              this.$osCorrente = null;
            }

            docz.util.loading.stop();
            resolve();
          })
          .catch((err) => {
            var msg = null;
            if (typeof err == "object") msg = err.statusText;
            else msg = JSON.parse(err).mensagem;

            this.$error.html("Erro: " + msg);

            docz.util.loading.stop();

            this.$osCorrente = null;
            this.carregar();

            reject();
          });
      } else {
        docz.util.loading.stop();
        this.$error.html(
          "Erro: N&atilde;o foi poss&iacute;vel identificar a O.S."
        );

        this.$osCorrente = null;
        this.carregar();

        reject();
      }
    });
  }

  confirmarOS(OS) {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      if (OS != null) {
        this.rest
          .docz("confirmarSolicitacao", {
            solicitacao: OS.id,
            login: docz.util.storage.get("user"),
            app: "APP_ANDROID_SOS",
          })
          .then((rs) => {
            var obj = rs.confirmarSolicitacaoReturn;
            obj = JSON.parse(obj);

            if (obj.status == "success") {
              this.m$success.play();
              navigator.notification.alert(obj.mensagem);
            } else {
              this.m$error.play();
              navigator.notification.alert(obj.mensagem);
            }

            this.$loading.hide();
            this.carregar();

            resolve();
          })
          .catch((err) => {
            var msg = null;
            if (typeof err == "object") msg = err.statusText;
            else msg = JSON.parse(err).mensagem;

            this.m$error.play();
            navigator.notification.alert(
              "Ocorreu um erro ao tentar realizar a confirma&ccedil;&atilde;o da O.S.\nTente novamente ou entre em contato com a Guarda SOSDocs." +
                "\n" +
                msg
            );

            this.$loading.hide();
            reject();
          });
      } else {
        this.$error.html(
          "Erro: N&atilde;o foi poss&iacute;vel identificar a O.S."
        );

        this.$loading.hide();
        reject();
      }
    });
  }

  cancelarOS(OS) {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      if (OS != null) {
        this.rest
          .docz("cancelarSolicitacao", {
            solicitacao: OS.id,
            login: docz.util.storage.get("user"),
            app: "APP_ANDROID_SOS",
          })
          .then((rs) => {
            var obj = rs.cancelarSolicitacaoReturn;
            obj = JSON.parse(obj);

            if (obj.status == "success") {
              this.m$success.play();
              navigator.notification.alert(
                "O.S cancelada com sucesso.\nOs itens inclu&iacute;dos na O.S tiveram seus status alterados para o status anterior a O.S."
              );
            } else {
              this.m$error.play();
              navigator.notification.alert(
                "N&atilde;o foi poss&iacute;vel cancelar a O.S.\nEntre em contato com a Guarda SOS."
              );
            }

            this.$loading.hide();
            this.carregar();

            resolve();
          })
          .catch((err) => {
            var msg = null;
            if (typeof err == "object") msg = err.statusText;
            else msg = JSON.parse(err).mensagem;

            this.m$error.play();
            navigator.notification.alert(
              "Ocorreu um erro ao tentar realizar o cancelamento da O.S.\nTente novamente ou entre em contato com a Guarda SOSDocs." +
                "\n" +
                msg
            );

            this.$loading.hide();
            reject();
          });
      } else {
        this.$error.html(
          "Erro: N&atilde;o foi poss&iacute;vel identificar a O.S."
        );

        this.$loading.hide();
        reject();
      }
    });
  }

  cancelarItemOS(OS, item) {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      if (OS != null && item != null) {
        this.rest
          .docz("cancelarItemOS", {
            solicitacao: OS.id,
            item: item.id,
            login: docz.util.storage.get("user"),
            app: "APP_ANDROID_SOS",
          })
          .then((rs) => {
            var obj = rs.cancelarItemOSReturn;
            obj = JSON.parse(obj);

            if (obj.status == "success") {
              this.m$success.play();
              navigator.notification.alert(
                "Item " +
                  item.item +
                  " - " +
                  item.descricao +
                  " cancelado com sucesso."
              );
            } else {
              this.m$error.play();
              navigator.notification.alert(
                "N&atilde;o foi poss&iacute;vel cancelar o item " +
                  item.item +
                  " - " +
                  item.descricao +
                  ".\nEntre em contato com a Guarda SOS."
              );
            }

            this.$loading.hide();
            this.consultaItensOS(OS);

            resolve();
          })
          .catch((err) => {
            var msg = null;
            if (typeof err == "object") msg = err.statusText;
            else msg = JSON.parse(err).mensagem;

            this.m$error.play();
            navigator.notification.alert(
              "Ocorreu um erro ao tentar realizar o sincronismo do item: " +
                item.item +
                " - " +
                item.descricao +
                ".\nTente novamente ou entre em contato com a Guarda SOSDocs." +
                "\n" +
                msg
            );

            this.$loading.hide();
            reject();
          });
      } else {
        this.$error.html(
          "Erro: N&atilde;o foi poss&iacute;vel identificar a O.S."
        );

        this.$loading.hide();
        reject();
      }
    });
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

  adicionarItemOS(OS, item) {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      if (OS != null && item != null) {
        let podeAvancar = true;
        $.each(OS.objetosSolicitacao, (key, k) => {
          if (k.item == item) {
            podeAvancar = false;
            return;
          }
        });

        if (!podeAvancar) {
          this.m$error.play();
          navigator.notification.alert("Objeto já está incluído na O.S.");

          this.$loading.hide();
          reject();
          return;
        }

        if (this.isObjetoSOS(item)) {
          if (
            parseInt(item.substring(2, 7)) ==
            docz.util.storage.get("codigoGuarda")
          ) {
            this.rest
              .docz("adicionarItemOS", {
                solicitacao: OS.id,
                item: item,
                login: docz.util.storage.get("user"),
                app: "APP_ANDROID_SOS",
              })
              .then((rs) => {
                var obj = rs.adicionarItemOSReturn;
                obj = JSON.parse(obj);

                if (obj.status == "success") {
                  this.m$success.play();
                  navigator.notification.alert(
                    "Item " + item + " adicionado com sucesso."
                  );
                } else {
                  this.m$error.play();
                  navigator.notification.alert(obj.mensagem);
                }

                this.$loading.hide();
                this.consultaItensOS(OS);

                resolve();
              })
              .catch((err) => {
                var msg = null;
                if (typeof err == "object") msg = err.statusText;
                else msg = JSON.parse(err).mensagem;

                this.m$error.play();
                navigator.notification.alert(
                  "Ocorreu um erro ao tentar realizar a adi&ccedil;&atilde;o do item: " +
                    item +
                    ".\nTente novamente ou entre em contato com a Guarda SOSDocs." +
                    "\n" +
                    msg
                );

                this.$loading.hide();
                reject();
              });
          } else {
            this.m$error.play();
            navigator.notification.alert(
              "Etiqueta de identificação n&atilde;o corresponde ao projeto selecionado.\nTente novamente e/ou selecione o projeto correto."
            );

            this.$loading.hide();
            reject();
          }
        } else {
          this.m$error.play();
          navigator.notification.alert(
            "N&atilde;o é uma etiqueta de identificação SOS."
          );

          this.$loading.hide();
          reject();
        }
      } else {
        this.$error.html(
          "Erro: N&atilde;o foi poss&iacute;vel identificar a O.S."
        );

        this.$loading.hide();
        reject();
      }
    });
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
      descricaoObjetoSelecionado = objeto.valores["c1"];
    }

    return descricaoObjetoSelecionado;
  }

  buscaItensIdCliente(OS, idObjeto) {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      if (OS != null && idObjeto != null && idObjeto != "") {
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

            if (obj.status == "success") {
              $("#listaSelecaoItensClienteOS_Crud").empty();

              if (obj.objetos == null) {
                $("#viewCorpoOS").show();
                $("#containerItemsSelecaoCliente").hide();

                navigator.notification.alert(
                  "Nenhum objeto encontrado para o identificador informado."
                );
              } else {
                let temItens = false;

                for (var i in obj.objetos) {
                  let item = obj.objetos[i];

                  if (
                    item.valores.c3 != "SOLICITADO" &&
                    item.valores.c3 != "SAIDA DEFINITIVA" &&
                    item.valores.c3 != "EXPURGADO"
                  ) {
                    const $tr = $("<tr></tr>");

                    $("<td>" + item.valores.c1 + "</td>").appendTo($tr);
                    $(
                      "<td>" + this.pegaDescricaoObjeto(item) + "</td>"
                    ).appendTo($tr);

                    const $td_link = $("<td></td>");

                    const $link = $("<img src='images/icons/add.png'></img>");
                    $link.unbind("click").click(() => {
                      this.adicionarItemOS(OS, item.valores.c1);
                    });

                    $link.appendTo($td_link);

                    $td_link.appendTo($tr);
                    $tr.appendTo(
                      this.$html.find(
                        '[data-ref="listaSelecaoItensClienteOS_Crud"]'
                      )
                    );

                    temItens = true;
                  }
                }

                if (!temItens) {
                  $("#viewCorpoOS").show();
                  $("#containerItemsSelecaoCliente").hide();

                  navigator.notification.alert(
                    "Nenhum objeto encontrado para o identificador informado."
                  );
                } else {
                  $("#viewCorpoOS").hide();
                  $("#containerItemsSelecaoCliente").show();
                }

                this.m$success.play();
              }
            } else {
              this.m$error.play();
              navigator.notification.alert(obj.mensagem);
            }

            this.$loading.hide();

            resolve();
          })
          .catch((err) => {
            var msg = null;
            if (typeof err == "object") msg = err.statusText;
            else msg = JSON.parse(err).mensagem;

            this.m$error.play();
            navigator.notification.alert(
              "Ocorreu um erro ao incluir o item na O.S: " +
                item +
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

  NovaOSDevolucao() {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      this.rest
        .docz("criarSolicitacao", {
          cliente: docz.util.storage.get("cliente"),
          codigoGuarda: docz.util.storage.get("codigoGuarda"),
          tipo: "DEVOLUCAO",
          prioridade: "NORMAL",
          login: docz.util.storage.get("user"),
          app: "APP_ANDROID_SOS",
        })
        .then((rs) => {
          var obj = rs.criarSolicitacaoReturn;
          obj = JSON.parse(obj);

          if (obj.status == "success") {
            this.m$success.play();
            navigator.notification.alert(obj.mensagem);
          } else {
            this.m$error.play();
            navigator.notification.alert(obj.mensagem);
          }

          this.$loading.hide();
          this.carregar();

          resolve();
        })
        .catch((err) => {
          var msg = null;
          if (typeof err == "object") msg = err.statusText;
          else msg = JSON.parse(err).mensagem;

          this.m$error.play();
          navigator.notification.alert(
            "Ocorreu um erro ao tentar criar uma nova O.S de devolu&ccedil;&atilde;o.\nTente novamente ou entre em contato com a Guarda SOSDocs." +
              "\n" +
              msg
          );

          this.$loading.hide();
          reject();
        });
    });
  }

  NovaOSImplantacao() {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      this.rest
        .docz("criarSolicitacao", {
          cliente: docz.util.storage.get("cliente"),
          codigoGuarda: docz.util.storage.get("codigoGuarda"),
          tipo: "IMPLANTACAO",
          prioridade: "NORMAL",
          login: docz.util.storage.get("user"),
          app: "APP_ANDROID_SOS",
        })
        .then((rs) => {
          var obj = rs.criarSolicitacaoReturn;
          obj = JSON.parse(obj);

          if (obj.status == "success") {
            this.m$success.play();
            navigator.notification.alert(obj.mensagem);
          } else {
            this.m$error.play();
            navigator.notification.alert(obj.mensagem);
          }

          this.$loading.hide();
          this.carregar();

          resolve();
        })
        .catch((err) => {
          var msg = null;
          if (typeof err == "object") msg = err.statusText;
          else msg = JSON.parse(err).mensagem;

          this.m$error.play();
          navigator.notification.alert(
            "Ocorreu um erro ao tentar criar uma nova O.S de Implanta&ccedil;&atilde;o.\nTente novamente ou entre em contato com a Guarda SOSDocs." +
              "\n" +
              msg
          );

          this.$loading.hide();
          reject();
        });
    });
  }

  NovaOSEmprestimo() {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      this.rest
        .docz("criarSolicitacao", {
          cliente: docz.util.storage.get("cliente"),
          codigoGuarda: docz.util.storage.get("codigoGuarda"),
          tipo: "EMPRESTIMO",
          prioridade: "NORMAL",
          login: docz.util.storage.get("user"),
          app: "APP_ANDROID_SOS",
        })
        .then((rs) => {
          var obj = rs.criarSolicitacaoReturn;
          obj = JSON.parse(obj);

          if (obj.status == "success") {
            this.m$success.play();
            navigator.notification.alert(obj.mensagem);
          } else {
            this.m$error.play();
            navigator.notification.alert(obj.mensagem);
          }

          this.$loading.hide();
          this.carregar();

          resolve();
        })
        .catch((err) => {
          var msg = null;
          if (typeof err == "object") msg = err.statusText;
          else msg = JSON.parse(err).mensagem;

          this.m$error.play();
          navigator.notification.alert(
            "Ocorreu um erro ao tentar criar uma nova O.S de Em.\nTente novamente ou entre em contato com a Guarda SOSDocs." +
              "\n" +
              msg
          );

          this.$loading.hide();
          reject();
        });
    });
  }

  alterarObservacaoSolicitacao(OS, observacao) {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      if (OS != null && observacao != null) {
        this.rest
          .docz("alterarObservacaoSolicitacao", {
            idSol: OS.id,
            observacao: observacao,
            login: docz.util.storage.get("user"),
            app: "APP_ANDROID_SOS",
          })
          .then((rs) => {
            var obj = rs.alterarObservacaoSolicitacaoReturn;
            obj = JSON.parse(obj);

            if (obj.status == "success") {
              this.m$success.play();
              navigator.notification.alert(
                "Observação " + observacao + " adicionado com sucesso."
              );
            } else {
              this.m$error.play();
              navigator.notification.alert(obj.mensagem);
            }

            this.$loading.hide();
            this.consultaItensOS(OS);

            resolve();
          })
          .catch((err) => {
            var msg = null;
            if (typeof err == "object") msg = err.statusText;
            else msg = JSON.parse(err).mensagem;

            this.m$error.play();
            navigator.notification.alert(
              "Ocorreu um erro ao tentar realizar a adi&ccedil;&atilde;o da observação: " +
                observacao +
                ".\nTente novamente ou entre em contato com a Guarda SOSDocs." +
                "\n" +
                msg
            );

            this.$loading.hide();
            reject();
          });
      } else {
        this.$error.html(
          "Erro: N&atilde;o foi poss&iacute;vel identificar a O.S ou observação vazia."
        );

        this.$loading.hide();
        reject();
      }
    });
  }

  implementaRecursosConsultaOS() {
    this.$btn_consulta_os_scan.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_consulta_os_scan)) {
        const THIS = this;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (!result.cancelled) {
              if (THIS.isObjetoSOS(result.text.toUpperCase())) {
                THIS.adicionarItemOS(
                  THIS.$osCorrente,
                  result.text.toUpperCase()
                );
              } else {
                THIS.buscaItensIdCliente(
                  THIS.$osCorrente,
                  result.text.toUpperCase()
                );
              }

              THIS.stopLoadingAction(THIS.$btn_consulta_os_scan);
            }
          },
          function (err) {
            console.log(err);
            THIS.stopLoadingAction(THIS.$btn_consulta_os_scan);
          },
          {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (if available)
            saveHistory: false, // Android, save scan history (default false)
            prompt: "", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats: "QR_CODE,PDF_417,CODE_128", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true, // iOS
            disableSuccessBeep: true, // iOS and Android
          }
        );
      }
      e.preventDefault();
    });

    this.$btn_consulta_os_leitor.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_consulta_os_leitor)) {
        this.$btn_consulta_os_leitor.blur();
        this.$leitor_block.find(".leitor-block-msg").html("");
        $('<ul class="cancelar"><li>Cancelar</li></ul>').appendTo(
          this.$leitor_block.find(".leitor-block-msg")
        );
        const THIS = this;
        const query = "#leitor .leitor-block-msg ul > li";
        const options = {
          query: query,
          left: 400,
          list: true,
          onOpen: function () {
            this.destroy(true);
            THIS.$leitor_block.hide();
            $(document).unbind("leitor");
            THIS.stopLoadingAction(THIS.$btn_consulta_os_leitor);
          },
        };

        const swiped = Swiped.init(options);
        this.$leitor_block.show();

        $(document)
          .unbind("leitor")
          .bind("leitor", (e, valor) => {
            if (valor.key.toLowerCase() === "enter") {
              if (this.isObjetoSOS(this.leitor_data.toUpperCase())) {
                this.adicionarItemOS(
                  this.$osCorrente,
                  this.leitor_data.toUpperCase()
                );
              } else {
                this.buscaItensIdCliente(
                  this.$osCorrente,
                  this.leitor_data.toUpperCase()
                );
              }

              this.leitor_data = "";

              return;
            }

            if (valor.key.toLowerCase() !== "shift") {
              this.leitor_data += valor.key.toUpperCase();
            }
          });
      }

      e.preventDefault();
    });

    this.$btn_consulta_os_texto.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_consulta_os_texto)) {
        navigator.notification.prompt(
          "Código do Objeto",
          (results) => {
            let valor = results["input1"];
            if (this.isObjetoSOS(valor.toUpperCase())) {
              this.adicionarItemOS(this.$osCorrente, valor.toUpperCase())
                .then(() => {
                  this.stopLoadingAction(this.$btn_consulta_os_texto);
                })
                .catch((err) => {
                  this.stopLoadingAction(this.$btn_consulta_os_texto);
                  console.log(err);
                });
            } else {
              this.buscaItensIdCliente(this.$osCorrente, valor.toUpperCase())
                .then(() => {
                  this.stopLoadingAction(this.$btn_consulta_os_texto);
                })
                .catch((err) => {
                  console.log(err);
                  this.stopLoadingAction(this.$btn_consulta_os_texto);
                });
            }
          },
          "Docz",
          ["Ok"],
          ""
        );
      }
      e.preventDefault();
    });

    this.$btn_observacao_os_texto.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_observacao_os_texto)) {
        navigator.notification.prompt(
          "Observação",
          (results) => {
            let valor = results["input1"];
            if (results["buttonIndex"] == 1) {
              this.alterarObservacaoSolicitacao(
                this.$osCorrente,
                valor.toUpperCase()
              )
                .then(() => {
                  this.stopLoadingAction(this.$btn_observacao_os_texto);
                })
                .catch((err) => {
                  this.stopLoadingAction(this.$btn_observacao_os_texto);
                  console.log(err);
                });
            } else {
              this.stopLoadingAction(this.$btn_observacao_os_texto);
            }
          },
          "Docz",
          ["Salvar", "Cancelar"],
          this.$osCorrente.observacao
        );
      }
      e.preventDefault();
    });

    this.$btn_nova_os_devolucao.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_nova_os_devolucao)) {
        this.NovaOSDevolucao()
          .then(() => {
            this.stopLoadingAction(this.$btn_nova_os_devolucao);
          })
          .catch((err) => {
            console.log(err);
            this.stopLoadingAction(this.$btn_nova_os_devolucao);
          });
      }
      e.preventDefault();
    });

    this.$btn_nova_os_emprestimo.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_nova_os_emprestimo)) {
        this.NovaOSEmprestimo()
          .then(() => {
            this.stopLoadingAction(this.$btn_nova_os_emprestimo);
          })
          .catch((err) => {
            console.log(err);
            this.stopLoadingAction(this.$btn_nova_os_emprestimo);
          });
      }
      e.preventDefault();
    });

    this.$btn_nova_os_implantacao.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_nova_os_implantacao)) {
        this.NovaOSImplantacao()
          .then(() => {
            this.stopLoadingAction(this.$btn_nova_os_implantacao);
          })
          .catch((err) => {
            console.log(err);
            this.stopLoadingAction(this.$btn_nova_os_implantacao);
          });
      }

      e.preventDefault();
    });

    this.$btn_confirmar_os.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_confirmar_os)) {
        this.confirmarOS(this.$osCorrente)
          .then(() => {
            this.stopLoadingAction(this.$btn_confirmar_os);
          })
          .catch((err) => {
            console.log(err);
            this.stopLoadingAction(this.$btn_confirmar_os);
          });
      }

      e.preventDefault();
    });

    this.$btn_cancelar_os.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_cancelar_os)) {
        this.cancelarOS(this.$osCorrente)
          .then(() => {
            this.stopLoadingAction(this.$btn_cancelar_os);
          })
          .catch((err) => {
            console.log(err);
            this.stopLoadingAction(this.$btn_cancelar_os);
          });
      }

      e.preventDefault();
    });

    this.$btn_voltar_para_os.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_voltar_para_os)) {
        $("#viewCorpoOS").show();
        $("#containerItemsSelecaoCliente").hide();
        this.stopLoadingAction(this.$btn_voltar_para_os);
      }

      e.preventDefault();
    });
  }
};
