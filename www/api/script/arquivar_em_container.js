docz.script.arquivar_em_container = class ArquivarEmContainer extends (
  docz.script.generic_scan
) {
  constructor($el) {
    super("arquivar_em_container", $el);

    this.$loading = this.$html.find("[data-ref=loading]");

    this.$btn_scan_arquivar_em_container = this.$html.find(
      "[data-ref=btn-scan-arquivar-em-container]"
    );

    this.$btn_texto_arquivar_em_container = this.$html.find(
      "[data-ref=btn-texto-arquivar-em-container]"
    );

    this.$btn_leitor_arquivar_em_container = this.$html.find(
      "[data-ref=btn-leitor-arquivar-em-container]"
    );

    this.container;
    this.listaObjetos;

    this.inicializarRecursos();
  }

  carregar() {
    return new Promise((resolve, reject) => {
      this.container = null;
      this.listaObjetos = new Array();
      this.$html
        .find("[data-ref=container-arquivar-em-container]")
        .html("1º Informe o container Principal");
      this.mostrarDados();
      resolve();
    });
  }

  mostrarDados() {
    return new Promise((resolve, reject) => {
      $("#listaArquivarEmContainer").empty();

      for (var i in this.listaObjetos) {
        let item = this.listaObjetos[i];

        const $tr = $("<tr></tr>");

        $("<td>" + item.valores.c1 + "</td>").appendTo($tr);
        $("<td>" + item.valores.c2 + "</td>").appendTo($tr);

        $tr.appendTo(this.$html.find('[data-ref="listaArquivarEmContainer"]'));
      }

      this.$html
        .find("[data-ref=total-arquivar-em-container]")
        .html("Total de Items: " + this.listaObjetos.length);

      resolve();
    });
  }

  isCaixaSOS(codigo) {
    let pattern = /^(CB|CX)(\d{5})(\d{1}|(G\d{1})|UN)\d{7}SOS$/g;
    return pattern.test(codigo);
  }

  isCaixaBox(codigo) {
    let pattern = /^(CB)(\d{5})(\d{1}|(G\d{1})|UN)\d{7}SOS$/g;
    return pattern.test(codigo);
  }

  isCaixa20Kg(codigo) {
    let pattern = /^(CX)(\d{5})(\d{1}|(G\d{1})|UN)\d{7}SOS$/g;
    return pattern.test(codigo);
  }

  isDocumentoSOS(codigo) {
    let pattern = /^(DC)(\d{5})(([A-Z])|\d{1}|([A-Z]\d{1})|UN)\d{7}SOS$/g;
    return pattern.test(codigo);
  }

  existe(objeto) {
    let retorno = false;

    $.each(this.listaObjetos, function (index, doc) {
      if (doc.valores.c1 == objeto) {
        retorno = true;
      }
    });

    return retorno;
  }

  atribuirLocalizacaoObjeto(objeto) {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      if (!this.isCaixaSOS(objeto) && !this.isDocumentoSOS(objeto)) {
        this.m$error.play();
        navigator.notification.alert(
          "Necessário informar uma etiqueta válida!"
        );
        this.$loading.hide();
        return reject();
      }

      let caixaSOS = this.isCaixaSOS(objeto);

      if (this.container == null) {
        if (caixaSOS) {
          this.container = objeto;
          this.$html
            .find("[data-ref=container-arquivar-em-container]")
            .html(this.container);
          this.$loading.hide();
          return resolve();
        } else {
          this.m$error.play();
          navigator.notification.alert(
            "Necessário informar um container válido. Tente novamente!"
          );
          this.$loading.hide();
          return reject();
        }
      } else {
        if (this.container == objeto) {
          this.m$success.play();
          navigator.notification.alert(
            "Informações foram resetadas, inicie o processo novamente!"
          );
          this.carregar();
          this.$loading.hide();
          return resolve();
        }
      }

      let podeExecutar = false;

      if (this.isCaixaSOS(objeto)) {
        if (
          (this.isCaixa20Kg(objeto) && this.isCaixa20Kg(this.container)) ||
          (this.isCaixaBox(objeto) && this.isCaixaBox(this.container))
        ) {
          this.m$error.play();
          navigator.notification.alert(
            "Não é possível armazenar objetos de igual tamanho dentro do outro. Tente novamente!"
          );
          this.$loading.hide();
          return reject();
        }

        if (this.isCaixaBox(this.container) && this.isCaixa20Kg(objeto)) {
          this.m$error.play();
          navigator.notification.alert(
            "Não é possível armazenar objetos de tamanho superior em objeto de tamanho inferior. Tente novamente!"
          );
          this.$loading.hide();
          return reject();
        }

        podeExecutar = true;
      } else if (this.isDocumentoSOS(objeto)) {
        podeExecutar = true;
      }

      if (this.existe(objeto)) {
        this.m$error.play();
        navigator.notification.alert("Objeto já foi vinculado.");
        this.$loading.hide();
        return reject();
      }

      ///(?<=^(DC|CB|CX)).\d{4}(?)/g
      if (this.container.substring(2, 7) != objeto.substring(2, 7)) {
        this.m$error.play();
        navigator.notification.alert(
          "Não é possível vincular objetos de projetos diferentes."
        );
        this.$loading.hide();
        return reject();
      }

      if (podeExecutar) {
        this.rest
          .docz("arquivarObjetoEmContainer", {
            item: objeto,
            localizacao: this.container,
            login: docz.util.storage.get("user"),
            app: "APP_ANDROID_SOS",
          })
          .then((rs) => {
            var obj = rs.arquivarObjetoEmContainerReturn;

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
              "Ocorreu um erro ao tentar realizar a operação de atribuir localização a uma caixa." +
                "\n" +
                msg
            );

            this.$loading.hide();

            reject(
              "Ocorreu um erro ao tentar realizar a operação de atribuir localização a uma caixa."
            );
          });
      } else {
        navigator.notification.alert(
          "Ocorreu um erro ao validar as informações. Tente novamente."
        );

        this.$loading.hide();

        reject("Ocorreu um erro ao validar as informações. Tente novamente.");
      }
    });
  }

  inicializarRecursos() {
    this.$btn_scan_arquivar_em_container.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_scan_arquivar_em_container)) {
        const THIS = this;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (!result.cancelled) {
              THIS.atribuirLocalizacaoObjeto(result.text.toUpperCase())
                .then(() => {
                  THIS.stopLoadingAction(THIS.$btn_scan_arquivar_em_container);
                })
                .catch((err) => {
                  THIS.stopLoadingAction(THIS.$btn_scan_arquivar_em_container);
                  //console.log(err);
                });
            }
          },
          function (err) {
            THIS.stopLoadingAction(THIS.$btn_scan_arquivar_em_container);
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

    this.$btn_leitor_arquivar_em_container.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_leitor_arquivar_em_container)) {
        this.$btn_leitor_arquivar_em_container.blur();
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
            this.stopLoadingAction(THIS.$btn_leitor_arquivar_em_container);
          },
        };

        const swiped = Swiped.init(options);
        this.$leitor_block.show();

        $(document)
          .unbind("leitor")
          .bind("leitor", (e, valor) => {
            if (valor.key.toLowerCase() === "enter") {
              this.atribuirLocalizacaoObjeto(this.leitor_data.toUpperCase())
                .then(() => {
                  this.stopLoadingAction(
                    this.$btn_leitor_arquivar_em_container
                  );
                })
                .catch((err) => {
                  //console.log(err);
                  this.stopLoadingAction(
                    this.$btn_leitor_arquivar_em_container
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

    this.$btn_texto_arquivar_em_container.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_texto_arquivar_em_container)) {
        navigator.notification.prompt(
          "Código do Objeto",
          (results) => {
            let valor = results["input1"];
            this.atribuirLocalizacaoObjeto(valor)
              .then(() => {
                this.stopLoadingAction(this.$btn_texto_arquivar_em_container);
              })
              .catch((err) => {
                //console.log(err);
                this.stopLoadingAction(this.$btn_texto_arquivar_em_container);
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
};
