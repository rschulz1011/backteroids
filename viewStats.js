var viewStats = function(game){};

viewStats.prototype = {

	preload: function() {
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
		preLoadButtons();
	},

	create: function() {
		addMuteButton(765,30);
		createNavigationButtons("ViewStats");

		displayStatLine(200,75,statCategories.levelsPlayed);

		displayStatLine(200,125,statCategories.totalKills);
		
		displayStatLine(200,150,statCategories.quickKills);
		displayStatLine(200,175,statCategories.instantKills);
		displayStatLine(200,200,statCategories.directHits);

		displayTotalScore();
		calculatePlayerLevel(gameData);
		displayPlayerLevel();
	},
}

function displayStatLine(x,y,stat)
{
	statTitleText = game.add.text(x,y,stat.displayText,{font: "16px Arial",fill:"#ffffff"});
	statTitleText.anchor.x = 1;
	statValueText = game.add.text(x+20,y,stat.value(playerData.playerStats).toFixed(0),{font: "bold 16px Arial",fill:"#ffff00"});
	statValueText.anchor.x = 0;
}


statCategories = {
	totalKills: {
		displayText: "Total Kills",
		value: function(playerStats) {
			return playerStats.kills;
		}
	},
	quickKills: {
		displayText: "Quick Kills",
		value: function(playerStats) {
			return playerStats.quickKills;
		}
	},
	instantKills: {
		displayText: "Instant Kills",
		value: function(playerStats) {
			return playerStats.instantKills;
		}
	},
	directHits: {
		displayText: "Direct Hits",
		value: function(playerStats) {
			return playerStats.directHits;
		}
	},
	levelsPlayed: {
		displayText: "Levels Played",
		value: function(playerStats) {
			return playerStats.levelsPlayed;
		}
	},
};

var playerStats = {
	kills : 0,
	levelsPlayed: 0,
	quickKills: 0,
	instantKills: 0,
	directHits: 0,
	goodiesCollected: 0,
};