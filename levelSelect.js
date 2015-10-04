var levelSelect = function(game){
	gameData = null;
	levelTileSize = 70;
	levelTileMargin = 30;
	selectedLevel = null;
	difficultyLevels = {};
	currentLevel = level;
};

levelSelect.prototype = {

	preload: function() {
		game.load.spritesheet('levelButton', 'res/levelButton.png',70,70);
		game.load.image('playButton','res/playButton.png');
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
		game.load.spritesheet('increaseDifficulty','res/increase_difficulty.png',25,25);
		game.load.spritesheet('decreaseDifficulty','res/decrease_difficulty.png',25,25);

		loadShipSprites();
		preLoadButtons();

		game.load.image('star','res/levelStar.png');
	},

	create: function() {

		loadSounds();
		preLoadButtons();
		addMuteButton(765,30);

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

		playButton = this.game.add.button((game.width - 6*levelTileSize - levelTileMargin)/2,475,"playButton",clickPlayButton,this);
		playButton.anchor.x = 0.5;
		playButton.kill();

		var selectLevelStyle = { font: "18px Arial", stroke: "bold", fill: "#eeeeee"};
		var selectLevelText = game.add.text((game.width - 6*levelTileSize - levelTileMargin)/2,40,"Select Level",selectLevelStyle);
		selectLevelText.anchor.x = 0.5;
		selectLevelText.anchor.y = 0;

		levelInfoNameStyle = {font: "24px Arial", stroke: "bold", fill: "#eeeeee"};
		levelParameterStyle = {font: "12px Arial", stroke: "bold", fill: "#eeeeee"};
		levelValueStyle = {font: "bold 14px Arial", fill: "#eeeeee"};

		difficultyLevelTooltip = new tooltip(game,20,280,250,60,function(group){
			tooltipInfoTextStyle = {font: "13px Arial", stroke: "bold", fill: "#ffffff",wordWrap: true, wordWrapWidth: 250};
			var infoText = group.addChild(game.add.text(125,30,"Complete the level to unlock difficulty modifiers",tooltipInfoTextStyle));
			infoText.anchor.x = 0.5;
			infoText.anchor.y = 0.5;
		});

		populateLevelInfo(null);

		displayTotalScore();
		createNavigationButtons("LevelSelect");

		difficultyLevelControls = game.add.group();
		addDifficultyLevelControls(level);
		difficultyLevelControls.alpha = 0;


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
	playButtonClick();
	buttons.forEach(function(b){
		b.frame=0;
	});

	button.frame = 1;
	selectedLevel = button.levelId;
	playButton.revive();

	populateLevelInfo(button.levelId);

};

var populateLevelInfo = function(level) {

	currentLevel = level;

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

		var difficultyLevelStyle = { font: "18px Arial", stroke: "bold", fill: "#eeeeee"};
		difficultyLevelText = game.add.text((game.width - 6*levelTileSize - levelTileMargin)/2,250,"Difficulty Settings",difficultyLevelStyle);
		difficultyLevelText.anchor.x = 0.5;

		resetDifficultyLevels();
		
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

		resetDifficultyLevels();

		
		if (playerData.levelScores[level] !== undefined && playerData.levelScores[level].passed)
		{
			difficultyLevelControls.alpha = 1;
			difficultyLevelTooltip.unlink(difficultyLevelText);
		}
		else
		{
			difficultyLevelControls.alpha = 0.3;
			difficultyLevelTooltip.link(difficultyLevelText);
		}
		
		updateDifficultyControls(level);

	}
};

var addDifficultyLevelControls = function(level) {

	difficultySettingName = {};
	difficultySettingValue = {};
	difficultySettingMultiplier = {};
	difficultyDecreaseButton = {};
	difficultyIncreaseButton = {};

	var ypos = 280;

	$.each(difficultySetting,function(index, control) {
		addDifficultyControl(index,control,level,ypos);
		ypos = ypos +33;
	})

	var difficultySettingNameStyle = {font: "14px Arial", fill: "#FFFFFF"};
	var totalDifficultySettingLabel = game.add.text(75,ypos+3,"Total Multiplier",difficultySettingNameStyle);
	difficultyLevelControls.add(totalDifficultySettingLabel);

	var difficultySettingMultiplierStyle = {font: "18px Arial", fill: "#FFFF00"};
	totalDifficultyMultiplierText = game.add.text(200,ypos," ",difficultySettingMultiplierStyle);
	difficultyLevelControls.add(totalDifficultyMultiplierText);

	updateDifficultyControls(level);
};

