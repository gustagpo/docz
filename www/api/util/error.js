docz.util.error = class {
    constructor(){}
    static show(){
        $('.error-full').show();
    }
    static hide(){
        $('.error-full').hide();
    }
    static msg(msg){
        $('.error-full .error-full-msg').find('[data-ref=msg]').html(msg);
    }
    static link(msg){
        $('#btn-main-error-full').html(msg);
    }
};