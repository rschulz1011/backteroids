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

   	if (playerData.playerStats.shipStats[id].e > 0) {

    	shipTitleText = game.add.text(tileWidth/2,12,ship.name,{font: "10px Arial",fill:"#ffffff"});
    	shipTitleText.anchor.x = 0.5;
    	shipTitleText.anchor.y = 0.5;

    	killsText = game.add.text(tileWidth/2,tileWidth-4,"Kills: "+playerData.playerStats.shipStats[id].k,{font: "9px Arial",fill:"#999999"});
    	killsText.anchor.x = 0.5;
    	killsText.anchor.y = 0.5;

    	var shipSprite = ships.create(tileWidth/2,tileWidth/2,ship.imageKey);
    	shipSprite.anchor.x = 0.5;
    	shipSprite.anchor.y = 0.5;
    	shipSprite.angle = Math.random() * 360;

    	tileSprite.addChild(shipSprite);
    	tileSprite.addChild(shipTitleText);
    	tileSprite.addChild(killsText);
    	shipSprite.bringToTop();

    	var maxShipSize = Math.max(shipSprite.width,shipSprite.height);

    	var shipInfoTooltip = new tooltip(game,x-40,y-20,150,160,function(group){
    		var infoText = group.addChild(game.add.text(92,15,ship.name,{font: "16px bold Arial", fill:"#ffffff"}));
			infoText.anchor.x = 0.5;
			infoText.anchor.y = 0.5;

			var tooltipShipSprite = group.addChild(game.add.sprite(30,30,ship.imageKey));
			tooltipShipSprite.anchor.x = 0.5;
			tooltipShipSprite.anchor.y = 0.5;

			if (maxShipSize > 30) {
    			tooltipShipSprite.width = tooltipShipSprite.width * 30/maxShipSize;
    			tooltipShipSprite.height = tooltipShipSprite.height * 30/maxShipSize;
    		}

    		var statsTextStyle = {font: "12px bold Arial", fill: "#ffffff"};
    		var infoTextStyle = {font: "9px Arial", fill:"#000000"};

    		var killsText = group.addChild(game.add.text(115,25,"Kills:",statsTextStyle));
    		killsText.anchor.x = 1;
    		var killsNum = group.addChild(game.add.text(120,25,playerData.playerStats.shipStats[id].k,statsTextStyle));
    		killsNum.anchor.x = 0;

    		var encounterText = group.addChild(game.add.text(115,40,"Encountered:",statsTextStyle));
    		encounterText.anchor.x = 1;
    		var encounterNum = group.addChild(game.add.text(120,40,playerData.playerStats.shipStats[id].e,statsTextStyle));
    		encounterNum.anchor.x = 0;

    		var fireRateText = group.addChild(game.add.text(50,60,"Fire Rate:",infoTextStyle));
    		fireRateText.anchor.x = 1;
    		var fireRateNum = group.addChild(game.add.text(52,60,ship.fireRate,infoTextStyle));
    		fireRateNum.anchor.x = 0;

    		var bulletSpeedText = group.addChild(game.add.text(50,75,"Bullet Vel:",infoTextStyle));
    		bulletSpeedText.anchor.x = 1;
    		var bulletSpeedNum = group.addChild(game.add.text(52,75,ship.bulletVelocity,infoTextStyle));
    		bulletSpeedNum.anchor.x = 0;

    		var shieldsText = group.addChild(game.add.text(50,90,"Shields:",infoTextStyle));
    		shieldsText.anchor.x = 1;
    		var shieldNum = group.addChild(game.add.text(52,90,ship.maxShields,infoTextStyle));
    		shieldNum.anchor.x = 0;

    		var turnRateText = group.addChild(game.add.text(120,60,"Turn Rate:",infoTextStyle));
    		turnRateText.anchor.x = 1;
    		var turnRateNum = group.addChild(game.add.text(122,60,ship.maxTurnRate,infoTextStyle));
    		turnRateNum.anchor.x = 0;

    		var thrustText = group.addChild(game.add.text(120,75,"Thrust:",infoTextStyle));
    		thrustText.anchor.x = 1;
    		var thrustNum = group.addChild(game.add.text(122,75,ship.enginePower,infoTextStyle));
    		thrustNum.anchor.x = 0;

    		var warpsText = group.addChild(game.add.text(120,90,"Warps:",infoTextStyle));
    		warpsText.anchor.x = 1;
    		var warpsNum = group.addChild(game.add.text(122,90,ship.warps,infoTextStyle));
    		warpsNum.anchor.x = 0;


    		var specialWeaponsTitle = group.addChild(game.add.text(75,105,"Special Weapons:",{font:"11px bold Arial"}));
    		specialWeaponsTitle.anchor.x = 0.5;

    		specialWeaponsText = {
    			bullet: "Cannon",
    			missile: "Missle Launcher",
    			bomb: "Bomb Bay",
    			fighterBay: "Fighter Bay",
    		};

    		if (ship.extraWeapons === undefined) {
    			var noneText = group.addChild(game.add.text(75,119,"None",infoTextStyle));
    			noneText.anchor.x = 0.5;
    		}
    		else
    		{
    			for (var i=0; i<ship.extraWeapons.length; i++) {

    				var xpos;
    				var ypos;
    				if (ship.extraWeapons.length-i > 1 || ship.extraWeapons.length % 2 === 0) {
    					xpos = i%2;
    				}
    				else {
    					xpos = 0.5;
    				}
    				ypos = Math.floor(i/2);

    				var weaponText = group.addChild(game.add.text(38+xpos*75,119+12*ypos, specialWeaponsText[ship.extraWeapons[i].type],infoTextStyle));
    				weaponText.anchor.x = 0.5;
    			}
    		}

    	});

    	shipInfoTooltip.link(shipSprite);

    	if (maxShipSize > 42) {
    		shipSprite.width = shipSprite.width * 42/maxShipSize;
    		shipSprite.height = shipSprite.height * 42/maxShipSize;
    	}

    	if (playerData.playerStats.shipStats[id].k > 0)
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