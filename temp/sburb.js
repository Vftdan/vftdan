alert ("Started loading...");
if(typeof String.prototype.trim!=='function'){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,'');}}
var Sburb=(function(Sburb){Sburb.Keys={backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,escape:27,space:32,left:37,up:38,right:39,down:40,w:87,a:65,s:83,d:68};Sburb.Stage=null;Sburb.cam={x:0,y:0}
Sburb.stage=null;Sburb.pressed=null;Sburb.assetManager=null;Sburb.assets=null;Sburb.sprites=null;Sburb.effects=null;Sburb.buttons=null;Sburb.rooms=null;Sburb.char=null;Sburb.curRoom=null;Sburb.destRoom=null;Sburb.destX=null;Sburb.destY=null;Sburb.focus=null;Sburb.destFocus=null;Sburb.chooser=null;Sburb.curAction=null;Sburb.bgm=null;Sburb.hud=null;Sburb.Mouse={down:false,x:0,y:0};Sburb.waitFor=null;Sburb.engineMode="wander";Sburb.fading=false;Sburb.lastMusicTime=[0,0];Sburb.updateLoop=null;Sburb.initFinished=null;Sburb._hardcode_load=null;Sburb._include_dev=false;var lastDrawTime=0;Sburb.initialize=function(div,levelName,includeDevTools){var deploy='   \
 <div style="padding-left: 0;\
  padding-right: 0;\
  margin-left: auto;\
  margin-right: auto;\
  display: block;\
  width:650px;\
  height:450px;"> \
  <div id="SBURBgameDiv" style="position: absolute; z-index:100">\
   <canvas id="SBURBStage" width="650" height="450" tabindex="0" \
      onmousedown = "Sburb.onMouseDown(event,this)"\
      onmousemove = "Sburb.onMouseMove(event,this)"\
      onmouseup = "Sburb.onMouseUp(event,this)"\
      >\
      ERROR: Your browser is too old to display this content!\
   </canvas>\
   <canvas id="SBURBMapCanvas" width="1" height="1" style="display:none"/> \
  </div>\
  <div id="SBURBmovieBin" style="position: absolute; z-index:200"> </div>\
  <div id="SBURBfontBin"></div>\
  </br>';if(includeDevTools){Sburb._include_dev=true;deploy+='\
  <div> \
   <button id="saveState" onclick="Sburb.serialize(Sburb.assets, Sburb.effects, Sburb.rooms, Sburb.sprites, Sburb.hud, Sburb.dialoger, Sburb.curRoom, Sburb.char)">save state</button>\
   <button id="loadState" onclick="Sburb.loadSerial(document.getElementById(\'serialText\').value)">load state</button>\
   <input type="file" name="level" id="levelFile" />\
   <button id="loadLevelFile" onclick="Sburb.loadLevelFile(document.getElementById(\'levelFile\'))">load level</button>\
   <button id="strifeTest" onclick="Sburb.loadSerialFromXML(\'levels/strifeTest.xml\')">strife test</button>\
   <button id="wanderTest" onclick="Sburb.loadSerialFromXML(\'levels/wanderTest.xml\')">wander test</button>\
   </br>\
   <textarea id="serialText" style="display:inline; width:650; height:100;"></textarea><br/>\
  </div>';}
deploy+='</div>';document.getElementById(div).innerHTML=deploy;var gameDiv=document.getElementById("SBURBgameDiv");gameDiv.onkeydown=_onkeydown;gameDiv.onkeyup=_onkeyup;Sburb.Stage=document.getElementById("SBURBStage");Sburb.Stage.scaleX=Sburb.Stage.scaleY=3;Sburb.Stage.x=Sburb.Stage.y=0;Sburb.Stage.fps=30;Sburb.Stage.fade=0;Sburb.Stage.fadeRate=0.1;Sburb.stage=Sburb.Stage.getContext("2d");Sburb.chooser=new Sburb.Chooser();Sburb.dialoger=null;Sburb.assetManager=new Sburb.AssetManager();Sburb.assets=Sburb.assetManager.assets;Sburb.rooms={};Sburb.sprites={};Sburb.effects={};Sburb.buttons={};Sburb.hud={};Sburb.pressed=[];Sburb.loadSerialFromXML(levelName);}
function startUpdateProcess(){haltUpdateProcess();Sburb.updateLoop=setInterval(update,1000/Sburb.Stage.fps);Sburb.drawLoop=setInterval(draw,1000/Sburb.Stage.fps);}
function haltUpdateProcess(){if(Sburb.updateLoop){clearInterval(Sburb.updateLoop);clearInterval(Sburb.drawLoop);Sburb.updateLoop=Sburb.drawLoop=null;}}
function update(){handleAudio();handleInputs();handleHud();Sburb.curRoom.update();focusCamera();handleRoomChange();Sburb.chooser.update();Sburb.dialoger.update();chainAction();updateWait();}
function draw(){if(!Sburb.playingMovie){Sburb.stage.save();Sburb.Stage.offset=true;Sburb.stage.translate(-Sburb.Stage.x,-Sburb.Stage.y);Sburb.curRoom.draw();Sburb.stage.restore();Sburb.Stage.offset=false;if(Sburb.Stage.fade>0.1){Sburb.stage.fillStyle="rgba(0,0,0,"+Sburb.Stage.fade+")";Sburb.stage.fillRect(0,0,Sburb.Stage.width,Sburb.Stage.height);}
Sburb.dialoger.draw();drawHud();Sburb.stage.save();Sburb.Stage.offset=true;Sburb.stage.translate(-Sburb.Stage.x,-Sburb.Stage.y);Sburb.chooser.draw();Sburb.stage.restore();Sburb.Stage.offset=false;}}
var _onkeydown=function(e){if(Sburb.chooser.choosing){if(e.keyCode==Sburb.Keys.down||e.keyCode==Sburb.Keys.s){Sburb.chooser.nextChoice();}
if(e.keyCode==Sburb.Keys.up||e.keyCode==Sburb.Keys.w){Sburb.chooser.prevChoice();}
if(e.keyCode==Sburb.Keys.space&&!Sburb.pressed[Sburb.Keys.space]){Sburb.performAction(Sburb.chooser.choices[Sburb.chooser.choice]);Sburb.chooser.choosing=false;}}else if(Sburb.dialoger.talking){if(e.keyCode==Sburb.Keys.space&&!Sburb.pressed[Sburb.Keys.space]){Sburb.dialoger.nudge();}}else if(hasControl()){if(e.keyCode==Sburb.Keys.space&&!Sburb.pressed[Sburb.Keys.space]&&Sburb.engineMode=="wander"){Sburb.chooser.choices=[];var queries=Sburb.char.getActionQueries();for(var i=0;i<queries.length;i++){Sburb.chooser.choices=Sburb.curRoom.queryActions(Sburb.char,queries[i].x,queries[i].y);if(Sburb.chooser.choices.length>0){break;}}
if(Sburb.chooser.choices.length>0){Sburb.chooser.choices.push(new Sburb.Action("cancel","cancel","cancel"));beginChoosing();}}}
Sburb.pressed[e.keyCode]=true;if(e.altKey||e.ctrlKey||e.metaKey){return true;}
return false;}
var _onkeyup=function(e){Sburb.pressed[e.keyCode]=false;}
Sburb.onMouseMove=function(e,canvas){var point=relMouseCoords(e,canvas);Sburb.Mouse.x=point.x;Sburb.Mouse.y=point.y;}
Sburb.onMouseDown=function(e,canvas){if(Sburb.engineMode=="strife"&&hasControl()){Sburb.chooser.choices=Sburb.curRoom.queryActionsVisual(Sburb.char,Sburb.Stage.x+Sburb.Mouse.x,Sburb.Stage.y+Sburb.Mouse.y);if(Sburb.chooser.choices.length>0){Sburb.chooser.choices.push(new Sburb.Action("cancel","cancel","cancel"));beginChoosing();}}
Sburb.Mouse.down=true;}
Sburb.onMouseUp=function(e,canvas){Sburb.Mouse.down=false;if(Sburb.dialoger&&Sburb.dialoger.box&&Sburb.dialoger.box.isVisuallyUnder(Sburb.Mouse.x,Sburb.Mouse.y)){Sburb.dialoger.nudge();}}
function relMouseCoords(event,canvas){var totalOffsetX=0;var totalOffsetY=0;var canvasX=0;var canvasY=0;var currentElement=canvas;do{totalOffsetX+=currentElement.offsetLeft;totalOffsetY+=currentElement.offsetTop;}
while(currentElement=currentElement.offsetParent)
canvasX=event.pageX-totalOffsetX;canvasY=event.pageY-totalOffsetY;return{x:canvasX,y:canvasY};}
function handleAudio(){if(Sburb.bgm&&Sburb.bgm.asset){if(Sburb.bgm.asset.ended||Sburb.bgm.asset.currentTime>=Sburb.bgm.asset.duration){Sburb.bgm.loop();}
if(Sburb.lastMusicTime[0]==Sburb.bgm.asset.currentTime&&Sburb.lastMusicTime[1]==Sburb.bgm.asset.currentTime){Sburb.bgm.asset.pause();Sburb.bgm.asset.play();}
if(Sburb.bgm.asset.paused){Sburb.bgm.play();}
Sburb.lastMusicTime[0]=Sburb.lastMusicTime[1];Sburb.lastMusicTime[1]=Sburb.bgm.asset.currentTime;}else{}}
function handleInputs(){if(Sburb.Stage){Sburb.Stage.style.cursor="default";}
if(hasControl()){Sburb.char.handleInputs(Sburb.pressed);}else{Sburb.char.moveNone();}}
function handleHud(){for(var content in Sburb.hud){var obj=Sburb.hud[content];obj.update();}}
function drawHud(){for(var content in Sburb.hud){Sburb.hud[content].draw();}}
function hasControl(){return!Sburb.dialoger.talking&&!Sburb.chooser.choosing&&!Sburb.destRoom&&!Sburb.waitFor&&!Sburb.fading&&!Sburb.destFocus;}
function focusCamera(){if(!Sburb.destFocus){Sburb.cam.x=Sburb.focus.x-Sburb.Stage.width/2;Sburb.cam.y=Sburb.focus.y-Sburb.Stage.height/2;}else if(Math.abs(Sburb.destFocus.x-Sburb.cam.x-Sburb.Stage.width/2)>8||Math.abs(Sburb.destFocus.y-Sburb.cam.y-Sburb.Stage.height/2)>8){Sburb.cam.x+=(Sburb.destFocus.x-Sburb.Stage.width/2-Sburb.cam.x)/5;Sburb.cam.y+=(Sburb.destFocus.y-Sburb.Stage.height/2-Sburb.cam.y)/5;}else{Sburb.focus=Sburb.destFocus;Sburb.destFocus=null;}
Sburb.Stage.x=Math.max(0,Math.min(Math.round(Sburb.cam.x/Sburb.Stage.scaleX)*Sburb.Stage.scaleX,Sburb.curRoom.width-Sburb.Stage.width));Sburb.Stage.y=Math.max(0,Math.min(Math.round(Sburb.cam.y/Sburb.Stage.scaleX)*Sburb.Stage.scaleX,Sburb.curRoom.height-Sburb.Stage.height));}
function handleRoomChange(){if(Sburb.destRoom||Sburb.fading){if(Sburb.Stage.fade<1.1){Sburb.Stage.fade=Math.min(1.1,Sburb.Stage.fade+Sburb.Stage.fadeRate);}else if(Sburb.destRoom){var deltaX=Sburb.destX-Sburb.char.x;var deltaY=Sburb.destY-Sburb.char.y;var curSprite=Sburb.char;while(curSprite){curSprite.x+=deltaX;curSprite.y+=deltaY;curSprite.followBuffer=[];curSprite=curSprite.follower;}
Sburb.moveSprite(Sburb.char,Sburb.curRoom,Sburb.destRoom);Sburb.curRoom.exit();Sburb.curRoom=Sburb.destRoom;Sburb.curRoom.enter();Sburb.destRoom=null;}else{Sburb.fading=false;}}else if(hasControl()&&Sburb.Stage.fade>0.01){Sburb.Stage.fade=Math.max(0.01,Sburb.Stage.fade-Sburb.Stage.fadeRate);}}
function beginChoosing(){Sburb.char.idle();Sburb.chooser.beginChoosing(Sburb.char.x,Sburb.char.y);}
function chainAction(){if(Sburb.curAction){if(Sburb.curAction.times<=0){if(Sburb.curAction.followUp){if(hasControl()||Sburb.curAction.followUp.noWait){Sburb.performAction(Sburb.curAction.followUp);}}else{Sburb.curAction=null;}}else if(hasControl()||Sburb.curAction.noWait){Sburb.performAction(Sburb.curAction);}}}
function updateWait(){if(Sburb.waitFor){if(Sburb.waitFor.checkCompletion()){Sburb.waitFor=null;}}}
Sburb.performAction=function(action){if(action.silent){Sburb.performActionSilent(action);return;}
if(((Sburb.curAction&&Sburb.curAction.followUp!=action)||!hasControl())&&action.soft){return;}
var looped=false;Sburb.curAction=action.clone();do{if(looped){Sburb.curAction=Sburb.curAction.followUp.clone();}
Sburb.performActionSilent(Sburb.curAction);looped=true;}while(Sburb.curAction&&Sburb.curAction.times<=0&&Sburb.curAction.followUp&&Sburb.curAction.followUp.noDelay);}
Sburb.performActionSilent=function(action){action.times--;var info=action.info;if(info){info=info.trim();}
Sburb.commands[action.command.trim()](info);}
Sburb.changeRoom=function(newRoom,newX,newY){Sburb.destRoom=newRoom;Sburb.destX=newX;Sburb.destY=newY;}
Sburb.moveSprite=function(sprite,oldRoom,newRoom){var curSprite=sprite;while(curSprite){oldRoom.removeSprite(curSprite);newRoom.addSprite(curSprite);curSprite=curSprite.follower;}}
Sburb.setCurRoomOf=function(sprite){if(!Sburb.curRoom.contains(sprite)){for(var room in Sburb.rooms){if(Sburb.rooms[room].contains(sprite)){Sburb.changeRoom(Sburb.rooms[room],Sburb.char.x,Sburb.char.y);return;}}}}
Sburb.changeBGM=function(newSong){if(newSong){if(Sburb.bgm){if(Sburb.bgm.asset==newSong.asset&&Sburb.bgm.startLoop==newSong.startLoop){return;}
Sburb.bgm.stop();}
Sburb.bgm=newSong;Sburb.bgm.stop();Sburb.bgm.play();}}
Sburb.playEffect=function(effect,x,y){Sburb.curRoom.addEffect(effect.clone(x,y));}
Sburb.playSound=function(sound){sound.stop();sound.play();}
Sburb.playMovie=function(movie){var name=movie.name;document.getElementById(name).style.display="block";Sburb.waitFor=new Sburb.Trigger("movie,"+name+",5");Sburb.playingMovie=true;}
Sburb.startUpdateProcess=startUpdateProcess;Sburb.haltUpdateProcess=haltUpdateProcess;Sburb.draw=draw;return Sburb;})(Sburb||{});var Sburb=(function(Sburb){function Sprite(name,x,y,width,height,dx,dy,depthing,collidable){this.x=x;this.y=y;this.dx=typeof dx=="number"?dx:0;this.dy=typeof dy=="number"?dy:0;this.width=width;this.height=height;this.depthing=typeof depthing=="number"?depthing:this.BG_DEPTHING;this.collidable=typeof collidable=="boolean"?collidable:false;this.animations={};this.animation=null;this.state=null;this.lastTime=0;this.actions=[];this.name=name;this.queries=null;}
Sprite.prototype.BG_DEPTHING=0;Sprite.prototype.MG_DEPTHING=1;Sprite.prototype.FG_DEPTHING=2;Sprite.prototype.addAnimation=function(anim){this.animations[anim.name]=anim;}
Sprite.prototype.startAnimation=function(name){if(this.state!=name){this.animation=this.animations[name];this.animation.reset();this.state=name;}}
Sprite.prototype.update=function(curRoom){if(this.animation.hasPlayed()&&this.animation.followUp){this.startAnimation(this.animation.followUp);}else{this.animation.update();}}
Sprite.prototype.staticImg=function(){return this.animation.staticImg();}
Sprite.prototype.draw=function(){if(this.animation!=null){this.animation.draw(this.x,this.y);}}
Sprite.prototype.isBehind=function(other){if(this.depthing==other.depthing){return this.y+this.dy<other.y+other.dy;}else{return this.depthing<other.depthing;}}
Sprite.prototype.collides=function(other,dx,dy){var x=this.x+(dx?dx:0);var y=this.y+(dy?dy:0);if(other.collidable){if((x-this.width/2<other.x+other.width/2)&&(x+this.width/2>other.x-other.width/2)&&(y-this.height/2<other.y+other.height/2)&&(y+this.height/2>other.y-other.height/2)){return true;}}
return false;}
Sprite.prototype.hitsPoint=function(x,y){if((this.x-this.width/2<=x)&&(this.x+this.width/2>=x)&&(this.y-this.height/2<=y)&&(this.y+this.height/2>=y)){return true;}
return false;}
Sprite.prototype.isVisuallyUnder=function(x,y){return this.animation.isVisuallyUnder(x-this.x,y-this.y);}
Sprite.prototype.addAction=function(action){this.actions.push(action);}
Sprite.prototype.removeAction=function(name){for(var i=0;i<this.actions.length;i++){if(this.actions[i].name==name){this.actions.splice(i,1);return;}}}
Sprite.prototype.getActions=function(sprite){var validActions=[];for(var i=0;i<this.actions.length;i++){var action=this.actions[i];var desired=action.sprite;if(!desired||desired==sprite.name||(desired.charAt(0)=="!"&&desired.substring(1)!=sprite.name)){validActions.push(action);}}
return validActions;}
Sprite.prototype.getBoundaryQueries=function(dx,dy){var spriteX=this.x+(dx?dx:0);var spriteY=this.y+(dy?dy:0);var w=this.width/2;var h=this.height/2;if(!this.queries){this.queries={upRight:{},upLeft:{},downLeft:{},downRight:{},downMid:{},upMid:{}};}
this.queries.upRight.x=spriteX+w;this.queries.upRight.y=spriteY-h;this.queries.upLeft.x=spriteX-w;this.queries.upLeft.y=spriteY-h;this.queries.downLeft.x=spriteX-w;this.queries.downLeft.y=spriteY+h;this.queries.downRight.x=spriteX+w;this.queries.downRight.y=spriteY+h;this.queries.downMid.x=spriteX;this.queries.downMid.y=spriteY+h;this.queries.upMid.x=spriteX;this.queries.upMid.y=spriteY-h;return this.queries;}
Sprite.prototype.serialize=function(output){var animationCount=0;for(anim in this.animations){animationCount++;}
output=output.concat("\n<sprite "+
Sburb.serializeAttributes(this,"name","x","y","dx","dy","width","height","depthing","collidable")+
(animationCount>1?"state='"+this.state+"' ":"")+">");for(var anim in this.animations){output=this.animations[anim].serialize(output);}
for(var action in this.actions){output=this.actions[action].serialize(output);}
output=output.concat("\n</sprite>");return output;}
Sburb.parseSprite=function(spriteNode,assetFolder){var attributes=spriteNode.attributes;var newName=null;var newX=0;var newY=0;var newWidth=0;var newHeight=0;var newDx=0;var newDy=0;var newDepthing=0;var newCollidable=false;var newState=null;var newAnimations={};var temp;newName=(temp=attributes.getNamedItem("name"))?temp.value:newName;newX=(temp=attributes.getNamedItem("x"))?parseInt(temp.value):newX;newY=(temp=attributes.getNamedItem("y"))?parseInt(temp.value):newY;newWidth=(temp=attributes.getNamedItem("width"))?parseInt(temp.value):newWidth;newHeight=(temp=attributes.getNamedItem("height"))?parseInt(temp.value):newHeight;newDx=(temp=attributes.getNamedItem("dx"))?parseInt(temp.value):newDx;newDy=(temp=attributes.getNamedItem("dy"))?parseInt(temp.value):newDy;newDepthing=(temp=attributes.getNamedItem("depthing"))?parseInt(temp.value):newDepthing;newCollidable=(temp=attributes.getNamedItem("collidable"))?temp.value!="false":newCollidable;newState=(temp=attributes.getNamedItem("state"))?temp.value:newState;var newSprite=new Sprite(newName,newX,newY,newWidth,newHeight,newDx,newDy,newDepthing,newCollidable);var anims=spriteNode.getElementsByTagName("animation");for(var j=0;j<anims.length;j++){var newAnim=Sburb.parseAnimation(anims[j],assetFolder);newSprite.addAnimation(newAnim);if(newState==null){newState=newAnim.name;}}
newSprite.startAnimation(newState);return newSprite;}
Sburb.Sprite=Sprite;return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.Fighter=function(name,x,y,width,height){Sburb.Sprite.call(this,name,x,y,width,height,null,null,Sburb.Sprite.prototype.MG_DEPTHING,true);this.accel=1.5;this.decel=1;this.friction=0.87;this.vx=0;this.vy=0;this.facing="Right";}
Sburb.Fighter.prototype=new Sburb.Sprite();Sburb.Fighter.prototype.update=function(curRoom){this.tryToMove(curRoom);Sburb.Sprite.prototype.update.call(this,curRoom);this.animation.flipX=(this.facing=="Left");}
Sburb.Fighter.prototype.handleInputs=function(pressed){var moved=false;if(pressed[Sburb.Keys.down]||pressed[Sburb.Keys.s]){this.moveDown();moved=true;}else if(pressed[Sburb.Keys.up]||pressed[Sburb.Keys.w]){this.moveUp();moved=true;}
if(pressed[Sburb.Keys.left]||pressed[Sburb.Keys.a]){this.moveLeft();moved=true;}else if(pressed[Sburb.Keys.right]||pressed[Sburb.Keys.d]){this.moveRight();moved=true;}
if(pressed[Sburb.Keys.space]||pressed[Sburb.Keys.enter]||pressed[Sburb.Keys.ctrl]){this.attack();}
if(!moved){this.idle();}}
Sburb.Fighter.prototype.idle=function(){if(this.state=="walk"){this.startAnimation("idle");}}
Sburb.Fighter.prototype.walk=function(){if(this.state=="idle"){this.startAnimation("walk");}}
Sburb.Fighter.prototype.attack=function(){this.startAnimation("attack");}
Sburb.Fighter.prototype.moveUp=function(){this.walk();this.vy-=this.accel;}
Sburb.Fighter.prototype.moveDown=function(){this.walk();this.vy+=this.accel;}
Sburb.Fighter.prototype.moveLeft=function(){this.walk();this.vx-=this.accel;this.facing="Left";}
Sburb.Fighter.prototype.moveRight=function(){this.walk();this.vx+=this.accel;this.facing="Right";}
Sburb.Fighter.prototype.moveNone=function(){}
Sburb.Fighter.prototype.becomePlayer=function(){}
Sburb.Fighter.prototype.becomeNPC=function(){}
Sburb.Fighter.prototype.getActionQueries=function(){var queries=[];return queries;}
Sburb.Fighter.prototype.collides=function(sprite,dx,dy){if(!this.width||!sprite.width){return false;}
var x1=this.x+(dx?dx:0);var y1=this.y+(dy?dy:0);var w1=this.width/2;var h1=this.height/2;var x2=sprite.x;var y2=sprite.y;var w2=sprite.width/2;var h2=sprite.height/2;var xDiff=x2-x1;var yDiff=y2-y1;return Math.sqrt(xDiff*xDiff/w2/w1+yDiff*yDiff/h2/h1)<2;}
Sburb.Fighter.prototype.getBoundaryQueries=function(dx,dy){var x=this.x+(dx?dx:0);var y=this.y+(dy?dy:0);var queries={};var queryCount=8;var angleDiff=2*Math.PI/queryCount;for(var i=0,theta=0;i<queryCount;i++,theta+=angleDiff){queries[i]={x:x+Math.cos(theta)*this.width/2,y:y+Math.sin(theta)*this.height/2};}
return queries;}
Sburb.Fighter.prototype.tryToMove=function(room){this.vx*=this.friction;this.vy*=this.friction;if(Math.abs(this.vx)<this.decel){this.vx=0;}
if(Math.abs(this.vy)<this.decel){this.vy=0;}
var vx=this.vx;var vy=this.vy;var i;var moveMap=room.getMoveFunction(this);var wasShifted=false;if(moveMap){l=moveMap(vx,vy);if(vx!=l.x||vy!=l.y){wasShifted=true;}
vx=l.x;vy=l.y;}
var dx=vx;var dy=vy;this.x+=vx;this.y+=vy;var collides=room.collides(this);if(collides){var tx=0;var ty=0;var theta=Math.atan2(this.y-collides.y,this.x-collides.x);var xOff=Math.cos(theta);var yOff=Math.sin(theta);while(this.collides(collides,tx,ty)){tx-=(dx-xOff)*0.1;ty-=(dy-yOff)*0.1;}
if(room.collides(this,tx,ty)){this.x-=dx;this.y-=dy;return false;}
this.x+=tx;this.y+=ty;dx+=tx;dy+=ty;var theta=Math.atan2(this.y-collides.y,this.x-collides.x);this.vx+=tx;this.vy+=ty;this.vx*=0.9;this.vy*=0.9;}
var queries=room.isInBoundsBatch(this.getBoundaryQueries());var queryCount=8;var collided=false;var hitX=0;var hitY=0;var angleDiff=2*Math.PI/queryCount;for(var i=0,theta=0;i<queryCount;i++,theta+=angleDiff){var query=queries[i];if(!query){hitX+=Math.cos(theta);hitY+=Math.sin(theta);collided=true;}}
if(collided){var tx=0;var ty=0;var theta=Math.atan2(hitY,hitX);var xOff=Math.cos(theta);var yOff=Math.sin(theta);var timeout=0;while(!room.isInBounds(this,tx,ty)&&timeout<20){tx-=xOff*2;ty-=yOff*2;timeout++;}
if(timeout>=20||room.collides(this,tx,ty)){console.log(tx,ty);this.x-=dx;this.y-=dy;return false;}
this.x+=tx;this.y+=ty;dx+=tx;dy+=ty;this.vx+=tx;this.vy+=ty;this.vx*=0.9;this.vy*=0.9;}
return true;}
Sburb.Fighter.prototype.serialize=function(output){var animationCount=0;for(anim in this.animations){animationCount++;}
output=output.concat("<fighter "+
Sburb.serializeAttributes(this,"name","x","y","width","height","facing")+
(animationCount>1?"state='"+this.state+"' ":"")+">");for(animation in this.animations){output=this.animations[animation].serialize(output);}
for(action in this.actions){output=this.actions[action].serialize(output);}
output=output.concat("</fighter>");return output;}
Sburb.parseFighter=function(spriteNode,assetFolder){var attributes=spriteNode.attributes;var newName=null;var newX=0;var newY=0;var newWidth=0;var newHeight=0;var newState=null;var temp;newName=(temp=attributes.getNamedItem("name"))?temp.value:newName;newX=(temp=attributes.getNamedItem("x"))?parseInt(temp.value):newX;newY=(temp=attributes.getNamedItem("y"))?parseInt(temp.value):newY;newWidth=(temp=attributes.getNamedItem("width"))?parseInt(temp.value):newWidth;newHeight=(temp=attributes.getNamedItem("height"))?parseInt(temp.value):newHeight;newState=(temp=attributes.getNamedItem("state"))?temp.value:newState;var newFacing=(temp=attributes.getNamedItem("facing"))?temp.value:"Right";var newSprite=new Sburb.Fighter(newName,newX,newY,newWidth,newHeight);newSprite.facing=newFacing;var anims=spriteNode.getElementsByTagName("animation");for(var j=0;j<anims.length;j++){var newAnim=Sburb.parseAnimation(anims[j],assetFolder);newSprite.addAnimation(newAnim);if(newState==null){newState=newAnim.name;}}
newSprite.startAnimation(newState);return newSprite;}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.Character=function(name,x,y,width,height,sx,sy,sWidth,sHeight,sheet,bootstrap){Sburb.Sprite.call(this,name,x,y,width,height,null,null,Sburb.Sprite.prototype.MG_DEPTHING,true);this.speed=12;this.vx=0;this.vy=0;this.facing="Front";this.npc=true;this.spriteType="character";this.following=null;this.followBuffer=null;this.follower=null;this.lastLeaderPos=null;this.handledInput=-1;if(!bootstrap){sWidth=typeof sWidth=="number"?sWidth:width;sHeight=typeof sHeight=="number"?sHeight:height;this.addAnimation(new Sburb.Animation("idleFront",sheet,sx,sy,sWidth,sHeight,0,1,2));this.addAnimation(new Sburb.Animation("idleRight",sheet,sx,sy,sWidth,sHeight,1,1,2));this.addAnimation(new Sburb.Animation("idleBack",sheet,sx,sy,sWidth,sHeight,2,1,2));this.addAnimation(new Sburb.Animation("idleLeft",sheet,sx,sy,sWidth,sHeight,3,1,2));this.addAnimation(new Sburb.Animation("walkFront",sheet,sx,sy,sWidth,sHeight,4,2,4));this.addAnimation(new Sburb.Animation("walkRight",sheet,sx,sy,sWidth,sHeight,6,2,4));this.addAnimation(new Sburb.Animation("walkBack",sheet,sx,sy,sWidth,sHeight,8,2,4));this.addAnimation(new Sburb.Animation("walkLeft",sheet,sx,sy,sWidth,sHeight,10,2,4));this.startAnimation("walkFront");}else{this.bootstrap=true;}
this.becomeNPC();}
Sburb.Character.prototype=new Sburb.Sprite();Sburb.Character.prototype.followBufferLength=9;Sburb.Character.prototype.update=function(curRoom){if(this.following){if(this.following.isNPC()&&!this.isNPC()){this.becomeNPC();this.collidable=true;this.walk();}else if(!this.following.isNPC()&&this.isNPC()){this.becomePlayer();this.collidable=false;}
if(this.following.x!=this.lastLeaderPos.x||this.following.y!=this.lastLeaderPos.y){this.followBuffer.push({x:this.following.x,y:this.following.y});this.lastLeaderPos.x=this.following.x;this.lastLeaderPos.y=this.following.y;}
while(this.followBuffer.length>this.followBufferLength){var destPos=this.followBuffer[0];if(Math.abs(destPos.x-this.x)>=this.speed/1.9){if(destPos.x>this.x){this.moveRight();}else{this.moveLeft();}}else if(Math.abs(destPos.y-this.y)>=this.speed/1.9){if(destPos.y>this.y){this.moveDown();}else{this.moveUp();}}else{this.followBuffer.splice(0,1);continue;}
break;}
if(this.followBuffer.length<=this.followBufferLength&&!this.following.isNPC()){this.moveNone();}}
if(this.handleInput>0){--this.handleInput;if(this.handleInput==0){moveNone();}}
this.tryToMove(this.vx,this.vy,curRoom);Sburb.Sprite.prototype.update.call(this,curRoom);}
Sburb.Character.prototype.moveUp=function(){this.facing="Back";this.walk();this.vx=0;this.vy=-this.speed;}
Sburb.Character.prototype.moveDown=function(){this.facing="Front";this.walk();this.vx=0;this.vy=this.speed;}
Sburb.Character.prototype.moveLeft=function(){this.facing="Left";this.walk();this.vx=-this.speed;this.vy=0;}
Sburb.Character.prototype.moveRight=function(){this.facing="Right";this.walk();this.vx=this.speed;this.vy=0;}
Sburb.Character.prototype.moveNone=function(){if(this.animations.walkFront.frameInterval==4){this.idle();this.vx=0;this.vy=0;}}
Sburb.Character.prototype.walk=function(){this.startAnimation("walk"+this.facing);}
Sburb.Character.prototype.idle=function(){this.startAnimation("idle"+this.facing);}
Sburb.Character.prototype.becomeNPC=function(){this.animations.walkFront.frameInterval=12;this.animations.walkBack.frameInterval=12;this.animations.walkLeft.frameInterval=12;this.animations.walkRight.frameInterval=12;}
Sburb.Character.prototype.becomePlayer=function(){this.animations.walkFront.frameInterval=4;this.animations.walkBack.frameInterval=4;this.animations.walkLeft.frameInterval=4;this.animations.walkRight.frameInterval=4;}
Sburb.Character.prototype.handleInputs=function(pressed){if(pressed[Sburb.Keys.down]||pressed[Sburb.Keys.s]){this.moveDown();}else if(pressed[Sburb.Keys.up]||pressed[Sburb.Keys.w]){this.moveUp();}else if(pressed[Sburb.Keys.left]||pressed[Sburb.Keys.a]){this.moveLeft();}else if(pressed[Sburb.Keys.right]||pressed[Sburb.Keys.d]){this.moveRight();}else{this.moveNone();}
this.handledInput=2;}
Sburb.Character.prototype.tryToMove=function(vx,vy,room){var i;var moveMap=room.getMoveFunction(this);var wasShifted=false;if(moveMap){l=moveMap(vx,vy);if(vx!=l.x||vy!=l.y){wasShifted=true;}
vx=l.x;vy=l.y;}
var minX=Sburb.Stage.scaleX;var minY=Sburb.Stage.scaleY;while(Math.abs(vx)>=minX||Math.abs(vy)>=minY){var dx=0;var dy=0;if(Math.abs(vx)>=minX){dx=Math.round((minX)*vx/Math.abs(vx));this.x+=dx;vx-=dx;}
if(Math.abs(vy)>=minY){dy=Math.round((minY)*vy/Math.abs(vy));this.y+=dy;vy-=dy;}
if(!this.following){var collision;if(collision=room.collides(this)){var fixed=false;if(dx!=0){if(!this.collides(collision,0,minY)){dy+=minY;this.y+=minY;fixed=true;}else if(!this.collides(collision,0,-minY)){dy-=minY;this.y-=minY;fixed=true;}}
if(!fixed&&dy!=0){if(!this.collides(collision,minX,0)){dx+=minX;this.x+=minX;fixed=true;}else if(!this.collides(collision,-minX,0)){dx-=minX;this.x-=minX;fixed=true;}}
if(!fixed||room.collides(this)){this.x-=dx;this.y-=dy;return false;}}
if(!room.isInBounds(this)){var fixed=false;if(dx!=0){if(room.isInBounds(this,0,minY)){dy+=minY;this.y+=minY;fixed=true;}else if(room.isInBounds(this,0,-minY)){dy-=minY;this.y-=minY;fixed=true;}}
if(!fixed&&dy!=0){if(room.isInBounds(this,minX,0)){dx+=minX;this.x+=minX;fixed=true;}else if(room.isInBounds(this,-minX,0)){dx-=minX;this.x-=minX;fixed=true;}}
if(!fixed||room.collides(this)){this.x-=dx;this.y-=dy;return false;}}}}
return true;}
Sburb.Character.prototype.follow=function(sprite){while(sprite.follower!=null){sprite=sprite.follower;}
this.following=sprite;sprite.follower=this;this.followBuffer=[];this.lastLeaderPos={};this.collidable=false;}
Sburb.Character.prototype.unfollow=function(){if(this.following){this.following.follower=this.follower;if(this.follower){this.follower.following=this.following;this.follower.followBuffer=[];}
this.following=null;this.follower=null;this.lastLeaderPos=null;this.collidable=true;this.becomeNPC();}}
Sburb.Character.prototype.getActionQueries=function(){var queries=[];queries.push({x:this.x,y:this.y});if(this.facing=="Front"){queries.push({x:this.x,y:this.y+(this.height/2+15)});queries.push({x:this.x-this.width/2,y:this.y+(this.height/2+15)});queries.push({x:this.x+this.width/2,y:this.y+(this.height/2+15)});}else if(this.facing=="Back"){queries.push({x:this.x,y:this.y-(this.height/2+15)});queries.push({x:this.x-this.width/2,y:this.y-(this.height/2+15)});queries.push({x:this.x+this.width/2,y:this.y-(this.height/2+15)});}else if(this.facing=="Right"){queries.push({x:this.x+(this.width/2+15),y:this.y});queries.push({x:this.x+(this.width/2+15),y:this.y+this.height/2});queries.push({x:this.x+(this.width/2+15),y:this.y-this.height/2});}else if(this.facing=="Left"){queries.push({x:this.x-(this.width/2+15),y:this.y});queries.push({x:this.x-(this.width/2+15),y:this.y+this.height/2});queries.push({x:this.x-(this.width/2+15),y:this.y-this.height/2});}
return queries;}
Sburb.Character.prototype.serialize=function(output){output=output.concat("\n<character name='"+this.name+"' x='"+this.x+"' y='"+this.y+"' width='"+this.width+"' height='"+this.height+"' state='"+this.state+"' facing='"+this.facing);if(!this.bootstrap){output=output.concat("' sx='"+this.animations.walkFront.x+"' sy='"+this.animations.walkFront.y+"' sWidth='"+this.animations.walkFront.colSize+"' sHeight='"+this.animations.walkFront.rowSize+"' sheet='"+this.animations.walkFront.sheet.name);}else{output=output.concat("' bootstrap='true");}
output=output.concat("'>");for(var animation in this.animations){var anim=this.animations[animation];if(this.bootstrap||(anim.name.indexOf("idle")==-1&&anim.name.indexOf("walk")==-1)){output=anim.serialize(output);}}
for(var action in this.actions){output=this.actions[action].serialize(output);}
output=output.concat("\n</character>");return output;}
Sburb.Character.prototype.isNPC=function(){return this.animations.walkFront.frameInterval==12;}
Sburb.parseCharacter=function(charNode,assetFolder){var attributes=charNode.attributes;var newChar=new Sburb.Character(attributes.getNamedItem("name").value,attributes.getNamedItem("x")?parseInt(attributes.getNamedItem("x").value):0,attributes.getNamedItem("y")?parseInt(attributes.getNamedItem("y").value):0,parseInt(attributes.getNamedItem("width").value),parseInt(attributes.getNamedItem("height").value),attributes.getNamedItem("sx")?parseInt(attributes.getNamedItem("sx").value):0,attributes.getNamedItem("sy")?parseInt(attributes.getNamedItem("sy").value):0,parseInt(attributes.getNamedItem("sWidth").value),parseInt(attributes.getNamedItem("sHeight").value),assetFolder[attributes.getNamedItem("sheet").value]);var temp=attributes.getNamedItem("following");if(temp){var following=Sburb.sprites[temp.value];newChar.follow(following);}
var anims=charNode.getElementsByTagName("animation");for(var j=0;j<anims.length;j++){var newAnim=Sburb.parseAnimation(anims[j],assetFolder);newChar.addAnimation(newAnim);}
newChar.startAnimation(attributes.getNamedItem("state").value);newChar.facing=attributes.getNamedItem("facing").value;return newChar;}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.SpriteButton=function(name,x,y,width,height,sheet,action){Sburb.Sprite.call(this,name,x,y,width,height);this.pressed=false;this.mousePressed=false;this.clicked=false;this.action?action:null;for(var i=0;i<(sheet.width/this.width)*(sheet.height/this.height);i++){this.addAnimation(new Sburb.Animation("state"+i,sheet,0,0,width,height,i,1,1000));}
this.startAnimation("state0");}
Sburb.SpriteButton.prototype=new Sburb.Sprite();Sburb.SpriteButton.prototype.update=function(){Sburb.Sprite.prototype.update.call(this);this.updateMouse();}
Sburb.SpriteButton.prototype.updateMouse=function(){var x=Sburb.Mouse.x;var y=Sburb.Mouse.y;var mouseDown=Sburb.Mouse.down;this.clicked=false;if(this.hitsPoint(x-this.width/2,y-this.height/2)){Sburb.Stage.style.cursor="pointer";}
if(mouseDown){if(!this.mousePressed){this.mousePressed=true;if(this.hitsPoint(x-this.width/2,y-this.height/2)){this.pressed=true;}}}else{if(this.pressed){if(this.hitsPoint(x-this.width/2,y-this.height/2)){this.clicked=true;var nextState="state"+(parseInt(this.animation.name.substring(5,this.animation.name.length))+1);if(this.animations[nextState]){this.startAnimation(nextState);}else{this.startAnimation("state0");}}}
this.pressed=false;this.mousePressed=false;}
if(this.clicked&&this.action){Sburb.performAction(this.action);}}
Sburb.SpriteButton.prototype.setState=function(state){this.startAnimation("state"+state);}
Sburb.SpriteButton.prototype.serialize=function(output){output=output.concat("\n<spritebutton name='"+this.name+
(this.x?"' x='"+this.x:"")+
(this.y?"' y='"+this.y:"")+"' width='"+this.width+"' height='"+this.height+"' sheet='"+this.animation.sheet.name+"' >");if(this.action){output=this.action.serialize(output);}
output=output.concat("</spritebutton>");return output;}
Sburb.parseSpriteButton=function(button){var attributes=button.attributes;var newButton=new Sburb.SpriteButton(attributes.getNamedItem("name").value,attributes.getNamedItem("x")?parseInt(attributes.getNamedItem("x").value):0,attributes.getNamedItem("y")?parseInt(attributes.getNamedItem("y").value):0,parseInt(attributes.getNamedItem("width").value),parseInt(attributes.getNamedItem("height").value),Sburb.assets[attributes.getNamedItem("sheet").value]);var curAction=button.getElementsByTagName("action");if(curAction.length>0){var newAction=Sburb.parseAction(curAction[0]);newButton.action=newAction;}
return newButton;}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.Animation=function(name,sheet,x,y,colSize,rowSize,startPos,length,frameInterval,loopNum,followUp,flipX,flipY){this.sheet=sheet;this.x=x;this.y=y;this.rowSize=rowSize;this.colSize=colSize;this.startPos=startPos;this.length=length;this.curInterval=0;this.curFrame=0;this.numRows=sheet.height/rowSize;this.numCols=sheet.width/colSize;this.name=name;this.loopNum=typeof loopNum=="number"?loopNum:-1;this.curLoop=0;this.followUp=followUp;this.flipX=flipX?true:false;this.flipY=flipY?true:false;if(typeof frameInterval=="string"){if(frameInterval.indexOf(":")==-1){this.frameInterval=parseInt(frameInterval);}else{var intervals=frameInterval.split(",");this.frameIntervals={};for(var i=0;i<intervals.length;i++){var pair=intervals[i].split(":");this.frameIntervals[parseInt(pair[0])]=parseInt(pair[1]);}
if(!this.frameIntervals[0]){this.frameIntervals[0]=1;}
this.frameInterval=this.frameIntervals[this.curFrame];}}else{this.frameInterval=frameInterval;}}
Sburb.Animation.prototype.nextFrame=function(){this.curFrame++;if(this.curFrame>=this.length){if(this.curLoop==this.loopNum){this.curFrame=this.length-1;}else{this.curFrame=0;if(this.loopNum>=0){this.curLoop++;}}}
if(this.frameIntervals&&this.frameIntervals[this.curFrame]){this.frameInterval=this.frameIntervals[this.curFrame];}}
Sburb.Animation.prototype.update=function(){this.curInterval++;while(this.curInterval>this.frameInterval){this.curInterval-=this.frameInterval;this.nextFrame();}}
Sburb.Animation.prototype.draw=function(x,y){var Stage=Sburb.Stage;var stage=Sburb.stage;var stageX=Stage.offset?Stage.x:0;var stageY=Stage.offset?Stage.y:0;var stageWidth=Stage.width;var stageHeight=Stage.height;if(this.flipX){stageX=-stageX-stageWidth;x=-x;}
if(this.flipY){stageY=-stageY-stageHeight;y=-y;}
x=Math.round((this.x+x)/Stage.scaleX)*Stage.scaleX;y=Math.round((this.y+y)/Stage.scaleY)*Stage.scaleY;var colNum=((this.startPos+this.curFrame)%this.numCols);var rowNum=(Math.floor((this.startPos+this.curFrame-colNum)/this.numRows));var frameX=colNum*this.colSize;var frameY=rowNum*this.rowSize;var drawWidth=this.colSize;var drawHeight=this.rowSize;var delta=x-stageX;if(delta<0){frameX-=delta;drawWidth+=delta;x=stageX;if(frameX>=this.sheet.width){return;}}
delta=y-stageY;if(delta<0){frameY-=delta;drawHeight+=delta;y=stageY;if(frameY>=this.sheet.height){return;}}
delta=drawWidth+x-stageX-stageWidth;if(delta>0){drawWidth-=delta;}
if(drawWidth<=0){return;}
delta=drawHeight+y-stageY-stageHeight;if(delta>0){drawHeight-=delta;}
if(drawHeight<=0){return;}
var scaleX=1;var scaleY=1;if(this.flipX){scaleX=-1;}
if(this.flipY){scaleY=-1;}
if(scaleX!=1||scaleY!=1){stage.scale(scaleX,scaleY);}
stage.drawImage(this.sheet,frameX,frameY,drawWidth,drawHeight,x,y,drawWidth,drawHeight);if(scaleX!=1||scaleY!=1){stage.scale(scaleX,scaleY);}}
Sburb.Animation.prototype.reset=function(){this.curFrame=0;this.curInterval=0;this.curLoop=0;}
Sburb.Animation.prototype.hasPlayed=function(){return this.curLoop==this.loopNum&&this.curFrame==this.length-1;}
Sburb.Animation.prototype.setColSize=function(newSize){this.colSize=newSize;this.numCols=this.sheet.width/this.colSize;this.reset();}
Sburb.Animation.prototype.setRowSize=function(newSize){this.rowSize=newSize;this.numRows=this.sheet.height/this.rowSize;this.reset();}
Sburb.Animation.prototype.setSheet=function(newSheet){this.sheet=newSheet;this.numRows=this.sheet.height/this.rowSize;this.numCols=this.sheet.width/this.colSize;this.reset();}
Sburb.Animation.prototype.isVisuallyUnder=function(x,y){if(x>=this.x&&x<=this.x+this.colSize){if(y>=this.y&&y<=this.y+this.rowSize){return true;}}
return false;}
Sburb.Animation.prototype.clone=function(x,y){return new Sburb.Animation(this.name,this.sheet,x+this.x,y+this.y,this.colSize,this.rowSize,this.startPos,this.length,this.frameInterval,this.loopNum);}
Sburb.Animation.prototype.serialize=function(output){output=output.concat("\n<animation "+
("sheet='"+this.sheet.name+"' ")+
((this.name!="image")?"name='"+this.name+"' ":"")+
Sburb.serializeAttributes(this,"x","y")+
((this.rowSize!=this.sheet.height)?"rowSize='"+this.rowSize+"' ":"")+
((this.colSize!=this.sheet.width)?"colSize='"+this.colSize+"' ":"")+
Sburb.serializeAttribute(this,"startPos")+
((this.length!=1)?"length='"+this.length+"' ":"")+
((this.frameInterval!=1)?"frameInterval='"+this.frameInterval+"' ":"")+
((this.loopNum!=-1)?"loopNum='"+this.loopNum+"' ":"")+
Sburb.serializeAttributes(this,"folowUp","flipX","flipY")+" />");return output;}
Sburb.parseAnimation=function(animationNode,assetFolder){var attributes=animationNode.attributes;var name="image";var sheet=null;var x=0;var y=0;var colSize=null;var rowSize=null;var startPos=0;var length=1;var frameInterval=1;var loopNum=-1;var followUp=null;var temp;name=(temp=attributes.getNamedItem("name"))?temp.value:name;sheet=(temp=attributes.getNamedItem("sheet"))?assetFolder[temp.value]:sheet;x=(temp=attributes.getNamedItem("x"))?parseInt(temp.value):x;y=(temp=attributes.getNamedItem("y"))?parseInt(temp.value):y;length=(temp=attributes.getNamedItem("length"))?parseInt(temp.value):length;colSize=(temp=attributes.getNamedItem("colSize"))?parseInt(temp.value):Math.round(sheet.width/length);rowSize=(temp=attributes.getNamedItem("rowSize"))?parseInt(temp.value):sheet.height;startPos=(temp=attributes.getNamedItem("startPos"))?parseInt(temp.value):startPos;frameInterval=(temp=attributes.getNamedItem("frameInterval"))?temp.value:frameInterval;loopNum=(temp=attributes.getNamedItem("loopNum"))?parseInt(temp.value):loopNum;followUp=(temp=attributes.getNamedItem("followUp"))?temp.value:followUp;var flipX=(temp=attributes.getNamedItem("flipX"))?temp.value!="false":false;var flipY=(temp=attributes.getNamedItem("flipY"))?temp.value!="false":false;return new Sburb.Animation(name,sheet,x,y,colSize,rowSize,startPos,length,frameInterval,loopNum,followUp,flipX,flipY);}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.Room=function(name,width,height){this.name=name;this.width=width;this.height=height;this.sprites=[];this.effects=[];this.walkables=[];this.unwalkables=[];this.motionPaths=[];this.triggers=[];this.walkableMap=null;}
Sburb.Room.prototype.mapData=null;Sburb.Room.prototype.mapScale=4;Sburb.Room.prototype.blockSize=500;Sburb.Room.prototype.addEffect=function(effect){this.effects.push(effect);}
Sburb.Room.prototype.addTrigger=function(trigger){this.triggers.push(trigger);}
Sburb.Room.prototype.addSprite=function(sprite){this.sprites.push(sprite);}
Sburb.Room.prototype.removeSprite=function(sprite){var i;for(i=0;i<this.sprites.length;i++){if(this.sprites[i]==sprite){this.sprites.splice(i,1);return true;}}
return false;}
Sburb.Room.prototype.addWalkable=function(path){this.walkables.push(path);}
Sburb.Room.prototype.addUnwalkable=function(path){this.unwalkables.push(path);}
Sburb.Room.prototype.addMotionPath=function(path,xtox,xtoy,ytox,ytoy,dx,dy){var motionPath=new function(){this.path=path;this.xtox=xtox;this.xtoy=xtoy;this.ytox=ytox;this.ytoy=ytoy;this.dx=dx;this.dy=dy;};this.motionPaths.push(motionPath);}
Sburb.Room.prototype.removeWalkable=function(path){this.walkables.splice(this.walkables.indexOf(path),1);}
Sburb.Room.prototype.removeUnwalkable=function(path){this.unwalkables.splice(this.unwalkables.indexOf(path),1);}
Sburb.Room.prototype.removeMotionPath=function(path){for(var i=0;i<this.motionPaths.length;i++){var mpath=this.motionPaths[i];if(mpath.name==path.name){this.motionPaths.splice(i,1);return;}}}
Sburb.Room.prototype.enter=function(){if(this.walkableMap){var mapCanvas=document.getElementById("SBURBMapCanvas");var drawWidth=mapCanvas.width=this.walkableMap.width;var drawHeight=mapCanvas.height=this.walkableMap.height;var ctx=mapCanvas.getContext("2d");ctx.drawImage(this.walkableMap,0,0,drawWidth,drawHeight,0,0,drawWidth,drawHeight);this.mapData=ctx.getImageData(0,0,drawWidth,drawHeight).data;}}
Sburb.Room.prototype.exit=function(){this.effects=[];this.mapData=null;}
Sburb.Room.prototype.contains=function(sprite){for(var i=0;i<this.sprites.length;i++){if(this.sprites[i]==sprite){return true;}}
return false;}
Sburb.Room.prototype.update=function(){var i;for(i=0;i<this.sprites.length;i++){this.sprites[i].update(this);}
for(i=this.effects.length-1;i>=0;i--){if(this.effects[i].hasPlayed()){this.effects.splice(i,1);}else{this.effects[i].update();}}
for(i=this.triggers.length-1;i>=0;i--){if(this.triggers[i].tryToTrigger()){this.triggers.splice(i,1);}}}
Sburb.Room.prototype.draw=function(){this.sortDepths();for(var i=0;i<this.sprites.length;i++){this.sprites[i].draw();}
for(i=0;i<this.effects.length;i++){this.effects[i].draw(0,0);}}
Sburb.Room.prototype.sortDepths=function(){var i,j;for(i=1,j=1;i<this.sprites.length;i++,j=i){var temp=this.sprites[j];while(j>0&&temp.isBehind(this.sprites[j-1])){this.sprites[j]=this.sprites[j-1]
j--;}
this.sprites[j]=temp;}}
Sburb.Room.prototype.queryActions=function(query,x,y){var validActions=[];for(var i=0;i<this.sprites.length;i++){var sprite=this.sprites[i];if(sprite!=query&&sprite.hitsPoint(x,y)){validActions=validActions.concat(sprite.getActions(query));}}
return validActions;}
Sburb.Room.prototype.queryActionsVisual=function(query,x,y){var validActions=[];for(var i=0;i<this.sprites.length;i++){var sprite=this.sprites[i];if(sprite.isVisuallyUnder(x,y)){validActions=validActions.concat(sprite.getActions(query));}}
return validActions;}
Sburb.Room.prototype.isInBounds=function(sprite,dx,dy){var queries=sprite.getBoundaryQueries(dx,dy);var result=this.isInBoundsBatch(queries);for(var point in result){if(!result[point]){return false;}}
return true;}
Sburb.Room.prototype.isInBoundsBatch=function(queries,results){if(typeof results!="object"){results={};for(var queryName in queries){results[queryName]=false;}}
if(this.walkableMap){for(var query in queries){var pt=queries[query];var data=this.mapData;var width=this.walkableMap.width;var height=this.walkableMap.height;if(pt.x<0||pt.x>width*this.mapScale||pt.y<0||pt.y>height*this.mapScale){results[query]=false;}else{var imgPt=(Math.round(pt.x/this.mapScale)+Math.round(pt.y/this.mapScale)*width)*4;results[query]=!!data[imgPt];}}}
for(var i=0;i<this.walkables.length;i++){this.walkables[i].queryBatchPos(queries,results);}
for(var i=0;i<this.unwalkables.length;i++){this.unwalkables[i].queryBatchNeg(queries,results);}
return results;}
Sburb.Room.prototype.getMoveFunction=function(sprite){var result;for(i=0;i<this.motionPaths.length;i++){var motionPath=this.motionPaths[i];var shouldMove=motionPath.path.query(sprite);if(shouldMove){result=function(ax,ay){var fx,fy;fx=(ax*motionPath.xtox+ay*motionPath.ytox+motionPath.dx);fy=(ax*motionPath.xtoy+ay*motionPath.ytoy+motionPath.dy);return{x:fx,y:fy};};return result;}}}
Sburb.Room.prototype.collides=function(sprite,dx,dy){for(var i=0;i<this.sprites.length;i++){var theSprite=this.sprites[i];if(theSprite.collidable&&sprite!=theSprite){if(sprite.collides(theSprite,dx,dy)){return theSprite;}}}
return null;}
Sburb.Room.prototype.serialize=function(output){output=output.concat("\n<room name='"+this.name+"' width='"+this.width+"' height='"+this.height+
(this.walkableMap?("' walkableMap='"+this.walkableMap.name):"")+"' >");output=output.concat("\n<paths>");for(var i=0;i<this.walkables.length;i++){var walkable=this.walkables[i];output=output.concat("\n<walkable path='"+walkable.name+"'/>");}
for(var i=0;i<this.unwalkables.length;i++){var unwalkable=this.unwalkables[i];output=output.concat("\n<unwalkable path='"+unwalkable.name+"'/>");}
for(var i=0;i<this.motionPaths.length;i++){var motionPath=this.motionPaths[i];output=output.concat("\n<motionpath path='"+motionPath.path.name+"' xtox='"+motionPath.xtox+"' xtoy='"+motionPath.xtoy+"' ytox='"+motionPath.ytox+"' ytoy='"+motionPath.ytoy+"' dx='"+motionPath.dx+"' dy='"+motionPath.dy+"'/>");}
output=output.concat("\n</paths>");output=output.concat("\n<triggers>");for(var i=0;i<this.triggers.length;i++){otuput=this.triggers[i].serialize(output);}
output=output.concat("\n</triggers>");for(var sprite in this.sprites){output=this.sprites[sprite].serialize(output);}
output=output.concat("\n</room>");return output;}
Sburb.parseRoom=function(roomNode,assetFolder,spriteFolder){var attributes=roomNode.attributes;var newRoom=new Sburb.Room(attributes.getNamedItem("name").value,parseInt(attributes.getNamedItem("width").value),parseInt(attributes.getNamedItem("height").value));var walkableMap=attributes.getNamedItem("walkableMap");if(walkableMap){newRoom.walkableMap=assetFolder[walkableMap.value];}
Sburb.serialLoadRoomSprites(newRoom,roomNode.getElementsByTagName("sprite"),spriteFolder);Sburb.serialLoadRoomSprites(newRoom,roomNode.getElementsByTagName("character"),spriteFolder);Sburb.serialLoadRoomSprites(newRoom,roomNode.getElementsByTagName("fighter"),spriteFolder);var paths=roomNode.getElementsByTagName("paths");if(paths.length>0){Sburb.serialLoadRoomPaths(newRoom,paths,assetFolder);}
var triggers=roomNode.getElementsByTagName("triggers")
if(triggers.length>0){Sburb.serialLoadRoomTriggers(newRoom,triggers,spriteFolder);}
return newRoom;}
return Sburb;})(Sburb||{});(function(){try{var a=new Uint8Array(1);return;}catch(e){}
function subarray(start,end){return this.slice(start,end);}
function set_(array,offset){if(arguments.length<2)offset=0;for(var i=0,n=array.length;i<n;++i,++offset)
this[offset]=array[i]&0xFF;}
function TypedArray(arg1){var result;if(typeof arg1==="number"){result=new Array(arg1);for(var i=0;i<arg1;++i)
result[i]=0;}else
result=arg1.slice(0);result.subarray=subarray;result.buffer=result;result.byteLength=result.length;result.set=set_;if(typeof arg1==="object"&&arg1.buffer)
result.buffer=arg1.buffer;return result;}
window.Uint8Array=TypedArray;window.Uint32Array=TypedArray;window.Int32Array=TypedArray;})();var Sburb=(function(Sburb){Sburb.FontEngine=function(text){this.font="bold 14px SburbFont";this.color="#000000";this.text=typeof text=="string"?text:"";this.x=0;this.y=0;this.width=999999;this.height=999999;this.start=0;this.end=999999;this.lines=[];this.lineHeight=17;this.charWidth=8;this.align="left";this.formatted=true;this.formatQueue=[];}
Sburb.FontEngine.prototype.prefixColours={aa:"#a10000",aradia:"#a10000",ac:"#416600",nepeta:"#416600",ag:"#005682",vriska:"#005682",at:"#a15000",tavros:"#a15000",ca:"#6a006a",eridan:"#6a006a",cc:"#77003c",feferi:"#77003c",cg:"#626262",karkat:"#626262",ct:"#000056",equius:"#000056",ga:"#008141",kanaya:"#008141",gc:"#008282",terezi:"#008282",ta:"#a1a100",sollux:"#a1a100",tc:"#2b0057",gamzee:"#2b0057",dave:"#e00707",meenah:"#77003c",rose:"#b536da",aranea:"#005682",kankri:"#ff0000",porrim:"#008141",latula:"#008282"};Sburb.FontEngine.prototype.setStyle=function(font,color,lineHeight,charWidth){this.font=typeof font=="string"?font:this.font;this.color=typeof color=="string"?color:this.color;this.lineHeight=typeof lineHeight=="number"?lineHeight:this.lineHeight;this.charWidth=typeof charWidth=="number"?charWidth:this.charWidth;this.parseText();}
Sburb.FontEngine.prototype.setFormatted=function(formatted){this.formatted=formatted;}
Sburb.FontEngine.prototype.setText=function(text){this.text=text;this.parseEverything();}
Sburb.FontEngine.prototype.setAlign=function(align){this.align=align;}
Sburb.FontEngine.prototype.showSubText=function(start,end){this.start=typeof start=="number"?start:this.start;this.end=typeof end=="number"?end:this.end;}
Sburb.FontEngine.prototype.setDimensions=function(x,y,width,height){this.x=typeof x=="number"?x:this.x;this.y=typeof y=="number"?y:this.y;this.width=typeof width=="number"?width:this.width;this.height=typeof height=="number"?height:this.height;this.parseText();}
Sburb.FontEngine.prototype.parseEverything=function(){this.parseFormatting();this.parseText();}
Sburb.FontEngine.prototype.parseText=function(){this.lines=[];var i=0;var lastSpace=0;var lineStart=0;for(i=0;i<this.text.length;i++){if(this.text.charAt(i)==" "){lastSpace=i;}else if(this.text.charAt(i)=="\n"){this.lines.push(this.text.substring(lineStart,i));lineStart=i+1;lastSpace=lineStart;continue;}
if(i-lineStart>this.width/this.charWidth){if(lineStart==lastSpace){this.lines.push(this.text.substring(lineStart,i));lineStart=i;lastSpace=i;}else{this.lines.push(this.text.substring(lineStart,lastSpace));lineStart=lastSpace+1;lastSpace=lineStart;}}}
this.lines.push(this.text.substring(lineStart,i));}
Sburb.FontEngine.prototype.parseFormatting=function(){this.formatQueue=[];if(this.formatted){this.escaped={};this.parsePrefixes();this.parseEscapes();this.parseUnderlines();this.parseColors();}}
Sburb.FontEngine.prototype.parseEscapes=function(){var index;var escapeLocation=0;do{index=this.text.indexOf("/",escapeLocation);if(index<this.text.length-1&&index>=0){var character=this.text.charAt(index+1);if(character=="/"){escapeLocation=index+1;}else{var characterListing=this.escaped[character];if(!characterListing){characterListing=this.escaped[character]={};}
var count=0;for(var i=0;i<index;i++){if(this.text.charAt(i)==character){count++;}}
characterListing[count+1]=true;}}
this.text=this.text.substring(0,index)+this.text.substring(index+1,this.text.length);}while(index>=0);}
Sburb.FontEngine.prototype.parsePrefixes=function(){var prefix=this.text.split(" ",1)[0];var actor;if(prefix!="!"){if(prefix.indexOf("_")>=0){actor=prefix.substring(0,this.text.indexOf("_"));}else{actor=prefix.substring(0,2);}
this.parsePrefix(actor);}
this.text=this.text.substring(prefix.length,this.text.length).trim();}
Sburb.FontEngine.prototype.parseUnderlines=function(){var escapePoint=0;var index=0;var count=0;while(true){while(true){count++;index=this.text.indexOf("_",escapePoint);if(this.escaped["_"]&&this.escaped["_"][count]){escapePoint=index+1;}else{break;}}
if(index==-1){break;}
var closing=false;for(var i=this.formatQueue.length-1;i>=0;i--){if(this.formatQueue[i].type=="underline"&&this.formatQueue[i].maxIndex==999999){this.formatQueue[i].maxIndex=index;closing=true;break;}}
if(!closing){this.addToFormatQueue(new Sburb.FormatRange(index,999999,"underline"));}
this.text=this.text.substring(0,index)+this.text.substring(index+1,this.text.length);this.realignFormatQueue(index,1);}}
Sburb.FontEngine.prototype.parseColors=function(){var escapePoint=0;var index=0;var count=0;while(true){while(true){count++;index=this.text.indexOf("#",escapePoint);if(this.escaped["#"]&&this.escaped["#"][count]){escapePoint=index+1;}else{break;}}
if(index==-1){break;}
if(this.text.indexOf("##",escapePoint)==index){for(var i=this.formatQueue.length-1;i>=0;i--){if(this.formatQueue[i].type=="colour"&&this.formatQueue[i].maxIndex==999999){this.formatQueue[i].maxIndex=index;break;}}
count++;this.text=this.text.substring(0,index)+this.text.substring(index+2,this.text.length);this.realignFormatQueue(index,2);}else{this.addToFormatQueue(new Sburb.FormatRange(index,999999,"colour","#"+this.text.substring(index+1,index+7)));this.text=this.text.substring(0,index)+this.text.substring(index+7,this.text.length);this.realignFormatQueue(index,7);}}}
Sburb.FontEngine.prototype.addToFormatQueue=function(format){var newPlace=this.formatQueue.length;for(var i=0;i<this.formatQueue.length;i++){if(this.formatQueue[i].minIndex>format.minIndex){newPlace=i;break;}}
this.formatQueue.splice(newPlace,0,format);}
Sburb.FontEngine.prototype.realignFormatQueue=function(startPos,shiftSize){for(var i=0;i<this.formatQueue.length;i++){var curFormat=this.formatQueue[i];if(curFormat.maxIndex>startPos&&curFormat.maxIndex!=999999){curFormat.maxIndex-=shiftSize;}
if(curFormat.minIndex>startPos){curFormat.minIndex-=shiftSize;}}}
Sburb.FontEngine.prototype.parsePrefix=function(prefix){this.formatQueue.push(new Sburb.FormatRange(0,this.text.length,"colour",this.prefixColouration(prefix)));}
Sburb.FontEngine.prototype.prefixColouration=function(prefix){if(this.prefixColours[prefix.toLowerCase()]){return this.prefixColours[prefix.toLowerCase()];}else{return"#000000";}}
Sburb.FontEngine.prototype.nextBatch=function(){this.realignFormatQueue(-1,this.batchLength());this.lines.splice(0,Math.min(this.lines.length,Math.floor(this.height/this.lineHeight)));return this.lines.length;}
Sburb.FontEngine.prototype.onLastBatch=function(){return Math.floor(this.height/this.lineHeight)>=this.lines.length;}
Sburb.FontEngine.prototype.draw=function(){var i;var lenCount;var linePos=0;var strStart,strEnd;var currentFormat=0;var currentFormats=[];var nextStop;var curLine;i=0;lenCount=0;while(i<Math.floor(this.height/this.lineHeight)&&i<this.lines.length){Sburb.stage.save();Sburb.stage.textBaseline="top";Sburb.stage.textAlign=this.align;curLine=this.lines[i];var curFont=this.font;var curColor=this.color;var underlining=false;nextStop=curLine.length;if(currentFormat<this.formatQueue.length&&this.formatQueue[currentFormat].minIndex<=lenCount+linePos){currentFormats.push(this.formatQueue[currentFormat]);currentFormat++;}
for(var k=currentFormats.length-1;k>=0;k--){if(currentFormats[k].maxIndex<=lenCount+linePos){currentFormats.splice(k,1);}}
for(var k=0;k<currentFormats.length;k++){if(currentFormats[k].type=="colour"){curColor=currentFormats[k].extra;}else if(currentFormats[k].type=="underline"){underlining=true;}else if(currentFormats[k].type=="italic"){curFont="italic "+this.font;}}
if(currentFormat<this.formatQueue.length&&this.formatQueue[currentFormat].minIndex<lenCount+curLine.length){if(this.formatQueue[currentFormat].minIndex<this.end){nextStop=Math.min(nextStop,this.formatQueue[currentFormat].minIndex-lenCount);}}
for(var k=0;k<currentFormats.length;k++){if(currentFormats[k].maxIndex<this.end){nextStop=Math.min(nextStop,currentFormats[k].maxIndex-lenCount);}}
if(nextStop!=curLine.length){strStart=linePos;strEnd=nextStop;linePos+=strEnd-strStart;}else{if(lenCount+curLine.length<=this.end){strEnd=curLine.length;}else{strEnd=this.end-lenCount;}
if(lenCount+linePos>=this.start){strStart=linePos;}else if(lenCount+curLine.length>=this.start){strStart=this.start-(lenCount)+linePos;}else{strStart=linePos;strEnd=linePos;}
linePos=-1;}
var numChars=strEnd-strStart;if(numChars>0){var startX=this.x+strStart*this.charWidth;var startY=this.y+i*this.lineHeight;Sburb.stage.font=curFont;Sburb.stage.strokeStyle=Sburb.stage.fillStyle=curColor;Sburb.stage.fillText(curLine.substring(strStart,strEnd),startX,startY,numChars*this.charWidth);if(underlining&&strStart<strEnd){if(Sburb.stage.lineWidth!=0.6){Sburb.stage.lineWidth=0.6;}
if(Sburb.stage.lineCap!="square"){Sburb.stage.lineCap="square";}
Sburb.stage.beginPath();Sburb.stage.moveTo(startX,startY+this.lineHeight-3);Sburb.stage.lineTo(startX+numChars*this.charWidth,startY+this.lineHeight-3);Sburb.stage.closePath();Sburb.stage.stroke();}}
if(linePos==-1){lenCount+=this.lines[i].length;linePos=0;i++;}
Sburb.stage.restore();}}
Sburb.FontEngine.prototype.isShowingAll=function(){return this.end>=this.batchLength();}
Sburb.FontEngine.prototype.batchLength=function(){var len=0;var i;for(i=0;i<Math.floor(this.height/this.lineHeight)&&i<this.lines.length;i++){len+=this.lines[i].length;}
return len;}
Sburb.FontEngine.prototype.showAll=function(){this.end=this.batchLength();}
Sburb.FormatRange=function(minIndex,maxIndex,type,extra){this.minIndex=minIndex;this.maxIndex=maxIndex;this.type=type;this.extra=typeof extra=="string"?extra:"";}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.Action=function(command,info,name,sprite,followUp,noWait,noDelay,times,soft,silent){this.sprite=sprite?sprite:null;this.name=name?name:null;this.command=command
this.info=info;this.followUp=followUp?followUp:null;this.noWait=noWait?noWait:false;this.noDelay=noDelay?noDelay:false;this.soft=soft?soft:false;this.silent=silent?silent:false;this.times=times?times:1;}
Sburb.Action.prototype.clone=function(){return new Sburb.Action(this.command,this.info,this.name,this.sprite,this.followUp,this.noWait,this.noDelay,this.times,this.soft,this.silent);}
Sburb.Action.prototype.serialize=function(output){output=output.concat("\n<action "+"command='"+this.command+
(this.sprite?"sprite='"+this.sprite:"")+
(this.name?"' name='"+this.name:"")+
(this.noWait?"' noWait='"+this.noWait:"")+
(this.noDelay?"' noDelay='"+this.noDelay:"")+
(this.soft?"' soft='"+this.soft:"")+
(this.silent?"' silent='"+this.silent:"")+
(this.times!=1?"' times='"+this.times:"")+"'>");output=output.concat(this.info.trim());if(this.followUp){output=this.followUp.serialize(output);}
output=output.concat("</action>");return output;}
Sburb.parseAction=function(node){var targSprite=null;var firstAction=null;var oldAction=null;do{var attributes=node.attributes;if(attributes.getNamedItem("sprite")&&attributes.getNamedItem("sprite").value!="null"){targSprite=attributes.getNamedItem("sprite").value;}
var newAction=new Sburb.Action(attributes.getNamedItem("command").value,node.firstChild?getNodeText(node).trim():"",attributes.getNamedItem("name")?attributes.getNamedItem("name").value:null,targSprite,null,attributes.getNamedItem("noWait")?attributes.getNamedItem("noWait").value=="true":false,attributes.getNamedItem("noDelay")?attributes.getNamedItem("noDelay").value=="true":false,attributes.getNamedItem("times")?parseInt(attributes.getNamedItem("times").value):1,attributes.getNamedItem("soft")?attributes.getNamedItem("soft").value=="true":false,attributes.getNamedItem("silent")?attributes.getNamedItem("silent").value=="true":false);if(oldAction){oldAction.followUp=newAction;}
if(!firstAction){firstAction=newAction;}
oldAction=newAction;var oldNode=node;node=null;for(var i=0;i<oldNode.childNodes.length;i++){var child=oldNode.childNodes[i];if(child.nodeName=="action"){node=child;break;}}
if(!node){break;}}while(node);return firstAction;}
function getNodeText(xmlNode){if(!xmlNode)return'';for(var i=0;i<xmlNode.childNodes.length;i++){var child=xmlNode.childNodes[i];if(child.tagName=="args"){for(var k=0;k<child.childNodes.length;k++){if(child.childNodes[k].firstChild){serializer=new XMLSerializer();var output="";for(var j=0;j<child.childNodes.length;j++){output+=serializer.serializeToString(child.childNodes[j]);}
return output;}}
if(typeof(child.textContent)!="undefined"){return child.textContent;}
return child.firstChild.nodeValue;}}
if(typeof(xmlNode.textContent)!="undefined"){return xmlNode.textContent;}
return xmlNode.firstChild.nodeValue;}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.Trigger=function(info,action,followUp,restart,detonate){this.info=info;this.followUp=followUp?followUp:null;this.action=action?action:null;this.restart=restart?restart:false;this.detonate=detonate?detonate:false;this.type=null;this.reset();}
Sburb.Trigger.prototype.reset=function(){var params=this.info.split(",");this.type=params[0];if(this.type=="spriteProperty"){if(params[1]=="char"){this.entity=params[1];}else{this.entity=Sburb.sprites[params[1]];}
var token;var query=params[2];if(query.indexOf(">")>-1){token=">";this.trigger=function(entity,property,target){return entity[property]>target;};}else if(query.indexOf("<")>-1){token="<";this.trigger=function(entity,property,target){return entity[property]<target;};}else if(query.indexOf("!=")>-1){token="!=";this.trigger=function(entity,property,target){return entity[property]!=target;};}else if(query.indexOf("=")>-1){token="=";this.trigger=function(entity,property,target){return entity[property]==target;};}
var queryParts=query.split(token);this.property=queryParts[0].trim();this.target=queryParts[1].trim();this.checkCompletion=function(){var entity=this.entity;if(this.entity=="char"){entity=Sburb.char;}
return this.trigger(entity,this.property,this.target);}}else if(this.type=="inBox"){if(params[1]=="char"){this.entity=params[1];}else{this.entity=Sburb.sprites[params[1]];}
this.x=parseInt(params[2]);this.y=parseInt(params[3]);this.width=parseInt(params[4]);this.height=parseInt(params[5]);this.checkCompletion=function(){var entity=this.entity;if(this.entity=="char"){entity=Sburb.char;}
return entity.x>=this.x&&entity.y>=this.y&&entity.x<=this.x+this.width&&entity.y<=this.y+this.height;}}else if(this.type=="time"){this.time=parseInt(params[1]);this.checkCompletion=function(){this.time--;return this.time<=0;};}else if(this.type=="played"){this.entity=Sburb.sprites[params[1]];this.checkCompletion=function(){var entity=this.entity;if(this.entity=="char"){entity=Sburb.char;}
return entity.animation.hasPlayed();};}else if(this.type=="movie"){this.movie=window.document.getElementById("movie"+params[1]);this.threshold=parseInt(params[2]);this.checkCompletion=function(){if(this.movie&&(!this.movie.TotalFrames||(this.movie.TotalFrames()>0&&this.movie.TotalFrames()-1-this.movie.CurrentFrame()<=this.threshold))){Sburb.commands.removeMovie(params[1]);return true;}
return false;}}}
Sburb.Trigger.prototype.tryToTrigger=function(){if(this.checkCompletion()){if(this.action){Sburb.performAction(this.action);}
if(this.followUp){if(this.followUp.tryToTrigger()){this.followUp=null;}}
if(this.restart){reset();}
return this.detonate;}}
Sburb.Trigger.prototype.serialize=function(output){output=output.concat("\n<trigger"+
(this.restart?" restart='true'":"")+
(this.detonate?" detonate='true'":"")+">");output=output.concat(this.info);if(this.action){output=this.action.serialize(output);}
if(this.followUp){output=this.followUp.serialize(output);}
output=output.concat("\n</trigger>");return output;}
Sburb.parseTrigger=function(triggerNode){var firstTrigger=null;var oldTrigger=null;do{var attributes=triggerNode.attributes;var info=triggerNode.firstChild.nodeValue.trim();var actions=triggerNode.getElementsByTagName("action");var action=null;var restart=false;var detonate=false;if(actions.length>0&&actions[0].parentNode==triggerNode){action=Sburb.parseAction(actions[0]);}
restart=attributes.getNamedItem("restart")?attributes.getNamedItem("restart").value=="true":restart;detonate=attributes.getNamedItem("detonate")?attributes.getNamedItem("detonate").value=="true":detonate;var trigger=new Sburb.Trigger(info,action,null,restart,detonate);if(!firstTrigger){firstTrigger=trigger;}
if(oldTrigger){oldTrigger.followUp=trigger;}
oldTrigger=trigger;var triggerNodes=triggerNode.getElementsByTagName("trigger");if(triggerNodes){triggerNode=triggerNodes[0];}else{break;}}while(triggerNode)
return firstTrigger;}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){function parseParams(info){var params=info.split(",");params.map(cleanParam);return params;}
function cleanParam(param){return param.trim();}
var commands={};commands.talk=function(info){Sburb.dialoger.startDialog(info);}
commands.randomTalk=function(info){Sburb.dialoger.startDialog(info);var randomNum=Math.floor(Math.random()*(Sburb.dialoger.queue.length+1));if(randomNum){Sburb.dialoger.queue=[Sburb.dialoger.queue[randomNum-1]];Sburb.dialoger.nextDialog();}else{Sburb.dialoger.queue=[];}}
commands.changeRoom=function(info){var params=parseParams(info);Sburb.changeRoom(Sburb.rooms[params[0]],parseInt(params[1]),parseInt(params[2]));}
commands.changeFocus=function(info){var params=parseParams(info);var sprite=parseCharacterString(params[0]);Sburb.destFocus=sprite;}
commands.teleport=function(info){commands.changeRoom(info);Sburb.playEffect(Sburb.effects["teleportEffect"],Sburb.char.x,Sburb.char.y);var params=parseParams(info);Sburb.curAction.followUp=new Sburb.Action("playEffect","teleportEffect,"+params[1]+","+params[2],null,null,Sburb.curAction.followUp);}
commands.changeChar=function(info){Sburb.char.becomeNPC();Sburb.char.walk();Sburb.focus=Sburb.char=Sburb.sprites[info];Sburb.char.becomePlayer();Sburb.setCurRoomOf(Sburb.char);}
commands.playSong=function(info){var params=parseParams(info);Sburb.changeBGM(new Sburb.BGM(Sburb.assets[params[0]],parseFloat(params[1])));}
commands.becomeNPC=function(info){Sburb.char.becomeNPC();}
commands.becomePlayer=function(info){Sburb.char.becomePlayer();}
commands.playSound=function(info){Sburb.playSound(new Sburb.Sound(Sburb.assets[info.trim()]));}
commands.playEffect=function(info){var params=parseParams(info);Sburb.playEffect(Sburb.effects[params[0]],parseInt(params[1]),parseInt(params[2]));}
commands.playAnimation=function(info){var params=parseParams(info);var sprite=parseCharacterString(params[0]);sprite.startAnimation(params[1]);}
commands.addActions=function(info){var params=parseParams(info);var firstComma=info.indexOf(",");var sprite=parseCharacterString(params[0]);var actionString=info.substring(firstComma+1,info.length);var actions=parseActionString(actionString);for(var i=0;i<actions.length;i++){var action=actions[i];sprite.addAction(action);}}
commands.removeAction=function(info){var params=parseParams(info);var sprite=parseCharacterString(params[0]);sprite.removeAction(params[1]);}
commands.presentActions=function(info){var actions=parseActionString(info);Sburb.chooser.choices=actions;Sburb.chooser.beginChoosing(Sburb.cam.x+20,Sburb.cam.y+50);}
commands.openChest=function(info){var params=info.split(",",2);var chest=Sburb.sprites[params[0].trim()];var item=Sburb.sprites[params[1].trim()];if(chest.animations["open"]){chest.startAnimation("open");if(Sburb.assets["openSound"]){commands.playSound("openSound");}}
chest.removeAction(Sburb.curAction.name);var offset=params[0].length+params[1].length+2;var speech=info.substring(offset,info.length).trim();speech=speech.charAt(0)=="@"?speech:"@! "+speech;var lastAction;var newAction=lastAction=new Sburb.Action("waitFor","played,"+chest.name,null,null);lastAction=lastAction.followUp=new Sburb.Action("waitFor","time,13");lastAction=lastAction.followUp=new Sburb.Action("addSprite",item.name+","+Sburb.curRoom.name,null,null,null,true);lastAction=lastAction.followUp=new Sburb.Action("moveSprite",item.name+","+chest.x+","+(chest.y-60),null,null,null,true,true);lastAction=lastAction.followUp=new Sburb.Action("deltaSprite",item.name+",0,-3",null,null,null,true,null,10);if(Sburb.assets["itemGetSound"]){lastAction=lastAction.followUp=new Sburb.Action("playSound","itemGetSound",null,null,null,true,null);}
lastAction=lastAction.followUp=new Sburb.Action("waitFor","time,30");lastAction=lastAction.followUp=new Sburb.Action("talk",speech);lastAction=lastAction.followUp=new Sburb.Action("removeSprite",item.name+","+Sburb.curRoom.name);lastAction.followUp=Sburb.curAction.followUp;Sburb.performAction(newAction);}
commands.deltaSprite=function(info){var params=parseParams(info);var sprite=null;if(params[0]=="char"){sprite=Sburb.char;}else{sprite=Sburb.sprites[params[0]];}
var dx=parseInt(params[1]);var dy=parseInt(params[2]);sprite.x+=dx;sprite.y+=dy;}
commands.moveSprite=function(info){var params=parseParams(info);var sprite=parseCharacterString(params[0]);var newX=parseInt(params[1]);var newY=parseInt(params[2]);sprite.x=newX;sprite.y=newY;}
commands.playMovie=function(info){var params=parseParams(info);Sburb.playMovie(Sburb.assets[params[0]]);if(params.length>0){var interval=setInterval(function(){var movie=window.document.getElementById("movie"+params[0]);if(movie&&(!movie.CurrentFrame||movie.CurrentFrame()>=4)){clearInterval(interval);commands.playSong(info.substring(info.indexOf(",")+1,info.length));}},10);}}
commands.removeMovie=function(info){Sburb.playingMovie=false;Sburb.draw();document.getElementById(info).style.display="none";}
commands.waitFor=function(info){Sburb.waitFor=new Sburb.Trigger(info);}
commands.addSprite=function(info){var params=parseParams(info);var sprite=Sburb.sprites[params[0]];var room=Sburb.rooms[params[1]];room.addSprite(sprite);}
commands.removeSprite=function(info){var params=parseParams(info);var sprite=Sburb.sprites[params[0]];var room=Sburb.rooms[params[1]];room.removeSprite(sprite);}
commands.addWalkable=function(info){var params=parseParams(info);var path=Sburb.assets[params[0]];var room=Sburb.rooms[params[1]];room.addWalkable(path);}
commands.addUnwalkable=function(info){var params=parseParams(info);var path=Sburb.assets[params[0]];var room=Sburb.rooms[params[1]];room.addUnwalkable(path);}
commands.addMotionPath=function(info){var params=parseParams(info);var path=Sburb.assets[params[0]];var room=Sburb.rooms[params[7]];room.addMotionPath(path,parseFloat(params[1]),parseFloat(params[2]),parseFloat(params[3]),parseFloat(params[4]),parseFloat(params[5]),parseFloat(params[6]));}
commands.removeWalkable=function(info){var params=parseParams(info);var path=Sburb.assets[params[0]];var room=Sburb.rooms[params[1]];room.removeWalkable(path);}
commands.removeUnwalkable=function(info){var params=parseParams(info);var path=Sburb.assets[params[0]];var room=Sburb.rooms[params[1]];room.removeUnwalkable(path);}
commands.toggleVolume=function(){if(Sburb.globalVolume>=1){Sburb.globalVolume=0;}else if(Sburb.globalVolume>=0.6){Sburb.globalVolume=1;}else if(Sburb.globalVolume>=0.3){Sburb.globalVolume=0.66;}else{Sburb.globalVolume=0.33;}
if(Sburb.bgm){Sburb.bgm.fixVolume();}}
commands.changeMode=function(info){Sburb.engineMode=info.trim();}
commands.loadStateFile=function(info){var params=parseParams(info);var path=params[0];var keepOld=params[1]=="true";Sburb.loadSerialFromXML(path,keepOld);}
commands.fadeOut=function(info){Sburb.fading=true;}
commands.changeRoomRemote=function(info){var params=parseParams(info);var lastAction;var newAction=lastAction=new Sburb.Action("fadeOut");lastAction=lastAction.followUp=new Sburb.Action("loadStateFile",params[0]+","+true);lastAction=lastAction.followUp=new Sburb.Action("changeRoom",params[1]+","+params[2]+","+params[3]);lastAction.followUp=Sburb.curAction.followUp;Sburb.performAction(newAction);}
commands.teleportRemote=function(info){commands.changeRoomRemote(info);Sburb.playEffect(Sburb.effects["teleportEffect"],Sburb.char.x,Sburb.char.y);var params=parseParams(info);Sburb.curAction.followUp.followUp.followUp=new Sburb.Action("playEffect","teleportEffect,"+params[2]+","+params[3],null,null,Sburb.curAction.followUp.followUp.followUp);}
commands.setButtonState=function(info){var params=parseParams(info);Sburb.buttons[params[0]].setState(params[1]);}
commands.skipDialog=function(info){Sburb.dialoger.skipAll();}
commands.follow=function(info){var params=parseParams(info);var follower=parseCharacterString(params[0]);var leader=parseCharacterString(params[1]);follower.follow(leader);}
commands.unfollow=function(info){var params=parseParams(info);var follower=parseCharacterString(params[0]);follower.unfollow();}
commands.addOverlay=function(info){var params=parseParams(info);var sprite=Sburb.sprites[params[0]];sprite.x=Sburb.cam.x;sprite.y=Sburb.cam.y;Sburb.curRoom.addSprite(sprite);}
commands.removeOverlay=function(info){var params=parseParams(info);var sprite=Sburb.sprites[params[0]];Sburb.curRoom.removeSprite(sprite);}
commands.cancel=function(){}
function parseCharacterString(string){if(string=="char"){return Sburb.char;}else{return Sburb.sprites[string];}}
function parseActionString(string){var actions=[];string="<sburb>"+string+"</sburb>";var parser=new DOMParser();var input=parser.parseFromString(string,"text/xml").documentElement;for(var i=0;i<input.childNodes.length;i++){var tmp=input.childNodes[i];if(tmp.tagName=="action"){actions.push(Sburb.parseAction(tmp));}}
return actions;}
Sburb.commands=commands;return Sburb;})(Sburb||{});var Sburb=(function(Sburb){var templateClasses={};var loadedFiles={};var loadingDepth=0;var loadQueue=[];var updateLoop=null;Sburb.serialize=function(assets,effects,rooms,sprites,hud,dialoger,curRoom,char){var out=document.getElementById("serialText");var output="<sburb"+"' char='"+char.name+
(Sburb.bgm?"' bgm='"+Sburb.bgm.asset.name+(Sburb.bgm.startLoop?","+Sburb.bgm.startLoop:""):"")+
(Sburb.Stage.scaleX!=1?"' scale='"+Sburb.Stage.scaleX:"")+
(Sburb.assetManager.resourcePath?("' resourcePath='"+Sburb.assetManager.resourcePath):"")+
(Sburb.assetManager.levelPath?("' levelPath='"+Sburb.assetManager.levelPath):"")+"'>\n";output=serializeAssets(output,assets,effects);output=serializeTemplates(output,templateClasses);output=serializeHud(output,hud,dialoger);output=serializeLooseObjects(output,rooms,sprites);output=output.concat("\n<rooms>\n");for(var room in rooms){output=rooms[room].serialize(output);}
output=output.concat("\n</rooms>\n");output=output.concat("\n</sburb>");if(out){out.value=output;}
return output;}
function serializeLooseObjects(output,rooms,sprites){for(var sprite in sprites){var theSprite=sprites[sprite];var contained=false;for(var room in rooms){if(rooms[room].contains(theSprite)){contained=true;break;}}
if(!contained){output=theSprite.serialize(output);}}
for(var button in Sburb.buttons){var theButton=Sburb.buttons[button];if(!Sburb.hud[theButton.name]){output=theButton.serialize(output);}}
return output;}
function serializeAssets(output,assets,effects){output=output.concat("\n<assets>");for(var asset in assets){var curAsset=assets[asset];output=output.concat("\n<asset name='"+curAsset.name+"' type='"+curAsset.type+"'>");if(curAsset.type=="graphic"){output=output.concat(curAsset.src);}else if(curAsset.type=="audio"){var sources=curAsset.innerHTML.split('"');var vals="";for(var i=1;i<sources.length;i+=2){vals+=sources[i];if(i+2<sources.length){vals+=";";}}
output+=vals;}else if(curAsset.type=="path"){for(var i=0;i<curAsset.points.length;i++){output=output.concat(curAsset.points[i].x+","+curAsset.points[i].y);if(i!=curAsset.points.length-1){output=output.concat(";");}}}else if(curAsset.type=="movie"){output=output.concat(curAsset.src);}else if(curAsset.type=="font"){output+=curAsset.originalVals;}
output=output.concat("</asset>");}
output=output.concat("\n</assets>\n");output=output.concat("\n<effects>");for(var effect in effects){var curEffect=effects[effect];output=curEffect.serialize(output);}
output=output.concat("\n</effects>\n");return output;}
function serializeTemplates(output,templates){output=output.concat("\n<classes>");var serialized;try{serializer=new XMLSerializer();for(var template in templates){output=output.concat(serializer.serializeToString(templates[template]));}}catch(e){for(var template in templates){output=output.concat(templates[template].xml);}}
output=output.concat("\n</classes>\n");return output;}
function serializeHud(output,hud,dialoger){output=output.concat("\n<hud>");for(var content in hud){output=hud[content].serialize(output);}
output=Sburb.dialoger.serialize(output);var animations=dialoger.dialogSpriteLeft.animations;output=output.concat("\n<dialogsprites>");for(var animation in animations){output=animations[animation].serialize(output);}
output=output.concat("\n</dialogsprites>");output=output.concat("\n</hud>\n");return output;}
function purgeAssets(){Sburb.assetManager.purge();Sburb.assets=Sburb.assetManager.assets;}
function purgeState(){if(Sburb.rooms){delete Sburb.rooms;}
if(Sburb.sprites){delete Sburb.sprites;}
Sburb.rooms={};if(Sburb.bgm){Sburb.bgm.stop();Sburb.bgm=null;}
document.getElementById("SBURBmovieBin").innerHTML="";document.getElementById("SBURBfontBin").innerHTML="";Sburb.globalVolume=1;Sburb.hud={};Sburb.sprites={};Sburb.buttons={};Sburb.effects={};Sburb.curAction=null;Sburb.pressed=[];Sburb.chooser=new Sburb.Chooser();Sburb.dialoger=null;Sburb.curRoom=null;Sburb.char=null;Sburb.assetManager.resourcePath="";Sburb.assetManager.levelPath="";loadedFiles={};}
Sburb.loadSerialFromXML=function(file,keepOld){Sburb.haltUpdateProcess();file=Sburb.assetManager.levelPath+file;if(keepOld&&loadedFiles[file]){Sburb.startUpdateProcess();return;}else{loadedFiles[file]=true;}
if(window.ActiveXObject){var request=new ActiveXObject("MSXML2.XMLHTTP");}else{var request=new XMLHttpRequest();}
request.open('GET',file,false);try{request.send(null);}catch(err){console.log("If you are running Google Chrome, you need to run it with the -allow-file-access-from-files switch to load this.");fi=document.getElementById("levelFile");return;}
if(request.status===200||request.status==0){loadSerial(request.responseText,keepOld);}}
function loadSerial(serialText,keepOld){Sburb.haltUpdateProcess();var inText=serialText;var parser=new DOMParser();var input=parser.parseFromString(inText,"text/xml").documentElement;if(!keepOld){purgeAssets();purgeState();}
var rootAttr=input.attributes;var levelPath=rootAttr.getNamedItem("levelPath");if(levelPath){Sburb.assetManager.levelPath=levelPath.value+"/";}
var resourcePath=rootAttr.getNamedItem("resourcePath");if(resourcePath){Sburb.assetManager.resourcePath=resourcePath.value;}
loadingDepth++;loadDependencies(input);loadingDepth--;loadSerialAssets(input);loadQueue.push(input);loadSerialState(input);}
function loadDependencies(input){var dependenciesNode=input.getElementsByTagName("dependencies")[0];if(dependenciesNode){var dependencies=dependenciesNode.getElementsByTagName("dependency");for(var i=0;i<dependencies.length;i++){var dependency=dependencies[i].firstChild.nodeValue.trim();Sburb.loadSerialFromXML(dependency,true);}}}
function loadSerialAssets(input){var rootAttr=input.attributes;var description=rootAttr.getNamedItem("description");if(description){Sburb.assetManager.description=description.value;}else{Sburb.assetManager.description="assets"}
var newAssets=input.getElementsByTagName("asset");for(var i=0;i<newAssets.length;i++){var curAsset=newAssets[i];var attributes=curAsset.attributes;var name=attributes.getNamedItem("name").value;if(!Sburb.assetManager.isLoaded(name)){loadSerialAsset(curAsset);}}}
function loadSerialAsset(curAsset){var newAsset=parseSerialAsset(curAsset);Sburb.assetManager.loadAsset(newAsset);}
function parseSerialAsset(curAsset){var attributes=curAsset.attributes;var name=attributes.getNamedItem("name").value;var type=attributes.getNamedItem("type").value;var value=curAsset.firstChild.nodeValue.trim();var newAsset;if(type=="graphic"){newAsset=Sburb.createGraphicAsset(name,value);}else if(type=="audio"){var sources=value.split(";");newAsset=Sburb.createAudioAsset(name,sources);}else if(type=="path"){var pts=value.split(";");var path=new Sburb.Path();for(var j=0;j<pts.length;j++){var point=pts[j].split(",");path.push({x:parseInt(point[0]),y:parseInt(point[1])});}
newAsset=Sburb.createPathAsset(name,path);}else if(type=="movie"){newAsset=Sburb.createMovieAsset(name,value);}else if(type=="font"){newAsset=Sburb.createFontAsset(name,value);}
return newAsset;}
function loadSerialState(){if(updateLoop){clearTimeout(updateLoop);updateLoop=null;}
if(!Sburb.assetManager.finishedLoading()){updateLoop=setTimeout(function(){loadSerialState();},500);return;}
while(loadQueue.length>0){var input=loadQueue[0];loadQueue.splice(0,1);parseTemplateClasses(input);applyTemplateClasses(input);parseButtons(input);parseSprites(input);parseCharacters(input);parseFighters(input);parseRooms(input);parseHud(input);parseEffects(input);parseState(input);}
if(loadQueue.length==0&&loadingDepth==0){Sburb.startUpdateProcess();}}
function parseDialogSprites(input){var hud=input.getElementsByTagName("hud");if(hud.length>0){var dialogSprites=hud[0].getElementsByTagName("dialogsprites");if(dialogSprites.length>0){serialLoadDialogSprites(dialogSprites[0],Sburb.assets);}}}
function parseEffects(input){var effects=input.getElementsByTagName("effects");if(effects.length>0){serialLoadEffects(effects[0],Sburb.assets,Sburb.effects);}}
function parseTemplateClasses(input){var classes=input.getElementsByTagName("classes");if(classes.length>0){var templates=classes[0].childNodes;for(var i=0;i<templates.length;i++){var templateNode=templates[i];if(templateNode.nodeName!="#text"&&templateNode.nodeName!="#comment"){applyTemplateClasses(templateNode);var tempAttributes=templateNode.attributes;templateClasses[tempAttributes.getNamedItem("class").value]=templateNode.cloneNode(true);}}
input.removeChild(input.getElementsByTagName("classes")[0]);}}
function applyTemplateClasses(input){for(var className in templateClasses){var templateNode=templateClasses[className];var candidates=input.getElementsByTagName(templateNode.nodeName);for(var j=0;j<candidates.length;j++){var candidate=candidates[j];tryToApplyTemplate(templateNode,candidate);}}}
function tryToApplyTemplate(templateNode,candidate){var templateClass=templateNode.attributes.getNamedItem("class").value;var candClass=candidate.attributes.getNamedItem("class");if(candClass&&candClass.value==templateClass){applyTemplate(templateNode,candidate);}}
function applyTemplate(templateNode,candidate){var tempAttributes=templateNode.attributes;var tempChildren=templateNode.childNodes;var candAttributes=candidate.attributes;var candChildren=candidate.childNodes;for(var k=0;k<tempAttributes.length;k++){var tempAttribute=tempAttributes[k];if(!candAttributes.getNamedItem(tempAttribute.name)){candidate.setAttribute(tempAttribute.name,tempAttribute.value);}}
for(var k=0;k<tempChildren.length;k++){candidate.appendChild(tempChildren[k].cloneNode(true));}}
function parseButtons(input){var newButtons=input.getElementsByTagName("spritebutton");for(var i=0;i<newButtons.length;i++){var curButton=newButtons[i];var newButton=Sburb.parseSpriteButton(curButton);Sburb.buttons[newButton.name]=newButton;}}
function parseSprites(input){var newSprites=input.getElementsByTagName("sprite");for(var i=0;i<newSprites.length;i++){var curSprite=newSprites[i];var newSprite=Sburb.parseSprite(curSprite,Sburb.assets);Sburb.sprites[newSprite.name]=newSprite;parseActions(curSprite,newSprite);}}
function parseActions(spriteNode,sprite){var newActions=spriteNode.childNodes;for(var k=0;k<newActions.length;k++){if(newActions[k].nodeName=="#text"){continue;}
if(newActions[k].nodeName=="action"){var newAction=Sburb.parseAction(newActions[k]);sprite.addAction(newAction);}}}
function parseCharacters(input){var newChars=input.getElementsByTagName("character");for(var i=0;i<newChars.length;i++){var curChar=newChars[i];var newChar=Sburb.parseCharacter(curChar,Sburb.assets);Sburb.sprites[newChar.name]=newChar;parseActions(curChar,newChar);}}
function parseFighters(input){var newFighters=input.getElementsByTagName("fighter");for(var i=0;i<newFighters.length;i++){var curFighter=newFighters[i];var newFighter=Sburb.parseFighter(curFighter,Sburb.assets);Sburb.sprites[newFighter.name]=newFighter;parseActions(curFighter,newFighter);}}
function parseRooms(input){var newRooms=input.getElementsByTagName("room");for(var i=0;i<newRooms.length;i++){var currRoom=newRooms[i];var newRoom=Sburb.parseRoom(currRoom,Sburb.assets,Sburb.sprites);Sburb.rooms[newRoom.name]=newRoom;}}
function parseState(input){var rootInfo=input.attributes;var char=rootInfo.getNamedItem("char");if(char){Sburb.focus=Sburb.char=Sburb.sprites[char.value];Sburb.char.becomePlayer();}
var mode=rootInfo.getNamedItem("mode");if(mode){Sburb.engineMode=mode.value;}
var scale=rootInfo.getNamedItem("scale");if(scale){Sburb.Stage.scaleX=Sburb.Stage.scaleY=parseInt(scale.value);}
var curRoom=rootInfo.getNamedItem("curRoom");if(curRoom){Sburb.curRoom=Sburb.rooms[curRoom.value];Sburb.curRoom.enter();}else if(Sburb.curRoom==null&&Sburb.char!=null){for(var roomName in Sburb.rooms){var room=Sburb.rooms[roomName];if(room.contains(Sburb.char)){Sburb.curRoom=room;Sburb.curRoom.enter();break;}}}
var bgm=rootInfo.getNamedItem("bgm");if(bgm){var params=bgm.value.split(",");Sburb.changeBGM(new Sburb.BGM(Sburb.assets[params[0]],parseFloat(params.length>1?params[1]:"0")));}
var initAction;var initActionName;if(rootInfo.getNamedItem("startAction")){initActionName=rootInfo.getNamedItem("startAction").value;for(var i=0;i<input.childNodes.length;i++){var tmp=input.childNodes[i];if(tmp.tagName=="action"&&tmp.attributes.getNamedItem("name").value==initActionName){initAction=Sburb.parseAction(tmp);continue;}}
if(initAction){Sburb.performAction(initAction);}}}
function parseHud(input){var hud=input.getElementsByTagName("hud");if(hud.length>0){var children=hud[0].childNodes;for(var i=0;i<children.length;i++){var child=children[i];if(child.nodeName=="spritebutton"){var name=child.attributes.getNamedItem("name").value;Sburb.hud[name]=Sburb.buttons[name];}}}
parseDialoger(input);parseDialogSprites(input);}
function parseDialoger(input){var dialoger=input.getElementsByTagName("dialoger");if(dialoger.length>0){var dialogSpriteLeft=null;var dialogSpriteRight=null;if(Sburb.dialoger){dialogSpriteLeft=Sburb.dialoger.dialogSpriteLeft;dialogSpriteRight=Sburb.dialoger.dialogSpriteRight;}
Sburb.dialoger=Sburb.parseDialoger(dialoger[0]);Sburb.dialoger.dialogSpriteLeft=dialogSpriteLeft;Sburb.dialoger.dialogSpriteRight=dialogSpriteRight;}}
function serialLoadDialogSprites(dialogSprites,assetFolder){if(!Sburb.dialoger){Sburb.dialoger={};}
if(!Sburb.dialoger.dialogSpriteLeft){Sburb.dialoger.dialogSpriteLeft=new Sburb.Sprite("dialogSprite",-1000,Sburb.Stage.height,0,0);Sburb.dialoger.dialogSpriteRight=new Sburb.Sprite("dialogSprite",Sburb.Stage.width+1000,Sburb.Stage.height,0,0);}
var animations=dialogSprites.getElementsByTagName("animation");for(var i=0;i<animations.length;i++){Sburb.dialoger.dialogSpriteLeft.addAnimation(Sburb.parseAnimation(animations[i],assetFolder));Sburb.dialoger.dialogSpriteRight.addAnimation(Sburb.parseAnimation(animations[i],assetFolder));}}
function serialLoadEffects(effects,assetFolder,effectsFolder){var animations=effects.getElementsByTagName("animation");for(var i=0;i<animations.length;i++){var newEffect=Sburb.parseAnimation(animations[i],assetFolder);effectsFolder[newEffect.name]=newEffect;}}
function serialLoadRoomSprites(newRoom,roomSprites,spriteFolder){for(var j=0;j<roomSprites.length;j++){var curSprite=roomSprites[j];var actualSprite=spriteFolder[curSprite.attributes.getNamedItem("name").value];newRoom.addSprite(actualSprite);}}
function serialLoadRoomPaths(newRoom,paths,assetFolder){var walkables=paths[0].getElementsByTagName("walkable");for(var j=0;j<walkables.length;j++){var node=walkables[j];var attributes=node.attributes;newRoom.addWalkable(assetFolder[attributes.getNamedItem("path").value]);}
var unwalkables=paths[0].getElementsByTagName("unwalkable");for(var j=0;j<unwalkables.length;j++){var node=unwalkables[j];var attributes=node.attributes;newRoom.addUnwalkable(assetFolder[attributes.getNamedItem("path").value]);}
var motionPaths=paths[0].getElementsByTagName("motionpath");for(var j=0;j<motionPaths.length;j++){var node=motionPaths[j];var attributes=node.attributes;newRoom.addMotionPath(assetFolder[attributes.getNamedItem("path").value],parseFloat(attributes.getNamedItem("xtox").value),parseFloat(attributes.getNamedItem("xtoy").value),parseFloat(attributes.getNamedItem("ytox").value),parseFloat(attributes.getNamedItem("ytoy").value),parseFloat(attributes.getNamedItem("dx").value),parseFloat(attributes.getNamedItem("dy").value));}}
function serialLoadRoomTriggers(newRoom,triggers){var candidates=triggers[0].childNodes;for(var i=0;i<candidates.length;i++){if(candidates[i].nodeName=="trigger"){newRoom.addTrigger(Sburb.parseTrigger(candidates[i]));}}}
Sburb.serializeAttribute=function(base,val){var sub;return base[val]?" "+val+"='"+base[val]+"' ":"";}
Sburb.serializeAttributes=function(base){str="";for(var i=1;i<arguments.length;i++){str=str.concat(Sburb.serializeAttribute(base,arguments[i]));}
return str;}
Sburb.serialLoadRoomSprites=serialLoadRoomSprites;Sburb.serialLoadRoomPaths=serialLoadRoomPaths;Sburb.serialLoadRoomTriggers=serialLoadRoomTriggers;Sburb.loadSerial=loadSerial;return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.Dialoger=function(hiddenPos,alertPos,talkPosLeft,talkPosRight,spriteStartRight,spriteEndRight,spriteStartLeft,spriteEndLeft,alertTextDimensions,leftTextDimensions,rightTextDimensions,type){this.name="default";this.currentDialog=null;this.talking=false;this.queue=[];this.extraArgs=null;this.dialog=new Sburb.FontEngine();this.hiddenPos=hiddenPos;this.alertPos=alertPos;this.talkPosLeft=talkPosLeft;this.talkPosRight=talkPosRight;this.spriteStartRight=spriteStartRight;this.spriteEndRight=spriteEndRight;this.spriteStartLeft=spriteStartLeft;this.spriteEndLeft=spriteEndLeft;this.alertTextDimensions=alertTextDimensions;this.leftTextDimensions=leftTextDimensions;this.rightTextDimensions=rightTextDimensions;this.pos={x:hiddenPos.x,y:hiddenPos.y}
this.actor=null;this.dialogSide="Left";this.graphic=null;this.box=null;this.defaultBox=null;this.type=type;this.handleType();this.inPosition=false;}
Sburb.Dialoger.prototype.dialogSpriteLeft=null;Sburb.Dialoger.prototype.dialogSpriteRight=null;Sburb.Dialoger.prototype.handleType=function(){if(this.type=="social"){this.hashes=new Sburb.FontEngine();this.hashes.setFormatted(false);this.choices={};}}
Sburb.Dialoger.prototype.nudge=function(){if(this.inPosition){if(this.dialog.isShowingAll()){if(this.dialog.nextBatch()){this.dialog.showSubText(0,1);}else{if(this.queue.length>0){this.nextDialog();}else{this.talking=false;}}}else{this.dialog.showAll();}}}
Sburb.Dialoger.prototype.skipAll=function(){this.talking=false;}
Sburb.Dialoger.prototype.startDialog=function(info){this.inPosition=false;this.actor=null;this.currentDialog=info;this.queue=info.split("@");for(var i=this.queue.length-2;i>=0;i--){var line=this.queue[i];var escapeCount=0;var index=line.length-1;while(index>=0&&line.charAt(index)=="/"){escapeCount++;index--;}
if(escapeCount%2==1){this.queue[i]+="@"+this.queue[i+1];this.queue.splice(i+1,1);}}
if(this.type=="social"){this.hashes.setText("");}
this.queue.reverse();this.queue.pop();this.nextDialog();if(this.type=="social"){Sburb.buttons.spadeButton.startAnimation("state0");Sburb.buttons.heartButton.startAnimation("state0");if(this.actor&&!this.choices[this.currentDialog]){this.choices[this.currentDialog]=0;}else{if(this.choices[this.currentDialog]==1){Sburb.buttons.heartButton.startAnimation("state1");}else{Sburb.buttons.spadeButton.startAnimation("state1");}}}
this.box.x=-this.box.width;this.talking=true;}
Sburb.Dialoger.prototype.nextDialog=function(){var nextDialog=this.queue.pop().trim();this.dialog.setText(nextDialog);this.dialog.showSubText(0,0);var prefix=nextDialog.split(" ",1)[0];if(prefix.indexOf("~")>=0){var firstIndex=prefix.indexOf("~");var lastIndex=prefix.length;var ampIndex=prefix.indexOf("%");if(ampIndex>firstIndex){lastIndex=ampIndex;}
var colIndex=prefix.indexOf(":");if(colIndex>=0&&colIndex<lastIndex){lastIndex=colIndex;}
var resource=prefix.substring(firstIndex+1,lastIndex);prefix=prefix.substring(0,firstIndex)+prefix.substring(lastIndex,prefix.length);var img=Sburb.assets[resource];this.graphic=new Sburb.Sprite();this.graphic.addAnimation(new Sburb.Animation("image",img,0,0,img.width,img.height,0,1,1));this.graphic.startAnimation("image");}else{this.graphic=null;}
if(prefix.indexOf("%")>=0){var firstIndex=prefix.indexOf("%");var lastIndex=prefix.length;var colIndex=prefix.indexOf(":");if(colIndex>=0&&colIndex<lastIndex){lastIndex=colIndex;}
var resource=prefix.substring(firstIndex+1,lastIndex);prefix=prefix.substring(0,firstIndex)+prefix.substring(lastIndex,prefix.length);this.setBox(resource);}else{this.box=this.defaultBox;}
if(prefix.indexOf(":")>=0){var firstIndex=prefix.indexOf(":");var lastIndex=prefix.length;var resource=prefix.substring(firstIndex+1,lastIndex);prefix=prefix.substring(0,firstIndex)+prefix.substring(lastIndex,prefix.length);this.extraArgs=resource;if(this.type=="social"){this.hashes.setText(this.extraArgs.replace(/#/g," #").replace(/-/g," ").trim());}}else{this.extraArgs=null;if(this.type=="social"){this.hashes.setText("");}}
if(prefix=="!"){this.actor=null;this.dialogSide="Left";}else{var newActor;if(prefix.indexOf("_")>=0){newActor=prefix.substring(0,prefix.indexOf("_"));}else{newActor=prefix.substring(0,2);}
if(this.actor==null){this.dialogSide="Left";var sprite=this.dialogOnSide(this.dialogSide);var desiredPos=this.startOnSide(this.oppositeSide(this.dialogSide));sprite.x=desiredPos.x;sprite.y=desiredPos.y;}else if(this.actor!=newActor){this.dialogSide=this.oppositeSide(this.dialogSide);var sprite=this.dialogOnSide(this.dialogSide)
var desiredPos=this.startOnSide(this.dialogSide);sprite.x=desiredPos.x;sprite.y=desiredPos.y;}
this.actor=newActor;this.dialogOnSide(this.dialogSide).startAnimation(prefix);}}
Sburb.Dialoger.prototype.oppositeSide=function(side){if(side=="Left"){return"Right";}else{return"Left";}}
Sburb.Dialoger.prototype.dialogOnSide=function(side){return this["dialogSprite"+side];}
Sburb.Dialoger.prototype.startOnSide=function(side){return this["spriteStart"+side];}
Sburb.Dialoger.prototype.endOnSide=function(side){return this["spriteEnd"+side];}
Sburb.Dialoger.prototype.moveToward=function(sprite,pos,speed){if(typeof speed!="number"){speed=100;}
if(Math.abs(sprite.x-pos.x)>speed){sprite.x+=speed*Math.abs(pos.x-sprite.x)/(pos.x-sprite.x);}else{sprite.x=pos.x;}
if(Math.abs(sprite.y-pos.y)>speed){sprite.y+=speed*Math.abs(pos.y-sprite.y)/(pos.y-sprite.y);}else{sprite.y=pos.y;}
return sprite.y==pos.y&&sprite.x==pos.x;}
Sburb.Dialoger.prototype.update=function(){if(this.type=="social"){var closeButton=Sburb.buttons.closeButton;var spadeButton=Sburb.buttons.spadeButton;var heartButton=Sburb.buttons.heartButton;var bubbleButton=Sburb.buttons.bubbleButton;var hashTagBar=Sburb.sprites.hashTagBar;}
if(this.talking){var desiredPos;var ready=true;if(this.actor==null){desiredPos=this.alertPos;this.inPosition=true;}else{desiredPos=this["talkPos"+this.dialogSide];ready=this.moveToward(this.dialogOnSide(this.dialogSide),this.endOnSide(this.dialogSide));this.moveToward(this.dialogOnSide(this.oppositeSide(this.dialogSide)),this.startOnSide(this.oppositeSide(this.dialogSide)));}
var init=false;if(this.moveToward(this.pos,desiredPos,110)&&ready){if(this.dialog.start==this.dialog.end){this.inPosition=true;var dialogDimensions=this.decideDialogDimensions();this.dialog.setDimensions(dialogDimensions.x,dialogDimensions.y,dialogDimensions.width,dialogDimensions.height);init=true;}
this.dialog.showSubText(null,this.dialog.end+2);if(this.actor){this.dialogOnSide(this.dialogSide).update();}
if(this.type=="social"){if(this.queue.length==0){if(this.actor!=null){spadeButton.update();heartButton.update();bubbleButton.update();}}else{closeButton.update();}
hashTagBar.update();}}else{this.inPosition=false;}
if(this.graphic){this.graphic.x=this.pos.x;this.graphic.y=this.pos.y;}}else{this.moveToward(this.pos,this.hiddenPos,120);if(this.actor!=null){if(this.moveToward(this.dialogOnSide(this.dialogSide),this.startOnSide(this.oppositeSide(this.dialogSide)))){var pos1=this.startOnSide(this.dialogSide);var sprite1=this.dialogOnSide(this.dialogSide);sprite1.x=pos1.x;sprite1.y=pos1.y;var pos2=this.startOnSide(this.oppositeSide(this.dialogSide));var sprite2=this.dialogOnSide(this.oppositeSide(this.dialogSide));sprite2.x=pos2.x;sprite2.y=pos2.y;this.actor=null;}}}
this.box.x=this.pos.x;this.box.y=this.pos.y;if(this.type=="social"){hashTagBar.x=this.pos.x;hashTagBar.y=this.pos.y+this.box.height;if(this.dialogSide=="Right"){spadeButton.x=hashTagBar.x+20;heartButton.x=hashTagBar.x+60;bubbleButton.x=hashTagBar.x+100;}else{spadeButton.x=hashTagBar.x+hashTagBar.animation.colSize-120;heartButton.x=hashTagBar.x+hashTagBar.animation.colSize-80;bubbleButton.x=hashTagBar.x+hashTagBar.animation.colSize-40;}
spadeButton.y=hashTagBar.y+15;heartButton.y=hashTagBar.y+15;bubbleButton.y=hashTagBar.y+15;if(this.actor){if(Sburb.buttons.spadeButton.animation.name=="state1"){this.choices[this.currentDialog]=-1;}else if(Sburb.buttons.heartButton.animation.name=="state1"){this.choices[this.currentDialog]=1;}else{this.choices[this.currentDialog]=0;}}
if(init){if(this.dialogSide=="Right"){this.hashes.setDimensions(this.dialog.x,hashTagBar.y+13,this.dialog.width,hashTagBar.animation.rowSize-10);}else{this.hashes.setDimensions(this.dialog.x,hashTagBar.y+13,this.dialog.width,hashTagBar.animation.rowSize-10);}}
if(this.dialog.isShowingAll()&&this.dialog.onLastBatch()){this.hashes.showAll();}else{this.hashes.showSubText(0,0);}}
this.box.update();}
Sburb.Dialoger.prototype.decideDialogDimensions=function(){if(this.actor==null){return{x:this.pos.x+this.alertTextDimensions.x,y:this.pos.y+this.alertTextDimensions.y,width:this.alertTextDimensions.width,height:this.alertTextDimensions.height};}else if(this.dialogSide=="Left"){return{x:this.pos.x+this.leftTextDimensions.x,y:this.pos.y+this.leftTextDimensions.y,width:this.leftTextDimensions.width,height:this.leftTextDimensions.height};}else{return{x:this.pos.x+this.rightTextDimensions.x,y:this.pos.y+this.rightTextDimensions.y,width:this.rightTextDimensions.width,height:this.rightTextDimensions.height};}}
Sburb.Dialoger.prototype.setBox=function(box){var boxAsset=Sburb.assets[box];var dialogBox=new Sburb.Sprite("dialogBox",Sburb.Stage.width+1,1000,boxAsset.width,boxAsset.height,null,null,0);dialogBox.addAnimation(new Sburb.Animation("image",boxAsset,0,0,boxAsset.width,boxAsset.height,0,1,1));dialogBox.startAnimation("image");if(!this.box){this.defaultBox=dialogBox;}
this.box=dialogBox;}
Sburb.Dialoger.prototype.draw=function(){if(this.type=="social"){Sburb.sprites.hashTagBar.draw();}
this.box.draw();if(this.graphic){this.graphic.draw();}
if(this.talking){this.dialog.draw();if(this.type=="social"){if(this.queue.length>0){Sburb.buttons.closeButton.draw();}
if(this.dialog.start!=this.dialog.end){this.hashes.draw();if(this.queue.length==0&&this.actor!=null){Sburb.buttons.spadeButton.draw();Sburb.buttons.heartButton.draw();Sburb.buttons.bubbleButton.draw();}}}}
if(this.actor!=null){this.dialogSpriteLeft.draw();if(this.dialogSpriteRight.animation){this.dialogSpriteRight.animation.flipX=true;}
this.dialogSpriteRight.draw();}}
Sburb.parseDialoger=function(dialoger){var attributes=dialoger.attributes;var hiddenPos=parseDimensions(attributes.getNamedItem("hiddenPos").value);var alertPos=parseDimensions(attributes.getNamedItem("alertPos").value);var talkPosLeft=parseDimensions(attributes.getNamedItem("talkPosLeft").value);var talkPosRight=parseDimensions(attributes.getNamedItem("talkPosRight").value);var spriteStartRight=parseDimensions(attributes.getNamedItem("spriteStartRight").value);var spriteEndRight=parseDimensions(attributes.getNamedItem("spriteEndRight").value);var spriteStartLeft=parseDimensions(attributes.getNamedItem("spriteStartLeft").value);var spriteEndLeft=parseDimensions(attributes.getNamedItem("spriteEndLeft").value);var alertTextDimensions=parseDimensions(attributes.getNamedItem("alertTextDimensions").value);var leftTextDimensions=parseDimensions(attributes.getNamedItem("leftTextDimensions").value);var rightTextDimensions=parseDimensions(attributes.getNamedItem("rightTextDimensions").value);var type=attributes.getNamedItem("type")?attributes.getNamedItem("type").value:"standard";var newDialoger=new Sburb.Dialoger(hiddenPos,alertPos,talkPosLeft,talkPosRight,spriteStartRight,spriteEndRight,spriteStartLeft,spriteEndLeft,alertTextDimensions,leftTextDimensions,rightTextDimensions,type);var box=attributes.getNamedItem("box").value;newDialoger.setBox(box);return newDialoger;}
Sburb.Dialoger.prototype.serialize=function(input){input+="\n<dialoger "+serializeDimensions(this,"hiddenPos","alertPos","talkPosLeft","talkPosRight","spriteStartRight","spriteEndRight","spriteStartLeft","spriteEndLeft","alertTextDimensions","leftTextDimensions","rightTextDimensions");input+=Sburb.serializeAttribute(this,"type");input+="box='"+this.box.animation.sheet.name+"' ";input+=">";input+="</dialoger>";return input;}
function serializeDimensions(base){str="";for(var i=1;i<arguments.length;i++){str=str.concat(serializeDimension(base,arguments[i]));}
return str;}
function serializeDimension(base,val){var dim=base[val];var sub=" "+val+"='";sub+=(dim.hasOwnProperty("x"))?dim.x+",":"";sub+=(dim.hasOwnProperty("y"))?dim.y+",":"";sub+=(dim.hasOwnProperty("width"))?dim.width+",":"";sub+=(dim.hasOwnProperty("height"))?dim.height+",":"";sub=sub.substring(0,sub.length-1);sub+="' ";return sub;}
function parseDimensions(input){var values=input.split(",");var dimensions={};switch(values.length){case 4:dimensions.height=parseInt(values[3]);case 3:dimensions.width=parseInt(values[2]);case 2:dimensions.y=parseInt(values[1]);case 1:dimensions.x=parseInt(values[0]);}
return dimensions;}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.Chooser=function(){this.choosing=false;this.choices=[];this.choice=0;this.dialogs=[];this.time=0;}
Sburb.Chooser.prototype.nextChoice=function(){this.choice=(this.choice+1)%this.choices.length;}
Sburb.Chooser.prototype.prevChoice=function(){this.choice=(this.choice-1+this.choices.length)%this.choices.length;}
Sburb.Chooser.prototype.beginChoosing=function(x,y){this.choosing=true;this.choice=0;this.dialogs=[];for(var i=0;i<this.choices.length;i++){var curEngine=new Sburb.FontEngine(" > "+this.choices[i].name);curEngine.showSubText(0,1);curEngine.setDimensions(x,y+i*curEngine.lineHeight);this.dialogs.push(curEngine);}}
Sburb.Chooser.prototype.draw=function(){if(this.choosing){Sburb.stage.save();var x,y,width=160,height=0,i;x=this.dialogs[0].x;y=this.dialogs[0].y-1;for(i=0;i<this.dialogs.length;i++){width=Math.max(width,this.dialogs[i].lines[0].length*this.dialogs[i].charWidth);}
height=this.dialogs[0].lineHeight*this.dialogs.length;Sburb.stage.fillStyle="#ff9900";Sburb.stage.fillRect(x-6,y-6,width+12,height+13);Sburb.stage.fillStyle="#ffff00";Sburb.stage.fillRect(x-2,y-2,width+4,height+5);Sburb.stage.fillStyle="#000000";Sburb.stage.fillRect(x,y,width,height);for(i=0;i<this.dialogs.length;i++){this.dialogs[i].draw();}
Sburb.stage.restore();}}
Sburb.Chooser.prototype.update=function(){if(this.choosing){this.time++;for(var i=0;i<this.dialogs.length;i++){var curDialog=this.dialogs[i];curDialog.showSubText(null,curDialog.end+1);if(i==this.choice){if(this.time%Sburb.Stage.fps<Sburb.Stage.fps/2){curDialog.start=2;}else{curDialog.start=0;}
curDialog.color="#cccccc";}else{curDialog.start=0;curDialog.color="#ffffff";}}}}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.globalVolume=1;Sburb.Sound=function(asset){this.asset=asset;}
Sburb.Sound.prototype.play=function(pos){if(window.chrome){this.asset.load();if(pos){var oThis=this;this.asset.addEventListener('playing',function(){oThis.asset.currentTime=pos;oThis.asset.pause();oThis.asset.removeEventListener('playing',arguments.callee);oThis.asset.play();},false);}}else if(pos){this.asset.currentTime=pos;}
this.fixVolume();this.asset.play();}
Sburb.Sound.prototype.pause=function(){this.asset.pause();}
Sburb.Sound.prototype.stop=function(){this.pause();this.asset.currentTime=0;}
Sburb.Sound.prototype.ended=function(){return this.asset.ended;}
Sburb.Sound.prototype.fixVolume=function(){this.asset.volume=Sburb.globalVolume;}
Sburb.BGM=function(asset,startLoop,priority){Sburb.Sound.call(this,asset);this.startLoop=0;this.endLoop=0;this.setLoopPoints(startLoop?startLoop:0);}
Sburb.BGM.prototype=new Sburb.Sound();Sburb.BGM.prototype.setLoopPoints=function(start,end){tmpAsset=this.asset
tmpAsset.addEventListener('ended',function(){tmpAsset.currentTime=start;tmpAsset.play();},false);this.startLoop=start;this.endLoop=end;}
Sburb.BGM.prototype.loop=function(){this.play(this.startLoop);}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.AssetManager=function(){this.totalAssets=0;this.totalLoaded=0;this.assets={};this.loaded={};this.recurrences={};this.description="";this.resourcePath="";this.levelPath="";}
Sburb.AssetManager.prototype.resolvePath=function(path){if(path.indexOf(this.resourcePath)==-1){return this.resourcePath+"/"+path;}else{return path;}}
Sburb.AssetManager.prototype.totalAssetsRemaining=function(){return this.totalAssets-this.totalLoaded;}
Sburb.AssetManager.prototype.finishedLoading=function(){return(this.totalAssets&&(this.totalAssets==this.totalLoaded));}
Sburb.AssetManager.prototype.draw=function(){Sburb.stage.fillStyle="rgb(0,0,0)";Sburb.stage.fillRect(-3,-3,Sburb.Stage.width+6,Sburb.Stage.height+6);if(this.loaded["preloaderBG"]){var preloaderBG=Sburb.assets["preloaderBG"];Sburb.stage.drawImage(preloaderBG,0,0,preloaderBG.width,preloaderBG.height,0,0,preloaderBG.width,preloaderBG.height);}
Sburb.stage.fillStyle="rgb(255,255,255)"
Sburb.stage.font="10px Verdana";Sburb.stage.textAlign="center";Sburb.stage.fillText(Math.floor((this.totalLoaded/this.totalAssets)*100)+"%",Sburb.Stage.width/2,Sburb.Stage.height-50);}
Sburb.AssetManager.prototype.isLoaded=function(name){return this.loaded[name]?true:false;}
Sburb.AssetManager.prototype.purge=function(){this.assets={}
this.loaded={}
this.totalLoaded=0;this.totalAssets=0;}
Sburb.AssetManager.prototype.loadAsset=function(assetObj){var name=assetObj.name;this.assets[name]=assetObj;if(assetObj.instant){return;}
var oThis=this;this.assetAdded(name);var loadedAsset=this.assets[name].assetOnLoadFunction(function(){oThis.assetLoaded(name);});if(!loadedAsset&&assetObj.needsTimeout&&assetObj.checkLoaded){this.recurrences[assetObj.name]=assetObj.checkLoaded;}
this.draw();}
Sburb.AssetManager.prototype.assetAdded=function(name){this.totalAssets++;this.loaded[name]=false;}
Sburb.AssetManager.prototype.assetLoaded=function(name){if(this.assets[name]){if(!this.loaded[name]){this.loaded[name]=true
this.totalLoaded++;this.draw();if(this.finishedLoading()&&Sburb._hardcode_load){Sburb.finishInit();initFinished=true;}}}};Sburb.createGraphicAsset=function(name,path){var ret=new Image();ret.loaded=false;ret.onload=function(){ret.loaded=true;}
ret.src=Sburb.assetManager.resolvePath(path);ret.type="graphic";ret.name=name;ret.assetOnLoadFunction=function(fn){if(ret.loaded){if(fn){fn();}
return true;}else{ret.onload=function(){ret.loaded=true
if(fn){fn();}}
return false;}};return ret;}
Sburb.createAudioAsset=function(name,sources){var ret=new Audio();ret.name=name
ret.type="audio";ret.preload=true;for(var a=0;a<sources.length;a++){var tmp=document.createElement("source");tmp.src=Sburb.assetManager.resolvePath(sources[a]);ret.appendChild(tmp);}
ret.assetOnLoadFunction=function(fn){this.checkLoaded=function(){if(ret.readyState==4){if(fn){fn();}
return true;}
return false;}
if(!this.checkLoaded()){ret.addEventListener('loadeddata',fn,false);return false;}else{return true;}};return ret;}
Sburb.createMovieAsset=function(name,path){var ret={src:Sburb.assetManager.resolvePath(path)};document.getElementById("SBURBmovieBin").innerHTML+='<div id="'+name+'"><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" id="movie" width="'+Sburb.Stage.width+'" height="'+Sburb.Stage.height+'"><param name="allowScriptAccess" value="always" /\><param name="wmode" value="transparent"/\><param name="movie" value="'+name+'" /\><param name="quality" value="high" /\><embed src="'+Sburb.assetManager.resolvePath(path)+'" quality="high" WMODE="transparent" width="'+Sburb.Stage.width+'" height="'+Sburb.Stage.height+'" swLiveConnect=true id="movie'+name+'" name="movie'+name+'" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /\></object></div>';ret.name=name;ret.type="movie";ret.instant=true;document.getElementById(name).style.display="none";return ret;}
Sburb.createPathAsset=function(name,path){var ret=path;ret.name=name;ret.type="path";ret.instant=true;ret.assetOnLoadFunction=function(fn){if(fn){fn();}
return;}
return ret}
Sburb.createFontAsset=function(name,sources){var ret={font:sources[0]};ret.name=name;ret.originalVals=sources;ret.type="font";ret.instant=true;var source="";var extra="";var sourceList=sources.split(',');for(var i=0;i<sourceList.length;i++){var result="";var values=sourceList[i].split(':');var type=values[0].trim();var path=values[1].trim();if(type=="url"){var extension=path.substring(path.indexOf(".")+1,path.length);var format="";if(extension=="ttf"){format="truetype";}else if(extension=="woff"){format="woff";}else if(extension=="svg"){format="svg";}
path=Sburb.assetManager.resolvePath(path);result="url('"+path+"') format('"+format+"')";}else if(type=="local"){result="local('"+path+"')";}else if(type=="weight"){extra+="font-weight:"+path+"; "}
if(result!=""){source+=result+",";}}
source=source.substring(0,source.length-1);var style='<style type="text/css">'+'@font-face{ font-family: '+name+'; src: '+source+'; '+extra+'}'+'</style>';document.getElementById("SBURBfontBin").innerHTML+=style;Sburb.stage.font="10px "+name;Sburb.stage.fillText("load font",-100,-100);ret.assetOnLoadFunction=function(fn){if(fn){fn();}
return;}
return ret}
return Sburb;})(Sburb||{});var Sburb=(function(Sburb){Sburb.Path=function(){this.points=[];}
Sburb.Path.prototype.push=function(point){this.points.push(point);}
Sburb.Path.prototype.queryBatchPos=function(queries,results){for(var query in queries){results[query]=results[query]||this.query(queries[query]);}}
Sburb.Path.prototype.queryBatchNeg=function(queries,results){for(var query in queries){results[query]=results[query]&&!this.query(queries[query]);}}
Sburb.Path.prototype.query=function(pt){for(var c=false,i=-1,l=this.points.length,j=l-1;++i<l;j=i){var ptA=this.points[i];var ptB=this.points[j];((ptA.y<=pt.y&&pt.y<ptB.y)||(ptB.y<=pt.y&&pt.y<ptA.y))&&(pt.x<(ptB.x-ptA.x)*(pt.y-ptA.y)/(ptB.y-ptA.y)+ptA.x)&&(c=!c);}
return c;}
return Sburb;})(Sburb||{});
alert("Loaded!");
