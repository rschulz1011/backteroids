var playLevel = function(game) {

	rockAnchor = new Phaser.Point();
	launchLine = new Phaser.Line();
	drawLine = false;

	maxRocks = null;
	numKills = 0;

	rocksLeft = null;

	threatThreshold = 35;

	gameOver = false;

	gameData = null;
	level = null;
	wave = 0;
	numWaves = null;

	

	levelScore = 0;
	detailedScore = {};
	detailedScore.totalKills = 0;
	detailedScore.quickKills = 0;
	detailedScore.instantKills = 0;
	detailedScore.directHits = 0;
	detailedScore.basePoints = 0;
	detailedScore.quickKillPoints = 0;
	detailedScore.instantKillPoints = 0;
	detailedScore.directHitPoints = 0;
	detailedScore.goodiesCollected = 0;
	detailedScore.goodieScore = 0;
	detailedScore.warpsForced = 0;
	detailedScore.shieldsDepleted = 0;

	difficultyValues = null;
	difficultyMultiplier = 1.0;
	bonusMultiplier = 1.0;

	waveGroup = [];
	adjustedWaves = [];
}

playLevel.prototype = {

	init: function(levelData) {
		level = levelData.selectedLevel;
		difficultyValues = levelData.difficultyValues;
	},

	preload: function() {
		loadShipSprites();
		game.load.image('space','res/space.png');
		game.load.image('rockMedium','res/medium_rock.png');
		game.load.image('rockSmall','res/small_rock.png');
		game.load.image('rockLarge','res/large_rock.png');
		game.load.spritesheet('kaboom', 'res/explode.png', 128,128);
		game.load.spritesheet('ion_kaboom','res/ion_explosion.png',100,100);
		game.load.spritesheet('warp','res/warp.png',50,50);
		game.load.image('bullet','res/bullet.png');
		game.load.spritesheet('rockButton','res/rock_button.png',50,50);
		game.load.spritesheet('convergeButton','res/converge_button.png',50,50);
		game.load.spritesheet('pauseButton','res/pause_button.png',30,20);
		game.load.spritesheet('exitButton','res/exit_button.png',30,20);
		game.load.spritesheet('confuseButton','res/confuse_button.png',50,50);
		game.load.spritesheet('stunButton','res/stun_button.png',50,50);
		game.load.spritesheet('ufoButton','res/ufo_button.png',50,50)
		game.load.spritesheet('healthbar','res/healthbar.png',10,3);
		game.load.image('confuse','res/confuse_sprite.png');
		game.load.image('stun','res/stun_sprite.png');
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
		game.load.image('waveIndicator','res/wave_indicator.png');
		game.load.image('bomb','res/bomb.png');
		game.load.image('missile','res/missile.png');
		game.load.image('ufoBullet','res/ufo_bullet.png');
		game.load.image('ufo','res/ufo.png');
		game.load.spritesheet('bombExplosion','res/bomb_explosion.png',150,150);
		game.load.image('goodie','res/goodie.png');
	},

	create: function() {

		playerData.recharge = {};
		recharge = {};

		setUpgrades(playerData);
		maxRocks = playerData.maxRocks;
		maxConverge = playerData.maxConverge;
		maxConfuse = playerData.maxConfuse;
		maxStun = playerData.maxStuns;
		maxUfo = playerData.numUfos;
		stunTime = playerData.stunTime;
		stunShields = playerData.stunShields;
		numKills = 0;
		rocksLeft = maxRocks;
		convergeLeft = maxConverge;
		convergeSpeedup = playerData.convergeSpeedup;
		confuseLeft = maxConfuse;
		confuseTime = playerData.confuseTime;
		rockSplit = playerData.rockSplit;
		stunLeft = maxStun;
		ufoLeft = maxUfo;
		goodieChance = playerData.goodieDropChance;
		goodieValue = 25;
		directHitBonus = playerData.directHitBonus;
		instantKillBonus = playerData.instantKillBonus;
		convergeFollow = playerData.convergeFollow;
		rockDamage = playerData.rockDamage;

		shipStats = {};

		//set recharge timers
		recharge.rocks = {};
		if (playerData.recharge.rocks !== null)
		{
			recharge.rocks.max = playerData.recharge.rocks * 1000;
			recharge.rocks.timer = playerData.recharge.rocks * 1000;
		}
		else
		{
			recharge.rocks.max = null;
		}
		recharge.randomRocks = {};
		if (playerData.recharge.randomRocks !== null)
		{
			recharge.randomRocks.max = playerData.recharge.randomRocks * 1000;
			recharge.randomRocks.timer = recharge.randomRocks.max;
		}
		else
		{
			recharge.randomRocks.max = null;
		}
		recharge.ufo = {};
		if (playerData.recharge.ufo !== null)
		{
			recharge.ufo.max = playerData.recharge.ufo * 1000;
			recharge.ufo.timer = recharge.ufo.max;
		}
		else
		{
			recharge.ufo.max = null;
		}
		recharge.stun = {};
		if (playerData.recharge.stun != null)
		{
			recharge.stun.max = playerData.recharge.stun * 1000;
			recharge.stun.timer = recharge.stun.max;
		}
		recharge.confuse = {};
		if (playerData.recharge.confuse != null)
		{
			recharge.confuse.max = playerData.recharge.confuse * 1000;
			recharge.confuse.timer = recharge.confuse.max;
		}
		recharge.converge = {};
		if (playerData.recharge.converge != null)
		{
			recharge.converge.max = playerData.recharge.converge * 1000;
			recharge.converge.timer = recharge.converge.max;
		}
		convergeFollowTimer = 0;


		
		wave = 0;
		rockAnchor.x = 0;
		rockAnchor.y = 0;
		drawLine = false;
		shipFireMultiplier = 1 + difficultySetting.fireRate.value(difficultyValues.fireRate) * .01;
		shipSpeedMultiplier = 1 + difficultySetting.shipSpeed.value(difficultyValues.shipSpeed) * .01;
		shipShieldsMultiplier = 1 + difficultySetting.shipStrength.value(difficultyValues.shipStrength) * .01;
		extraShips = difficultySetting.extraShips.value(difficultyValues.extraShips);
		safeRadiusFactor = playerData.safeRadius;

		ufoFireRate = playerData.ufoFireRate;
		ufoHitPoints = playerData.ufoShield;
		ufoAccuracy = 0.20 - playerData.ufoAccuracy * 0.04;
		ufoEvasion = playerData.ufoEvasion;


		levelScore = 0;

		detailedScore = {};
		detailedScore.totalKills = 0;
		detailedScore.quickKills = 0;
		detailedScore.instantKills = 0;
		detailedScore.directHits = 0;
		detailedScore.basePoints = 0;
		detailedScore.quickKillPoints = 0;
		detailedScore.instantKillPoints = 0;
		detailedScore.directHitPoints = 0;
		detailedScore.goodiesCollected = 0;
		detailedScore.goodieScore = 0;
		detailedScore.warpsForced = 0;
		detailedScore.shieldsDepleted = 0;

		game.add.sprite(0,0,'space');

		$.getJSON( "gameData.json", function( data ) {
			gameData = data;
			numWaves = gameData.levels[level].waves.length;
			adjustedWaves = addExtraWaves(gameData.levels[level].waves,difficultySetting.numWaves.value(difficultyValues.numWaves));
			numWaves = adjustedWaves.length;
			setWave(gameData,wave);
			drawWaveIndicators(gameData,adjustedWaves);
		})
		.fail(function(jqxhr, textStatus, error){
			var err = textStatus + ", " + error;
		});

		difficultyMultiplier = 1.0;
		$.each(difficultySetting,function(index,control){
			difficultyMultiplier = difficultyMultiplier * control.multiplier(difficultyValues[index]);
		})

		bonusMultiplier = playerData.bonusMultiplier;

		rocks = game.add.group();
		rocks.enableBody = true;
		rocks.allowRotation = true;

		game.input.onDown.add(rockClick, this);
		game.input.onUp.add(rockRelease, this);
		game.input.addMoveCallback(rockStretch, this);

		ships = game.add.group();
		ships.enableBody = true;
		ships.allowRotation = true;

		ufos = game.add.group();
		ufos.enableBody = true;

		goodies = game.add.group();
		goodies.enableBody = true;
		goodies.allowRotation = true;

		explosions = game.add.group();
		explosion = explosions.create(0,0,'kaboom');
		explosion.animations.add('kaboom');
		explosion.anchor.setTo(0.5,0.5);
		explosions.remove(explosion);
		ionExplosion = explosions.create(0,0,'ion_kaboom');
		ionExplosion.animations.add('ion_kaboom');
		ionExplosion.anchor.setTo(0.5,0.5);
		explosions.remove(ionExplosion);
		bombExplosion = explosions.create(0,0,'bombExplosion');
		bombExplosion.animations.add('bombExplosion');
		bombExplosion.anchor.setTo(0.5,0.5);
		explosions.remove(bombExplosion);

		warps = game.add.group();

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.allowRotation = true;

		ufoBullets = game.add.group();
		ufoBullets.enableBody = true;
		ufoBullets.allowRotation = true;

		var text = getScoreLine();
		var style = { font: "15px Arial", fill: "#ffffff", align: "left" };
		scoreText = game.add.text(10,20,text,style);

		rockButton = game.add.button(20,gameHeight-70,'rockButton',buttonClick,this,2,0,1,1);
		//Add recharge timer
		recharge.rocks.sprite =  game.add.sprite(20,gameHeight-18,'healthbar');
		recharge.rocks.sprite.width = 0;
		recharge.rocks.sprite.height = 5;

		pauseButton = game.add.button(gameWidth-35,5,'pauseButton',pauseGame,this,2,0,1,1);
		addMuteButton(gameWidth-70,5);
		exitButton = game.add.button(gameWidth-105,5,'exitButton',exitLevel,this,2,0,1,1);

		var rocksLeftStyle = {font: "30px Arial", fill: "#ffffff", align: "center"};
		rocksLeftText = game.add.text(35,gameHeight-60,""+rocksLeft,rocksLeftStyle);
		
		if (maxConverge>0)
		{
			convergeButton = game.add.button(80,gameHeight-70,'convergeButton',convergeRocks,this,2,0,1,1);
			convergeLeftText = game.add.text(95,gameHeight-60,""+convergeLeft,rocksLeftStyle);
			keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    		keyW.onDown.add(convergeRocks,this);

    		recharge.converge.sprite = game.add.sprite(80,gameHeight-18,'healthbar');
    		recharge.converge.sprite.width = 0;
    		recharge.converge.sprite.height = 5;
		}

		if (maxConfuse>0)
		{
			confuseButton = game.add.button(140,gameHeight-70,'confuseButton',confuseShips,this,2,0,1,1);
			confuseLeftText = game.add.text(155,gameHeight-60,""+confuseLeft,rocksLeftStyle);
			keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
    		keyE.onDown.add(confuseShips,this);

    		recharge.confuse.sprite = game.add.sprite(140,gameHeight-18,'healthbar');
    		recharge.confuse.sprite.width = 0;
    		recharge.confuse.sprite.height = 5;
		}

		if (maxStun>0)
		{
			stunButton = game.add.button(200,gameHeight-70,'stunButton',stunShips,this,2,0,1,1);
			stunLeftText = game.add.text(215,gameHeight-60,""+stunLeft,rocksLeftStyle);
			keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
    		keyR.onDown.add(stunShips,this);

    		recharge.stun.sprite = game.add.sprite(200,gameHeight-18,'healthbar');
    		recharge.stun.sprite.width = 0;
    		recharge.stun.sprite.height = 5;
		}
		//TODO: Anchor text and center and add alpha

		if (maxUfo>0)
		{
			ufoButton = game.add.button(260,gameHeight-70,'ufoButton',createUfo,this,2,0,1,1);
			ufoLeftText = game.add.text(275,gameHeight-60,""+ufoLeft,rocksLeftStyle);
			keyU = game.input.keyboard.addKey(Phaser.Keyboard.U);
    		keyU.onDown.add(createUfo,this);

    		recharge.ufo.sprite =  game.add.sprite(260,gameHeight-18,'healthbar');
			recharge.ufo.sprite.width = 0;
			recharge.ufo.sprite.height = 5;
		}

		game.rockLoaded = null;
		game.mouseSprite = null;

		keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    	keyQ.onDown.add(buttonClick, this);

    	keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
    	keyP.onDown.add(pauseGame, this);

    	keyEsc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    	keyEsc.onDown.add(exitLevel, this);

		//TODO: Remove world's easiest cheat code before release
    	keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
    	keyC.onDown.add(function(){maxRocks = 99; rocksLeft = 99;},this)

    	game.input.onDown.add(unpauseGame, self);

    	exitLevelTooltip = new tooltip(game,gameWidth/2-150,gameHeight/2-50,300,100,function(group){
			tooltipInfoTextStyle = {font: "13px Arial", stroke: "bold", fill: "#ffffff",wordWrap: true, wordWrapWidth: 250};
			var infoText = group.addChild(game.add.text(150,30,"Are you sure you want to exit this level?",tooltipInfoTextStyle));
			infoText.anchor.x = 0.5;
			infoText.anchor.y = 0.5;

			var exitButton = group.addChild(game.add.button(20,55,"button_blank",exitLevelClick,this,1,0,1,0));
			var buttonText = group.addChild(game.add.text(75,73,"EXIT",{font: "18px Arial", stroke: "bold", fill: "#ffffff"}));
			buttonText.anchor.x = 0.5;
			buttonText.anchor.y = 0.5;

			var resumeButton = group.addChild(game.add.button(160,55,"button_blank",exitLevelClick,this,1,0,1,0));
			var buttonText = group.addChild(game.add.text(215,73,"RESUME",{font: "18px Arial", stroke: "bold", fill: "#ffffff"}));
			buttonText.anchor.x = 0.5;
			buttonText.anchor.y = 0.5;
		});
	},

	update: function() {
		var wrapThreshold = 10;
		rocks.forEachAlive(function(rock)
		{
			if (rock.x > gameWidth + wrapThreshold)
			{
				rock.x = -wrapThreshold;
				rock.directHit = false;
			}

			if (rock.x < -wrapThreshold)
			{
				rock.x = gameWidth + wrapThreshold;
				rock.directHit = false;
			}

			if (rock.y < -wrapThreshold)
			{
				rock.y = gameHeight + wrapThreshold;
				rock.directHit = false;
			}

			if (rock.y > gameHeight + wrapThreshold)
			{
				rock.y = -wrapThreshold;
				rock.directHit = false;
			}

		});

		ships.forEachAlive(function(ship){
			if (ship.x > gameWidth + wrapThreshold)
			{
				ship.x = -wrapThreshold;
			}
			if (ship.x < -wrapThreshold)
			{
				ship.x = gameWidth + wrapThreshold;
			}
			if (ship.y < -wrapThreshold)
			{
				ship.y = gameHeight + wrapThreshold;
			}
			if (ship.y > gameHeight + wrapThreshold)
			{
				ship.y = -wrapThreshold;
			}
		});

		ufos.forEachAlive(function(ship){
			if (ship.x > gameWidth + wrapThreshold)
			{
				ship.x = -wrapThreshold;
			}
			if (ship.x < -wrapThreshold)
			{
				ship.x = gameWidth + wrapThreshold;
			}
			if (ship.y < -wrapThreshold)
			{
				ship.y = gameHeight + wrapThreshold;
			}
			if (ship.y > gameHeight + wrapThreshold)
			{
				ship.y = -wrapThreshold;
			}
		});

		bullets.forEach(function(bullet){

			if ( bullet && (bullet.x > gameWidth + wrapThreshold || bullet.x < -wrapThreshold ||
				bullet.y > gameHeight + wrapThreshold || bullet.y < -wrapThreshold))
			{
				bullets.remove(bullet);
				bullet.kill();
			}

			if (bullet && bullet.type == 'missile')
			{
				if (bullet.target == null || !bullet.target.alive)
				{
					targetMissile(bullet);
				}
				steerMissile(bullet);
			} 

		});

		ufoBullets.forEach(function(bullet){
			if ( bullet && (bullet.x > gameWidth + wrapThreshold || bullet.x < -wrapThreshold ||
				bullet.y > gameHeight + wrapThreshold || bullet.y < -wrapThreshold))
			{
				ufoBullets.remove(bullet);
				bullet.kill();
			}
		});

		game.physics.arcade.overlap(rocks,ships,shipHit);

		game.physics.arcade.overlap(rocks,bullets,rockHit);

		game.physics.arcade.overlap(ufos,bullets,ufoHit);

		game.physics.arcade.overlap(ufoBullets,ships,shipHit);

		goodies.forEach(function(goodie){
			if (goodie !== undefined)
			{
				moveGoodie(goodie);
			}
			else if (goodie !== undefined && goodie.alpha == 0)
			{
				goodies.remove(goodie);
				goodie.kill();
			}
		})

		if (gameOver==false)
		{
			ships.forEachAlive(function(ship){

				if (ship.shieldBar !== null){
					ship.shields = Math.min(ship.maxShields,ship.shields + ship.rechargeRate * game.time.physicsElapsedMS/1000);
					ship.shieldBar.x = ship.x;
					ship.shieldBar.y = ship.y - ship.height/2-2;
					ship.shieldBar.width = ship.shields / ship.maxShields * ship.width;
					ship.shieldBar.frame = Math.floor((1-ship.shields/ship.maxShields)*6);
					ionExplosion.x = ship.x;
					ionExplosion.y = ship.y;
				}

				addBullet(ship);

				//if (ship.currentTarget == null || !ship.currentTarget.alive)
				//{
				ship.currentTarget = getClosestRock(ship);
				//}

				if (ship.currentTarget != null | ship.confused >0 )
				{
					moveShip(ship);
				}
				else
				{
					throttle(ship,0);
					ship.angularVelocity = 0;
				}

			});

			ufos.forEachAlive(function(ufo){

				if (ufo.shieldBar !== null)
				{
					ufo.shieldBar.x = ufo.x;
					ufo.shieldBar.y = ufo.y - ufo.height/2-2;
					ufo.shieldBar.width = ufo.hitPoints / ufoHitPoints * ufo.width;
					ufo.shieldBar.frame = Math.floor((1-ufo.hitPoints/ufoHitPoints)*6);
				}

				moveUfo(ufo);
				addUfoBullet(ufo);
			});
	
			scoreText.text = getScoreLine();
			rocksLeftText.text = ""+rocksLeft;

			if (maxConverge>0)
			{
				convergeLeftText.text = ""+convergeLeft;
			}
			if (maxConfuse>0)
			{
				confuseLeftText.text = ""+confuseLeft;
			}
			if (maxStun>0)
			{
				stunLeftText.text = ""+stunLeft;
			}
			if (maxUfo>0)
			{
				ufoLeftText.text = ""+ufoLeft;
			}

			if (rocks.getFirstAlive() == null && rocksLeft == 0 && game.rockLoaded === null)
			{
				var performanceData = {};
				performanceData.kills = numKills;
				performanceData.success = false;
				performanceData.level = level;
				performanceData.score = Math.round(levelScore); 
				performanceData.detailedScore = detailedScore;
				performanceData.difficultyMultiplier = difficultyMultiplier;
				performanceData.bonusMultiplier = bonusMultiplier;
				performanceData.shipStats = shipStats;
				setTimeout(function(){
					this.game.state.start("LevelComplete",true,false,gameData,performanceData);
				},1000);
				
			}

			if (ufos.countLiving() > 0 || rocks.countLiving() > 1 || (rocks.countLiving()===1 && game.rockLoaded === null)) {
				decrementRechargeTimers();
			}

			steerRocks(false);

		}
	},

	render: function() {
		if (drawLine)
		{
			game.debug.geom(launchLine);
			ships.forEachAlive(function(ship){
			
				if (ship.drawCircle === true)
				{
					game.debug.geom(ship.circle,'#ff0000',false);	
				}
			});
		}
		else
		{
			launchLine.setTo(0,0,0,0);
			game.debug.geom(launchLine);
		}
	},

}

