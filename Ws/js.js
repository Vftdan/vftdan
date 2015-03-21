
var vft=document.getElementById("vft").innerHTML.replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"").replace(/&\$;/i,"");

document.removeChild(document.lastChild);
window.onload=function() {
document.write("<"+"script>iscl=true;when_loaded(true);</script"+">"+vft);
c_$(location.search.match(/\?[A-Za-z0-9&=+-]*/i)[0].match(/[A-Za-z0-9&=+-]*/i)[0]);
}
function c_$($get) {
var _stat=document.getElementsByTagName("h1")[0];
var _tit=document.getElementsByTagName("title")[0];
_status="200 OK";
if($get==""){_status="204 No Content"};
if(_stat.parentNode.tagName=="CENTER") {
_stat.innerHTML=_status;
_tit.innerHTML=_status+" - vftdan";};
}
