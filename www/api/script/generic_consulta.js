docz.script.generic_consulta = class ScriptGenericConsulta{

    constructor(nome, $el) {
        this.nome = nome;
        this.$html = $el;

        this.$btn_scan = null;
        this.$btn_texto = null;
        this.$btn_leitor = null;
        this.$leitor_block = null;
        this.$btns = null;

        this.m$success = null;
        this.m$ops = null;
        this.m$error = null;

        this.leitor_data = '';

        this.rest = null;
    }

    init(){
        this.$btns = this.$html.find('[data-ref=btns]');
        this.$btn_scan = this.$html.find('[data-ref=btn-scan]');
        this.$btn_texto = this.$html.find('[data-ref=btn-texto]');
        this.$btn_leitor = this.$html.find('[data-ref=btn-leitor]');
        this.$leitor_block = $('#leitor');

        this.rest = new docz.util.rest();
    }

    carregar(){
        return new Promise((resolve,reject) => {

            console.log('Carregando');

            this.$btn_scan.unbind('click').click((e)=>{
                if(this.startLoadingAction(this.$btn_scan)){
                    const THIS = this;
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            if(!result.cancelled){
                                THIS.pesquisar(result.text, result.format).then(()=>{
                                    THIS.stopLoadingAction(THIS.$btn_scan);
                                }).catch(err=>{
                                    console.log(err);
                                    THIS.stopLoadingAction(THIS.$btn_scan);
                                })
                            }else{
                                THIS.stopLoadingAction(THIS.$btn_scan);
                            }
                        },
                        function (err) {
                            console.log(err);
                            THIS.stopLoadingAction(THIS.$btn_scan);
                        },
                        {
                            preferFrontCamera : false, // iOS and Android
                            showFlipCameraButton : true, // iOS and Android
                            showTorchButton : true, // iOS and Android
                            torchOn: true, // Android, launch with the torch switched on (if available)
                            saveHistory: false, // Android, save scan history (default false)
                            prompt : "", // Android
                            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                            formats : "QR_CODE,PDF_417,CODE_128", // default: all but PDF_417 and RSS_EXPANDED
                            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                            disableAnimations : true, // iOS
                            disableSuccessBeep: true // iOS and Android
                        }
                    );
                }
                e.preventDefault();

            });
            this.$btn_texto.unbind('click').click((e)=>{
                if(this.startLoadingAction(this.$btn_texto)){
                    navigator.notification.prompt(
                        'Código de Barras',
                        (results)=>{
                            this.pesquisar(results['input1'], 'User').then(()=>{
                                this.stopLoadingAction(this.$btn_texto);
                            }).catch(err=>{
                                this.stopLoadingAction(this.$btn_texto);
                            });
                        },
                        'Docz',['Ok'],''
                    );
                }
                e.preventDefault();
            });

            this.$btn_leitor.unbind('click').click((e)=>{
                if(this.startLoadingAction(this.$btn_leitor)){
                    this.$btn_leitor.blur();
                    this.$leitor_block.find('.leitor-block-msg').html('');
                    $('<ul class="cancelar"><li>Cancelar</li></ul>').appendTo(this.$leitor_block.find('.leitor-block-msg'));
                    const THIS = this;
                    const query = '#leitor .leitor-block-msg ul > li';
                    const options = {
                        query: query,
                        left: 400,
                        list: true,
                        onOpen: function() {
                            this.destroy(true);
                            THIS.$leitor_block.hide();
                            $(document).unbind('leitor');
                            THIS.stopLoadingAction(THIS.$btn_leitor);
                        }
                    };
                    const swiped = Swiped.init(options);
                    this.$leitor_block.show();

                    $(document).unbind('leitor').bind('leitor',(e , valor)=>{
                        if(valor.key.toLowerCase() === 'enter'){
                            this.pesquisar(this.leitor_data, 'Leitor');
                            this.leitor_data = '';
                            return;
                        }
                        if(valor.key.toLowerCase() !== 'shift'){
                            this.leitor_data += valor.key.toUpperCase();
                        }
                    });
                }
                e.preventDefault();
            });

            resolve();
        })
    }

    pesquisar(cod,tipo){
        return new Promise((resolve,reject) => {
            resolve();
        });
    }

    sortByUnixDate(rs, list, field){
        list.sort((key1,key2)=>{
            const o1 = rs[key1];
            const o2 = rs[key2];
            if(!o1[field] && !o2[field]){
                return 0;
            }else if(!o1[field]){
                return 1;
            }else if(!o2[field]){
                return -1
            }
            if (moment(o1[field]).isBefore(moment(o2[field]))) return 1;
            else if(moment(o1[field]).isAfter(moment(o2[field]))) return  -1;
            else return  0;
        });
        return list;
    }

    startLoadingAction(btn){
        if(btn.hasClass('btn-disabled')) return false;
        btn.addClass('btn-disabled');
        let icon = btn.find('i');
        icon.data('lastclass',icon.attr('class'));
        icon.removeClass().addClass('fa fa-refresh fa-spin');
        return true;
    }

    stopLoadingAction(btn){
        let icon = btn.find('i');
        icon.removeClass().addClass(icon.data('lastclass'));
        btn.removeClass('btn-disabled');
    }

    log(texto){
        console.log('['+this.nome+']:'+texto);
    }

    show(show){
        if(show){
            this.$html.fadeIn();
        }else{
            this.$html.fadeOut();
        }
    }

};