function exitLevel() {
	if (game.paused==false)
	{
		pauseGame();
	}
	exitLevelTooltip.showNow();
}

function exitLevelClick() {
	console.log('bye');
}

function createUfo() {

	if (ufoLeft > 0)
	{

		x = Math.random() > .50 ? Math.random()/8+.05 : 0.95 - Math.random()/8 ;
		y = Math.random() > .50 ? Math.random()/8+.05 : 0.95 - Math.random()/8 ;
    	ufo = ufos.create(gameWidth*x,gameHeight*y,'ufo');
	
		ufo.anchor.setTo(0.5,0.5);
		ufo.body.velocity.x = 0;
		ufo.body.velocity.y = 0;
		ufo.body.angularVelocity = 0;
		ufo.fireRate = ufoFireRate;
		ufo.hitPoints = ufoHitPoints;
		ufo.bulletTimer = Math.random() * ufoFireRate;
		ufo.bulletVelocity = 500;
	
		ufo.body.drag.x = 5;
		ufo.body.drag.y = 5;

		ufo.moveDirection = null; 
		ufo.moveTimer = null; 
		ufo.accelTimer = null;
		ufo.accelVal = null;
	
		ufo.hitPoints = ufoHitPoints;
	
		ufo.shieldBar = null;
		ufo.body.mass = 1;
		ufo.body.bounce = 0;
		ufo.body.maxVelocity = 50;

		var shieldBar = game.add.sprite(ufo.x,ufo.y-ufo.height/2-2,'healthbar');
		ufo.shieldBar = shieldBar;
		ufo.shieldBar.anchor.x = 0.5;
		ufo.shieldBar.height = 2;
		ufo.shieldBar.width = ufo.width;
		ufo.shieldBar.alpha = 0.7;
	
		ufoLeft--;

		var ufoSound = game.add.audio('ufo');
		ufoSound.play('',0.5,0.20,false);
		setTimeout(function(){ufoSound.fadeOut(1300);},1700);
		setTimeout(function(){ufoSound.destroy()},10000);
		return ufo;
	}
}

