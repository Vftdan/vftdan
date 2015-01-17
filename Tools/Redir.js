function redir() {hr=location.search.replace(/\?/i,"http://");
while(hr.match(/%/i)=="%") {
hr=hr.replace(/%3F/i,"?");
hr=hr.replace(/%2F/i,"/");
hr=hr.replace(/%26/i,"&");
}
location.href=hr};
setTimeout("redir()",1000)
