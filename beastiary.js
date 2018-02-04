var beastiary = function(game){};

beastiary.prototype = {

	preload: function() {
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
		preLoadButtons();
	},

	create: function() {
		addMuteButton(765,30);
		createNavigationButtons("Beastiary");

		topText = game.add.text(400,55,"Beastiary",{fill:"#ffffff"});
		topText.anchor.x = 0.5;
		topText.anchor.y = 0.5;

		drawBeastiaryEntry(165,90,0);

		displayTotalScore();
		calculatePlayerLevel(gameData);
		displayPlayerLevel();

		$.getJSON( "gameData.json", function( data ) {
			gameData = data;
			shipTypeIndex = 0;
			$.each(gameData.shipTypes,function(index,shipType) {
				var tileWidth = 70;
				xid = shipTypeIndex % 7;
				yid = Math.floor(shipTypeIndex/7);
				drawBeastiaryEntry(155+xid*tileWidth,90+yid*tileWidth,shipType);
				shipTypeIndex++;
			});
		})
		.fail(function(jqxhr, textStatus, error){
			var err = textStatus + ", " + error;
		});
	},
}

function drawBeastiaryEntry(x,y,ship)
{
	var tileWidth = 70;
	var graphics = game.add.graphics(0, 0);
	//draw box around achievement
	graphics.lineStyle(1, 0x222222, 1);
	graphics.beginFill(0x050505, 1);
    graphics.drawRect(x,y,70,70);

    shipTitleText = game.add.text(x+tileWidth/2,y+10,ship.name,{font: "10px Arial",fill:"#ffffff"});
    shipTitleText.anchor.x = 0.5;
    shipTitleText.anchor.y = 0.5;
}