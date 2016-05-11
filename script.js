clearColor = '#EDEDED'//'#c3ffff'
brownColor = '#aa7941'
stoneColor1 = '#a0a0a0'



function TWorld(game,tileSize){
	this.instance=this;
	this.game=game;
	this.tileSize=tileSize;
	this.data=null;
	this.d=null;
	this.fireGroup=game.add.group();
	this.BazokaGroup=game.add.group();
	this.bazopkaPoints=game.cache.getJSON('bazokaC');
	
	
}
TWorld.prototype.getData=function(){
	return this.data;
}
TWorld.prototype.loadImage=function(){
	
	console.log(this.tileSize);
	
	this.init();
	var pixelData=this.canvas.getContext('2d').getImageData(0,0,this.img.width,this.img.height).data;
	for (var x = 0; x< this.img.width; x++) {
		for(var y =0;y<this.img.height;y++){
			var red = pixelData[((this.img.width * y) + x) * 4]
			var  green = pixelData[((this.img.width * y) + x) * 4 + 1]
			var  blue = pixelData[((this.img.width * y) + x) * 4 + 2]
			var alpha = pixelData[((this.img.width * y) + x) * 4 + 3]
			var hex = Helper.rgbToHex(red, green, blue);
			if(alpha==0)
				hex=clearColor
			this.data[x][y]=hex;
			this.futureData[x][y]=hex;
			this.land.ctx.fillStyle = hex
			if (hex!=clearColor)
   				this.land.ctx.fillRect(this.tileSize * x, this.tileSize * y, this.tileSize, this.tileSize)
   			this.land.dirty=true;
   			////console.log(hex);
		}	

	}
	
	//var PhysicalSystem=new PhysicsWorld(game, this, this.dude);
//		game.plugins.add(PhysicalSystem);


}
TWorld.prototype.init=function(){

	this.land = this.game.add.bitmapData(this.game.width, this.game.height);
	this.game.add.sprite(0,0,this.land);
    
	this.img = game.cache.getImage('land');
    this.canvas = document.createElement('canvas');
    this.canvas.getContext('2d').drawImage(this.img, 0, 0, this.img.width, this.img.height);
    var pixelData = this.canvas.getContext('2d').getImageData(0, 0, this.img.width, this.img.height).data;
   // document.body.appendChild(canvas);
   // Phaser.Canvas.addToDOM(canvas, parent, overflowHidden)
    var sprite = game.add.sprite(0, 0, this.land)
	
	this.data=new Array(this.game.height);
	this.width=this.game.width/this.tileSize;
	this.height=this.game.width/this.tileSize;
	
	this.futureData=new Array(this.game.height);
	for (var x = 0; x< this.game.width; x++) {
		this.data[x]=new Array(this.game.width);
		this.futureData[x]=new Array(this.game.width);
		for(var y =0;y<this.height;y++){
			this.data[x][y]=clearColor;
			this.futureData[x][y]=clearColor;

			
	
		}	

	}
	
	//var PhysicalSystem=new PhysicsWorld(game, this, this.dude);
//		game.plugins.add(PhysicalSystem);


}
TWorld.prototype.x=10;


TWorld.prototype.colorAPixle=function(x,y,r,g,b){
	// this.data[x][y]=Helper.rgbToHex(red, green, blue);
	this.land.ctx.fillStyle = Helper.rgbToHex(r, g, b)
	this.land.ctx.fillRect(this.tileSize * x, this.tileSize * y, this.tileSize, this.tileSize)
	this.land.dirty=true

}
TWorld.prototype.isWalkable=function(hexColor){
	//console.log(hexColor +" "+ clearColor);
	return hexColor  ==clearColor;
}

TWorld.prototype.render=function(force=false){
	for (var x=0;x<this.width;x++){
		for (var y=0;y<this.height;y++){

			if(this.data[x][y]!=this.futureData[x][y]||force){
				this.data[x][y]=this.futureData[x][y];
				this.drawTile(this.data[x][y],x,y);
				this.land.dirty=true;;
				//console.log("renderd");
			}	
		}
	}
	

}

TWorld.prototype.drawTile=function(color,x,y){

	this.land.ctx.fillStyle = color

   	this.land.ctx.clearRect(this.tileSize * x, this.tileSize * y, this.tileSize, this.tileSize)

}

