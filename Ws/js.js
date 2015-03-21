
var vft=document.getElementById("vft").innerHTML.replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"");

document.removeChild(document.lastChild);
window.onload=function() {
document.write("<"+"script>iscl=true;when_loaded(true);</script"+">"+vft);
c_$(location.search);
}
function c_$($get) {
var _stat=document.getElementsByTagName("h1")[0];
var _tit=document.getElementsByTagName("title")[0];
_status="200 OK";
_stat.innerHTML=_status;
_tit.innerHTML=_status+" - vftdan";
}
