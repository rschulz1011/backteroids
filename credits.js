var credits = function(game){};

credits.prototype = {

	preload: function() {
		preLoadButtons();
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
	},

	create: function() {
		addMuteButton(765,30);
		createNavigationButtons("Credits");

		topText = game.add.text(400,55,"Credits",{fill:"#ffffff"});
		topText.anchor.x = 0.5;
		topText.anchor.y = 0.5;

		createCreditLine("Brought to you by","So-and-So Studios", 255, 0);
		createCreditLine("Designer/Developer","Ryan Schulz", 285, 1);
		createCreditLine("Music","Abbey Panitzke", 315, 2);
		createCreditLine("Title Art","Linda Schulz", 345, 3);

		displayTotalScore();
		calculatePlayerLevel(gameData);
		displayPlayerLevel();
	},
}

var createCreditLine = function(title,name,yloc,index) {

	var titleStyle = {font: "18px Arial",fill:"#ffffff"};
	var creditTitleText = game.add.text(385,yloc+500,title,titleStyle);
	creditTitleText.anchor.x = 1;
	creditTitleText.anchor.y = 0.5;

	var nameStyle =  {font: "24px Arial",fill:"#ffffff"};
	var creditNameText = game.add.text(415,yloc+500,name,nameStyle);
	creditNameText.anchor.x = 0;
	creditNameText.anchor.y = 0.5;

	setTimeout(function(){
		game.add.tween(creditTitleText).to({y:yloc},2000,Phaser.Easing.Quadratic.Out,true);
		game.add.tween(creditNameText).to({y:yloc},2000,Phaser.Easing.Quadratic.Out,true);
	},500+1000*index);
}