Bazoka=function(x,y,key,game,radious){
	Phaser.Sprite.call(this,game,x,y,key);
	this.anchor.setTo(0.5,0.5);
	game.add.existing(this);
	this.radious=radious
	game.physics.arcade.enable(this, Phaser.Physics.ARCADE)

	
}

Bazoka.prototype=Object.create(Phaser.Sprite.prototype);
Bazoka.prototype.constructor=Bazoka;


