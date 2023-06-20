docz.script.status_gestao_documental = class StatusGestaoDocumental extends (
  docz.script.generic_scan
) {
  constructor($el) {
    super("status_gestao_documental", $el);

    this.$loading = this.$html.find("[data-ref=loading]");

    this.$btn_scan_status_gestao_documental = this.$html.find(
      "[data-ref=btn-scan-status-gestao-documental]"
    );

    this.$btn_texto_status_gestao_documental = this.$html.find(
      "[data-ref=btn-texto-status-gestao-documental]"
    );

    this.$btn_leitor_status_gestao_documental = this.$html.find(
      "[data-ref=btn-leitor-status-gestao-documental]"
    );

    this.statusGestaoDocumental = null;
    this.localizacaoStatusGestaoDocumental = null;
    this.listaObjetos = new Array();

    this.inicializarRecursos();
  }

  isObjetoSOS(codigo) {
    let pattern = /^(CB|CX)(\d{5})(\d{1}|(G\d{1})|UN)\d{7}SOS$/g;
    return pattern.test(codigo);
  }

  isLocalizacaoSOS(codigo) {
    let pattern = /^(EXP|PLT|ETRATA)((G\d{1})|UN)\d{4}SOS$/g;
    return pattern.test(codigo);
  }

  carregar() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  inicializarRecursos() {
    this.$btn_scan_status_gestao_documental.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_scan_status_gestao_documental)) {
        const THIS = this;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (!result.cancelled) {
              THIS.atribuirStatusGestaoDocumentoObjeto(
                result.text.toUpperCase()
              )
                .then(() => {
                  THIS.stopLoadingAction(
                    THIS.$btn_scan_status_gestao_documental
                  );
                })
                .catch((err) => {
                  THIS.stopLoadingAction(
                    THIS.$btn_scan_status_gestao_documental
                  );
                  //console.log(err);
                });
            }
          },
          function (err) {
            THIS.stopLoadingAction(THIS.$btn_scan_status_gestao_documental);
            //console.log(err);
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

    this.$btn_leitor_status_gestao_documental.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_leitor_status_gestao_documental)) {
        this.$btn_leitor_status_gestao_documental.blur();
        this.$leitor_block.find(".leitor-block-msg").html("");
        $('<ul class="cancelar"><li>Cancelar</li></ul>').appendTo(
          this.$leitor_block.find(".leitor-block-msg")
        );
        const query = "#leitor .leitor-block-msg ul > li";
        const options = {
          query: query,
          left: 400,
          list: true,
          onOpen: function () {
            this.destroy(true);
            this.$leitor_block.hide();
            $(document).unbind("leitor");
            this.stopLoadingAction(this.$btn_leitor_status_gestao_documental);
          },
        };

        const swiped = Swiped.init(options);
        this.$leitor_block.show();

        $(document)
          .unbind("leitor")
          .bind("leitor", (e, valor) => {
            if (valor.key.toLowerCase() === "enter") {
              this.atribuirStatusGestaoDocumentoObjeto(
                this.leitor_data.toUpperCase()
              )
                .then(() => {
                  this.stopLoadingAction(
                    this.$btn_leitor_status_gestao_documental
                  );
                })
                .catch((err) => {
                  console.log(err);
                  this.stopLoadingAction(
                    this.$btn_leitor_status_gestao_documental
                  );
                });

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

    this.$btn_texto_status_gestao_documental.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_texto_status_gestao_documental)) {
        navigator.notification.prompt(
          "Código do Objeto",
          (results) => {
            let valor = results["input1"];
            this.atribuirStatusGestaoDocumentoObjeto(valor.toUpperCase())
              .then(() => {
                this.stopLoadingAction(
                  this.$btn_texto_status_gestao_documental
                );
              })
              .catch((err) => {
                console.log(err);
                this.stopLoadingAction(
                  this.$btn_texto_status_gestao_documental
                );
              });
          },
          "Docz",
          ["Ok"],
          ""
        );
      }
      e.preventDefault();
    });
  }

  mostrarDados() {
    $("#listaStatusGestaoDocumental").empty();

    for (var i in this.listaObjetos) {
      let item = this.listaObjetos[i];

      const $tr = $("<tr></tr>");

      $("<td>" + item.valores.c1 + "</td>").appendTo($tr);
      $("<td>" + item.valores.c2 + "</td>").appendTo($tr);
      $("<td>" + item.valores.c48 + "</td>").appendTo($tr);

      $tr.appendTo(this.$html.find('[data-ref="listaStatusGestaoDocumental"]'));
    }
  }

  atribuirStatusGestaoDocumentoObjeto(objeto) {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      let isLocSOS = this.isLocalizacaoSOS(objeto);
      let isObjSOS = this.isObjetoSOS(objeto);

      if (this.localizacaoStatusGestaoDocumental == null) {
        if (isLocSOS) {
          this.localizacaoStatusGestaoDocumental = objeto;
          this.$html
            .find("[data-ref=passo1]")
            .html(this.localizacaoStatusGestaoDocumental);
          this.$loading.hide();
          return resolve();
        } else {
          navigator.notification.alert(
            "Necessário informar a localização. Tente novamente!"
          );
          this.$loading.hide();
          return reject();
        }
      } else {
        if (isLocSOS) {
          this.localizacaoStatusGestaoDocumental = objeto;
          this.$html
            .find("[data-ref=passo1]")
            .html(this.localizacaoStatusGestaoDocumental);
          this.$loading.hide();
          return resolve();
        }
      }

      if (!isLocSOS && !isObjSOS) {
        this.statusGestaoDocumental = objeto;
        this.$html.find("[data-ref=passo2]").html(this.statusGestaoDocumental);
        this.$loading.hide();
        return resolve();
      }

      if (
        this.statusGestaoDocumental == null ||
        this.statusGestaoDocumental == undefined ||
        this.statusGestaoDocumental == ""
      ) {
        navigator.notification.alert(
          "Necessário informar o status da gestão documental. Tente novamente!"
        );
        this.$loading.hide();
        return reject();
      }

      if (isObjSOS) {
        this.rest
          .docz("atualizarStatusGestaoObjeto", {
            item: objeto,
            status: this.statusGestaoDocumental,
            endereco: this.localizacaoStatusGestaoDocumental,
            login: docz.util.storage.get("user"),
            app: "APP_ANDROID_SOS",
          })
          .then((rs) => {
            var obj = rs.atualizarStatusGestaoObjetoReturn;

            obj = JSON.parse(obj);

            if (obj.status == "success") {
              this.listaObjetos[this.listaObjetos.length] = obj.documento;

              this.m$success.play();
              //navigator.notification.alert("Atualização realizada.");
            } else {
              this.m$error.play();
              navigator.notification.alert(obj.mensagem);
            }

            this.$loading.hide();
            this.mostrarDados();

            resolve();
          })
          .catch((err) => {
            var msg = null;
            if (typeof err == "object") msg = err.statusText;
            else msg = JSON.parse(err).mensagem;

            this.m$error.play();
            navigator.notification.alert(
              "Ocorreu um erro ao tentar realizar a operação de atualizar status da gestão documental da caixa." +
                "\n" +
                msg
            );

            this.$loading.hide();

            reject(
              "Ocorreu um erro ao tentar realizar a operação de atualizar status da gestão documental da caixa."
            );
          });

        this.$loading.hide();
        resolve();
      } else {
        navigator.notification.alert(
          "Não é uma caixa válida. Tente novamente!"
        );
        this.$loading.hide();
        reject();
      }
    });
  }
};
