Fire=function(x,y,key,game,time){
	Phaser.Sprite.call(this,game,x,y,key);
	this.anchor.setTo(0.5,0.5);
	game.add.existing(this);
	this.time=time;
	this.animations.add('loop',[0,1,2,3,4,5,6,7],10,true);
	this.animations.play('loop');
	game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
	this.numT=0;
}

Fire.prototype=Object.create(Phaser.Sprite.prototype);
Fire.prototype.constructor=Fire;
