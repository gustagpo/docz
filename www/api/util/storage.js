docz.util.storage = {

    id: 'docz',

    get:(key)=>{
        const data = window.localStorage.getItem(docz.util.storage.id+'.'+key);
        if(data){
            return JSON.parse(data);
        }else{
            return null;
        }
    },

    set:(key,item)=>{
        window.localStorage.setItem(docz.util.storage.id+'.'+key,JSON.stringify(item));
    },

    remove:(key)=>{
        window.localStorage.removeItem(docz.util.storage.id+'.'+key);
    }

};