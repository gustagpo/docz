docz.script.generic = class ScriptGeneric{

    constructor(nome, el){
        this.nome = nome;
        this.$html = el;
    }

    log(texto){
        console.log('['+this.nome+']:'+texto);
    }

    init(){
        return new Promise((resolve,reject) => {
            resolve();
        });
    }

    show(show){
        if(show){
            this.$html.fadeIn();
        }else{
            this.$html.fadeOut();
        }
    }

};