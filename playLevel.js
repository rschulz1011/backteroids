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
}

playLevel.prototype = {

	init: function(levelIn) {
		level = levelIn;
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
		game.load.spritesheet('confuseButton','res/confuse_button.png',50,50);
		game.load.spritesheet('stunButton','res/stun_button.png',50,50);
		game.load.spritesheet('healthbar','res/healthbar.png',10,3);
		game.load.image('confuse','res/confuse_sprite.png');
		game.load.image('stun','res/stun_sprite.png');
	},

	create: function() {

		maxRocks = 5;
		maxConverge = 1;
		maxConfuse = 2;
		maxStun = 2;
		numKills = 0;
		rocksLeft = maxRocks;
		convergeLeft = maxConverge;
		confuseLeft = maxConfuse;
		stunLeft = maxStun;
		wave = 0;
		rockAnchor.x = 0;
		rockAnchor.y = 0;
		drawLine = false;

		levelScore = 0;

		game.add.sprite(0,0,'space');

		$.getJSON( "gameData.json", function( data ) {
			gameData = data;
			numWaves = gameData.levels[level].waves.length;
			setWave(gameData,level,wave);
		})
		.fail(function(jqxhr, textStatus, error){
			var err = textStatus + ", " + error;
		});

		//var numRocks = 20;
		rocks = game.add.group();
		rocks.enableBody = true;
		rocks.allowRotation = true;

		game.input.onDown.add(rockClick, this);
		game.input.onUp.add(rockRelease, this);
		game.input.addMoveCallback(rockStretch, this);

		ships = game.add.group();
		ships.enableBody = true;
		ships.allowRotation = true;

		explosions = game.add.group();
		explosion = explosions.create(0,0,'kaboom');
		explosion.animations.add('kaboom');
		explosion.anchor.setTo(0.5,0.5);
		explosions.remove(explosion);
		ionExplosion = explosions.create(0,0,'ion_kaboom');
		ionExplosion.animations.add('ion_kaboom');
		ionExplosion.anchor.setTo(0.5,0.5);
		explosions.remove(ionExplosion);

		warps = game.add.group();

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.allowRotation = true;

		var text = getScoreLine();
		var style = { font: "15px Arial", fill: "#ffffff", align: "left" };
		scoreText = game.add.text(10,20,text,style);

		rockButton = game.add.button(20,gameHeight-70,'rockButton',buttonClick,this,2,0,1,1);
		convergeButton = game.add.button(80,gameHeight-70,'convergeButton',convergeRocks,this,2,0,1,1);
		confuseButton = game.add.button(140,gameHeight-70,'confuseButton',confuseShips,this,2,0,1,1);
		stunButton = game.add.button(200,gameHeight-70,'stunButton',stunShips,this,2,0,1,1);

		pauseButton = game.add.button(gameWidth-35,5,'pauseButton',pauseGame,this,2,0,1,1);

		var rocksLeftStyle = {font: "30px Arial", fill: "#ffffff", align: "center"};
		rocksLeftText = game.add.text(35,gameHeight-60,""+rocksLeft,rocksLeftStyle);
		convergeLeftText = game.add.text(95,gameHeight-60,""+convergeLeft,rocksLeftStyle);
		confuseLeftText = game.add.text(155,gameHeight-60,""+confuseLeft,rocksLeftStyle);
		stunLeftText = game.add.text(215,gameHeight-60,""+stunLeft,rocksLeftStyle);
		//TODO: Anchor text and center

		game.rockLoaded = null;
		game.mouseSprite = null;

		keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    	keyQ.onDown.add(buttonClick, this);

    	keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
    	keyP.onDown.add(pauseGame, this);

    	keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    	keyW.onDown.add(convergeRocks,this);

    	keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
    	keyE.onDown.add(confuseShips,this);

    	keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
    	keyR.onDown.add(stunShips,this);

    	game.input.onDown.add(unpauseGame, self);
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

		bullets.forEach(function(bullet){

			if ( bullet && (bullet.x > gameWidth + wrapThreshold || bullet.x < -wrapThreshold ||
				bullet.y > gameHeight + wrapThreshold || bullet.y < -wrapThreshold))
			{
				bullets.remove(bullet);
				bullet.kill();
			}

		});

		game.physics.arcade.overlap(rocks,ships,shipHit);

		game.physics.arcade.overlap(rocks,bullets,rockHit);

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
	
			scoreText.text = getScoreLine();
			rocksLeftText.text = ""+rocksLeft;
			convergeLeftText.text = ""+convergeLeft;
			confuseLeftText.text = ""+confuseLeft;
			stunLeftText.text = ""+stunLeft;

			if (rocks.getFirstAlive() == null && rocksLeft == 0 && game.rockLoaded === null)
			{
				var performanceData = {};
				performanceData.kills = numKills;
				performanceData.success = false;
				performanceData.level = level;
				performanceData.score = Math.round(levelScore); 
				setTimeout(function(){
					this.game.state.start("LevelComplete",true,false,gameData,performanceData);
				},1000);
				
				//var finalScoreStyle = {font: "36px Arial", fill: "#cccccc", align: "center"};
				//game.add.text(100,gameHeight/2,"Level Failed.\nRefresh To Play Again",finalScoreStyle);
			}
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


function unpauseGame()
{
	if (game.paused)
	{
		game.paused = false;
		pauseButton.frame = 0;
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

function setWave(gameData,level,wave)
{
	var levelData = gameData.levels[level];
	var waveData = levelData.waves[wave];

	waveData.ships.forEach(function(shipParams,index){
		shipData = gameData.shipTypes[shipParams.type];
		createShip(shipData,shipParams.x,shipParams.y);
	});

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
				var currentRockSpeed = Math.sqrt(Math.pow(rock.body.velocity.x,2)+Math.pow(rock.body.velocity.y,2));
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
			ship.confused = 3000;
		});
	}
}

function stunShips()
{
	if (stunLeft>0)
	{
		stunLeft--;
		ships.forEachAlive(function(ship){
			ship.stunned = 3000;
		});
	}
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

	safeRadius = 250;
    ship = ships.create(gameWidth*x,gameHeight*y,shipData.imageKey);

	ship.anchor.setTo(0.5,0.5);
	ship.body.velocity.x = 0;
	ship.body.velocity.y = 0;
	ship.body.angularVelocity = 0;
	ship.fireRate = shipData.fireRate;
	ship.bulletTimer = shipData.fireRate;
	ship.currentTarget = null;
	ship.maxTurnRate = shipData.maxTurnRate;
	ship.bulletVelocity = shipData.bulletVelocity;
	ship.enginePower = shipData.enginePower;
	ship.body.drag.x = shipData.enginePower/2;
	ship.body.drag.y = shipData.enginePower/2;
	ship.warpsLeft = shipData.warps;
	ship.basePoints = shipData.basePoints;
	ship.maxShields = shipData.maxShields;
	ship.shields = shipData.maxShields;
	ship.rechargeRate = shipData.shieldRecharge;
	ship.shieldBar = null;
	ship.body.mass = 1;
	ship.body.bounce = 0;
	//ship.animations.add('test',[0,1],10,false);
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
}

function createRock(rocks,level,x,y,xVel,yVel,directHit)
{

	var vMax = 100;

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
		}
	}
	else if (ship.stunned>0)
	{
		ship.stunnedSprite.revive();
		ship.stunned = ship.stunned - game.time.physicsElapsedMS;
		throttle(ship,0);
		ship.body.angularVelocity = 0;
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

	var damage = Math.pow(2,rock.level)*10 + 
	(Math.pow(rock.body.velocity.x,2) + Math.pow(rock.body.velocity.y,2)) * .001;
	ship.shields = ship.shields - damage;
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
		ionExplosion.width = ship.width*1.3;
		ionExplosion.height = ship.height*1.3;
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
	if (rock)
	{

		breakRock(rock);
	}
	if (bullet)
	{
		bullet.kill();
		bullets.remove(bullet);
	}
}

