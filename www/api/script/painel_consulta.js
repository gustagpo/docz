docz.script.painel_consulta = class PainelConsulta extends docz.script.generic{

    constructor($el) {
        super('painel', $el);
    }

    init(){
        this.$btn_consulta = this.$html.find('[data-ref=btn-consulta]');
        this.$btn_consulta_dependentes = this.$html.find('[data-ref=btn-consulta-dependentes]');
        this.$btn_consulta_os = this.$html.find('[data-ref=btn-consulta-os]');
    }

    carregar()
    {
        return new Promise((resolve,reject) => 
        {
            console.log('Carregando Painel Cliente');

            this.$btn_consulta.unbind('click').click((e)=>
            {
                $('#menu-consulta').trigger('click');
                e.preventDefault();
            });

            this.$btn_consulta_dependentes.unbind('click').click((e)=>
            {
                $('#menu-consulta-dependentes').trigger('click');
                e.preventDefault();
            });

            this.$btn_consulta_os.unbind('click').click((e)=>
            {
                $('#menu-consulta-os').trigger('click');
                e.preventDefault();
            });
            
            resolve();
        })
    }

};