function moveUfo(ufo) {

	if (ufo.moveDirection === null || ufo.moveTimer === null || ufo.moveTimer < 0)
	{
		ufo.moveDirection = Math.random() * 2 * Math.PI;
		ufo.moveTimer = (1500 + Math.random() * 1500) / (ufoEvasion/1.5);
		ufo.accelTimer = ufo.moveTimer / (11-ufoEvasion*1.6);
		ufo.accelVal = 250 * (0.4 + Math.random()*0.6) * (ufoEvasion/.7);
	}

	if (ufo.accelTimer > 0)
	{
		ufo.body.acceleration.x = ufo.accelVal * Math.sin(ufo.moveDirection);
		ufo.body.acceleration.y = ufo.accelVal * Math.cos(ufo.moveDirection);
	}
	else
	{
		ufo.body.velocity.x = ufo.body.velocity.x / 1.5;
		ufo.body.velocity.y = ufo.body.velocity.y / 1.5;
	}

	ufo.moveTimer = ufo.moveTimer - game.time.physicsElapsedMS;
	ufo.accelTimer = ufo.accelTimer - game.time.physicsElapsedMS;
}

function addUfoBullet(ufo) {

	ufo.bulletTimer = ufo.bulletTimer - game.time.physicsElapsedMS;

	if (ufo.bulletTimer < 0)
	{
		ufo.bulletTimer = ufoFireRate;

		var bulletDirection = aimUfo(ufo);

		if (bulletDirection !== null)
		{
			var bullet = ufoBullets.create(ufo.position.x, ufo.position.y,'ufoBullet');
			bullet.body.velocity.y = ufo.bulletVelocity * Math.sin(bulletDirection*Math.PI/180);
			bullet.body.velocity.x = ufo.bulletVelocity * Math.cos(bulletDirection*Math.PI/180);
			bullet.body.rotation = bulletDirection;
			bullet.body.mass = .1;
			bullet.anchor.x = 0.5;
			bullet.anchor.y = 0.5;
		}
	}
}

function aimUfo(ufo) {
	var nShips = ships.countLiving();
	var targetShipNum = Math.floor(Math.random()*nShips);
	var targetShip = null;

	ships.forEachAlive(function(ship){
		if (targetShipNum == 0)
		{
			targetShip = ship;
		}
		else
		{
			targetShipNum--;
		}
	});

	if (targetShip !== null)
	{
		return (Math.atan2(targetShip.y - ufo.y , targetShip.x - ufo.x) + ((Math.random()-0.5) * ufoAccuracy * 2 )) * 180 / Math.PI ;
	}
	else
	{
		return null;
	}
}

