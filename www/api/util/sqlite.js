docz.util.sqlite = class SQLite {

    constructor(){
        this.database = null;
    }

    init(){
        return new Promise((resolve,reject) => {
            window.sqlitePlugin.openDatabase({name: 'docz.db', location: 'default'},(db)=>{
                this.database = db;
                this.database.transaction((tx)=>{
                    tx.executeSql('CREATE TABLE IF NOT EXISTS endereco (id, data, base)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS caixa (id, endereco, legado, data, base)');
                }, (err)=>{
                    console.log('Transaction ERROR: ' + err.message);
                    reject(err.message);
                }, ()=>{
                    console.log('Open Database Complete');
                    resolve();
                });
            },(err)=>{
                reject(err);
            });
        });
    }

    listar(base){
        return new Promise((resolve,reject) => {
            this.database.executeSql('select * from endereco where base =  ?', [base], (rs)=>{
                const dados = {};
                for(let i = 0; i < rs.rows.length; i++) {
                    const endereco = rs.rows.item(i);
                    dados[endereco.id] = {};
                    dados[endereco.id].id = endereco.id;
                    dados[endereco.id].data = endereco.data;
                    dados[endereco.id].tipo = 'endereco';
                    dados[endereco.id].dados = {};
                }
                this.database.executeSql('select * from caixa where base =  ?', [base], (rs)=>{
                    for(let i = 0; i < rs.rows.length; i++) {
                        const caixa = rs.rows.item(i);
                        if(dados[caixa.endereco]){
                            dados[caixa.endereco].dados[caixa.id] = {};
                            dados[caixa.endereco].dados[caixa.id].id = caixa.id;
                            dados[caixa.endereco].dados[caixa.id].endereco = caixa.endereco;
                            dados[caixa.endereco].dados[caixa.id].data = caixa.data;
                            dados[caixa.endereco].dados[caixa.id].tipo = 'caixa';
                            dados[caixa.endereco].dados[caixa.id].legado = caixa.legado;
                        }
                    }
                    resolve(dados);
                },(err)=>{
                    console.log(err.message);
                    reject(err);
                });
            },(err)=>{
                console.log(err.message);
                reject(err);
            });
        });
    }

    salvarEndereco(base, item){
        return new Promise((resolve,reject) => {
            const valores = [
                base,
                item.id,
                item.data
            ];
            this.database.executeSql('select * from endereco where base = ? and id = ?', [base, item.id], (rs)=> {
                if(rs.rows.length > 0){
                    valores.push(item.id);
                    this.database.executeSql('update endereco set base = ?, id = ?, data = ? where id = ?', valores, (rs)=> {
                        this.database.executeSql('select count(*) as n from caixa where base = ? and endereco = ?', [base, item.id], (rs)=> {
                            resolve(rs.rows.item(0)['n']);
                        },(err)=>{
                            reject(err);
                        });
                    },(err)=>{
                        reject(err);
                    });
                }else{
                    this.database.executeSql('insert into endereco (base, id, data) values (?,?,?)', valores, (rs)=> {
                        resolve('insert');
                    },(err)=>{
                        reject(err);
                    });
                }
            },(err)=>{
                reject(err);
            });
        })
    }

    salvarCaixa(base, item){
        return new Promise((resolve,reject) => {
            const valores = [
                base,
                item.id,
                item.endereco,
                item.legado,
                item.data
            ];
            this.database.executeSql('select * from caixa where base = ? and id = ?', [base, item.id], (rs)=> {
                if(rs.rows.length > 0){
                    valores.push(item.id);
                    this.database.executeSql('update caixa set base = ?, id = ?, endereco = ?, legado = ?, data = ? where id = ?', valores, (rs)=> {
                        resolve('update');
                    },(err)=>{
                        reject(err);
                    });
                }else{
                    this.database.executeSql('insert into caixa (base, id, endereco, legado, data) values (?,?,?,?,?)', valores, (rs)=> {
                        resolve('insert');
                    },(err)=>{
                        reject(err);
                    });
                }
            },(err)=>{
                reject(err);
            });
        })
    }

    legadoExiste(base,legado){
        return new Promise((resolve,reject) => {
            this.database.executeSql('select * from caixa where base = ? and legado = ?', [base, legado], (rs)=> {
                if(rs.rows.length > 0){
                    resolve(rs.rows.item(0));
                }else{
                    resolve();
                }
            },(err)=>{
                reject(err);
            });
        });
    }

    limpar(base){
        return new Promise((resolve,reject) => {
            this.database.transaction((tx)=>{
                tx.executeSql('delete from caixa where base = ?',[base]);
                tx.executeSql('delete from endereco where base = ?',[base]);
            }, (err)=>{
                console.log('Transaction ERROR: ' + err.message);
                reject(err.message);
            }, ()=>{
                resolve();
            });
        });
    }

    removerEndereco(base, id){
        return new Promise((resolve,reject) => {
            this.database.transaction((tx)=>{
                tx.executeSql('delete from caixa where base = ? and endereco = ?',[base,id]);
                tx.executeSql('delete from endereco where base = ? and id = ?',[base,id]);
            }, (err)=>{
                console.log('Transaction ERROR: ' + err.message);
                reject(err.message);
            }, ()=>{
                resolve();
            });
        })
    }

    removerCaixa(base, id){
        return new Promise((resolve,reject) => {
            this.database.transaction((tx)=>{
                tx.executeSql('delete from caixa where base = ? and id = ?',[base,id]);
            }, (err)=>{
                console.log('Transaction ERROR: ' + err.message);
                reject(err.message);
            }, ()=>{
                resolve();
            });
        })
    }


};