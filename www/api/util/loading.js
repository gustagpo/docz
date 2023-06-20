docz.util.loading = class {

    constructor(){}

    static start(){
        $('.preloader-full').fadeIn('fast');
    }
    static show(){
        $('.preloader-full').show();
    }
    static hide(){
        $('.preloader-full').hide();
    }
    static stop(){
        $('.preloader-full').fadeOut('fast');
    }
    static msg(msg){
        $('.preloader-full .preloader-full-msg').find('[data-ref=msg]').html(msg);
    }

};