function decrementRechargeTimers() {
	if (recharge.rocks.max !== null && rocksLeft < maxRocks)
	{
		recharge.rocks.timer = recharge.rocks.timer - game.time.physicsElapsedMS;
		if (recharge.rocks.timer < 0)
		{
			recharge.rocks.timer = recharge.rocks.max;
			rocksLeft = Math.min(rocksLeft+1,maxRocks);
		}
		recharge.rocks.sprite.width = 50 * (1- recharge.rocks.timer / recharge.rocks.max);
	}
	else
	{
		recharge.rocks.sprite.width = 0;
	}

	recharge.randomRocks.timer = recharge.randomRocks.timer - game.time.physicsElapsedMS;
	if (recharge.randomRocks.timer < 0)
	{
		createRandomRock();
		recharge.randomRocks.timer = recharge.randomRocks.max;
	}

	if (recharge.ufo.max !== null && ufoLeft < maxUfo)
	{
		recharge.ufo.timer = recharge.ufo.timer - game.time.physicsElapsedMS;
		if (recharge.ufo.timer < 0)
		{
			recharge.ufo.timer = recharge.ufo.max;
			ufoLeft = Math.min(ufoLeft+1,maxUfo);
		}
		recharge.ufo.sprite.width = 50 * (1- recharge.ufo.timer / recharge.ufo.max);
	}
	else if (maxUfo>0)
	{
		recharge.ufo.sprite.width = 0;
	}

	if (recharge.stun.max !== null && stunLeft < maxStun)
	{
		recharge.stun.timer = recharge.stun.timer - game.time.physicsElapsedMS;
		if (recharge.stun.timer < 0)
		{
			recharge.stun.timer = recharge.stun.max;
			stunLeft = Math.min(stunLeft+1,maxStun);
		}
		recharge.stun.sprite.width = 50 * (1- recharge.stun.timer / recharge.stun.max);
	}
	else if (maxStun>0)
	{
		recharge.stun.sprite.width = 0;
	}

	if (recharge.confuse.max !== null && confuseLeft < maxConfuse)
	{
		recharge.confuse.timer = recharge.confuse.timer - game.time.physicsElapsedMS;
		if (recharge.confuse.timer < 0)
		{
			recharge.confuse.timer = recharge.confuse.max;
			confuseLeft = Math.min(confuseLeft+1,maxConfuse);
		}
		recharge.confuse.sprite.width = 50 * (1- recharge.confuse.timer / recharge.confuse.max);
	}
	else if (maxConfuse>0)
		
	{
		recharge.confuse.sprite.width = 0;
	}

	if (recharge.converge.max !== null && convergeLeft < maxConverge)
	{
		recharge.converge.timer = recharge.converge.timer - game.time.physicsElapsedMS;
		if (recharge.converge.timer < 0)
		{
			recharge.converge.timer = recharge.converge.max;
			convergeLeft = Math.min(convergeLeft+1,maxConverge);
		}
		recharge.converge.sprite.width = 50 * (1- recharge.converge.timer / recharge.converge.max);
	}
	else if (maxConverge>0)
		
	{
		recharge.converge.sprite.width = 0;
	}

}

function createRandomRock()
{
	var rockLevel = Math.ceil(Math.random()*3);

	var horzVert = Math.round(Math.random());

	var xlaunch;
	var ylaunch;

	if (horzVert)
	{
		ylaunch = Math.random() * gameHeight;
		xlaunch = 0;
	}
	else 
	{
		xlaunch = Math.random() * gameWidth;
		ylaunch = 0;
	}

	var xVelLaunch =  (Math.random() - 0.5 ) * playerData.maxRockSpeed * 2;
	var yVelLaunch =  (Math.random ()- 0.5 ) * playerData.maxRockSpeed * 2;

	createRock(rocks,rockLevel,xlaunch,ylaunch,xVelLaunch,yVelLaunch,false)
}

function addExtraWaves(waves, numExtra)
{
	var wavesAdded = 0;
	var newWaves = [];

	for (var index=0; index<waves.length; index++)
	{
		newWaves[index] = waves[index];
	}

	var currentWaveId = 0;

	while (wavesAdded<numExtra)
	{
		newWaves.splice(currentWaveId,0,newWaves[currentWaveId]);
		wavesAdded++;
		currentWaveId = currentWaveId +2;
		if (currentWaveId>=newWaves.length) {currentWaveId = 0;}
	}

	return newWaves;

}


function unpauseGame()
{
	if (game.paused && exitLevelTooltip.tooltipGroup.alpha == 0)
	{
		game.paused = false;
		pauseButton.frame = 0;
	}
	else if (exitLevelTooltip.tooltipGroup.alpha > 0.5)
	{
		var mousex = game.input.mousePointer.x;
		var mousey = game.input.mousePointer.y;

		if (mousex < gameWidth/2 - 150 + 20 + 110 && mousex > gameWidth/2 - 150 + 20 && mousey < gameHeight/2 -50 + 55 + 35 && mousey > gameHeight/2 - 50 + 55)
		{
			var performanceData = {};
			performanceData.kills = numKills;
			performanceData.success = false;
			performanceData.level = level;
			performanceData.score = Math.round(levelScore); 
			performanceData.detailedScore = detailedScore;
			performanceData.difficultyMultiplier = difficultyMultiplier;
			performanceData.bonusMultiplier = bonusMultiplier;
			performanceData.shipStats = shipStats;
			this.game.state.start("LevelComplete",true,false,gameData,performanceData);
			game.paused = false;
		}
		else
		{
			exitLevelTooltip.hideNow();
			game.paused = false;
			pauseButton.frame = 0;
			exitButton.frame = 0;
		}

	}
}

function pauseGame()
{
	if (game.paused)
	{
		game.paused = false;
		pauseButton.frame = 0;
	}
	else
	{
		game.paused = true;
		pauseButton.frame = 1;
	}
}

function setWave(gameData,wave)
{
	var waveData = adjustedWaves[wave];

	waveData.ships.forEach(function(shipParams,index){
		shipData = gameData.shipTypes[shipParams.type];
		shipData.type = shipParams.type;
		createShip(shipData,shipParams.x,shipParams.y);
		countShipEncounter(shipParams.type);
	});

	for (var i=0; i<extraShips; i++)
	{
		shipIndex = Math.floor(Math.random()*waveData.ships.length);
		shipData = gameData.shipTypes[waveData.ships[shipIndex].type];
		shipData.type = shipParams.type;
		createShip(shipData,Math.random()*.6+.2,Math.random()*.6+.2);
		countShipEncounter(waveData.ships[shipIndex].type);
	}

}

function countShipEncounter(shipType) 
{
	if (shipStats[shipType] === undefined) {
		shipStats[shipType] = {};
		shipStats[shipType].kills = 0;
		shipStats[shipType].encountered = 0;
	}
	shipStats[shipType].encountered++;
}

function countShipKill(shipType) 
{
	if (shipStats[shipType] === undefined) {
		shipStats[shipType] = {};
		shipStats[shipType].kills = 0;
		shipStats[shipType].encountered = 0;
	}
	shipStats[shipType].kills++;
}

function buttonClick()
{
	if (rocksLeft>0 && game.rockLoaded === null && game.paused == false)
	{
		game.rockLoaded = 3;
		rocksLeft--;
		addMouseSprite(3,true);
		rockButton.frame = 1;
	}
}

function convergeRocks()
{
	if (convergeLeft>0 && game.rockLoaded === null && game.paused == false)
	{
		convergeLeft--;
		convergeFollowTimer = 1 + convergeFollow * 1000;

		steerRocks(true);
		playPowersSound();
	}
}

function steerRocks(multiplySpeed)
{
	if (convergeFollowTimer > 0)
	{
		convergeFollowTimer = convergeFollowTimer - game.time.physicsElapsedMS;
		speedMultiple = 1;
		if (multiplySpeed)
		{
			speedMultiple = convergeSpeedup;
		}
	
		rocks.forEachAlive(function(rock){
			minShipDist = 1000000;
			closestShip = null;
			ships.forEachAlive(function(ship){
				shipDist = Math.pow((rock.x - ship.x),2) + Math.pow((rock.y-ship.y),2);
				if (shipDist<minShipDist)
				{
					minShipDist = shipDist;
					closestShip = ship;
				}
			});

			if (closestShip !== null)
			{
				var newAngle = game.physics.arcade.angleBetween(rock,closestShip);
				var currentRockSpeed = Math.sqrt(Math.pow(rock.body.velocity.x,2)+Math.pow(rock.body.velocity.y,2)) * speedMultiple;
				rock.body.velocity.x = Math.cos(newAngle)  * currentRockSpeed;
				rock.body.velocity.y = Math.sin(newAngle) * currentRockSpeed;
			}
		});
	}
}