function breakRock(rock)
{
	if(rock.level==3)
	{
		var numRocks = 2 + Math.round(Math.random());

		for (var i=0; i<numRocks; i++)
		{
			createRock(rocks,2,rock.x,rock.y,rock.body.velocity.x + Math.random()*120-60,
				rock.body.velocity.y + Math.random()*120-60,false);
		}
	}
	else if (rock.level == 2)
	{
		var numRocks = 2 + Math.round(Math.random()*2);
		for (var i=0; i<numRocks; i++)
		{
			createRock(rocks,1,rock.x,rock.y,rock.body.velocity.x + Math.random()*80-40,
				rock.body.velocity.y + Math.random()*120-60,false);
		}
	}

	rock.kill();
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
		}
	}
}


function deadShip(ship,directHit) {

	var pointsScored = ship.basePoints;
	if(directHit)
	{
		scoreBlip(ship.x,ship.y-25,"Direct Hit!","#ffff00");
		pointsScored = pointsScored * 1.25;
	}
	if (ship.aliveTime<500) {
		pointsScored = pointsScored * 1.5;
		scoreBlip(ship.x,ship.y,"Instant Kill\n"+Math.round(pointsScored),"#6666ff");
	}
	else if (ship.aliveTime<1500) {
		pointsScored = pointsScored * 1.25;
		scoreBlip(ship.x,ship.y,"Quick Kill\n"+Math.round(pointsScored),"#00ff00");
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
    	wave++;
		
		if (wave<numWaves)
		{
			setTimeout(function(){
				setWave(gameData,level,wave);
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
			setTimeout(function(){
				this.game.state.start("LevelComplete",true,false,gameData,performanceData);
			},1000);
			
		}
	}
};

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