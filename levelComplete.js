var levelComplete = function(game){};

levelComplete.prototype = {

	init: function(gameData,performanceData) {
		this.gameData = gameData;
		this.performanceData = performanceData;
	},

	preload: function() {
		game.load.image('nextLevel','res/nextLevel.png');
	},

	create: function() {
		var playButton = this.game.add.button(400,500,'nextLevel',this.playButtonClick,this);
		playButton.anchor.setTo(0.5,0.5);

		if (this.performanceData.success === true)
		{
			levelResult = "Level Complete";
		}
		else
		{
			levelResult = "Level Failed";
		}

		var levelResultText = game.add.text(400,80,levelResult,{font:"24px Arial",fill:"#ffffff"});
		levelResultText.anchor.set(0.5);

		if (playerData.levelScores[this.performanceData.level])
		{
			oldScore = playerData.levelScores[this.performanceData.level].bestScore;
		}
		else
		{
			oldScore = 0;
		}
			
		playerData.levelScores[this.performanceData.level] = {
			passed: this.performanceData.success,
			bestScore: Math.max(this.performanceData.score,oldScore)		
		};

		displayTotalScore();
		var prevLevel = playerData.level;
		calculatePlayerLevel(gameData);
		if (playerData.level > prevLevel)
		{
			setTimeout(function(){displayLevelUp(playerData.level);},1000);
		}
		displayPlayerLevel();

	},

	playButtonClick: function() {
		this.game.state.start("LevelSelect",true,false);
	},
}

function displayLevelUp(newLevel) {
	var levelUpStyle = {font: "Italic 22px Arial", fill: "#FFFF00"};
	var levelUpText = game.add.text(850,35,"LEVEL UP!",levelUpStyle);
	game.add.tween(levelUpText).to({x: 560},500,"Linear",true);	
}