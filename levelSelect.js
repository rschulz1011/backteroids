var levelSelect = function(game){
	gameData = null;
	levelTileSize = 70;
	levelTileMargin = 20;
	selectedLevel = null;
};

levelSelect.prototype = {

	preload: function() {
		game.load.spritesheet('levelButton', 'res/levelButton.png',70,70);
		game.load.image('playButton','res/playButton.png');

		loadShipSprites();

		game.load.image('star','res/levelStar.png');
	},

	create: function() {

		loadSounds();

		$.getJSON( "gameData.json", function( data ) {
			gameData = data;
			drawLevelButtons();
			calculatePlayerLevel(gameData);
			displayPlayerLevel();
		})
		.fail(function(jqxhr, textStatus, error){
			var err = textStatus + ", " + error;
		});
		buttons = this.game.add.group();

		playButton = this.game.add.button(20,400,"playButton",clickPlayButton,this);
		playButton.kill();

		var selectLevelStyle = { font: "18px Arial", stroke: "bold", fill: "#eeeeee"};
		var selectLevelText = game.add.text((game.width - 6*levelTileSize - levelTileMargin)/2,40,"Select Level",selectLevelStyle);
		selectLevelText.anchor.x = 0.5;
		selectLevelText.anchor.y = 0;

		levelInfoNameStyle = {font: "24px Arial", stroke: "bold", fill: "#eeeeee"};
		levelParameterStyle = {font: "12px Arial", stroke: "bold", fill: "#eeeeee"};
		levelValueStyle = {font: "bold 14px Arial", fill: "#eeeeee"};

		populateLevelInfo(null);

		displayTotalScore();
	},
}

var drawLevelButtons = function() {
	
	var iLevel = 0;
	
	$.each(gameData.levels,function(index,level){
		var column = iLevel % 6;
		var row = Math.floor(iLevel / 6);

		xLocation = game.width - levelTileMargin - (6-column)*levelTileSize;
		yLocation = levelTileMargin*2 +  row*levelTileSize;

		drawLevelButton(level,index,xLocation,yLocation);

		iLevel++;
	});
};

var drawLevelButton = function(level,index,xLocation,yLocation) {

	button = this.game.add.button(xLocation,yLocation,"levelButton",clickLevelButton,this);
	button.levelId = index;
	buttons.add(button);

	var levelStyle = { font: "12px Arial", stroke: "bold", fill: "#eeeeee", align: "left" };
	var buttonLevelText = game.add.text(xLocation+levelTileSize/2,yLocation+15,level.name,levelStyle);
	buttonLevelText.anchor.x = 0.5;
	buttonLevelText.anchor.y = 0.5;

	var wavesStyle = { font: "10px Arial", stroke: "bold", fill: "#eeeeee", align: "left" };
	var waveText = level.waves.length + " Waves";
	var buttonWavesText = game.add.text(xLocation+levelTileSize/2,yLocation+30,waveText,wavesStyle);
	buttonWavesText.anchor.x = 0.5;
	buttonWavesText.anchor.y = 0.5;

	if (playerData.levelScores[index] !== undefined && playerData.levelScores[index].passed === true)
	{
		var star = game.add.sprite(xLocation+levelTileSize/2,yLocation+50,'star');
		star.anchor.x = 0.5;
		star.anchor.y = 0.5;
	}

};

var clickLevelButton = function(button) {
	
	buttons.forEach(function(b){
		b.frame=0;
	});

	button.frame = 1;
	selectedLevel = button.levelId;
	playButton.revive();

	populateLevelInfo(button.levelId);

};

var populateLevelInfo = function(level) {

	if (level===null)
	{
		levelInfoNameText = game.add.text((game.width - 6*levelTileSize - levelTileMargin)/2,65," ",levelInfoNameStyle);
		levelInfoNameText.anchor.x = 0.5;
		levelInfoValue = {};
		drawLevelParameter("nwaves","Number of Waves: ",110);
		drawLevelParameter("basePoints","Base Points: ",140);
		drawLevelParameter("bestScore","Best Score: ",170);
		drawLevelParameter("shipTypes","Ship Types: ",200);
		shipTypes = game.add.group();
	}
	else
	{
		levelInfoNameText.setText(gameData.levels[level].name);
		levelInfoValue['nwaves'].setText(gameData.levels[level].waves.length);
		levelInfoValue['basePoints'].setText(calculateBasePoints(level));
		var shipList = getUniqueShipTypes(level);
		shipTypes.removeAll();
		shipList.forEach(function(ship,index){
			var shipSprite = game.add.sprite(180+index*22,210,gameData.shipTypes[ship].imageKey);
			shipSprite.width = 20;
			shipSprite.height = 20;
			shipTypes.add(shipSprite);
			shipSprite.allowRotation = true;
			shipSprite.rotation = -Math.PI/2;
			shipSprite.anchor.y = 0.5;
			shipSprite.anchor.x = 0.5;
		});
		if (playerData.levelScores[level] !== undefined)
		{
			levelInfoValue["bestScore"].setText(playerData.levelScores[level].bestScore);
		}
		else
		{
			levelInfoValue["bestScore"].setText("--");
		}
	}
};

var calculateBasePoints = function(level){

	var totalBasePoints = 0;
	gameData.levels[level].waves.forEach(function(wave,index){
		wave.ships.forEach(function(ship,index){
			totalBasePoints = totalBasePoints + gameData.shipTypes[ship.type].basePoints;
		});
	});
	return totalBasePoints;
}

var getUniqueShipTypes = function(level){

	shipArray = [];
	gameData.levels[level].waves.forEach(function(wave,index){
		wave.ships.forEach(function(ship,index){
			thisShipType = ship.type;
			if (shipArray.indexOf(thisShipType) === -1)
			{
				shipArray = shipArray.concat(thisShipType);
			}
		});
	});

	return shipArray;
};

var clickPlayButton = function(){
	menuMusic.fadeOut(1000);
	setTimeout(function(){this.game.state.start("PlayLevel",true,false,selectedLevel);},1000);
};

var drawLevelParameter = function(parameterId, parameterTitle,ypos) {
	levelInfoParameter = {};
	levelInfoParameter[parameterId] = game.add.text(160,ypos,parameterTitle,levelParameterStyle);
	levelInfoParameter[parameterId].anchor.x = 1.0;

	levelInfoValue[parameterId] = game.add.text(180,ypos," ",levelValueStyle);
	levelInfoValue[parameterId].anchor.x = 0;
}