TWorld.prototype.highestNonFreeTile=function(x,y){
	var cy=y;
	while (cy>=0){
		if(this.isWalkable(this.data[x][y]))
			break;
		else
			cy--;
	}
	return cy;

}

TWorld.prototype.highestTile=function(x,y){
	var cy=y;
	while (cy>=0){
		if(!this.isWalkable(this.data[x][y]))
			break;
		else
			cy--;
	}
	return cy;

}






TWorld.prototype.TileForWorld=function(world){
	var result=world/this.tileSize;

	return Math.floor(result);
}

TWorld.prototype.destoryCircle=function(r,tileX,tileY){
	
	for(var x=-r;x<r;x++){
		for(var y=-r;y<r;y++){
			var d=x*x +y*y;
			if(d<r*r){
				var darwTileX=Phaser.Math.clamp(tileX+x,0,this.width-1);
				var darwTileY=Phaser.Math.clamp(tileY+y,0,this.height-1);
				
				this.futureData[darwTileX][darwTileY]=clearColor;
				this.land.dirty=true;
				//console.log("destroed");
			}
		}
	}
	this.render();
} 
TWorld.prototype.destroyOneTile=function(tileX,tileY){

	this.futureData[tileX][tileY]=clearColor;
	this.land.dirty=true;
	this.render();

}

TWorld.prototype.destroySquare=function(tileX,tileY,width,height){
	for (var i = tileY; i < tileY+height; i++) {
		for (var j =tileX;j<tileX+width;j++){
			this.futureData[j][i]=clearColor;
			this.land.dirty=true;
		}		    
		
	}
	this.render();
}
TWorld.prototype.AddFire=function(x,y,key,time){
	this.fireGroup=this.fireGroup||game.add.group();
	var fire=new Fire(x, y, key, this.game,time);
	this.fireGroup.add(fire);
	return fire;

}

TWorld.prototype.AddBazoka=function(x,y,key,r){
	
	var bazoka=new Bazoka(x, y, key, this.game,r);
	this.BazokaGroup.add(bazoka);
	return bazoka;

}

function PhysicsWorld(game,TWorld,charcters){

	this.game=game;
	this.World=TWorld;

	console.log(this.bazopkaPoints);

	this.charcters=charcters;
	
	console.log('constructor');
	//console.log(charcter);
}
PhysicsWorld.prototype=Phaser.Plugin

PhysicsWorld.prototype.update=function(){

	var f=this.checkOverlap;
	this.charcters.forEach(this.checkCharcterCollison);
	this.charcters.forEach(function (charcter) {
		// this.checkCharcterCollison(charcter);
		
		this.World.fireGroup.forEach(function(fire){
			if(f(fire,charcter)){
				console.log("it burns");
			}
		})
		// this.checkCharcterCollison(charcter);


		
	});
	this.World.fireGroup.forEach(this.checkFireCollison);
	this.World.BazokaGroup.forEach(this.bazokaVsPlatform);

}

PhysicsWorld.prototype.checkOverlap=function(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}
PhysicsWorld.prototype.postUpdate=function(){

}


TWorld.prototype.checkVerticalLine=function(x,y,length){
	for (var i =1;i<length;i++){
		if(!this.isWalkable(this.data[x][y-i])){
			World.colorAPixle(x, y-i, 255, 0, 0)
			return false;
		}
		World.colorAPixle(x, y, 0, 0, 255)
	}
	console.log("trueee");
	World.colorAPixle(x, y, 255, 255, 0)
	return !this.isWalkable(this.data[x][y])
}

