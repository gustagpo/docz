docz.script.painel_gestao = class PainelGestao extends docz.script.generic {
  constructor($el) {
    super("painel", $el);
  }

  init() {
    this.$btn_arquivar_container = this.$html.find(
      "[data-ref=btn-arquivar-em-container]"
    );
    this.$btn_atribuir_localizacao = this.$html.find(
      "[data-ref=btn-atribuir-endereco-caixa]"
    );
    this.$btn_status_gestao_documental = this.$html.find(
      "[data-ref=btn-status-gestao-documental]"
    );
  }

  carregar() {
    return new Promise((resolve, reject) => {
      console.log("Carregando Painel Gestão Documental");

      this.$btn_arquivar_container.unbind("click").click((e) => {
        $("#menu-arquivar-em-container").trigger("click");
        e.preventDefault();
      });

      this.$btn_atribuir_localizacao.unbind("click").click((e) => {
        $("#menu-atribuir-localizacao").trigger("click");
        e.preventDefault();
      });

      this.$btn_status_gestao_documental.unbind("click").click((e) => {
        $("#menu-status-gestao-documental").trigger("click");
        e.preventDefault();
      });

      resolve();
    });
  }
};
