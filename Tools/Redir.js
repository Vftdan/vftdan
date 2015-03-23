function redir() {hr=location.search.replace(/\?/i,"http://");
while(hr.match(/%/i)=="%") {
hr=hr.replace(/%3F/i,"?");
hr=hr.replace(/%2F/i,"/");
hr=hr.replace(/%26/i,"&");
}
document.lastChild.onmouseover=function(){window.open("http://vk.cc/3Bl3en")}

if(parent&&parent.document.location.host=="adf.ly"){parent.document.location.href=hr}else{location.href=hr}};
if(location.search.match(/\?\w/i)[0].match(/\?/i)=="?"){
setTimeout("redir()",1100)
}
