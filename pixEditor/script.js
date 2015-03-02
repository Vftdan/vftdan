var diam=29;
var drc="black"

window.addEventListener('load', function(e) {
document.querySelector('#tab').innerHTML = vtlTrs(diam);
  document.querySelector('#test').innerHTML = 'crc';
var tdsa = document.getElementsByTagName('td');
//document.getElementsByTagName('table')[0].onclick=function() {

for(idt=0;idt<2401;idt++) {
tdsa[idt].onclick=function() {

this.style.background=drc;
};
//};
};
//pain();


}, false);

/*function pain() {
var tdsa = document.getElementsByTagName('td');
document.getElementsByTagName('table')[0].oncli=function() {
for(idt=0;idt<2401;idt++) {
tdsa[idt].onclick=function() {
tdsa[idt].style.background="red";
};
//};
};
setTimeout("pain()",10000);
pain();
};*/

function vtlTds(tds) {
var tdStr = new String;
for(j=0;j<tds;j++) {
tdStr=tdStr + "<td class='td" +i+ "'></td>"
};
return tdStr;
};

function vtlTrs(trs) {
var trStr = new String;
for(i=0;i<trs;i++) {
trStr=trStr + "<tr id='tr" +i+ "'>"+vtlTds(trs)+"</tr><br />"
};
return trStr;
};


function circCoor(x,r) {
var sqTr=r*r;
var y;
y=sqrt(sqTr-x*x)*1.01;
return y;
};
/*
function sqrt(sq) {
var rt=2;
for (irt=1;irt<4095;irt++) {
if (sq/rt==rt) {break;} else {if (sq/rt>rt) {rt=rt+2/(irt-0.5)} else {rt=rt-2/(irt-0.5)}};


function sqrt(sq) {
var rt=2;
for (irt=1;irt<4095;irt++) {
if (sq/rt==rt) {break;} else {if (sq/rt>rt) {rt=rt+2/(irt-0.5)} else {rt=rt-2/(irt-0.5)}};
};
if (rt<0) {rt=0-rt};
return rt;


};

if (rt<0) {rt=0-rt};
return rt;
};*/
function sqrt(sq) {
var rt=2;
for (irt=1;irt<4095;irt++) {
if (sq/rt==rt) {break;} else {if (sq/rt>rt) {rt=rt+2/(irt-0.5)} else {rt=rt-2/(irt-0.5)}};
};
if (rt<0) {rt=0-rt};
return rt;


};

function drwCirc() { 
//alert("ab");
var r=document.getElementById("inr").value;
/*curTr=document.getElementById("tr1");
//document.getElementsByClassName("td2")[0].style.background="black";
*/
//alert("de");
xb=r-(0-1);
for (icd=0;icd<r*r/4;icd++) {
ic=icd/(r/4);
//alert("ef"+ic);
x=xb-ic;
y=circCoor(x,r);
//alert(y)
if(ic>0) {y=Math.ceil(y);} else {
y=Math.round(y);};
x=x-r/15;
x=Math.round(x);
y=y-r/15;
y=Math.round(y);
//alert(y)
//alert("fg"+x);
cx=(diam-1)/2-x;
cy=(diam-1)/2-y;
vx=(diam-1)/2-(0-x);
vy=(diam-1)/2-(0-y);
if(x>(Math.ceil(r/20))-2 && y>(Math.ceil(r/20))-2 && y<17) {
document.getElementsByClassName('td'+cx)[cy].style.background=drc;

document.getElementsByClassName('td'+vy)[cx].style.background=drc;

document.getElementsByClassName('td'+cy)[vx].style.background=drc;

document.getElementsByClassName('td'+vy)[vx].style.background=drc;
//

document.getElementsByClassName('td'+cy)[cx].style.background=drc;

document.getElementsByClassName('td'+vx)[cy].style.background=drc;

document.getElementsByClassName('td'+cx)[vy].style.background=drc;

document.getElementsByClassName('td'+vx)[vy].style.background=drc;
//

}
};



};

function drQ(f,a2) {
a = a2||document.getElementById("inr").value*2;

va=(diam-1)/2-(a/2);
for(iq=0;iq<a;iq++) {

ca=(diam-1)/2-(a/2)+iq;
document.getElementsByClassName('td'+va)[ca].style.background=drc;
};

for(iq=0;iq<a;iq++) {

ca=(diam-1)/2-(a/2)+iq;
document.getElementsByClassName('td'+ca)[va].style.background=drc;
};

va=(diam-1)/2-(0-(a/2));


for(iq=0;iq<a;iq++) {

ca=(diam-1)/2-(a/2)+iq;
document.getElementsByClassName('td'+va)[ca].style.background=drc;
};
for(iq=0;iq<a+1;iq++) {

ca=(diam-1)/2-(a/2)+iq;
document.getElementsByClassName('td'+ca)[va].style.background=drc;
};

if(f==true) {
a1=Math.round((a-1)/4);
for(a1=a1*2;a1>-1;a1--) {
//alert(32)
a=a1*2;
va=(diam-1)/2-(a/2);
for(iq=0;iq<a;iq++) {

ca=(diam-1)/2-(a/2)+iq;
document.getElementsByClassName('td'+va)[ca].style.background=drc;
};

for(iq=0;iq<a;iq++) {

ca=(diam-1)/2-(a/2)+iq;
document.getElementsByClassName('td'+ca)[va].style.background=drc;
};

va=(diam-1)/2-(0-(a/2));


for(iq=0;iq<a;iq++) {

ca=(diam-1)/2-(a/2)+iq;
document.getElementsByClassName('td'+va)[ca].style.background=drc;
};
for(iq=0;iq<a+1;iq++) {

ca=(diam-1)/2-(a/2)+iq;
document.getElementsByClassName('td'+ca)[va].style.background=drc;
};

};

};
};
/*
