docz.script.generic_scan = class ScriptGenericScan {
  constructor(nome, $el) {
    this.nome = nome;
    this.$html = $el;

    this.$lista = null;
    this.$status = null;

    this.$btn_scan = null;
    this.$btn_limpar_tab_arquivamento = null;
    this.$btn_enviar = null;
    this.$btn_limpar = null;
    this.$btn_texto = null;
    this.$tdSelecionada = null;
    this.$btn_leitor = null;

    // Auditoria de O.S
    this.$btn_audit_os_enviar = null;
    this.$btn_audit_os_limpar = null;
    this.$btn_audit_os_texto = null;
    this.$btn_audit_os_leitor = null;
    this.$btn_audit_os_scan = null;

    // Importar Caixa
    this.$btn_btn_importar_caixa_enviar = null;
    this.$btn_importar_caixa_limpar = null;
    this.$brn_btn_importar_caixa_texto = null;
    this.$btn_importar_caixa_leitor = null;
    this.$btn_importar_caixa_scan = null;
    this.$div_ultimo_palete = null;
    this.ultimo_palete = null;
    this.$tabela_importar_caixa = null;
    this.$quantidadeImportacao = 0;

    this.$leitor_block = null;
    this.$btns = null;
    this.$div_ultima_caixa = null;
    this.$div_ultima_os = null;
    this.m$cadastre_primeiro_endereco = null;
    this.m$success = null;
    this.$error = null;
    this.m$ops = null;
    this.m$error = null;

    this.ultimo_item = null;
    this.ultima_os = null;
    this.ultimo_endereco = null;
    this.leitor_data = "";
    this.ultima_caixa = null;
    this.$tbody = null;
    this.$tabela = null;
    this.$tabela_audit_os = null;
    this.$lista_cliente = null;
    this.rest = null;
  }

  init() {
    this.$lista = this.$html.find("[data-ref=lista]");
    this.$tabela_audit_os = this.$html.find("[data-ref=tabela-audit-os]");
    this.$status = this.$html.find("[data-ref=status]");
    this.$btns = this.$html.find("[data-ref=btns]");
    this.$btn_scan = this.$html.find("[data-ref=btn-scan]");
    this.$btn_leitor_arquivar = this.$html.find(
      "[data-ref=btn-leitor-arquivar]"
    );
    this.$btn_texto = this.$html.find("[data-ref=btn-texto]");
    this.$btn_leitor = this.$html.find("[data-ref=btn-leitor]");
    this.$btn_enviar = this.$btns.find("[data-ref=btn-enviar]");
    this.$btn_limpar = this.$btns.find("[data-ref=btn-limpar]");

    //Auditoria de O.S
    this.$btn_audit_os_texto = this.$html.find("[data-ref=btn-texto-audit-os]");
    this.$btn_audit_os_scan = this.$html.find("[data-ref=btn-scan-audit-os]");
    this.$btn_audit_os_leitor = this.$html.find(
      "[data-ref=btn-leitor-audit-os]"
    );
    this.$btn_audit_os_enviar = this.$btns.find(
      "[data-ref=btn-enviar-audit-os]"
    );
    this.$btn_audit_os_limpar = this.$btns.find(
      "[data-ref=btn-limpar-audit-os]"
    );

    //Importar Caixa
    this.$btn_importar_caixa_texto = this.$html.find(
      "[data-ref=btn-texto-importar-caixa]"
    );
    this.$btn_importar_caixa_scan = this.$html.find(
      "[data-ref=btn-scan-importar-caixa]"
    );
    this.$btn_importar_caixa_leitor = this.$html.find(
      "[data-ref=btn-leitor-importar-caixa]"
    );
    this.$btn_importar_caixa_enviar = this.$btns.find(
      "[data-ref=btn-enviar-importar-caixa]"
    );
    this.$btn_importar_caixa_limpar = this.$btns.find(
      "[data-ref=btn-limpar-importar-caixa]"
    );
    this.$div_ultimo_palete = this.$html.find("[data-ref=div-ultimo-palete]");
    this.$tabela_importar_caixa = this.$html.find(
      "[data-ref=tabela-importar-caixa]"
    );

    this.$leitor_block = $("#leitor");
    this.$btn_limpar_tab_arquivamento = this.$btns.find(
      "[data-ref=btn-limpar-tab-arquivamento]"
    );
    this.$btn_teste = this.$btns.find("[data-ref=btn-teste]");
    this.$error = this.$html.find("[data-ref=error]");

    this.m$cadastre_primeiro_endereco = new docz.util.media(
      "cadastre_primeiro_endereco.mp3"
    );
    this.m$cadastre_primeiro_caixa = new docz.util.media(
      "cadastre_primeiro_caixa.mp3"
    );
    this.m$success = new docz.util.media("success.flac");
    this.m$ops = new docz.util.media("ops.flac");
    this.m$error = new docz.util.media("error.wav");
    this.$tabela = this.$html.find("[data-ref=tabela-arquivamento]");
    this.$tbody = this.$tabela.find("tbody");
    this.$div_ultima_caixa = this.$html.find("[data-ref=ultima-caixa]");
    this.$div_ultima_os = this.$html.find("[data-ref=div-ultima-os]");
    this.$lista_cliente = this.$html.find("[data-ref=lista-cliente]");
    this.rest = new docz.util.rest();
  }

  carregar() {
    return new Promise((resolve, reject) => {
      console.log("Carregando Dados");
      function onDeviceReady() {
        console.log(navigator.camera);
      }
      this.loadDados()
        .then(() => {
          this.$btn_teste.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_teste)) {
              const fn = async () => {
                for (let i = 0; i < 10; i++) {
                  await this.inserir("ETRANSG1000" + i + "SOS", "");
                  for (let j = 0; j < 100; j++) {
                    await this.inserir("CX999990000" + i + j + "SOS", "");
                  }
                }
                this.stopLoadingAction(this.$btn_teste);
                resolve();
              };
              fn();
            }
          });

          this.$btn_enviar.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_enviar)) {
              navigator.notification.confirm(
                "Deseja Enviar os Dados",
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    this.enviar()
                      .then(() => {
                        this.stopLoadingAction(this.$btn_enviar);
                      })
                      .catch((err) => {
                        this.stopLoadingAction(this.$btn_enviar);
                      });
                  } else {
                    this.stopLoadingAction(this.$btn_enviar);
                  }
                },
                "Docz",
                ["Ok", "Cancelar"]
              );
            }
            e.preventDefault();
          });

          this.$btn_limpar.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_limpar)) {
              navigator.notification.confirm(
                "Deseja Limpar os Dados",
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    this.limpar()
                      .then(() => {
                        this.stopLoadingAction(this.$btn_limpar);
                      })
                      .catch((err) => {
                        this.stopLoadingAction(this.$btn_limpar);
                      });
                  } else {
                    this.stopLoadingAction(this.$btn_limpar);
                  }
                },
                "Docz",
                ["Ok", "Cancelar"]
              );
            }
            e.preventDefault();
          });

          this.$btn_scan.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_scan)) {
              const THIS = this;
              cordova.plugins.barcodeScanner.scan(
                function (result) {
                  if (!result.cancelled) {
                    THIS.inserir(result.text, result.format)
                      .then(() => {
                        THIS.stopLoadingAction(THIS.$btn_scan);
                      })
                      .catch((err) => {
                        console.log(err);
                        THIS.stopLoadingAction(THIS.$btn_scan);
                      });
                  }
                },
                function (err) {
                  console.log(err);
                  THIS.stopLoadingAction(THIS.$btn_scan);
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

          this.$btn_leitor_arquivar.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_leitor_arquivar)) {
              this.$btn_leitor_arquivar.blur();
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
                  THIS.stopLoadingAction(THIS.$btn_leitor_arquivar);
                },
              };

              const swiped = Swiped.init(options);
              this.$leitor_block.show();

              $(document)
                .unbind("leitor")
                .bind("leitor", (e, valor) => {
                  if (valor.key.toLowerCase() === "enter") {
                    this.arquivar(this.leitor_data, "Leitor");
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

          //Importar Caixa

          this.$btn_importar_caixa_scan.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_importar_caixa_scan)) {
              const THIS = this;
              cordova.plugins.barcodeScanner.scan(
                function (result) {
                  if (!result.cancelled) {
                    THIS.importarCaixa(result.text, 0)
                      .then(() => {
                        THIS.stopLoadingAction(THIS.$btn_importar_caixa_scan);
                      })
                      .catch((err) => {
                        console.log(err);
                        THIS.stopLoadingAction(THIS.$btn_importar_caixa_scan);
                      });
                  }
                },
                function (err) {
                  console.log(err);
                  THIS.stopLoadingAction(THIS.$btn_importar_caixa_scan);
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

          this.$btn_importar_caixa_limpar.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_importar_caixa_limpar)) {
              navigator.notification.confirm(
                "Deseja Limpar os Dados",
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    this.limparImportarCaixa()
                      .then(() => {
                        this.stopLoadingAction(this.$btn_importar_caixa_limpar);
                      })
                      .catch((err) => {
                        this.stopLoadingAction(this.$btn_importar_caixa_limpar);
                      });
                  } else {
                    this.stopLoadingAction(this.$btn_importar_caixa_limpar);
                  }
                },
                "Docz",
                ["Ok", "Cancelar"]
              );
            }
            e.preventDefault();
          });

          this.$btn_importar_caixa_leitor.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_importar_caixa_leitor)) {
              this.$btn_importar_caixa_leitor.blur();
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
                  THIS.stopLoadingAction(THIS.$btn_importar_caixa_leitor);
                },
              };

              const swiped = Swiped.init(options);
              this.$leitor_block.show();

              $(document)
                .unbind("leitor")
                .bind("leitor", (e, valor) => {
                  if (valor.key.toLowerCase() === "enter") {
                    this.importarCaixa(this.leitor_data, 0);
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

          this.$btn_importar_caixa_texto.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_importar_caixa_texto)) {
              navigator.notification.prompt(
                "Id SOS",
                (results) => {
                  this.importarCaixa(results["input1"], 0)
                    .then(() => {
                      this.stopLoadingAction(this.$btn_importar_caixa_texto);
                    })
                    .catch((err) => {
                      console.log(err);
                      this.stopLoadingAction(this.$btn_importar_caixa_texto);
                    });
                },
                "Docz",
                ["Ok"],
                ""
              );
            }
            e.preventDefault();
          });

          this.$btn_importar_caixa_enviar.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_importar_caixa_enviar)) {
              navigator.notification.confirm(
                "Deseja Enviar os Dados",
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    this.enviaImportarCaixa()
                      .then(() => {
                        this.stopLoadingAction(this.$btn_importar_caixa_enviar);
                      })
                      .catch((err) => {
                        this.stopLoadingAction(this.$btn_importar_caixa_enviar);
                      });
                  } else {
                    this.stopLoadingAction(this.$btn_importar_caixa_enviar);
                  }
                },
                "Docz",
                ["Ok", "Cancelar"]
              );
            }
            e.preventDefault();
          });

          //Auditar O.S

          this.$btn_audit_os_scan.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_audit_os_scan)) {
              const THIS = this;
              cordova.plugins.barcodeScanner.scan(
                function (result) {
                  if (!result.cancelled) {
                    THIS.auditarOS(result.text, 0)
                      .then(() => {
                        THIS.stopLoadingAction(THIS.$btn_audit_os_scan);
                      })
                      .catch((err) => {
                        console.log(err);
                        THIS.stopLoadingAction(THIS.$btn_audit_os_scan);
                      });
                  }
                },
                function (err) {
                  console.log(err);
                  THIS.stopLoadingAction(THIS.$btn_audit_os_scan);
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

          this.$btn_audit_os_limpar.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_audit_os_limpar)) {
              navigator.notification.confirm(
                "Deseja Limpar os Dados",
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    this.limparOS()
                      .then(() => {
                        this.stopLoadingAction(this.$btn_audit_os_limpar);
                      })
                      .catch((err) => {
                        this.stopLoadingAction(this.$btn_audit_os_limpar);
                      });
                  } else {
                    this.stopLoadingAction(this.$btn_audit_os_limpar);
                  }
                },
                "Docz",
                ["Ok", "Cancelar"]
              );
            }
            e.preventDefault();
          });

          this.$btn_audit_os_leitor.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_leitor_arquivar)) {
              this.$btn_leitor_arquivar.blur();
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
                  THIS.stopLoadingAction(THIS.$btn_leitor_arquivar);
                },
              };

              const swiped = Swiped.init(options);
              this.$leitor_block.show();

              $(document)
                .unbind("leitor")
                .bind("leitor", (e, valor) => {
                  if (valor.key.toLowerCase() === "enter") {
                    this.auditarOS(this.leitor_data, 0);
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

          this.$btn_audit_os_texto.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_texto)) {
              navigator.notification.prompt(
                "Id SOS",
                (results) => {
                  this.auditarOS(results["input1"], 0)
                    .then(() => {
                      this.stopLoadingAction(this.$btn_texto);
                    })
                    .catch((err) => {
                      console.log(err);
                      this.stopLoadingAction(this.$btn_texto);
                    });
                },
                "Docz",
                ["Ok"],
                ""
              );
            }
            e.preventDefault();
          });

          this.$btn_audit_os_enviar.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_audit_os_enviar)) {
              navigator.notification.confirm(
                "Deseja Enviar os Dados",
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    this.enviaAuditoriaOS()
                      .then(() => {
                        this.stopLoadingAction(this.$btn_audit_os_enviar);
                      })
                      .catch((err) => {
                        this.stopLoadingAction(this.$btn_audit_os_enviar);
                      });
                  } else {
                    this.stopLoadingAction(this.$btn_audit_os_enviar);
                  }
                },
                "Docz",
                ["Ok", "Cancelar"]
              );
            }
            e.preventDefault();
          });

          this.$btn_texto.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_texto)) {
              navigator.notification.prompt(
                "Código de Barras",
                (results) => {
                  this.inserir(results["input1"], "User")
                    .then(() => {
                      this.stopLoadingAction(this.$btn_texto);
                    })
                    .catch((err) => {
                      console.log(err);
                      this.stopLoadingAction(this.$btn_texto);
                    });
                },
                "Docz",
                ["Ok"],
                ""
              );
            }
            e.preventDefault();
          });

          this.$btn_leitor.unbind("click").click((e) => {
            if (this.startLoadingAction(this.$btn_leitor)) {
              this.$btn_leitor.blur();
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
                  THIS.stopLoadingAction(THIS.$btn_leitor);
                },
              };
              const swiped = Swiped.init(options);
              this.$leitor_block.show();

              $(document)
                .unbind("leitor")
                .bind("leitor", (e, valor) => {
                  if (valor.key.toLowerCase() === "enter") {
                    this.inserir(this.leitor_data, "Leitor")
                      .then(() => {
                        this.leitor_data = "";
                      })
                      .catch((err) => {
                        console.log(err);
                        this.leitor_data = "";
                      });
                  } else {
                    if (valor.key.toLowerCase() !== "shift") {
                      this.leitor_data += valor.key.toUpperCase();
                    }
                  }
                });
            }
            e.preventDefault();
          });

          resolve();
        })
        .catch((err) => {
          reject(err);
        });

      this.$btn_limpar_tab_arquivamento.unbind("click").click((e) => {
        this.$tbody.empty();
        this.$error.empty();
        this.ultima_caixa = null;
        this.$div_ultima_caixa.empty();
      });
    });
  }

  limparOS() {
    return new Promise((resolve, reject) => {
      this.ultima_os = null;
      this.$error.html("");
      this.$tabela_audit_os.find("tbody").empty();
      this.$div_ultima_os.html("");
      resolve();
    });
  }

  inserir(id, formato) {
    return new Promise((resolve, reject) => {
      const item = {
        id: id,
        data: moment().unix(),
        tipo: "",
      };
      if (this.isEndereco(id)) {
        item.tipo = "endereco";
        this.salvarEndereco(item)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        if (!this.ultimo_endereco) {
          this.m$cadastre_primeiro_endereco.play();
          resolve();
          return;
        }
        if (this.isCaixa(id)) {
          item.tipo = "caixa";
          item.endereco = this.ultimo_endereco.id;
          this.salvarCaixa(item)
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          this.m$error.play();
          resolve();
        }
      }
    });
  }

  enviaAuditoriaOS() {
    return new Promise((resolve, reject) => {
      var items = "";

      this.$tabela_audit_os.find("tbody tr").each(function (i) {
        if (
          $(this).find("td:nth-child(3)").find("img").attr("data-valid") == "OK"
        ) {
          items += $(this).find("td:nth-child(2)").attr("data-id") + ",";
        }
      });

      if (items != "") items = items.slice(0, -1);

      if (items.length > 0) {
        this.rest
          .docz("enviaAuditoriaOS", {
            solicitacao: this.ultima_os,
            items,
            app: "APP_ANDROID_SOS",
          })
          .then((rs) => {
            this.m$success.play();
            this.auditarOS(this.ultima_os, 1);
            resolve();
          })
          .catch((err) => {
            var msg = null;
            if (typeof err == "object") msg = err.statusText;
            else msg = JSON.parse(err).mensagem;

            this.$error.html("Erro: " + obj.mensagem);
            reject();
          });
      } else {
        resolve();
      }
    });
  }

  auditarOS(IdItem, novo) {
    return new Promise((resolve, reject) => {
      this.$lista.html("");
      this.$error.html("");
      if (this.ultima_os == null || novo == 1) {
        this.ultima_os = IdItem;
        this.$div_ultima_os.html(this.ultima_os);
        this.$tabela_audit_os.find("tbody").empty();

        this.rest
          .docz("buscarSolicitacao", {
            solicitacao: this.ultima_os,
            app: "APP_ANDROID_SOS",
          })
          .then((rs) => {
            var obj = rs.buscarSolicitacaoReturn;
            obj = JSON.parse(obj);
            if (obj.status == "success") {
              var txtMsg = "";
              this.m$success.play();

              var validado = true;
              for (var i in obj.items) {
                if (!obj.items[i].auditado) validado = false;
                var auditado = obj.items[i].auditado
                  ? "<img src='images/icons/accept.png'></img>"
                  : "<img src='images/icons/exclamation.png'></img>";
                $(
                  '<tr data-id="' +
                    obj.items[i].item +
                    '"><td>' +
                    (Number(i) + 1) +
                    '</td><td data-id="' +
                    obj.items[i].id +
                    '">' +
                    obj.items[i].item +
                    "</td><td>" +
                    auditado +
                    "</td></tr>"
                ).appendTo(this.$tabela_audit_os.find("tbody"));
              }

              if (validado)
                txtMsg =
                  "O.S - " +
                  this.ultima_os +
                  " / <span style='color:green'>Validado</span> - Total de items [" +
                  obj.items.length +
                  "]";
              else
                txtMsg =
                  "O.S - " +
                  this.ultima_os +
                  " / <span style='color:red'>Nao Validado</span> - Total de items [" +
                  obj.items.length +
                  "]";

              this.$div_ultima_os.html(txtMsg);
              if (obj.items.length > 0) this.$status.hide();
              else this.$status.show();

              this.$tabela_audit_os.show();
            } else {
              this.$error.html("Erro: " + obj.mensagem);
              if (obj.mensagem.includes("Solicita��o n�o encontrada"))
                this.ultima_os = null;
            }
            resolve();
          })
          .catch((err) => {
            var msg = null;
            if (typeof err == "object") msg = err.statusText;
            else msg = JSON.parse(err).mensagem;
            this.$error.html("Erro: " + obj.mensagem);
            reject();
          });
      } else {
        if (
          this.$tabela_audit_os.find('tbody tr[data-id="' + IdItem + '"]')
            .length > 0
        ) {
          this.$tabela_audit_os
            .find('tbody tr[data-id="' + IdItem + '"] td:nth-child(3)')
            .html("<img src='images/icons/error.png' data-valid='OK'></img>");
          this.m$success.play();
          resolve();
        } else {
          this.$error.html("Erro: Objeto N�o encontrado.");
          this.m$error.play();
          reject();
        }
      }
    });
  }

  arquivar(IdItem) {
    return new Promise((resolve, reject) => {
      this.$lista.html("");
      this.$error.html("");
      if (this.ultima_caixa == null) {
        this.ultima_caixa = IdItem;
        if (this.ultima_caixa.includes("DC")) {
          this.fecharLeitor("Caixa : " + this.ultima_caixa + " n�o encontrada");
        } else {
          this.$div_ultima_caixa.html(this.ultima_caixa);
        }
      } else {
        var continua = true;
        if (this.$tbody.find("tr").attr("data-id") == IdItem) {
          continua = false;
          this.$error.empty();
          this.m$error.play();
          this.fecharLeitor("Erro: Objeto j� foi arquivado");
        }

        if (continua) {
          this.rest
            .docz("arquivarDocumento", {
              idSOS: IdItem,
              caixa: this.ultima_caixa,
              app: "APP_ANDROID_SOS",
              login: docz.util.storage.get("user"),
            })
            .then((rs) => {
              var obj = rs.arquivarDocumentoReturn;
              obj = JSON.parse(obj);
              if (obj.mensagem == "OK") {
                var c = obj.caixa.substr(2, 5);
                var sp = c.split("0");
                c = obj.caixa.replace(c, sp[sp.length - 1]);
                var dc = IdItem.substr(2, 5);
                sp = dc.split("0");
                dc = IdItem.replace(dc, sp[sp.length - 1]);
                this.m$success.play();
                $(
                  '<tr data-id="' +
                    IdItem +
                    '"><td>' +
                    dc.replace("SOS", "").replace("DC", "") +
                    "</td><td>" +
                    c.replace("SOS", "").replace("CX", "").replace("CB", "") +
                    "</td><td>" +
                    obj.endereco +
                    "</td></tr>"
                ).appendTo(this.$tbody);
                this.ultima_caixa = null;
                this.$tabela.show();
              } else {
                this.fecharLeitor(obj.mensagem);
              }
              resolve();
            })
            .catch((err) => {
              var msg = null;
              if (typeof err == "object") msg = err.statusText;
              else msg = JSON.parse(err).mensagem;
              this.fecharLeitor(msg);
            });
        }
      }
    });
  }

  fecharLeitor(msg) {
    this.$leitor_block.hide();
    this.ultima_caixa = null;
    this.$error.empty();
    $(document).unbind("leitor");
    this.stopLoadingAction(this.$btn_leitor_arquivar);
    this.m$error.play();
    this.$error.html("Erro: " + msg);
  }

  salvarCaixa(item) {
    return new Promise((resolve, reject) => {
      docz.obj["sqlite"]
        .salvarCaixa(this.nome, item)
        .then((st) => {
          this.addItem(item);
          this.ultimo_item = item;
          if (st === "insert") {
            this.m$success.play();
          } else {
            //update
            if (item.legado) {
              this.m$success.play();
            } else {
              this.m$ops.play();
            }
          }
          resolve();
        })
        .catch((err) => {
          this.m$error.play();
          reject(err);
        });
    });
  }

  createNewFileEntry(imgUri) {
    window.resolveLocalFileSystemURL(
      cordova.file.cacheDirectory,
      function success(dirEntry) {
        // JPEG file
        dirEntry.getFile(
          "tempFile.jpeg",
          { create: true, exclusive: false },
          function (fileEntry) {
            // Do something with it, like write to it, upload it, etc.
            // writeFile(fileEntry, imgUri);
            console.log("got file: " + fileEntry.fullPath);
            // displayFileData(fileEntry.fullPath, "File copied to");
          },
          onErrorCreateFile
        );
      },
      onErrorResolveUrl
    );
  }

  //Importar Caixa
  importarCaixa(IdItem, novo) {
    return new Promise((resolve, reject) => {
      this.$lista.html("");
      this.$error.html("");
      this.$error.empty();
      var srcType = navigator.camera.PictureSourceType.CAMERA;
      var options = setOptions(srcType);
      var func = this.createNewFileEntry;
      var ultimo = this.ultimo_palete;
      var qntd = this.$quantidadeImportacao;
      var $tab = this.$tabela_importar_caixa;
      var self = this;
      IdItem = IdItem.toUpperCase();
      qntd++;
      $tab.show();

      if (this.ultimo_palete == null) {
        if (this.isCaixa(IdItem)) {
          this.$error.html("Favor bipar um localiza��o");
          this.m$error.play();
          resolve();
          return;
        }

        this.ultimo_palete = IdItem.toUpperCase();
        this.$div_ultimo_palete.html(
          "<b>ULTIMO PALETE : " + this.ultimo_palete + "</b>"
        );
        resolve();
      } else {
        var continua = true;
        $tab
          .find("tbody")
          .find("tr")
          .each(function () {
            if ($(this).attr("data-id") == IdItem) {
              continua = false;
              self.$error.html("Caixa " + IdItem + " j� foi bipada");
            }
          });

        if (!this.isCaixa(IdItem)) {
          continua = false;
          self.$error.html("Caixa invalida, favor verificar!");
        }

        if (!continua) {
          reject();
          self.m$error.play();
          return;
        }

        navigator.camera.getPicture(
          function cameraCallback(imageUri) {
            $(
              '<tr data-id="' +
                IdItem +
                '" data-envio="1" data-palete="' +
                ultimo +
                '" data-url="' +
                imageUri +
                '"><td>' +
                qntd +
                "</td><td>" +
                IdItem +
                "</td><td><a href=\"javascript:displayImageByFileURL('" +
                IdItem +
                '\')"><img src="images/icons/image-resize.png"></img></a></td><td><a href="javascript:novaFoto(\'' +
                IdItem +
                '\')"><img src="images/icons/camera.png"></img></a></td></tr>'
            ).appendTo($tab.find("tbody"));
            self.$quantidadeImportacao++;
            //displayImage(imageUri);
            // You may choose to copy the picture, save it somewhere, or upload.
            console.log(imageUri);

            resolve();
          },
          function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
            reject();
          },
          options
        );
      }
      this.m$success.play();
    });
  }

  enviaImportarCaixa() {
    return new Promise((resolve, reject) => {
      var items = new Array();

      this.$tabela_importar_caixa
        .find("tbody")
        .find("tr")
        .each(function (i) {
          items.push($(this));
        });

      enviaArquivosRecursivo(items, this);
      resolve();
    });
  }

  limparImportarCaixa() {
    return new Promise((resolve, reject) => {
      this.ultimo_palete = null;
      this.$error.html("");
      this.$tabela_importar_caixa.find("tbody").empty();
      this.$div_ultimo_palete.html("");
      this.$quantidadeImportacao = 0;
      resolve();
    });
  }

  salvarEndereco(item) {
    return new Promise((resolve, reject) => {
      docz.obj["sqlite"]
        .salvarEndereco(this.nome, item)
        .then((st) => {
          this.addItem(item);
          this.ultimo_endereco = item;
          this.ultimo_item = item;
          if (st === "insert") {
            this.m$success.play();
          } else {
            this.speak("endereço com " + st + " caixas");
          }
          resolve();
        })
        .catch((err) => {
          this.m$error.play();
          reject(err);
        });
    });
  }

  enviar() {
    return new Promise((resolve, reject) => {
      console.log("Enviando...");

      docz.obj["sqlite"]
        .listar(this.nome)
        .then((rs) => {
          const syncList = [];
          let keys = Object.keys(rs);
          this.sortByUnixDate(rs, keys, "data", true);
          $.each(keys, (index_endereco, key_endereco) => {
            const endereco = rs[key_endereco];
            let keys_dados = Object.keys(endereco.dados);
            if (keys_dados.length === 0) {
              docz.obj["sqlite"]
                .removerEndereco(this.nome, endereco.id)
                .then(() => {
                  $("#" + this.nome + "-" + endereco.id).remove();
                  return true;
                })
                .catch((err) => {
                  console.log(err);
                  return true;
                });
            }
            this.sortByUnixDate(endereco.dados, keys_dados, "data", true);
            $.each(keys_dados, (index_caixa, key_caixa) => {
              const caixa = endereco.dados[key_caixa];
              syncList.push({
                endereco: endereco.id,
                caixa: caixa.id,
                legado: caixa.legado,
                status: 0,
              });
            });
          });
          if (syncList.length > 0) {
            const done = () => {
              this.setStatus("Enviado!");
              console.log("Enviado");
              resolve();
            };
            const fn = (index) => {
              if (!syncList[index]) {
                done();
                return;
              }
              const obj = syncList[index];
              const caixa = obj["caixa"];
              const endereco = obj["endereco"];
              const legado = obj["legado"];

              const $tag_caixa = $("#" + this.nome + "-" + caixa);
              const $tag_endereco = $("#" + this.nome + "-" + endereco);
              $tag_caixa
                .removeClass("caixa")
                .removeClass("erro-envio")
                .addClass("enviando");
              index++;

              if (this.nome === "legado" && !legado) {
                $tag_caixa.removeClass("caixa").addClass("erro-envio");
                fn(index);
                return;
              }
              this.sync(endereco, caixa, legado)
                .then((success) => {
                  console.log(obj, success);
                  if (success) {
                    docz.obj["sqlite"]
                      .removerCaixa(this.nome, caixa)
                      .then(() => {
                        $tag_caixa.remove();
                        const qtd = $tag_endereco.find("li").length;
                        if (qtd) {
                          $tag_endereco
                            .find("span[data-ref=qtd]")
                            .html("[" + qtd + "]");
                          fn(index);
                        } else {
                          docz.obj["sqlite"]
                            .removerEndereco(this.nome, endereco)
                            .then(() => {
                              $tag_endereco.remove();
                              fn(index);
                            })
                            .catch((err) => {
                              console.log(err);
                              fn(index);
                            });
                        }
                        this.setStatus();
                      })
                      .catch((err) => {
                        console.log(err);
                        fn(index);
                      });
                  } else {
                    $tag_caixa.removeClass("caixa").addClass("erro-envio");
                    fn(index);
                  }
                })
                .catch((err) => {
                  console.log(obj, err);
                  $tag_caixa.removeClass("caixa").addClass("erro-envio");
                  fn(index);
                });
            };
            fn(0);
          } else {
            resolve();
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  loadDados() {
    return new Promise((resolve, reject) => {
      this.$lista.html("");
      docz.obj["sqlite"]
        .listar(this.nome)
        .then((rs) => {
          if (Object.keys(rs).length > 0) {
            let keys = Object.keys(rs);
            this.sortByUnixDate(rs, keys, "data");
            $.each(keys, (index, key) => {
              const endereco = rs[key];
              this.addItem(endereco);
              this.ultimo_endereco = endereco;
              this.ultimo_item = endereco;
              let keys_dados = Object.keys(endereco.dados);
              this.sortByUnixDate(endereco.dados, keys_dados, "data");
              $.each(keys_dados, (i, key_item) => {
                const item = endereco.dados[key_item];
                this.addItem(item);
                this.ultimo_item = item;
                if (item.legado) {
                  this.ultimo_item = Object.assign({}, this.ultimo_endereco);
                }
              });
            });
          } else {
            this.ultimo_item = null;
            this.ultimo_endereco = null;
          }
          this.setStatus();
          console.log("Ultimo Endereço", this.ultimo_endereco);
          console.log("Ultimo Item", this.ultimo_item);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  addItem(item) {
    let html_legado = "";
    if (item.legado) {
      html_legado = '<span data-ref="legado">(' + item.legado + ")</span>";
    } else {
      html_legado = '<span data-ref="legado"></span>';
    }
    let html_qtd = "";
    let html_dados = "";
    if (item.tipo === "endereco") {
      html_qtd = '<span data-ref="qtd">[0]</span>';
      html_dados = '<ul class="lista" data-ref="dados"></ul>';
    }

    let classe = item.tipo;
    if (item.status && item.status === "error") {
      classe = "erro-envio";
    }
    if (item.legado) {
      classe = "numero";
    }

    const $item = $("#" + this.nome + "-" + item.id);
    //Verificando se já existe
    let $li = null;
    if (!$item.length) {
      $li = $(
        '<li id="' +
          this.nome +
          "-" +
          item.id +
          '" class="' +
          classe +
          '"><span style="padding-left: 10px;">' +
          item.id +
          "</span>" +
          html_legado +
          html_qtd +
          html_dados +
          "</li>"
      );
    } else {
      $li = $item;
      $li.removeClass().addClass(classe);
      if (!item.legado) {
        $li.find("span[data-ref=legado]").remove();
      } else {
        $li.find("span[data-ref=legado]").remove();
        $li.append(html_legado);
      }
    }

    if (item.tipo === "caixa") {
      const $endereco = $("#" + this.nome + "-" + item.endereco);
      const $dados = $endereco.find("ul[data-ref=dados]");
      $dados.prepend($li);
      $endereco
        .find("span[data-ref=qtd]")
        .html("[" + $endereco.find("li").length + "]");
      const THIS = this;
      if (!$item.length) {
        const query = "#" + this.nome + "-" + item.id;
        const options = {
          query: query,
          left: 400,
          list: true,
          onOpen: function () {
            docz.obj["sqlite"]
              .removerCaixa(THIS.nome, item.id)
              .then(() => {
                this.destroy(true);
                $endereco
                  .find("span[data-ref=qtd]")
                  .html("[" + $endereco.find("li").length + "]");
                if (!$endereco.find("li").length) {
                  docz.obj["sqlite"]
                    .removerEndereco(THIS.nome, item.endereco)
                    .then(() => {
                      $endereco.remove();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
                THIS.setStatus();
              })
              .catch((err) => {
                console.log(err);
              });
          },
        };
        const swiped = Swiped.init(options);
      }
    } else {
      this.$lista.prepend($li);
    }

    this.setStatus();
  }

  setStatus(msg) {
    if (msg) {
      this.$status.html(msg);
      return;
    }
    const qtdItens = this.$lista.find("li:not(.endereco)").length;
    if (qtdItens) {
      this.$status.html("Quantidade: " + qtdItens);
    } else {
      this.$status.html("Nenhum Registro");
    }
  }

  isCodSOS(codigo) {
    return this.isCaixa(codigo) || this.isEndereco(codigo);
  }

  isEndereco(codigo) {
    if (codigo.endsWith("SOS")) {
      if (
        codigo.startsWith("EDG") ||
        codigo.startsWith("PLTG") ||
        codigo.startsWith("EXPG") ||
        codigo.startsWith("ATRANSG") ||
        codigo.startsWith("ETRANSG") ||
        codigo.startsWith("IMPLANG") ||
        codigo.startsWith("REGISTRG") ||
        codigo.startsWith("ETRATAG") ||
        codigo.startsWith("SAIDADEFG")
      ) {
        return true;
      }
    }
  }

  isCaixa(codigo) {
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

  sortByUnixDate(rs, list, field, invert) {
    list.sort((key1, key2) => {
      const o1 = rs[key1];
      const o2 = rs[key2];
      if (!o1[field] && !o2[field]) {
        return 0;
      } else if (!o1[field]) {
        return 1;
      } else if (!o2[field]) {
        return -1;
      }
      if (!invert) {
        if (moment(o1[field]).isBefore(moment(o2[field]))) return -1;
        else if (moment(o1[field]).isAfter(moment(o2[field]))) return 1;
        else return 0;
      } else {
        if (moment(o1[field]).isBefore(moment(o2[field]))) return 1;
        else if (moment(o1[field]).isAfter(moment(o2[field]))) return -1;
        else return 0;
      }
    });
    return list;
  }

  sync(endereco, caixa, numeroAntigo) {
    return new Promise((resolve, reject) => {
      if (!numeroAntigo) numeroAntigo = "";
      this.rest
        .docz("sincronizaObjeto", {
          caixa: caixa,
          endereco: endereco,
          numeroAntigo: numeroAntigo,
          login: docz.util.storage.get("user"),
        })
        .then((rs) => {
          const success = rs["sincronizaObjetoReturn"];
          resolve(success);
        })
        .catch((err) => {
          console.log(err);
          resolve(false);
        });
    });
  }

  limpar() {
    return new Promise((resolve, reject) => {
      docz.obj["sqlite"]
        .limpar(this.nome)
        .then(() => {
          this.loadDados()
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  startLoadingAction(btn) {
    if (btn.hasClass("btn-disabled")) return false;
    btn.addClass("btn-disabled");
    let icon = btn.find("i");
    icon.data("lastclass", icon.attr("class"));
    icon.removeClass().addClass("fa fa-refresh fa-spin");
    return true;
  }

  stopLoadingAction(btn) {
    let icon = btn.find("i");
    icon.removeClass().addClass(icon.data("lastclass"));
    btn.removeClass("btn-disabled");
  }

  log(texto) {
    console.log("[" + this.nome + "]:" + texto);
  }

  show(show) {
    if (show) {
      this.$html.fadeIn();
    } else {
      this.$html.fadeOut();
    }
  }

  speak(valor) {
    TTS.speak({
      text: valor,
      locale: "pt-PT",
    })
      .then(() => {})
      .catch((err) => {});
  }

  //File transfer - Todo: Criar arquivo js e passar esses metodos abaixo

  setOptionsFileTransfer(type) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf("/") + 1);
    options.mimeType = type;
    return options;
  }
};
