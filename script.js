clearColor = '#c3ffff'
brownColor = '#aa7941'
stoneColor1 = '#a0a0a0'



function TWorld(game,tileSize){
	this.game=game;
	this.tileSize=tileSize;
	this.data=null;
	this.d=null;
	
}
TWorld.prototype.getData=function(){
	return this.data;
}
TWorld.prototype.loadImage=function(){
	this.land = this.game.add.bitmapData(800, 600);
	this.game.add.sprite(0,0,this.land);
    //this.land.draw('land');
    //this.land.update();
    //this.land.addToWorld();
    
	var img = game.cache.getImage('land');
    var canvas = document.createElement('canvas');
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    var pixelData = canvas.getContext('2d').getImageData(0, 0, img.width, img.height).data;
   // document.body.appendChild(canvas);
   // Phaser.Canvas.addToDOM(canvas, parent, overflowHidden)
    var sprite = game.add.sprite(0, 0, this.land)
	var pixelData=canvas.getContext('2d').getImageData(0,0,img.width,img.height).data;
	this.data=new Array(img.width);
	this.width=600/this.tileSize;
	this.height=800/this.tileSize;
	

	
	this.futureData=new Array(img.height);
	for (var x = 0; x< img.width; x++) {
		this.data[x]=new Array(img.width);
		this.futureData[x]=new Array(img.width);
		for(var y =0;y<img.height;y++){
			var red = pixelData[((img.width * y) + x) * 4]
			var  green = pixelData[((img.width * y) + x) * 4 + 1]
			var  blue = pixelData[((img.width * y) + x) * 4 + 2]
			var alpha = pixelData[((img.width * y) + x) * 4 + 3]
			var hex = Helper.rgbToHex(red, green, blue);
			this.data[x][y]=hex;
			this.futureData[x][y]=hex;
			this.land.ctx.fillStyle = hex
   			this.land.ctx.fillRect(4 * x, 4 * y, 4, 4)
   			this.land.dirty=true;
   			//console.log(hex);
		}	

	}
	
	//var PhysicalSystem=new PhysicsWorld(game, this, this.dude);
//		game.plugins.add(PhysicalSystem);


}
TWorld.prototype.x=10;
TWorld.prototype.isWalkable=function(hexColor){
	console.log(hexColor +" "+ clearColor);
	return hexColor  ==clearColor;
}

TWorld.prototype.render=function(force=false){
	for (var x=0;x<this.width;x++){
		for (var y=0;y<this.height;y++){

			if(this.data[x][y]!=this.futureData[x][y]||force){
				this.data[x][y]=this.futureData[x][y];
				this.drawTile(this.data[x][y],x,y);
				this.land.dirty=true;;
				console.log("renderd");
			}	
		}
	}

}

TWorld.prototype.drawTile=function(color,x,y){
	this.land.ctx.fillStyle = color
   	this.land.ctx.fillRect(4 * x, 4 * y, 4, 4)

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
				
				console.log("destroed");
			}
		}
	}
	this.render();
}


function PhysicsWorld(game,TWorld,charcter){
	this.game=game;
	this.TWorld=TWorld;
	this.charcter=charcter;
	console.log(charcter);
}
PhysicsWorld.prototype=Phaser.Plugin

PhysicsWorld.prototype.update=function(){

	this.checkCharcterCollison (this.charcter);

}

PhysicsWorld.prototype.postUpdate=function(){

}

PhysicsWorld.prototype.checkCharcterCollison=function(charcter){

	var tileX = this.TWorld.TileForWorld(this.charcter.body.x + (this.charcter.width/2 ))
    tileX = Phaser.Math.clamp(tileX, 0, this.TWorld.width-1)
    var tileY = this.TWorld.TileForWorld(this.charcter.body.y + this.charcter.height)
    tileY = Phaser.Math.clamp(tileY, 0, this.TWorld.height-1)
    tileHexColor = this.TWorld.data[tileX][tileY]

		console.log(tileX+" "+tileY)
	// if(!this.TWorld.isWalkable(this.TWorld.data[tileX+1][tileY-1])){
	// 	charcter.body.velocity=0;
	// 	console.log("1");

	// }
	//  if(!this.TWorld.isWalkable(this.TWorld.data[tileX-1][tileY-1])){
	// 	charcter.body.velocity=0;
	// 	console.log("2");
	// }
	// 
	// 
	// 
	// 
	if(!this.TWorld.isWalkable(this.TWorld.data[tileX+1][tileY-1])||
		!this.TWorld.isWalkable(this.TWorld.data[tileX+2][tileY-1])||
		!this.TWorld.isWalkable(this.TWorld.data[tileX+3][tileY-1])){
			if(charcter.body.velocity.x>0){
				charcter.body.velocity.x=0;
			console.log('cant go right');
			}
	}
	if(!this.TWorld.isWalkable(this.TWorld.data[tileX-1][tileY-1])||
		!this.TWorld.isWalkable(this.TWorld.data[tileX-2][tileY-1])||
		!this.TWorld.isWalkable(this.TWorld.data[tileX-3][tileY-1])){
			if(charcter.body.velocity.x<0){
				charcter.body.velocity.x=0;
			console.log('cant go left');
			}
	}
	
	if(this.TWorld.isWalkable(tileHexColor)){
		//charcter.body.velocity.x=50;
		charcter.body.acceleration.y=100;
	}
	 
	else{
		charcter.body.acceleration.y=0;
		charcter.body.velocity.y=0;
		//charcter.body.velocity.x=0;
		var highestTire=this.TWorld.highestNonFreeTile(tileX, tileY);
		if( highestTire>tileY-5){
			charcter.body.y=highestTire*4-charcter.height+1;
		}else{
			charcter.body.y=tileY*4-charcter.height+1;
		}

	}


}