PhysicsWorld.prototype.checkCharcterCollison=function(charcter){

	var tileX = this.World.TileForWorld(charcter.x +(charcter.width/2))
    tileX = Phaser.Math.clamp(tileX, 0, this.World.width-1)
    var tileY = this.World.TileForWorld(charcter.body.y + charcter.height)
    var tileTopY=this.World.TileForWorld(charcter.body.y);
    tileY = Phaser.Math.clamp(tileY, 0, this.World.height-1);
    tileTopY=Phaser.Math.clamp(tileTopY, 0, this.World.height-1);
    tileXright=this.World.TileForWorld(charcter.x +(charcter.width/4))
    tileXright=Phaser.Math.clamp(tileXright, 0, this.World.width-1)
    tileHexColor = this.World.data[tileX][tileY]

	
	// if(!this.World.isWalkable(this.World.data[tileX+1][tileY-1])||
	// 	!this.World.isWalkable(this.World.data[tileX+2][tileY-1])||
	// 	!this.World.isWalkable(this.World.data[tileX+3][tileY-1])){
	// 		if(charcter.body.velocity.x>0){
	// 			charcter.body.velocity.x=0;
	// 		//console.log('cant go right');
	// 		}
	
	// }
	// 
	var flag=0;

	// console.log(charcter.height);
	if(charcter.body.velocity.x>0){
		for(var i=1;i<charcter.height/4;i++){
			for(var j=1;j<3;j++)
				if(!this.World.isWalkable(this.World.data[tileX+j][tileY-i])){
				
					charcter.body.velocity.x=0;
					// this.World.colorAPixle(tileX+j, tileY-i, 255, 0, 0)
					if(this.World.checkVerticalLine(tileX+2, tileY-i, charcter.height/4)){
						charcter.body.y=charcter.body.y-6
						charcter.body.x=charcter.body.x+1
					}
					console.log("boo");
					break
				}

					
			}
		}

	

	if(charcter.body.velocity.x<0){
		for(var i=1;i<charcter.height/4;i++){
			for(var j=1;j<3;j++)
				if(!this.World.isWalkable(this.World.data[tileX-j][tileY-i])){
				
					charcter.body.velocity.x=0;
					// this.World.colorAPixle(tileX-j, tileY-i, 255, 0, 0)
					if(this.World.checkVerticalLine(tileX-2, tileY-i, charcter.height/4)){
						charcter.body.y=charcter.body.y-6
					
						charcter.body.x=charcter.body.x+-1
				}
					console.log("boo");
					break
				}

					
			}
		}

	if(charcter.body.velocity.y<0){
		//console.log("1");
		if(!this.World.isWalkable(this.World.data[tileX][tileTopY])){
			charcter.body.velocity.y=0;
			var highestTire=this.World.highestTile(tileX, tileTopY);
		//	console.log("2");
			charcter.body.y=highestTire*4+1;

		}
		

	}

	
	if(this.World.isWalkable(tileHexColor)){
		//charcter.body.velocity.x=50;
		charcter.body.acceleration.y=100;
	
}	

	else if(charcter.body.velocity.y>0){
		charcter.body.acceleration.y=0;
		charcter.body.velocity.y=0;
		console.log(this.tileSize);
		
		
		var highestTire=this.World.highestNonFreeTile(tileX, tileY);
		if( highestTire>tileY-5){
			charcter.body.y=highestTire*this.World.tileSize-charcter.height+1;
			console.log("bug");
		}else{
			charcter.body.y=tileY*this.World.tileSize-charcter.height+1;
		}

	}


}

PhysicsWorld.prototype.checkFireCollison=function(fire){

	var tileX = this.World.TileForWorld(fire.x +(fire.width/2))
    tileX = Phaser.Math.clamp(tileX, 0, this.World.width-1)
    var tileY = this.World.TileForWorld(fire.body.y + fire.height)
    var tileTopY=this.World.TileForWorld(fire.body.y);
    tileY = Phaser.Math.clamp(tileY, 0, this.World.height-1);
    tileTopY=Phaser.Math.clamp(tileTopY, 0, this.World.height-1);
    tileHexColor = this.World.data[tileX][tileY]

    if(this.World.isWalkable(tileHexColor)){
    	fire.body.acceleration.y=100;
    }
    else {
		fire.body.acceleration.y=0;
		fire.body.velocity.y=0;
		fire.body.velocity.x=0;
		
		var highestTire=this.World.highestNonFreeTile(tileX, tileY);
		if( highestTire>tileY-5){
			fire.body.y=highestTire*this.World.tileSize-fire.height+1;
		}else{
			fire.body.y=tileY*this.World.tileSize-fire.height+1;
		}
		tileX=this.World.TileForWorld(fire.x);
		thileY=this.World.TileForWorld(fire.y);

		
		this.timers=this.timers||[];
		this.TimerIndex=this.TimerIndex||0;
		 this.timers[this.TimerIndex]= game.time.events.loop(Phaser.Timer.QUARTER, burn, this,tileX,tileY,this,fire,this.TimerIndex++);

	}

}