function confuseShips()
{
	if (confuseLeft>0)
	{
		confuseLeft--;
		ships.forEachAlive(function(ship){
			ship.confused = confuseTime;
		});
		playPowersSound();
	}
}

function stunShips()
{
	if (stunLeft>0)
	{
		stunLeft--;
		ships.forEachAlive(function(ship){
			ship.stunned = stunTime;
		});
		playPowersSound();
	}
}

function playPowersSound() 
{
	var powersSound = game.add.audio('powers');
	powersSound.play('',0,0.7,false);
	setTimeout(function(){powersSound.fadeOut(1000);},3000);
	setTimeout(function(){powersSound.destroy()},5000);
}

function addMouseSprite(level,killIt)
{
	if (level===3) {game.mouseSprite = game.add.sprite(200,200,'rockLarge');}
	if (level===2) {game.mouseSprite = game.add.sprite(200,200,'rockMedium');}
	if (level===1) {game.mouseSprite = game.add.sprite(200,200,'rockSmall');}

	game.mouseSprite.anchor.setTo(0.5,0.5);
	if (killIt) {game.mouseSprite.kill();	}
}

function getScoreLine()
{
	if (gameData !== null)
	{
		return "Score: "+Math.round(levelScore)+"\n"+gameData.levels[level].name+"-  Wave "+(wave+1)+" of "+numWaves;
	}
	else
	{
		return "Loading...";
	}
}

function createShip(shipData,x,y)
{

	safeRadius = 250 * safeRadiusFactor;
    ship = ships.create(gameWidth*x,gameHeight*y,shipData.imageKey);

	ship.anchor.setTo(0.5,0.5);
	ship.body.velocity.x = 0;
	ship.body.velocity.y = 0;
	ship.body.angularVelocity = 0;
	ship.fireRate = shipData.fireRate / shipFireMultiplier;
	ship.bulletTimer = Math.random() * (shipData.fireRate / shipFireMultiplier);
	ship.currentTarget = null;
	ship.maxTurnRate = shipData.maxTurnRate * shipSpeedMultiplier;
	ship.bulletVelocity = shipData.bulletVelocity;
	ship.enginePower = shipData.enginePower * shipSpeedMultiplier;
	ship.body.drag.x = shipData.enginePower/2 * shipSpeedMultiplier;
	ship.body.drag.y = shipData.enginePower/2 * shipSpeedMultiplier;
	ship.warpsLeft = shipData.warps;
	ship.basePoints = shipData.basePoints;
	ship.maxShields = shipData.maxShields;
	ship.shields = shipData.maxShields * shipShieldsMultiplier;
	ship.rechargeRate = shipData.shieldRecharge;
	ship.shieldBar = null;
	ship.body.mass = 1;
	ship.body.bounce = 0;
	ship.type = shipData.type;


	ship.extraWeaponsRate = [];
	ship.extraWeaponsTimer = [];
	if (shipData.extraWeapons !== undefined)
	{
		ship.extraWeapons = shipData.extraWeapons;
		for (var index=0; index<shipData.extraWeapons.length; index++)
		{
			ship.extraWeaponsRate[index] = shipData.extraWeapons[index].recharge / shipFireMultiplier;
			ship.extraWeaponsTimer[index] = shipData.extraWeapons[index].recharge / shipFireMultiplier;
		}
	}

	ship.frame = 0;
	ship.aliveTime = 0;

	ship.confused = 0;
	ship.stunned = 0;

	ship.circle = new Phaser.Circle(ship.x, ship.y, safeRadius);
	ship.circle.alpha = 0.7;

	if (ship.maxShields>0)
	{
		var shieldBar = game.add.sprite(ship.x,ship.y-ship.height/2-2,'healthbar');
		ship.shieldBar = shieldBar;
		ship.shieldBar.anchor.x = 0.5;
		ship.shieldBar.height = 2;
		ship.shieldBar.width = ship.width;
		ship.shieldBar.alpha = 0.7;
	}

	ship.confusedSprite = game.add.sprite(0,0,'confuse');
	ship.confusedSprite.anchor.x = 0.5;
	ship.confusedSprite.anchor.y = 0.5;
	ship.confusedSprite.alpha = 0.4;
	ship.confusedSprite.width = ship.width + 2;
	ship.confusedSprite.height = ship.height + 2;
	ship.addChild(ship.confusedSprite);
	ship.confusedSprite.kill();

	ship.stunnedSprite = game.add.sprite(0,0,'stun');
	ship.stunnedSprite.anchor.x = 0.5;
	ship.stunnedSprite.anchor.y = 0.5;
	ship.stunnedSprite.alpha = 0.4;
	ship.stunnedSprite.width = ship.width+2;
	ship.stunnedSprite.height = ship.height+2;
	ship.addChild(ship.stunnedSprite);
	ship.stunnedSprite.kill();

	return ship;
}

function drawWaveIndicators(gameData,waves) {
	var xpos = 100;
	for (var index=0; index<waves.length; index++)
	{
		xpos = xpos + drawWaveIndicator(waves[index],xpos,index);
	}

}

function drawWaveIndicator(waveData,xpos,index) {

	waveGroup[index] = game.add.group();

	var waveSprite = game.add.sprite(xpos,3,'waveIndicator');

	var spriteWidth = 30 + waveData.ships.length * 16;
	waveSprite.width = spriteWidth;
	waveGroup[index].spriteWidth = spriteWidth;

	var waveTextStyle = {font: "bold 14px Arial", fill : "#CCCCCC"};
	var waveText = game.add.text(xpos+3,4,index+1,waveTextStyle);
	
	waveGroup[index].add(waveSprite);
	waveGroup[index].add(waveText);
	waveGroup[index].alpha = 0.5;

	for (var shipIndex=0; shipIndex<waveData.ships.length; shipIndex++)
	{
		var shipSprite = game.add.sprite(xpos+27+shipIndex*16,11,gameData.shipTypes[waveData.ships[shipIndex].type].imageKey);
		shipSprite.rotation = 90;
		shipSprite.width = 14;
		shipSprite.height = 14;
		shipSprite.anchor.x = 0.5;
		shipSprite.anchor.y = 0.5;
		waveGroup[index].add(shipSprite);
	}

	return spriteWidth;
}

function removeWaveIndicator(wave) {
	
	var spriteWidth = waveGroup[wave].spriteWidth;
	waveGroup[wave].destroy();

	for (var index=wave; index<waveGroup.length; index++)
	{
		for (var jindex=0; jindex<waveGroup[index].children.length; jindex++)
		{
			game.add.tween(waveGroup[index].children[jindex]).to({x: waveGroup[index].children[jindex].x-spriteWidth},500,"Linear",true);
		}
	}

}

function createRock(rocks,level,x,y,xVel,yVel,directHit)
{

	var vMax = playerData.maxRockSpeed;

	var v = Math.sqrt( Math.pow(xVel,2) + Math.pow(yVel,2));

	if ( v > vMax)
	{
		xVel = xVel / (v/vMax) ;
		yVel = yVel / (v/vMax) ;
	}


	if (level == 3)
	{
		var rock = rocks.create(x,y,'rockLarge');
	}
	else if (level == 2)
	{
		var rock = rocks.create(x,y,'rockMedium');
	}
	else if (level == 1)
	{
		var rock = rocks.create(x,y,'rockSmall');
	}

	var rockCenter = new Phaser.Point();

	rock.anchor.setTo(0.5,0.5);
	rock.body.velocity.x = xVel + Math.random()*20-10;
	rock.body.velocity.y = yVel + Math.random()*20-10;
	rock.body.angle = Math.random()*2*Math.PI;
	rock.body.angularVelocity = Math.random()*200-100;
	rock.body.mass = 1;
	rock.body.maxVelocity = vMax;

	rock.directHit = directHit;

	rock.level = level;

};

