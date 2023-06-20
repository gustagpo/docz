function displayImageByFileURL(cx) {
     var $elem = $("tr[data-id='" + cx +"']");
     var url = $elem.attr('data-url');

     var elem = document.getElementById('imagemCaixa');
     elem.src = url;

     var w = window.innerWidth;
     var h = window.innerHeight - 100;
     elem.style.width = w + "px";
     elem.style.height = h + "px";

     openModal("myModal");
 }

function openModal(modalName){
    // Get the modal
    var modal = document.getElementById(modalName);

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}