window.onload=function() {
if(parent&&window!=parent) {
var vft=document.getElementById("vk_inframe").innerHTML;



while(vft.match(/&\$;/i).toString=="&$;"){vft=vft.replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"")};
document.removeChild(document.lastChild);
document.write(vft);
}
}