var addDifficultyControl = function(index,control,level,ypos) {

	var difficultySettingNameStyle = {font: "14px Arial", fill: "#FFFFFF"};
	difficultySettingName[index] = game.add.text(97,ypos-3,control.name,difficultySettingNameStyle);
	difficultySettingName[index].anchor.x = 0.5;
	difficultyLevelControls.add(difficultySettingName[index]);

	var difficultySettingValueStyle = {font: "bold 14px Arial", fill: "#FFFF00"};
	difficultySettingValue[index] = game.add.text(97,ypos+12,control.displayString(2),difficultySettingValueStyle);
	difficultySettingValue[index].anchor.x = 0.5;
	difficultyLevelControls.add(difficultySettingValue[index]);

	var difficultySettingMultiplierStyle = {font: "18px Arial", fill: "#FFFF00"};
	difficultySettingMultiplier[index] = game.add.text(200,ypos+12,"x "+control.multiplier(2).toFixed(2),difficultySettingMultiplierStyle);
	difficultySettingMultiplier[index].anchor.y = 0.5;
	difficultyLevelControls.add(difficultySettingMultiplier[index]);

	difficultyDecreaseButton[index] = this.game.add.button(20,ypos,"decreaseDifficulty",difficultyButtonClick,this,1,0,0,0);
	difficultyDecreaseButton[index].name = index;
	difficultyDecreaseButton[index].direction = -1;
	difficultyIncreaseButton[index] = this.game.add.button(150,ypos,"increaseDifficulty",difficultyButtonClick,this,1,0,0,0);
	difficultyIncreaseButton[index].name = index;
	difficultyIncreaseButton[index].direction = 1;
	difficultyLevelControls.add(difficultyDecreaseButton[index]);
	difficultyLevelControls.add(difficultyIncreaseButton[index]);

	
}

var difficultyButtonClick = function(button) {
	var direction = 0;
	difficultyLevels[button.name] = difficultyLevels[button.name] + button.direction;
	updateDifficultyControls(currentLevel);
	playButtonClick();
};

var resetDifficultyLevels = function() {
	$.each(difficultySetting,function(index){
		difficultyLevels[index] = 0;
	});
};

var updateDifficultyControls = function(level) {

	var totalDifficultyMultiplier = 1.0;

	$.each(difficultySetting,function(index,control){
		difficultySettingValue[index].text = control.displayString(difficultyLevels[index]);
		difficultySettingMultiplier[index].text = "x "+control.multiplier(difficultyLevels[index]).toFixed(2);

		totalDifficultyMultiplier = totalDifficultyMultiplier * control.multiplier(difficultyLevels[index]);

		if (difficultyLevels[index]<=0)
		{
			difficultyDecreaseButton[index].inputEnabled = false;
			setTimeout(function(){difficultyDecreaseButton[index].frame = 2;},10);
		}
		else
		{
			difficultyDecreaseButton[index].inputEnabled = true;
			difficultyDecreaseButton[index].frame = 0;
		}

		if (level === null || difficultyLevels[index]>=control.maxLevel ||  playerData.levelScores[level] === undefined || !playerData.levelScores[level].passed )
		{
			difficultyIncreaseButton[index].inputEnabled = false;
			setTimeout(function(){difficultyIncreaseButton[index].frame=2;},10);
		}
		else
		{
			difficultyIncreaseButton[index].inputEnabled = true;
			difficultyIncreaseButton[index].frame = 0;
		}

	});

	totalDifficultyMultiplierText.text = "x "+totalDifficultyMultiplier.toFixed(2);
}

var calculateBasePoints = function(level){

	var totalBasePoints = 0;
	gameData.levels[level].waves.forEach(function(wave,index){
		wave.ships.forEach(function(ship,index){
			totalBasePoints = totalBasePoints + gameData.shipTypes[ship.type].basePoints;
		});
	});
	return totalBasePoints;
};

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
	playButtonClick();
	menuMusic.fadeOut(1000);
	levelData = {
		selectedLevel: selectedLevel,
		difficultyValues: difficultyLevels,
	};
	setTimeout(function(){this.game.state.start("PlayLevel",true,false,levelData);},1000);
};

var drawLevelParameter = function(parameterId, parameterTitle,ypos) {
	levelInfoParameter = {};
	levelInfoParameter[parameterId] = game.add.text(160,ypos,parameterTitle,levelParameterStyle);
	levelInfoParameter[parameterId].anchor.x = 1.0;

	levelInfoValue[parameterId] = game.add.text(180,ypos," ",levelValueStyle);
	levelInfoValue[parameterId].anchor.x = 0;
}


var difficultySetting = {
	shipSpeed: {
		name: "Ship Speed",
		value: function(level) {
			return level*10;
		},
		displayString: function(level) {
			return "+"+level*10+"%";
		},
		multiplier: function(level) {
			return 1 + level/20;
		},
		maxLevel: 20,
	},
	fireRate: {
		name: "Fire Rate",
		value: function(level) {
			return level*10;
		},
		displayString: function(level) {
			return "+"+level*10+"%";
		},
		multiplier: function(level) {
			return 1 + level/10;
		},
		maxLevel: 20,
	},
	numWaves: {
		name: "Extra Waves",
		value: function(level) {
			var extraWaves = [0,1,2,3,5,8,13,20,30]
			return extraWaves[level];
		},
		displayString: function(level) {
			return "+ "+this.value(level)+" waves";
		},
		multiplier: function(level){
			var extraWavesMult = [1, 1.1, 1.2, 1.3, 1.4, 1.6, 1.8, 2.0, 2.5];
			return extraWavesMult[level];
		},
		maxLevel: 8,
	}
};