function moveShip(ship) {
	var currentAngle = ship.angle;

	ship.circle.x = ship.x;
	ship.circle.y = ship.y;

	if (ship.confused>0)
	{
		ship.confusedSprite.revive();
		ship.confused = ship.confused - game.time.physicsElapsedMS;
		if (Math.random()<0.05)
		{
			ship.body.angularVelocity = (Math.random() * 2 - 1) * ship.maxTurnRate;
			throttle(ship,Math.round(Math.random()));
			if (Math.random() < (game.time.physicsElapsedMS/1000 * playerData.confuseWarps*10))
			{
				detailedScore.warpsForced++;
				warpShip(ship);
			}
		}
	}
	else if (ship.stunned>0)
	{
		ship.stunnedSprite.revive();
		ship.stunned = ship.stunned - game.time.physicsElapsedMS;
		throttle(ship,0);
		ship.body.angularVelocity = 0;
		if (playerData.stunShields > 0 && ship.shields > 0)
		{
			ship.shields = ship.shields - (ship.maxShields*(playerData.stunShields/100)*(game.time.physicsElapsedMS/1000));
		}
	}
	else
	{
		ship.confusedSprite.kill();
		ship.stunnedSprite.kill();
		var angleToTarget = getFiringSolution(ship);

		var action = '';
		if (ship.threat) {action = evaluateThreat(ship.threat)};

		if (ship.threat != null &&  (action === 'evade' || (action==="warp" && ship.warpsLeft == 0)))
		{
			angleToTarget = ship.threat.escapeAngle;
			throttle(ship,1);
		}
		else if (ship.threat != null && action === 'warp' && ship.warpsLeft > 0)
		{
			detailedScore.warpsForced++;
			warpShip(ship);
		}
		else
		{
			throttle(ship,0);
		}

		var angleDiff = angleToTarget - currentAngle;

		var degPerFrameEst = game.time.elapsed / 1000 * ship.maxTurnRate;

		if (Math.abs(angleDiff)<degPerFrameEst)
		{
			// to prevent oscillation when locked on to firing solution
			ship.angle = angleToTarget;
			ship.body.angularVelocity = 0;
		}
		else
		{
			if (Math.abs(angleDiff)<180) {ship.body.angularVelocity = Math.sign(angleDiff) * ship.maxTurnRate;}
			else {ship.body.angularVelocity = Math.sign(angleDiff) * -1* ship.maxTurnRate;}
		}
	}

};

function warpShip(ship)
{

	warp = warps.create(0,0,'warp');
	warp.animations.add('warp');
	warp.anchor.setTo(0.5,0.5);
	warp.position.x = ship.position.x;
	warp.position.y = ship.position.y;
	warp.animations.play('warp',20,false,true);

	ship.kill();
	ship.warpsLeft--;
	ship.x = (Math.random()*.6+.2)*gameWidth;
	ship.y = (Math.random()*.6+.2)*gameHeight;
	ship.body.velocity.x = 0;
	ship.body.velocity.y = 0;

	setTimeout(function(){
		warp = warps.create(0,0,'warp');
		warp.animations.add('warpIn',[9,8,7,6,5,4,3,2,1,0]);
		warp.anchor.setTo(0.5,0.5);
		warp.position.x = ship.position.x;
		warp.position.y = ship.position.y;
		warp.animations.play('warpIn',20,false,true);
	},1500);

	setTimeout(function(){
		ship.revive();
	},2000);
	
};

function throttle(ship,throttlePos)
{
	ship.body.acceleration.x = throttlePos * ship.enginePower * Math.cos(ship.body.rotation*Math.PI/180);
	ship.body.acceleration.y = throttlePos * ship.enginePower * Math.sin(ship.body.rotation*Math.PI/180);
	if (throttlePos>0) {ship.frame = 1;} else {ship.frame = 0;}
}

function evaluateThreat(threat)
{
    var warpThreshold = 0.75;
	if (threat.threatTime<warpThreshold)
	{
		return 'warp';
	}
	if (threat.level == 2 && threat.threatTime < 3 * ship.fireRate)
	{
		return 'evade';
	}
	else if (threat.level == 3 && threat.threatTime < 10 * ship.fireRate)
	{
		return 'evade';
	}
	else
	{
		return 'fire';
	}
};

function getFiringSolution(ship)
{
	
	rangeTime = 0;

	for (var i=0; i<5; i++)
	{
		var estXPos = ship.currentTarget.x+ship.currentTarget.body.velocity.x*rangeTime;
		var estYPos = ship.currentTarget.y+ship.currentTarget.body.velocity.y*rangeTime;
		var range = Math.sqrt( Math.pow(ship.x - estXPos,2) + Math.pow(ship.y-estYPos,2));
		var rangeTime = range/ship.bulletVelocity;
	}

	return Math.atan2(estYPos - ship.y , estXPos - ship.x) * 180 / Math.PI;

}

function getClosestRock(ship)
{
	closestRock = null;
	minDistance = gameWidth*gameWidth;
	threatRock = null;
	threatStore = null;
	minThreat = 1000;
	rocks.forEachAlive(function(rock){
		rockDist = Math.pow((rock.x - ship.x),2) + Math.pow((rock.y-ship.y),2);
		threat = getThreatTime(ship,rock);
		
		if (threat != null)  {threatTime = threat.threatTime} else {threatTime = null;}

		if (rockDist < minDistance) {minDistance = rockDist; closestRock = rock;}
		if (threatTime< minThreat && threatTime >0) {minThreat = threatTime; threatRock = rock; threatStore = threat;}
	});

	ufos.forEachAlive(function(rock){
		rockDist = Math.pow((rock.x - ship.x),2) + Math.pow((rock.y-ship.y),2);
		if (rockDist < minDistance) {minDistance = rockDist; closestRock = rock;}
	});

	if (threatRock != null)
	{
		ship.threat = threatStore;
		return threatRock;
	}
	else
	{
		ship.threat = null;
		return closestRock;
	}
};

function getThreatTime(ship,rock)
{
	var Vx = rock.body.velocity.x;
	var Vy = rock.body.velocity.y;
	var Rx = rock.x;
	var Ry = rock.y;
	var Sx = ship.x;
	var Sy = ship.y;

	var Xo = Rx - Sx;
	var Yo = Ry - Sy;

	var m = Vy/Vx;
	var b = Yo - Vy/Vx * Xo;

	var Xc = b / (-m - 1/m);
	var Yc = -Xc/m;

	var minDist =  Math.sqrt(Math.pow(Xc,2)+Math.pow(Yc,2));

	var threat = {};

	threat.minDist = minDist;
	threat.threatTime = (Xc - Xo) / Vx;
	threat.escapeAngle = Math.atan2(-Yc,-Xc) * 180 / Math.PI;
	threat.level = rock.level;

	if (minDist < threatThreshold)
	{
		return threat;
	}
	else
	{
		return null;
	}
};

function shipHit(rock,ship)
{
	var damage=0;
	if (rock.level !== undefined)
	{
		damage = Math.pow(2,rock.level)*10 + 
		(Math.pow(rock.body.velocity.x,2) + Math.pow(rock.body.velocity.y,2)) * .001;
	}
	else
	{
		damage = 100;
	}
	detailedScore.shieldsDepleted = detailedScore.shieldsDepleted + Math.min(damage*rockDamage,ship.shields);
	ship.shields = ship.shields - damage * rockDamage;
	var hitAngle = game.physics.arcade.angleBetween(ship,rock);
	breakRock(rock);

	if (ship.shields<=0)
	{
		deadShip(ship,rock.directHit);
	}
	else
	{
		explosions.add(ionExplosion);
		ionExplosion.position.x = ship.position.x;
		ionExplosion.position.y = ship.position.y;
		ionExplosion.width = Math.max(ship.width,ship.height)*1.3;
		ionExplosion.height = Math.max(ship.width,ship.height)*1.3;
		ionExplosion.alpha = 0.7;
		ionExplosion.animations.play('ion_kaboom',20,false,false);
		ionExplosion.rotation = hitAngle;
		setTimeout(function(){
			explosions.remove(ionExplosion);
		},500);

	}
};

function rockHit(rock,bullet)
{
	if (bullet)
	{
		if (bullet.type == 'bomb' || bullet.type == 'missile')
		{
			bombHit(bullet);
		}
		bullet.kill();
		bullets.remove(bullet);
	}
	if (rock && bullet.type !== 'bomb')
	{
		breakRock(rock);
	}
}

