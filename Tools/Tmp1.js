var $Dom={
ge:function(s){
var r=[]
var a=s.split(">");
for(i=0;i<a.length;i++){
var u=a[i].split("||");
for(k=0;k<u.length;k++) {
var t=u[k].split("&");
for(h=0;h<t.length;l++){
var c=t[h].split("|")
var st=false;
for(j=0;j<c.length;j++){
if(c[j].match(/[.#=]/i)==""){
st=true;
var _g
while(_g=document.getElementsByTagName(c[j])){r[i][k][h].push(_g)}
}
}
}
 }
}
return r
}
}
