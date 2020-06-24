function myFunction() {
    document.getElementById("demo").innerHTML = "Paragraph changed.";
   }

function functionStartingSite() {
    document.getElementById("backgroundAudio").play();
}
window.onload = functionStartingSite;

function changeContent(cod) {
    var contents = document.getElementsByClassName("content");
    var l = contents.length;
    for(i = 0; i < l; i++)
    {
        contents[i].style.visibility = 'hidden';
    }
    contents[cod].style.visibility = 'visible';
}