function redir() {hr=location.search.replace(/\?/i,"http://");
while(hr.match(/%/i)=="%") {
hr=hr.replace(/%3F/i,"?");
hr=hr.replace(/%2F/i,"/");
hr=hr.replace(/%26/i,"&");
}
if(parent&&parent.document.location.href=hr){void(0)}else{location.href=hr}};
if(location.search.match(/\?\w/i)[0].match(/\?/i)=="?"){
setTimeout("redir()",1100)
}
