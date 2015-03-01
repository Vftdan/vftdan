var legends=[];
var chooseL=[];
var chooseLl=0;
function getLegends() {
var i=0;
while(document.getElementsByTagName("legend")[i]!=null) {
legends[i]=document.getElementsByTagName("legend")[i];
i++;
}
for(var j=0;j<i;j++){if(legends[j].opened&&legends[j].opened==true){chooseL.push(legends[j]);chooseLl++}}
}
getLegends();

