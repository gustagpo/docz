const app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },
  onDeviceReady: function () {
    const index = new docz.script.index();
    index.init();
  },
};
app.initialize();

docz.script.index = class Index {
  constructor() {}
  init() {
    let IsDebug = false;

    docz.util.loading.msg("Carregando");
    docz.util.loading.show();

    if (IsDebug) {
      docz.util.storage.set("rest", "https://coletor-hml.sosdocs.com.br");
      docz.util.storage.set("url-docz", "https://doczhml.sosdocs.com.br/Docz");

      //docz.util.storage.set("rest", "http://192.168.1.5:8099");
      //docz.util.storage.set("url-docz", "http://192.168.1.5:8080/Docz");
    } else {
      docz.util.storage.set("rest", "https://coletor.sosdocs.com.br");
      docz.util.storage.set("url-docz", "https://docz.sosdocs.com.br/Docz");
    }

    /*cordova.plugins.IsDebug.getIsDebug(function(isDebug) {
            
            if (!isDebug)
            {
                docz.util.storage.set('rest','https://coletor.sosdocs.com.br');
            }
            else 
            {
                window.location = "opsdebug.html";
                docz.util.storage.set('rest','http://192.168.68.123:8099');
                return;
            }

        }, function(err) {
            console.error(err);
        });*/

    if (docz.util.storage.get("user")) {
      if (docz.util.storage.get("cliente")) {
        if (
          docz.util.storage.get("cliente").toUpperCase() == "GUARDA" ||
          docz.util.storage.get("cliente").toUpperCase() == "GESTAO-DOCUMENTAL"
        )
          window.location = "main.html";
        else window.location = "projetos.html";
      } else {
        window.location = "login.html";
      }
    } else {
      window.location = "login.html";
    }
  }
};
