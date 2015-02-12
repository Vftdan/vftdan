
var vft=document.getElementById("vft").innerHTML.replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"");

document.removeChild(document.lastChild);
window.onload=function() {
document.write(vft);
if(when_loaded||when_loaded()) {when_loaded()};
}
