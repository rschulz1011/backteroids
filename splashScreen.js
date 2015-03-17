var splashScreen = function(game){};

splashScreen.prototype = {

	preload: function() {
		game.load.image('playButton','res/playButton.png');
	},

	create: function() {
		var playButton = this.game.add.button(400,300,'playButton',this.playButtonClick,this);
		playButton.anchor.setTo(0.5,0.5);
	},

	playButtonClick: function() {
		this.game.state.start("LevelSelect");
	}
}