docz.script.atribuir_localizacao = class AtribuirLocalizacao extends (
  docz.script.generic_scan
) {
  constructor($el) {
    super("atribuir_localizacao", $el);

    this.$loading = this.$html.find("[data-ref=loading]");

    this.$btn_scan_atribuir_localizacao = this.$html.find(
      "[data-ref=btn-scan-atribuir-localizacao]"
    );

    this.$btn_texto_atribuir_localizacao = this.$html.find(
      "[data-ref=btn-texto-atribuir-localizacao]"
    );

    this.$btn_leitor_atribuir_localizacao = this.$html.find(
      "[data-ref=btn-leitor-atribuir-localizacao]"
    );

    this.ultimaLocalizacao;
    this.listaObjetos = new Array();

    this.inicializarRecursos();
  }

  carregar() {
    return new Promise((resolve, reject) => {
      $("#listaAtribuirLocalizacao").empty();

      for (var i in this.listaObjetos) {
        let item = this.listaObjetos[i];

        const $tr = $("<tr></tr>");

        $("<td>" + item.valores.c1 + "</td>").appendTo($tr);
        $("<td>" + item.valores.c2 + "</td>").appendTo($tr);

        $tr.appendTo(this.$html.find('[data-ref="listaAtribuirLocalizacao"]'));
      }

      resolve();
    });
  }

  isObjetoSOS(codigo) {
    let pattern = /^(CB|CX)(\d{5})(\d{1}|(G\d{1})|UN)\d{7}SOS$/g;
    return pattern.test(codigo);
  }

  //E.01.01.01.04.SOS
  //D.01.01.01.01.SOS
  /*removido a posição por solicitação do cliente*/
  isLocalizacaoCliente(codigo) {
    let pattern = /^[D-E].(\d{0,2}|\d{0,3}).\d{0,2}.\d{0,2}.SOS$/;
    //let pattern = /^[D-E].\d{0,2}.\d{0,2}.\d{0,2}.\d{0,2}.SOS$/;
    return pattern.test(codigo);
  }

  atribuirLocalizacaoObjeto(objeto) {
    return new Promise((resolve, reject) => {
      this.$loading.show();

      if (
        objeto == undefined ||
        objeto == null ||
        (!this.isLocalizacaoCliente(objeto) && !this.isObjetoSOS(objeto))
      ) {
        navigator.notification.alert("Necessário informar um valor válido.");
        this.$loading.hide();
        reject();
      } else if (this.isLocalizacaoCliente(objeto)) {
        this.ultimaLocalizacao = objeto;

        this.$html
          .find("[data-ref=status-atribuir-localizacao]")
          .html("Localização Atual: " + objeto);

        this.$loading.hide();
        resolve();
      } else {
        if (
          this.isLocalizacaoCliente(this.ultimaLocalizacao) &&
          this.isObjetoSOS(objeto)
        ) {
          this.rest
            .docz("atualizarLocalizacaoObjeto", {
              item: objeto,
              localizacao: this.ultimaLocalizacao,
              login: docz.util.storage.get("user"),
              app: "APP_ANDROID_SOS",
            })
            .then((rs) => {
              var obj = rs.atualizarLocalizacaoObjetoReturn;

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
              this.carregar();

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
            "Ocorreu um erro ao validar a localização e o código da etiqueta. Tente novamente."
          );

          this.$loading.hide();

          reject(
            "Ocorreu um erro ao validar a localização e o código da etiqueta."
          );
        }
      }
    });
  }

  inicializarRecursos() {
    this.$btn_scan_atribuir_localizacao.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_scan_atribuir_localizacao)) {
        const THIS = this;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (!result.cancelled) {
              THIS.atribuirLocalizacaoObjeto(result.text.toUpperCase())
                .then(() => {
                  THIS.stopLoadingAction(THIS.$btn_scan_atribuir_localizacao);
                })
                .catch((err) => {
                  THIS.stopLoadingAction(THIS.$btn_scan_atribuir_localizacao);
                  //console.log(err);
                });
            }
          },
          function (err) {
            THIS.stopLoadingAction(THIS.$btn_scan_atribuir_localizacao);
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

    this.$btn_leitor_atribuir_localizacao.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_leitor_atribuir_localizacao)) {
        this.$btn_leitor_atribuir_localizacao.blur();
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
            this.stopLoadingAction(THIS.$btn_leitor_atribuir_localizacao);
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
                  this.stopLoadingAction(this.$btn_leitor_atribuir_localizacao);
                })
                .catch((err) => {
                  console.log(err);
                  this.stopLoadingAction(this.$btn_leitor_atribuir_localizacao);
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

    this.$btn_texto_atribuir_localizacao.unbind("click").click((e) => {
      if (this.startLoadingAction(this.$btn_texto_atribuir_localizacao)) {
        navigator.notification.prompt(
          "Código do Objeto",
          (results) => {
            let valor = results["input1"];
            this.atribuirLocalizacaoObjeto(valor)
              .then(() => {
                this.stopLoadingAction(this.$btn_texto_atribuir_localizacao);
              })
              .catch((err) => {
                console.log(err);
                this.stopLoadingAction(this.$btn_texto_atribuir_localizacao);
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
