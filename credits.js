var credits = function(game){};

credits.prototype = {

	preload: function() {
		preLoadButtons();
	},

	create: function() {
		createNavigationButtons("Credits");
		thisText = game.add.text(400,300,"Coming Soon!",{fill:"#ffffff"});
		thisText.anchor.x = 0.5;
		thisText.anchor.y = 0.5;

		displayTotalScore();
		calculatePlayerLevel(gameData);
		displayPlayerLevel();
	},
}