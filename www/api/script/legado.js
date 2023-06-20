docz.script.legado = class Legado extends docz.script.generic_scan{

    constructor($el) {
        super('legado', $el);
    }

    inserir(id, formato){
        return new Promise((resolve,reject) => {
            const item = {
                'id':id,
                'data':moment().unix(),
                'tipo':''
            };
            if(this.isEndereco(id)){
                item.tipo = 'endereco';
                this.salvarEndereco(item).then(()=>{
                    resolve();
                }).catch(err=>{
                    reject(err);
                });
            }else{
                if(!this.ultimo_endereco){
                    this.m$cadastre_primeiro_endereco.play();
                    resolve();
                    return;
                }

                if(this.isCaixa(id)){
                    if(this.ultimo_item && this.ultimo_item.tipo === 'caixa'){
                        this.m$error.play();
                        resolve();
                        return;
                    }
                    item.tipo = 'caixa';
                    item.endereco = this.ultimo_endereco.id;
                    this.salvarCaixa(item).then(()=>{
                        resolve();
                    }).catch(err=>{
                        reject(err);
                    });
                }else{
                    if(!this.ultimo_item){
                        this.m$error.play();
                        resolve();
                        return;
                    }
                    if(this.ultimo_item && this.ultimo_item.tipo !== 'caixa'){
                        this.m$error.play();
                        resolve();
                        return;
                    }
                    docz.obj['sqlite'].legadoExiste(this.nome,id).then((cx)=>{
                        if(cx){
                            this.m$error.play();
                            resolve();
                        }else{
                            item.id = this.ultimo_item.id;
                            item.legado = id;
                            item.tipo = 'caixa';
                            item.endereco = this.ultimo_endereco.id;
                            this.salvarCaixa(item).then(()=>{
                                this.ultimo_item = Object.assign({},this.ultimo_endereco);
                                resolve();
                            }).catch(err=>{
                                reject(err);
                            });
                        }
                    }).catch(err=>{
                        reject(err);
                    });

                }
            }
        });
    }

    /*salvarItem(item){
        const dados = docz.util.storage.get('dados');
        const map = {};
        $.each(dados[this.nome],(endereco_id, endereco)=>{
            $.each(endereco.dados,(item_id, obj)=>{
                map[item_id] = endereco_id;
            });
        });
        if(map[item.id]){
            const legado = dados[this.nome][map[item.id]].dados[item.id].legado;
            delete dados[this.nome][map[item.id]].dados[item.id];
            item['parent'] = this.ultimo_endereco.id;
            item['legado'] = legado;
            dados[this.nome][this.ultimo_endereco.id].dados[item.id] = item;
            docz.util.storage.set('dados',dados);
            this.loadDados();
            this.m$ops.play();
        }else{
            if(item.tipo === 'caixa'){
                item['parent'] = this.ultimo_endereco.id;
                dados[this.nome][this.ultimo_endereco.id].dados[item.id] = item;
                docz.util.storage.set('dados',dados);
                this.loadDados();
                this.m$success.play();
                this.ultimo_item = item;
            }else{
                if(!this.ultimo_item || this.ultimo_item.tipo !== 'caixa'){
                    this.m$error.play();
                    return;
                }
                dados[this.nome][this.ultimo_endereco.id].dados[this.ultimo_item.id]['legado'] = item.id;
                docz.util.storage.set('dados',dados);
                this.loadDados();
                this.m$success.play();
                this.ultimo_item = item;
            }
        }

    }*/

};