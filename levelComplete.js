var levelComplete = function(game){};

var gameState;

levelComplete.prototype = {

	init: function(gameData,performanceData) {
		this.gameData = gameData;
		this.performanceData = performanceData;
		gameState = this;
	},

	preload: function() {
		game.load.image('nextLevel','res/nextLevel.png');
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
	},

	create: function() {

		var oldScore;
		addMuteButton(765,30);
		$.getJSON( "gameData.json", function( data ) {

			if (playerData.levelScores[gameState.performanceData.level])
			{
				oldScore = playerData.levelScores[gameState.performanceData.level].bestScore;
			}
			else
			{
				oldScore = 0;
			}

			gameData = data;
			displayTotalScore();
			calculatePlayerLevel(gameData);
			displayPlayerLevel();

						displayScoreLine(1,"Total Kills",gameState.performanceData.detailedScore.totalKills.toFixed(0),gameState.performanceData.detailedScore.basePoints.toFixed(0));
			displayScoreLine(2,"Direct Hits",gameState.performanceData.detailedScore.directHits.toFixed(0),Math.round(gameState.performanceData.detailedScore.directHitPoints).toFixed(0));
			displayScoreLine(3,"Instant Kills",gameState.performanceData.detailedScore.instantKills.toFixed(0),Math.round(gameState.performanceData.detailedScore.instantKillPoints).toFixed(0));
			displayScoreLine(4,"Quick Kills",gameState.performanceData.detailedScore.quickKills.toFixed(0),Math.round(gameState.performanceData.detailedScore.quickKillPoints).toFixed(0));
			displayScoreLine(5,"Kill Points","",gameState.performanceData.score.toFixed(0));
			displayScoreLine(6,"Difficulty Multiplier","x "+gameState.performanceData.difficultyMultiplier.toFixed(2),"",'multiplier');
			displayScoreLine(7,"Bonus Multiplier","x "+gameState.performanceData.bonusMultiplier.toFixed(2),"",'multiplier');

			if (gameState.performanceData.success === false)
			{
				rowShift = 1;
				passMultiplier = 0.30;
				displayScoreLine(8,"Level Failed","x 0.30","","levelFailed");
			}
			else
			{
				rowShift = 0;
				passMultiplier = 1.00;
			}

			totalScore = Math.round(gameState.performanceData.score*gameState.performanceData.difficultyMultiplier*gameState.performanceData.bonusMultiplier*passMultiplier);

			displayScoreLine(8+rowShift,"Total Score","",totalScore.toFixed(0),"totalScore");
			displayScoreLine(10+rowShift,"Previous Best","",oldScore.toFixed(0));
			displayScoreLine(11+rowShift,"New Points Earned","",Math.max(0,totalScore-oldScore).toFixed(0));

			playerData.levelScores[gameState.performanceData.level] = {
				passed: gameState.performanceData.success,
				bestScore: Math.max(totalScore,oldScore)		
			};

			var prevLevel = playerData.level;
		
			calculateTotalScore();
			calculatePlayerLevel(gameData);

			if (playerData.level > prevLevel)
			{
				setTimeout(function(){
					displayLevelUp(playerData.level);
				},3500);

			}

			setTimeout(function(){
				displayTotalScore();
				displayPlayerLevel();
				parent.kongregate.stats.submit("totalScore",playerData.totalScore);
			},4000);

			savePlayerData();
		})
		.fail(function(jqxhr, textStatus, error){
			var err = textStatus + ", " + error;
		});

		if (gameState.performanceData.success === true)
		{
			levelResult = "Level Complete";
		}
		else
		{
			levelResult = "Level Failed";
		}

		var levelResultText = game.add.text(400,80,levelResult,{font:"24px Arial",fill:"#ffffff"});
		levelResultText.anchor.set(0.5);
		
		createNavigationButtons();

		menuMusic.fadeIn(4000,true);
		//console.log(gameState.performanceData);

	},

}

function displayScoreLine(index,label,value1,value2,specialType)
{
	var xloc = 200;
	var yloc = 100 + 30*index;

	if (specialType !== "levelFailed")
	{
		var labelTextStyle = {font:"18px Arial", fill:"#FFFFFF"};
		var value1TextStyle = {font:"16px Arial", fill:"#FFFFFF"};
	}
	else
	{
		var labelTextStyle = {font: "18px Arial", fill: "#EE0000"};
		var value1TextStyle = {font:"16px Arial", fill:"#EE0000"};
	}
	
	if (specialType !== "totalScore")
	{
		var value2TextStyle = {font: "bold 18px Arial", fill: "#FFFF00"};
	}
	else
	{
		var value2TextStyle = {font: "bold 24px Arial", fill: "#FFFF00"};
	}

	var labelText = game.add.text(xloc,yloc,label,labelTextStyle);
	var value1Text = game.add.text(900,yloc,value1,value1TextStyle);
	var value2Text = game.add.text(990,yloc,value2,value2TextStyle);

	labelText.anchor.x = 1;
	labelText.anchor.y = 0.5;
	if (specialType !== "multiplier" & specialType !== "levelFailed")
	{
		value1Text.anchor.x = 1;
	}
	else
	{
		value1Text.anchor.x = 0;
	}
	value1Text.anchor.y = 0.5;
	value2Text.anchor.x = 1;
	value2Text.anchor.y = 0.5;

	setTimeout(function(){
		game.add.tween(value1Text).to({x:xloc+90},800,Phaser.Easing.Quadratic.Out,true);
		game.add.tween(value2Text).to({x:xloc+180},800,Phaser.Easing.Quadratic.Out,true);
	},500+200*index);

}

function displayLevelUp(newLevel) {
	var levelUpStyle = {font: "Italic 22px Arial", fill: "#FFFF00"};
	var levelUpText = game.add.text(850,35,"LEVEL UP!",levelUpStyle);
	game.add.tween(levelUpText).to({x: 560},500,"Linear",true);
	setTimeout(function(){
		var levelUpSound = game.add.audio('level_up');
		levelUpSound.play('',0,1,false);
		setTimeout(function(){levelUpSound.destroy()},1500);
	},500);	
}