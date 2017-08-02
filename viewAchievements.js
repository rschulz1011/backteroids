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
		$.each(achievements,function(index,achievement){
			achievement.draw(50,100 + 50*ii,playerData.playerStats);
			ii++;
		});

	},
}