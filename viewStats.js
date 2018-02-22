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
		displayStatLine(200,100,statCategories.levelsFailed);
		displayStatLine(200,125,statCategories.levelsPassed);

		displayStatLine(200,175,statCategories.totalKills);
		displayStatLine(200,200,statCategories.quickKills);
		displayStatLine(200,225,statCategories.instantKills);
		displayStatLine(200,250,statCategories.directHits);

		displayStatLine(200,300,statCategories.rocksLaunched);

		displayStatLine(450,75,statCategories.warpsForced);
		displayStatLine(450,100,statCategories.shieldsDepleted);

		displayStatLine(450,150,statCategories.shipsDiscovered);
		displayStatLine(450,175,statCategories.shipsKilled);

		displayStatLine(450,225,statCategories.totalPowersUsed);
		displayStatLine(450,250,statCategories.confuseUsed);
		displayStatLine(450,275,statCategories.stunUsed);
		displayStatLine(450,300,statCategories.convergeUsed);
		displayStatLine(450,325,statCategories.ufosUsed);


		displayStatLine(700,75,statCategories.achievementsEarned);
		displayStatLine(700,125,statCategories.bestDifficultyMultiplier);

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
	levelsPassed: {
		displayText: "Levels Passed",
		value: function(playerStats) {
			return playerStats.levelsPassed;
		}
	},
	levelsFailed: {
		displayText: "Levels Failed",
		value: function(playerStats) {
			return playerStats.levelsPlayed - playerStats.levelsPassed;
		}
	},
	warpsForced: {
		displayText: "Warps Forced",
		value: function(playerStats) {
			return playerStats.warpsForced;
		}
	},
	achievementsEarned: {
		displayText: "Achievements Earned",
		value: function(playerStats) {
			var totalEarned = 0;
			$.each(achievements,function(index,achievement){
				totalEarned = totalEarned + achievement.earned(playerData.playerStats);
			});
			return totalEarned;
		}
	},
	shieldsDepleted: {
		displayText: "Shields Depleted",
		value: function(playerStats) {
			return playerStats.shieldsDepleted;
		}
	},
	shipsDiscovered: {
		displayText: "Ship Types Discovered",
		value: function(playerStats) {
			var types=0;
			$.each(playerStats.shipStats,function(index,shipStats) {
				if (shipStats.e > 0) { types ++;} 
			});
			return types;
		}
	},
	shipsKilled: {
		displayText: "Ship Types Killed",
		value: function(playerStats) {
			var types=0;
			$.each(playerStats.shipStats,function(index,shipStats) {
				if (shipStats.k > 0) { types ++;} 
			});
			return types;
		}
	},
	totalPowersUsed: {
		displayText: "Total Powers Used",
		value: function(playerStats) {
			return playerStats.stunUsed+playerStats.confuseUsed+playerStats.convergeUsed+playerStats.ufosUsed;
		}
	},
	confuseUsed: {
		displayText: "Confuse Used",
		value: function(playerStats) {
			return playerStats.confuseUsed;
		}
	},
	stunUsed: {
		displayText: "Stuns Used",
		value: function(playerStats) {
			return playerStats.stunUsed;
		}
	},
	convergeUsed: {
		displayText: "Converges Used",
		value: function(playerStats) {
			return playerStats.convergeUsed;
		}
	},
	ufosUsed: {
		displayText: "UFO's Used",
		value: function(playerStats) {
			return playerStats.ufosUsed;
		}
	},
	rocksLaunched: {
		displayText: "Rocks Launched",
		value: function(playerStats) {
			return playerStats.rocksLaunched;
		}
	},
	bestDifficultyMultiplier: {
		displayText: "Best Difficulty Multiplier",
		value: function(playerStats) {
			return playerStats.bestDifficultyMultiplier;
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
	levelsPassed: 0,
	warpsForced: 0,
	shieldsDepleted: 0,
	confuseUsed: 0,
	stunUsed: 0,
	convergeUsed: 0,
	ufosUsed: 0,
	rocksLaunched: 0,
	bestDifficultyMultiplier: 0,
	shipStats: {},
};

