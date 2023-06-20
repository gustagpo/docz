var tabSelecionada;

function novaFoto(caixa) {
  var elem = $("tr[data-id='" + caixa + "']");
  var srcType = navigator.camera.PictureSourceType.CAMERA;
  var options = setOptions(srcType);

  navigator.camera.getPicture(
    function cameraCallback(imageUri) {
      elem.attr("data-url", imageUri);
      //displayImage(imageUri);
      // You may choose to copy the picture, save it somewhere, or upload.
      console.log(imageUri);
    },
    function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    options
  );
}

function setOptions(srcType) {
  var options = {
    // Some common settings are 20, 50, and 100
    quality: 20,
    destinationType: navigator.camera.DestinationType.FILE_URI,
    // In this app, dynamically set the picture source, Camera or photo gallery
    sourceType: srcType,
    encodingType: navigator.camera.EncodingType.JPEG,
    mediaType: navigator.camera.MediaType.PICTURE,
    allowEdit: false,
    correctOrientation: true, //Corrects Android orientation quirks
  };
  return options;
}

//using recursion
const enviaArquivosRecursivo = (products, inst, processed = []) =>
  products.length !== 0
    ? enviarArquivo(products[0], inst)
        //add product id to processed
        .then((_) => processed.push(products[0]))
        //reject with error and id's of processed products
        .catch((err) => Promise.reject([err, processed]))
        .then((_) => enviaArquivosRecursivo(products.slice(1), inst, processed))
    : processed; //resolve with array of processed product ids

function enviarArquivo(element, inst) {
  var url =
    docz.util.storage.get("url-docz") +
    "/AppService/File/Coletor/Upload?id=imagensColetor";

  element.find("td").removeClass("error");
  element.find("td").removeClass("sucesso");
  element.find("td").addClass("enviando");

  return new Promise((resolve, reject) => {
    var options = new FileUploadOptions();
    var fileURL = element.attr("data-url");
    var item = element;
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf("/") + 1);
    options.mimeType = "image/jpeg";

    var params = {};
    params.idSOS = element.attr("data-id");
    params.palete = element.attr("data-palete");
    url += "&palete=" + element.attr("data-palete");
    url += "&idSOS=" + element.attr("data-id");

    options.params = params;

    //options.headers = headers;

    var ft = new FileTransfer();
    ft.onprogress = function (progressEvent) {
      //console.log(progressEvent.loaded + "/" + progressEvent.total);
      if (progressEvent.loaded + 100 > progressEvent.total) {
      }
    };

    ft.upload(
      fileURL,
      url,
      function (erro) {
        let elem = item;
        elem.find("td").removeClass("enviando");

        if (erro.response == "Error" || erro.response == null)
          elem.find("td").addClass("error");
        else {
          elem.attr("data-envio", 0);
          elem.find("td").addClass("sucesso");
          setTimeout(function () {
            elem.remove();
            if (inst.$tabela_importar_caixa.find("tbody").html() == "") {
              inst.limparImportarCaixa();
            }
          }, 1000);
        }

        resolve();
      },
      function (erro) {
        let elem = item;
        elem.find("td").removeClass("enviando");

        if (erro.response == "Error" || erro.response == null)
          elem.find("td").addClass("error");
        else {
          elem.find("td").addClass("sucesso");
          setTimeout(function () {
            elem.remove();
          }, 1000);
        }

        resolve();
      },
      options
    );
  });
}