function ufoHit(ufo,bullet)
{
	bullet.kill();
	bullets.remove(bullet);

	ufo.hitPoints--;

	if (ufo.hitPoints == 0)
	{
		ufo.shieldBar.kill();
		ufo.kill();
		ufos.remove(bullet);
	}
}

function bombHit(bullet)
{
	explosions.add(bombExplosion);
	bombExplosion.position.x = bullet.position.x;
	bombExplosion.position.y = bullet.position.y;
	bombExplosion.alpha = 0.7;
	bombExplosion.width = 200;
	bombExplosion.height = 200;
	bombExplosion.animations.play('bombExplosion',30,false,false);
	setTimeout(function(){
		explosions.remove(bombExplosion);
	},300);

	$.each(rocks.children,function(index,rock)
	{
		var dist = Math.sqrt(Math.pow(rock.x-bullet.x,2)+Math.pow(rock.y-bullet.y,2));
		if (dist<100 && rock.alive)
		{
			setTimeout(function(){
				breakRock(rock);
			},300*(dist/100));
		}
	});
}

function breakRock(rock)
{
	var rockBreakSound = game.add.audio('rock_break');
	


	if(rock.level==3)
	{
		var intRocks = Math.floor(rockSplit);
		var partialRock = rockSplit - intRocks;

		var numRocks = intRocks + (Math.random() <= partialRock);

		for (var i=0; i<numRocks; i++)
		{
			createRock(rocks,2,rock.x,rock.y,rock.body.velocity.x + Math.random()*120-60,
				rock.body.velocity.y + Math.random()*120-60,false);
		}
		rockBreakSound.play('',0,0.3,false);
	}
	else if (rock.level == 2)
	{
		var numRocks = 2 + Math.round(Math.random()*2);
		for (var i=0; i<numRocks; i++)
		{
			createRock(rocks,1,rock.x,rock.y,rock.body.velocity.x + Math.random()*80-40,
				rock.body.velocity.y + Math.random()*120-60,false);
		}
		rockBreakSound.play('',0,0.2,false);
	}
	else
	{
		rockBreakSound.play('',0,0.1,false);
	}

	rock.kill();
	setTimeout(function(){rockBreakSound.fadeOut(200);},200);
	setTimeout(function(){rockBreakSound.destroy()},1000);
}

function addBullet(ship)
{
	var bulletVelocity = ship.bulletVelocity;

	if (ship.stunned <= 0)
	{
		ship.bulletTimer = ship.bulletTimer - game.time.physicsElapsedMS;
		ship.aliveTime = ship.aliveTime + game.time.physicsElapsedMS;

		if (ship.bulletTimer<0)
		{
			ship.bulletTimer = ship.fireRate;
			var bullet = bullets.create(ship.position.x,ship.position.y,'bullet');	
			bullet.body.velocity.y = bulletVelocity * Math.sin(ship.body.rotation*Math.PI/180);
			bullet.body.velocity.x = bulletVelocity * Math.cos(ship.body.rotation*Math.PI/180);
			bullet.body.rotation = ship.body.rotation;
			bullet.body.mass = .1;
			bullet.anchor.x = 0.5;
			bullet.anchor.y = 0.5;
			
			var bulletSound = game.add.audio('bullet_fire');
			bulletSound.play('',0,0.10,false);
			setTimeout(function(){bulletSound.fadeOut(200);},200);
			setTimeout(function(){bulletSound.destroy()},1000);

		}

		for (var index=0; index< ship.extraWeaponsTimer.length; index++)
		{
			ship.extraWeaponsTimer[index] = ship.extraWeaponsTimer[index] - game.time.physicsElapsedMS;

			if (ship.extraWeaponsTimer[index] < 0)
			{
				ship.extraWeaponsTimer[index] = ship.extraWeaponsRate[index];
				var xBulletPosition = ship.position.x + Math.cos(ship.body.rotation*Math.PI/180)*ship.extraWeapons[index].xOffset 
					- Math.sin(ship.body.rotation*Math.PI/180) * ship.extraWeapons[index].yOffset;
				var yBulletPosition = ship.position.y + Math.sin(ship.body.rotation*Math.PI/180)*ship.extraWeapons[index].xOffset 
					+ Math.cos(ship.body.rotation*Math.PI/180) * ship.extraWeapons[index].yOffset;


				var bullet = null;
				if (ship.extraWeapons[index].type == "bomb")
				{
					bullet = bullets.create(xBulletPosition,yBulletPosition,'bomb');
					bullet.type = 'bomb';
					bullet.body.velocity.y = 120 * Math.sin(ship.body.rotation*Math.PI/180);
					bullet.body.velocity.x = 120 * Math.cos(ship.body.rotation*Math.PI/180);
					bullet.body.rotation = ship.body.rotation + 90;

				}
				else if (ship.extraWeapons[index].type == "missile")
				{
					bullet = bullets.create(xBulletPosition,yBulletPosition,'missile');
					bullet.type = 'missile';
					bullet.body.velocity.y = 250 * Math.sin(ship.body.rotation*Math.PI/180);
					bullet.body.velocity.x = 250 * Math.cos(ship.body.rotation*Math.PI/180);
					bullet.body.maxVelocity = 250;
					bullet.body.rotation = ship.body.rotation;
					bullet.target = null;
					var missileSound = game.add.audio('missile');
					missileSound.play('',0,0.2,false);
					setTimeout(function(){bulletSound.fadeOut(200);},200);
					setTimeout(function(){bulletSound.destroy()},1000);
				}
				else if (ship.extraWeapons[index].type == 'fighterBay')
				{
					if (ship.extraWeapons[index].numWaves > 0)
					{
						deployFighterBay(ship,ship.extraWeapons[index]);
						ship.extraWeapons[index].numWaves = ship.extraWeapons[index].numWaves - 1;
					}
				}
				else
				{
					bullet = bullets.create(xBulletPosition,yBulletPosition,'bullet');
					bullet.body.velocity.y = bulletVelocity * Math.sin(ship.body.rotation*Math.PI/180);
					bullet.body.velocity.x = bulletVelocity * Math.cos(ship.body.rotation*Math.PI/180);
					bullet.body.rotation = ship.body.rotation;
				}

				if (bullet !== null)
				{
					bullet.body.mass = .1;
					bullet.anchor.x = 0.5;
					bullet.anchor.y = 0.5;
				}
			}

		}
	}
}

function deployFighterBay(ship,bay)
{
	var shipData = gameData.shipTypes[bay.shipType];
	var angleOffset = Math.random();
	for(var index=0; index<bay.shipCount; index ++)
	{
		shipData.type = bay.shipType;
		var ship = createShip(shipData,ship.x/gameWidth,ship.y/gameHeight);
		countShipEncounter(bay.shipType);
		var launchAngle = angleOffset + index / bay.shipCount * 2 * Math.PI;
		ship.body.velocity.x = Math.cos(launchAngle) * 75;
		ship.body.velocity.y = Math.sin(launchAngle) * 75;
		ship.rotation = launchAngle;
	}
	
}

