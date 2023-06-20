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
    const login = new docz.script.login();
    login.init();
  },
};
app.initialize();

/*window.onload = ()=>{
    const login = new docz.script.login();
    login.init();
};*/

docz.script.login = class Login {
  constructor() {}

  init() {
    docz.util.loading.msg("Iniciando Aplicativo");
    docz.util.loading.show();

    // const $btn_login_google = $('#btn-login-google');
    const $btn_entrar = $("#btn-entrar");
    const $btn_url = $("#btn-url");
    const $input_login = $("#input-login");
    const $input_cliente = $("#input-cliente");
    const $input_password = $("#input-password");
    const $btn_mostrar = $("#btn-mostrar");

    const $login_content = $("#login-content");

    $input_login.focus(function () {
      if (this.value === "Usuario") this.value = "";
    });
    $input_login.blur(function () {
      if (this.value === "") this.value = "Usuario";
    });
    $input_password.focus(function () {
      if (this.value === "password") this.value = "";
    });
    $input_password.blur(function () {
      if (this.value === "") this.value = "password";
    });
    $input_cliente.focus(function () {
      if (this.value === "Cliente") this.value = "";
    });
    $input_cliente.blur(function () {
      if (this.value === "") this.value = "Cliente";
    });

    if (docz.util.storage.get("ultimoLogin") != "")
      $input_login.val(docz.util.storage.get("ultimoLogin"));

    if (docz.util.storage.get("ultimoCliente") != "")
      $input_cliente.val(docz.util.storage.get("ultimoCliente"));

    if (docz.util.storage.get("ultimoPassword") != "")
      $input_password.val(docz.util.storage.get("ultimoPassword"));

    $btn_mostrar.unbind("click").click((e) => {
      if ($input_password.attr("type") === "text") {
        $input_password.attr("type", "password");
      } else {
        $input_password.attr("type", "text");
      }
    });

    const rest = new docz.util.rest();
    $btn_entrar.unbind("click").click((e) => {
      docz.util.loading.msg("Efetuando Login");
      docz.util.loading.show();

      let clientLogin = $input_cliente.val();

      if (clientLogin === "gestao-documental") clientLogin = "guarda";

      rest
        .docz("loginApp", {
          login: $input_login.val(),
          senha: $input_password.val(),
          alias: clientLogin,
          app: "APP_ANDROID_SOS",
        })
        .then((rs) => {
          const cod = rs["loginAppReturn"];
          switch (cod) {
            case 0:
              docz.util.storage.set("user", $input_login.val());
              docz.util.storage.set("cliente", $input_cliente.val());

              /*Salva as informa��es de ultimo acesso para facilitar o uso do aplicativo.*/
              docz.util.storage.set("ultimoLogin", $input_login.val());
              docz.util.storage.set("ultimoCliente", $input_cliente.val());
              docz.util.storage.set("ultimoPassword", $input_password.val());

              if (
                docz.util.storage.get("cliente").toUpperCase() == "GUARDA" ||
                docz.util.storage.get("cliente").toUpperCase() ==
                  "GESTAO-DOCUMENTAL"
              ) {
                window.location = "main.html";
              } else {
                window.location = "projetos.html";
              }

              break;

            case 1:
              this.showError("Login Invalido");
              break;
            case 2:
              this.showError("Senha Invalida");
              break;
            case 3:
              this.showError("É necessário alterar sua senha no Docz");
              break;
            case 4:
              this.showError("Cliente Invalido");
              break;
            case 5:
              this.showError("App Não Autorizado");
              break;
            default:
              this.showError("Problema ao efetuar Login");
              break;
          }
          docz.util.loading.stop();
        })
        .catch((err) => {
          this.showError("Problema ao efetuar Login");
          docz.util.loading.stop();
          console.log(err);
        });

      e.preventDefault();
    });

    // $btn_login_google.unbind('click').click((e)=>{
    //     docz.util.loading.msg('Efetuando Login');
    //     docz.util.loading.show();
    //     navigator.notification.prompt(
    //         'Cliente(alias)',  // message
    //         (results)=>{
    //             if(!results['input1'] || results['input1'] === ''){
    //                 this.showError('Cliente Invalido');
    //                 docz.util.loading.stop();
    //                 return;
    //             }
    //             window.plugins.googleplus.login({},(_gacc)=>{
    //                     rest.docz('loginAppEmail',{email: _gacc['email'], alias:results['input1'], app:'APP_ANDROID_SOS'}).then((rs)=>{
    //                         const cod = rs['loginAppEmailReturn'];
    //                         switch (cod){
    //                             case 0:
    //                                 docz.util.storage.set('user',_gacc['email']);
    //                                 docz.util.storage.set('cliente',results['input1']);
    //                                 window.location = "main.html";
    //                                 return;
    //                             case 1: this.showError('Email Invalido');break;
    //                             case 2: this.showError('N�o Autorizado a Utilizar o App');break;
    //                             case 3: this.showError('Necess�rio alterar sua senha no Docz');break;
    //                             case 4: this.showError('Cliente Invalido');break;
    //                             case 5: this.showError('App N�o Autorizado');break;
    //                             default: this.showError('Problema ao efetuar Login');break;
    //                         }
    //                         window.plugins.googleplus.logout((msg)=> {
    //                             console.log(msg);
    //                             docz.util.loading.stop();
    //                         },(err)=>{
    //                             console.log(err);
    //                             docz.util.loading.stop();
    //                         });
    //                     }).catch(err=>{
    //                         this.showError('Problema ao efetuar Login');
    //                         docz.util.loading.stop();
    //                         console.log(err);
    //                     });
    //                 },(msg)=>{
    //                     this.showError('Problema na autentica��o do Gmail');
    //                     docz.util.loading.stop();
    //                     console.log(msg);
    //                 }
    //             );
    //         },
    //         'Docz',            // title
    //         ['Ok'],              // buttonLabels
    //         ''// defaultText
    //     );
    //     e.preventDefault();
    // });

    $btn_url.unbind("click").click((e) => {
      let url_rest = docz.util.storage.get("rest");
      if (!url_rest) url_rest = "";
      docz.util.loading.msg("Configurando URL");
      docz.util.loading.show();
      navigator.notification.prompt(
        "Endereço(URL) do Docz", // message
        (results) => {
          if (!results["input1"] || results["input1"] === "") {
            this.showError("Endereço Invalido");
            docz.util.loading.stop();
          } else {
            rest
              .ping(results["input1"])
              .then(() => {
                docz.util.storage.set("rest", results["input1"]);
                docz.util.loading.stop();
                this.showInfo("Configurado com Sucesso");
                $login_content.show();
              })
              .catch((err) => {
                console.log(err);
                docz.util.loading.stop();
                this.showError("Endereço Invalido");
              });
          }
        },
        "Docz", // title
        ["Ok"], // buttonLabels
        url_rest // defaultText
      );
    });

    rest
      .ping(docz.util.storage.get("rest"))
      .then(() => {
        docz.util.loading.stop();
      })
      .catch((err) => {
        console.log(err);
        $login_content.hide();
        navigator.notification.alert(
          "Atualize o Endereço do Docz",
          () => {
            docz.util.loading.stop();
          },
          "Docz",
          "Ok"
        );
      });
  }

  showError(msg) {
    const $n = $("#error-notification");
    $n.find("p").html(msg);
    $n.slideDown(200);
    const timer = setTimeout(() => {
      $n.slideUp(250);
    }, 2000);
  }
  showInfo(msg) {
    const $n = $("#info-notification");
    $n.find("p").html(msg);
    $n.slideDown(200);
    const timer = setTimeout(() => {
      $n.slideUp(250);
    }, 2000);
  }
};
