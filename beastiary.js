var beastiary = function(game){};

beastiary.prototype = {

	preload: function() {
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
		preLoadButtons();
	},

	create: function() {
		addMuteButton(765,30);
		createNavigationButtons("Beastiary");
		thisText = game.add.text(400,300,"Coming Soon!",{fill:"#ffffff"});
		thisText.anchor.x = 0.5;
		thisText.anchor.y = 0.5;

		displayTotalScore();
		calculatePlayerLevel(gameData);
		displayPlayerLevel();
	},
}