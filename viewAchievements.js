var viewAchievements = function(game){};

viewAchievements.prototype = {

	preload: function() {
		preLoadButtons();
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
	},

	create: function() {
		addMuteButton(765,30);
		createNavigationButtons("ViewAchievements");

		displayTotalScore();
		calculatePlayerLevel(gameData);
		displayPlayerLevel();

		var ii = 0;
		var totalEarned = 0;
		var totalAchievements = 0;

		$.each(achievements,function(index,achievement){
			achievement.draw(50,100 + 50*ii,playerData.playerStats);
			totalEarned = totalEarned + achievement.earned(playerData.playerStats);
			totalAchievements = totalAchievements + achievement.thresholds.length;
			ii++;
		});

		topText = game.add.text(400,55,"Achievements Earned: "+totalEarned+"/"+totalAchievements,{fill:"#ffffff"});
		topText.anchor.x = 0.5;
		topText.anchor.y = 0.5;

		thisText = game.add.text(400,80,"Total Upgrade Points Earned: "+calculateAchievementPointsEarned(),{font: "bold 14px Arial", fill:"#aaaaff"});
		thisText.anchor.x = 0.5;
		thisText.anchor.y = 0.5;

	},
}

var calculateAchievementPointsEarned = function()
{
	var totalPoints = 0;
	$.each(achievements,function(index,achievement){
		totalPoints = totalPoints + achievement.upgradePointsEarned(playerData.playerStats);
	});
	return totalPoints;
}