function burn(x,y,pw,fire,TimerIndex){

	
	
	if(fire.time<=fire.numT){
		pw.game.time.events.remove(pw.timers[TimerIndex]);
		pw.World.fireGroup.removeChild(fire);
		fire.destroy();
		

	}
	pw.World.destroySquare(x-2,y, 5,4);
	fire.numT++;


}
PhysicsWorld.prototype.bazokaVsPlatform=function(bazoka){
tileX=this.World.TileForWorld(bazoka.body.x)
tileX1=this.World.TileForWorld(bazoka.body.x+bazoka.width)
tileY=this.World.TileForWorld(bazoka.body.y)+1
tileY1=this.World.TileForWorld(bazoka.body.y+bazoka.height)-1

if(bazoka.body.x<=0||bazoka.body.x>=this.game.width||bazoka.body.y<=0||bazoka.body.y>=this.game.height){
	
			this.World.BazokaGroup.removeChild(bazoka)
			bazoka.destroy()
			console.log('removed')
			return

}
this.World.colorAPixle(0, 0, 255, 255, 255)
	// for(var i=tileX;i<tileX1;i++)
	// 	this.World.colorAPixle(i, tileY, 255, 0, 0)

	for(i=0;i<this.World.bazopkaPoints.length;i++){
		x=bazoka.x+ this.World.bazopkaPoints[i][0]-12
		y=bazoka.y+ this.World.bazopkaPoints[i][1]-6
		
		p=new Phaser.Point(x,y)
		p=p.rotate(bazoka.x,bazoka.y,bazoka.angle,true)

		yy=Math.floor(p.y)
		xx=Math.floor(p.x)
		var pointX=this.World.TileForWorld(xx)
		var pointY=this.World.TileForWorld(yy)
		 console.log(x+" "+xx+" "+y+" "+yy );
		 this.World.colorAPixle(pointX, pointY, 255, 0, 0)
		
		if(!this.World.isWalkable(this.World.data[pointX][pointY])){
			this.World.destoryCircle(bazoka.radious, pointX, tileY)
			this.World.BazokaGroup.removeChild(bazoka)
				bazoka.destroy()

		}
		this.World.colorAPixle(0, 0, 255, 0, 0)
	}

}


	
PhysicsWorld.prototype.BazokaVsPlatForm=function(bazoka){
tileX=this.World.TileForWorld(bazoka.body.x)
tileX1=this.World.TileForWorld(bazoka.body.x+bazoka.width)
tileY=this.World.TileForWorld(bazoka.body.y)+1
tileY1=this.World.TileForWorld(bazoka.body.y+bazoka.height)-1

if(bazoka.body.x<=0||bazoka.body.x>=this.game.width||bazoka.body.y<=0||bazoka.body.y>=this.game.height){
	
			this.World.BazokaGroup.removeChild(bazoka)
			bazoka.destroy()
			console.log('removed')
			return

}

	try{
		for(var i=tileX;i<=tileX1;i++){
			if(!this.World.isWalkable(this.World.data[i][tileY])){
				this.World.destoryCircle(bazoka.radious, i, tileY)
				this.World.BazokaGroup.removeChild(bazoka)
				bazoka.destroy()
				return
			}
		}

		for(var i=tileX;i<=tileX1;i++){

			if(!this.World.isWalkable(this.World.data[i][tileY1])){
				this.World.destoryCircle(bazoka.radious, i, tileY1)
				this.World.BazokaGroup.removeChild(bazoka)
				bazoka.destroy()
				return
			}
		}

		for(var i=tileY;i<=tileY1;i++){
			if(!this.World.isWalkable(this.World.data[tileX][i])){
				this.World.destoryCircle(bazoka.radious, tileX, i)
				this.World.BazokaGroup.removeChild(bazoka)
				bazoka.destroy()
				return
			}
		}

		for(var i=tileY;i<=tileY1;i++){
				if(!this.World.isWalkable(this.World.data[tileX1][i])){
					this.World.destoryCircle(bazoka.radious, tileX1, i)
					this.World.BazokaGroup.removeChild(bazoka)
					bazoka.destroy()
					return
				}
		}
}catch(e){

}

	
}