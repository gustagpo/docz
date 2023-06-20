const app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },
  onDeviceReady: function () {
    const init = new docz.control.init();
    init.start();
    document.addEventListener(
      "keyup",
      (e) => {
        $(document).trigger("leitor", { key: e.key, code: e.code });
      },
      false
    );
  },
};
app.initialize();

/*window.onload = ()=>{
    const init = new docz.control.init();
    init.start();
};*/

docz.control.init = class Init {
  constructor() {
    this.$painel_guarda = $("#main-painel-guarda");
    this.$legado = $("#main-audit-legado");
    this.$endereco = $("#main-audit-endereco");
    this.$arquivamento = $("#main-audit-arquivamento");
    this.$audit_os = $("#main-audit-os");
    this.$importar_caixa = $("#main-importar-caixa");

    this.$painel_consulta = $("#main-painel-consulta");
    this.$consulta = $("#main-consulta");
    this.$consulta_dependentes = $("#main-consulta-dependentes");

    this.$painel_gestao_documental = $("#main-painel-gestao-documental");

    this.$menu_painel = $("#menu-painel");

    this.$menu_legado = $("#menu-audit-legado");
    this.$menu_audit_os = $("#menu-audit-os");
    this.$menu_endereco = $("#menu-audit-endereco");
    this.$menu_consulta = $("#menu-consulta");
    this.$menu_arquivamento = $("#menu-audit-arquivamento");
    this.$menu_importar_caixa = $("#menu-importar-caixa");

    this.$menu_consulta_dependentes = $("#menu-consulta-dependentes");

    this.$consulta_os = $("#main-consulta-os");
    this.$menu_consulta_os = $("#menu-consulta-os");

    this.$sobre = $("#main-sobre");
    this.$menu_sobre = $("#menu-sobre");

    this.$atribuir_localizacao = $("#main-atribuir-localizacao");
    this.$menu_atribuir_localizacao = $("#menu-atribuir-localizacao");

    this.$arquivar_em_container = $("#main-arquivar-em-container");
    this.$menu_arquivar_em_container = $("#menu-arquivar-em-container");

    this.$status_gestao_documental = $("#main-status-gestao-documental");
    this.$menu_status_gestao_documental = $("#menu-status-gestao-documental");

    const cliente = docz.util.storage.get("cliente");

    if (cliente.toLowerCase() === "guarda") {
      this.painel = new docz.script.painel_guarda(this.$painel_guarda);
      this.$menu_painel.attr("href", "#main-painel-guarda");
      this.$menu_consulta_os.hide();
    } else if (cliente.toLowerCase() === "gestao-documental") {
      this.painel = new docz.script.painel_gestao(
        this.$painel_gestao_documental
      );
      this.$menu_painel.attr("href", "#main-painel-gestao-documental");
      this.$menu_consulta_os.hide();
      this.$menu_legado.hide();
      this.$menu_audit_os.hide();
      this.$menu_arquivamento.hide();
      this.$menu_endereco.hide();
      this.$menu_importar_caixa.hide();
    } else {
      this.painel = new docz.script.painel_consulta(this.$painel_consulta);
      this.$menu_painel.attr("href", "#main-painel-consulta");
      this.$menu_legado.hide();
      this.$menu_audit_os.hide();
      this.$menu_arquivamento.hide();
      this.$menu_endereco.hide();
      this.$menu_importar_caixa.hide();
    }

    $("#div-cliente-logado").html(
      docz.util.storage.get("cliente").toUpperCase()
    );

    $("#div-usuario-logado").html(docz.util.storage.get("user"));

    this.audit_os = new docz.script.audit_os(this.$audit_os);
    this.legado = new docz.script.legado(this.$legado);
    this.endereco = new docz.script.endereco(this.$endereco);
    this.arquivamento = new docz.script.arquivamento(this.$arquivamento);
    this.importar_caixa = new docz.script.importar_caixa(this.$importar_caixa);
    this.consulta = new docz.script.consulta(this.$consulta);
    this.consulta_dependentes = new docz.script.consulta_dependentes(
      this.$consulta_dependentes
    );
    this.consulta_os = new docz.script.consulta_os(this.$consulta_os);
    this.atribuir_localizacao = new docz.script.atribuir_localizacao(
      this.$atribuir_localizacao
    );
    this.arquivar_em_container = new docz.script.arquivar_em_container(
      this.$arquivar_em_container
    );
    this.status_gestao_documental = new docz.script.status_gestao_documental(
      this.$status_gestao_documental
    );
    this.sobre = new docz.script.sobre(this.$sobre);
    this.snapper = new Snap({
      element: document.getElementById("content"),
      elementMirror: document.getElementById("header-fixed"),
      elementMirror2: document.getElementById("footer-fixed"),
      disable: "right",
      tapToClose: true,
      touchToDrag: false,
      maxPosition: 266,
      minPosition: -266,
    });

    this.$menu = $("#menu");
    this.$content = $("#content");

    this.$menu
      .find("a")
      .unbind("click")
      .click((e) => {
        const link = $(e.currentTarget);
        const pageid = link.attr("href");
        const scriptname = link.data("script");
        if (pageid === "#sair") {
          window.plugins.googleplus.logout(
            (msg) => {
              docz.util.storage.remove("user");
              docz.util.storage.remove("cliente");
              window.location = "index.html";
            },
            (err) => {
              console.log(err);
              docz.util.storage.remove("user");
              docz.util.storage.remove("cliente");
              window.location = "index.html";
            }
          );
          return;
        }
        docz.util.loading.show();
        this.snapper.close();
        this.$content.find("[data-ref=page]").each((i, item) => {
          $(item).hide();
        });
        if (pageid && pageid !== "" && pageid !== "#") {
          const $page = $(pageid);
          this[scriptname]
            .carregar()
            .then(() => {
              console.log("Loading[" + scriptname + "] Complete");
              docz.util.loading.stop();
              this[scriptname].show(true);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        e.preventDefault();
      });
  }

  start() {
    docz.util.loading.msg("Carregando");
    docz.util.loading.show();

    docz.obj["sqlite"] = new docz.util.sqlite();
    this.scripts()
      .then(() => {
        docz.control.layout.init();
        this.layout();
        setTimeout(() => {
          docz.util.loading.stop();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        docz.util.error.msg(err);
        docz.util.error.show();
      });
  }

  scripts() {
    return new Promise((resolve, reject) => {
      Promise.all([
        docz.obj["sqlite"].init(),
        this.painel.init(),
        this.legado.init(),
        this.audit_os.init(),
        this.importar_caixa.init(),
        this.endereco.init(),
        this.arquivamento.init(),
        this.consulta.init(),
        this.consulta_dependentes.init(),
        this.consulta_os.init(),
        this.atribuir_localizacao.init(),
        this.arquivar_em_container.init(),
        this.status_gestao_documental.init(),
        this.sobre.init(),
      ])
        .then(() => {
          Promise.all([this.painel.carregar()])
            .then(() => {
              this.painel.show(true);
              resolve();
            })
            .catch((err) => {
              console.log(err);
              reject("Problema para carregar os scripts");
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  layout() {
    $(".close-sidebar")
      .unbind("click")
      .click(() => {
        this.snapper.close();
        return false;
      });
    $(".open-left-sidebar")
      .unbind("click")
      .click(() => {
        if (this.snapper.state().state == "left") {
          this.snapper.close();
        } else {
          this.snapper.open("left");
        }
        return false;
      });
    this.snapper.on("open", () => {
      $(".back-to-top-badge").removeClass("back-to-top-badge-visible");
    });
    this.snapper.on("drag", () => {
      $(".back-to-top-badge").removeClass("back-to-top-badge-visible");
    });
  }
};
