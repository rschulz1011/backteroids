var beastiary = function(game){};

beastiary.prototype = {

	preload: function() {
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
		game.load.image('unknown','res/QuestionMark.png');
		preLoadButtons();
	},

	create: function() {
		addMuteButton(765,30);
		createNavigationButtons("Beastiary");

		topText = game.add.text(400,55,"Beastiary",{fill:"#ffffff"});
		topText.anchor.x = 0.5;
		topText.anchor.y = 0.5;

		displayTotalScore();
		calculatePlayerLevel(gameData);
		displayPlayerLevel();

		ships = game.add.group();
		ships.enableBody = true;
		ships.allowRotation = true;

		tiles = game.add.group();

		graphics = game.add.graphics(0, 0);

		$.getJSON( "gameData.json", function( data ) {
			gameData = data;
			shipTypeIndex = 0;
			$.each(gameData.shipTypes,function(index,shipType) {
				var tileWidth = 70;
				xid = shipTypeIndex % 7;
				yid = Math.floor(shipTypeIndex/7);
				drawBeastiaryEntry(155+xid*tileWidth,90+yid*tileWidth,shipType,index);
				shipTypeIndex++;
			});
		})
		.fail(function(jqxhr, textStatus, error){
			var err = textStatus + ", " + error;
		});
	},

	update:  function () {}
}

function drawBeastiaryEntry(x,y,ship,id)
{
	var tileWidth = 70;

	var bmd = game.add.bitmapData(tileWidth,tileWidth);

   	bmd.ctx.beginPath();
   	bmd.ctx.rect(0,0,tileWidth,tileWidth);
   	bmd.ctx.fillStyle = '#050505';
   	bmd.ctx.lineStyle = '#222222';
   	bmd.ctx.fill();

   	var tileSprite = tiles.create(x,y,bmd);

   	if (playerData.playerStats.shipStats[id].encountered > 0) {

    	shipTitleText = game.add.text(x+tileWidth/2,y+12,ship.name,{font: "10px Arial",fill:"#ffffff"});
    	shipTitleText.anchor.x = 0.5;
    	shipTitleText.anchor.y = 0.5;

    	killsText = game.add.text(x+tileWidth/2,y+tileWidth-4,"Kills: "+playerData.playerStats.shipStats[id].kills,{font: "9px Arial",fill:"#999999"});
    	killsText.anchor.x = 0.5;
    	killsText.anchor.y = 0.5;

    	var shipSprite = ships.create(tileWidth/2,tileWidth/2,ship.imageKey);
    	shipSprite.anchor.x = 0.5;
    	shipSprite.anchor.y = 0.5;
    	shipSprite.angle = Math.random() * 360;

    	tileSprite.addChild(shipSprite);
    	shipSprite.bringToTop();

    	var maxShipSize = Math.max(shipSprite.width,shipSprite.height);

    	if (maxShipSize > 42) {
    		shipSprite.width = shipSprite.width * 42/maxShipSize;
    		shipSprite.height = shipSprite.height * 42/maxShipSize;
    	}

    	if (playerData.playerStats.shipStats[id].kills > 0)
    	{
    		shipSprite.body.angularVelocity = Math.random() * 10 - 5;
    	}
    	else
    	{
    		shipSprite.alpha = 0.15;
    		shipTitleText.alpha = 0.25;
    		killsText.alpha = 0.25;
    	}
	} 
	else 
	{
		var unknownSprite = game.add.sprite(tileWidth/2,tileWidth/2,'unknown');
		unknownSprite.anchor.x = 0.5;
		unknownSprite.anchor.y = 0.5;
		tileSprite.addChild(unknownSprite);
	}


}