var splashScreen = function(game){};

splashScreen.prototype = {

	preload: function() {
		game.load.image('playButton','res/playButton.png');
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
		preLoadSounds();
	},

	create: function() {
		addMuteButton(765,30);
		var playButton = this.game.add.button(400,300,'playButton',this.playButtonClick,this);
		playButton.anchor.setTo(0.5,0.5);
	},

	playButtonClick: function() {
		playButtonClick();
		this.game.state.start("LevelSelect");
	}
}