function deadShip(ship,directHit) {

	var pointsScored = ship.basePoints;
	detailedScore.basePoints = detailedScore.basePoints + ship.basePoints;
	detailedScore.totalKills++;

	if(directHit)
	{
		scoreBlip(ship.x,ship.y-25,"Direct Hit!","#ffff00");
		pointsScored = pointsScored * directHitBonus;
		detailedScore.directHitPoints = detailedScore.directHitPoints + pointsScored*(directHitBonus-1);
		detailedScore.directHits++;
	}
	if (ship.aliveTime<500) {
		pointsScored = pointsScored * instantKillBonus;
		scoreBlip(ship.x,ship.y,"Instant Kill\n"+Math.round(pointsScored),"#6666ff");
		detailedScore.instantKillPoints = detailedScore.instantKillPoints + pointsScored*(instantKillBonus-1);
		detailedScore.instantKills++;
	}
	else if (ship.aliveTime<1500) {
		pointsScored = pointsScored * (1 + (instantKillBonus-1)/2 );
		scoreBlip(ship.x,ship.y,"Quick Kill\n"+Math.round(pointsScored),"#00ff00");
		detailedScore.quickKillPoints = detailedScore.quickKillPoints + pointsScored*((instantKillBonus-1)/2);
		detailedScore.quickKills++;
	}
	else if (directHit)
	{
		scoreBlip(ship.x,ship.y,Math.round(pointsScored),"#ffff00");
	}
	else
	{
		scoreBlip(ship.x,ship.y,pointsScored,"#dddddd");
	}
	levelScore = levelScore + pointsScored;
	
	numKills++;

	ships.remove(ship);

	if (ship.shieldBar !== null) {ship.shieldBar.destroy();}

	explosions.add(explosion);
	explosion.position.x = ship.position.x;
	explosion.position.y = ship.position.y;
	explosion.animations.play('kaboom',20,false);

	var explosionSound = game.add.audio('battle_explosion');
	explosionSound.play('',0,1,false);
	setTimeout(function(){explosionSound.fadeOut(500);},750);
	setTimeout(function(){explosionSound.destroy()},4000);

    if (ships.countLiving()==0)
    {	
    	removeWaveIndicator(wave);
    	wave++;
		
		if (wave<numWaves)
		{
			setTimeout(function(){
				setWave(gameData,wave);
				explosions.remove(explosion);
			},2000);
		}
		else
		{
			var performanceData = {};
			performanceData.kills = numKills;
			performanceData.success = true;
			performanceData.level = level;
			performanceData.score = Math.round(levelScore);
			performanceData.detailedScore = detailedScore;
			performanceData.difficultyMultiplier = difficultyMultiplier;
			performanceData.bonusMultiplier = bonusMultiplier;
			performanceData.shipStats = shipStats;

			setTimeout(function(){
				this.game.state.start("LevelComplete",true,false,gameData,performanceData);
			},2000);
			
		}
	}

	var goodieRand = Math.random();
	if (goodieRand < goodieChance)
	{
		createGoodie(ship.x,ship.y);
	}

	countShipKill(ship.type);

	ship.kill();
};

function createGoodie(x,y)
{
	goodie = goodies.create(x,y,'goodie');

	goodie.anchor.x = 0.5;
	goodie.anchor.y = 0.5;
	goodie.inputEnabled = true;

	goodie.body.velocity.x = 30*Math.random() - 15;
	goodie.body.velocity.y = 30*Math.random() - 15;

	goodie.body.angularVelocity = 150*Math.random() - 75;

	game.add.tween(goodie).to({width: 2},800+600*Math.random(),Phaser.Easing.Quadratic.InOut,true,0,-1,true);

	game.add.tween(goodie).to({alpha: 0},3000,"Linear",true,3000);
}

function goodiePickup(goodie)
{
	goodies.remove(goodie);
	scoreBlip(goodie.x,goodie.y+20,goodieValue,"#ffff00");
	levelScore = levelScore + goodieValue;
	detailedScore.goodiesCollected++;
	detailedScore.goodieScore = detailedScore.goodieScore + goodieValue;
	goodie.kill();
}

function moveGoodie(goodie)
{
	var mousex = game.input.mousePointer.x;
	var mousey = game.input.mousePointer.y;

	var vecx = mousex-goodie.x;
	var vecy = mousey-goodie.y;

	var dist2 = Math.pow(vecx,2) + Math.pow(vecy,2);

	if (dist2 < 200)
	{
		goodiePickup(goodie);
	}
	else if (dist2< 10000)
	{
		var maxAccel = 100;
		accel = Math.min(maxAccel,100000/dist2);
		goodie.body.acceleration.x = vecx / Math.sqrt(dist2) * accel;
		goodie.body.acceleration.y = vecy / Math.sqrt(dist2) * accel;
	}
	else
	{
		goodie.body.acceleration.x = 0;
		goodie.body.acceleration.y = 0;
	}



}

function scoreBlip(x,y,points,color)
{
	var scoreBlip = game.add.text(x,y-40,points,{font: "14px Arial", fill:color, align:"center"})
	scoreBlip.anchor.set(0.5);
	scoreBlip.alpha = 1;
	game.add.tween(scoreBlip).to({alpha:0, y: y-70},2500,"Linear",true);	

	//TODO kill scoreBlip on tween complete
}

function render() {

	
}

function rockClick(pointer) {

	if (game.rockLoaded)
	{
		game.mouseSprite.revive();
		game.mouseSprite.x = pointer.x;
		game.mouseSprite.y = pointer.y;
		rockAnchor.x = pointer.position.x;
		rockAnchor.y = pointer.position.y;
		launchLine.setTo(pointer.position.x,pointer.position.y, pointer.position.x, pointer.position.y);
		drawLine = true;
	}
	else
	{
		game.physics.arcade.getObjectsUnderPointer(pointer,rocks,function(pointer,rock){
			if (game.mouseSprite===null)
			{
				rockAnchor.x = pointer.position.x;
				rockAnchor.y = pointer.position.y;
				addMouseSprite(rock.level,false);
				game.mouseSprite.x = pointer.x;
				game.mouseSprite.y = pointer.y;
				game.rockLoaded = rock.level;
				rock.kill();
				drawLine = true;
			}
		});
	}

}

function rockRelease(pointer) {

	if (game.rockLoaded)
	{
		var xVelocity = rockAnchor.x - pointer.position.x ;
		var yVelocity = rockAnchor.y - pointer.position.y ;

		var freeZone = true;

		ships.forEachAlive(function(ship){
			if (Phaser.Circle.contains(ship.circle,pointer.position.x,pointer.position.y))
			{
				freeZone = false;
			}
		});

		if (freeZone)
		{
			createRock(rocks,game.rockLoaded,pointer.position.x,pointer.position.y,xVelocity,yVelocity,true);
			game.rockLoaded = null;
			game.mouseSprite.kill();	
			game.mouseSprite.destroy();
			game.mouseSprite = null;
			rockButton.frame = 0;
		}
		else
		{
			game.mouseSprite.kill();	
		}
		launchLine.setTo(0,0,0,0);
		drawLine = false;
	}
}

function rockStretch(pointer) {
	if (game.rockLoaded)
	{
		launchLine.setTo(rockAnchor.x,rockAnchor.y, pointer.position.x, pointer.position.y);

		game.mouseSprite.x = pointer.x;
		game.mouseSprite.y = pointer.y;

		ships.forEachAlive(function(ship){
			if (Phaser.Circle.contains(ship.circle,pointer.position.x,pointer.position.y))
			{
				ship.drawCircle = true;
			}
			else
			{
				ship.drawCircle = false;
			}
		});
	}
}

function targetMissile(missile) {
	var minAngleDiff = 100;
	var newTarget = null;
	rocks.forEachAlive(function(rock){
		angleDiff = Math.abs(missile.rotation - game.physics.arcade.angleBetween(missile,rock));
		if (angleDiff && angleDiff < minAngleDiff)
		{
			minAngleDiff = angleDiff;
			newTarget = rock;
		}
	});
	ufos.forEachAlive(function(rock){
		angleDiff = Math.abs(missile.rotation - game.physics.arcade.angleBetween(missile,rock));
		if (angleDiff && angleDiff < minAngleDiff)
		{
			minAngleDiff = angleDiff;
			newTarget = rock;
		}
	});
	missile.target = newTarget;
}

function steerMissile(missile) {
	if (missile.target)
	{
		var angleDiff = missile.rotation - game.physics.arcade.angleBetween(missile,missile.target);
	
		if (angleDiff > 0) {
			missile.body.angularVelocity = -200;
		}
		else { 
			missile.body.angularVelocity = 200;
		}
		var degPerFrameEst = game.time.elapsed / 1000 * 200;
		if (degPerFrameEst > Math.abs(angleDiff * 180 / Math.PI))
		{
			missile.body.angularVelocity = 0;
			missile.rotation = game.physics.arcade.angleBetween(missile,missile.target);
		}
	}
	else
	{
		missile.body.angularVelocity = 0;
	}

	missile.body.acceleration.x = 1000 * Math.cos(missile.rotation);
	missile.body.acceleration.y = 1000 * Math.sin(missile.rotation);

	if (missile.body.speed > missile.body.maxVelocity ) 
	{
		slowFactor = missile.body.speed / missile.body.maxVelocity;
		missile.body.velocity.x = missile.body.velocity.x / slowFactor;
		missile.body.velocity.y = missile.body.velocity.y / slowFactor;
	}

}