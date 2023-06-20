docz.script.painel_guarda = class PainelGuarda extends docz.script.generic{

    constructor($el) {
        super('painel', $el);
    }

    init()
    {
        this.$btn_endereco = this.$html.find('[data-ref=btn-endereco]');
        this.$btn_legado = this.$html.find('[data-ref=btn-legado]');
        this.$btn_audit_os = this.$html.find('[data-ref=btn-audit-os]');
        this.$btn_importar_caixa = this.$html.find('[data-ref=btn-importar-caixa]');
        this.$btn_arquivamento = this.$html.find('[data-ref=btn-arquivamento]');

        this.$btn_consulta = this.$html.find('[data-ref=btn-consulta]');
        this.$btn_consulta_dependentes = this.$html.find('[data-ref=btn-consulta-dependentes]');
    }

    carregar()
    {
        return new Promise((resolve,reject) => 
        {
            
            console.log('Carregando Painel Guarda');

            this.$btn_endereco.unbind('click').click((e)=>{
                $('#menu-audit-endereco').trigger('click');
                e.preventDefault();
            });

            this.$btn_legado.unbind('click').click((e)=>{
                $('#menu-audit-legado').trigger('click');
                e.preventDefault();
            });

            this.$btn_arquivamento.unbind('click').click((e)=>{
                $('#menu-audit-arquivamento').trigger('click');
                e.preventDefault();
            });

            this.$btn_audit_os.unbind('click').click((e)=>{
                $('#menu-audit-os').trigger('click');
                e.preventDefault();
            });

            this.$btn_importar_caixa.unbind('click').click((e)=>{
                $('#menu-importar-caixa').trigger('click');
                e.preventDefault();
            });

            this.$btn_consulta.unbind('click').click((e)=>{
                $('#menu-consulta').trigger('click');
                e.preventDefault();
            });

            this.$btn_consulta_dependentes.unbind('click').click((e)=>{
                $('#menu-consulta-dependentes').trigger('click');
                e.preventDefault();
            });

            resolve();
        })
    }
};