window.onload=function() {
if(parent&&window!=parent) {
var vft=document.getElementById("vk_inframe").innerHTML;



while((vft.match(/&\$;/i).[0]=="&$;"||vft.match(/&\$;/i).[0]!="")&&vft.match(/&\$;/i).[0].constructor==String){vft=vft.replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"")};
document.removeChild(document.lastChild);
document.write(vft);
}
}
