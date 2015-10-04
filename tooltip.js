function tooltip(game,x,y,width,height,content)
{
	this.game = game;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.content = content;

	 this.show = function() {
	 	this.game.add.tween(graphics).to({alpha:0.95},700,Phaser.Easing.Quadratic.Out,true);
	 	this.game.add.tween(this.tooltipGroup).to({alpha:0.95},700,Phaser.Easing.Quadratic.Out,true);
	 	this.game.world.bringToTop(this.tooltipGroup);
    };

    this.hide = function() {
	 	this.game.add.tween(graphics).to({alpha:0},700,Phaser.Easing.Quadratic.Out,true);
	 	this.game.add.tween(this.tooltipGroup).to({alpha:0},700,Phaser.Easing.Quadratic.Out,true);
    };

    this.link = function(sprite) {
    	sprite.inputEnabled = true;
		sprite.events.onInputOver.add(function(){
			this.show();
		},this);
		sprite.events.onInputOut.add(function(){
			this.hide();
		},this);
    }

    this.unlink = function(sprite) {
    	sprite.events.onInputOver.removeAll();
    	sprite.events.onInputOut.removeAll();
    }

	var graphics = game.add.graphics(this.x, this.y);
	graphics.lineStyle(2, 0x888888, 1);
	graphics.beginFill(0x444444, 1);
    graphics.drawRect(0,0,this.width,this.height);
    graphics.alpha = 0;

    this.tooltipGroup = graphics.addChild(game.add.group());
  	this.content(this.tooltipGroup);
  	this.tooltipGroup.alpha = 0;

}