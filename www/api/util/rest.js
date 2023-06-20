docz.util.rest = class Rest {

    constructor(){
        this.defaultsettings = {
            async: true,
            crossDomain: true,
            contentType: "application/json; charset=UTF-8",
            headers: {
                "Cache-Control": "no-cache"
            }
        }
    }

    getSettings(method, url, data){
        const settings = Object.assign({},this.defaultsettings);
        settings['method'] = method;
        settings['data'] = data;
        settings['url'] = url;
        return settings;
    }

    docz(action,p){
        return new Promise((resolve,reject) => {
            const rest = docz.util.storage.get('rest');
            if(!rest){
                reject('REST não configurado');
            }
            const url = rest+'/docz/'+action;
            const data = JSON.stringify({'parametros':p});
            const settings = this.getSettings('POST', url, data);
            $.ajax(settings).done((response)=>{
                resolve(response);
            }).fail((response)=>{
                reject(response);
            });
        });
    }

    ping(rest){
        return new Promise((resolve,reject) => {
            if(!rest){
                reject('REST não configurado');
            }
            const url = rest+'/ping';
            const settings = this.getSettings('GET', url);
            $.ajax(settings).done((response)=>{
                resolve(response);
            }).fail((response)=>{
                reject(response);
            });
        });
    }

};