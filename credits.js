var credits = function(game){};

credits.prototype = {

	preload: function() {
		preLoadButtons();
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
	},

	create: function() {
		addMuteButton(765,30);
		createNavigationButtons("Credits");
		thisText = game.add.text(400,300,"Coming Soon!",{fill:"#ffffff"});
		thisText.anchor.x = 0.5;
		thisText.anchor.y = 0.5;

		displayTotalScore();
		calculatePlayerLevel(gameData);
		displayPlayerLevel();
	},
}