var buyUpgrades = function(game){};

buyUpgrades.prototype = {

	preload: function() {
		preLoadButtons();
		game.load.spritesheet('upgradeBlank','res/upgrade_blank.png',50,50);
		game.load.spritesheet('upgradeGraphics','res/upgrade_graphics.png',40,40);
	},

	create: function() {

		buttons = this.game.add.group();

		var graphics = game.add.graphics(0, 0);
		graphics.lineStyle(1, 0xCCCCCCC, 1);
		graphics.beginFill(0x333333, 1);
    	graphics.drawRect(5,33,205,315);

		var upgradeTextStyle = {font:"24px Arial",fill: "#FFFFFF"};
		upgradeNameText = this.game.add.text(100,50,"Select Upgrade",upgradeTextStyle);
		upgradeNameText.anchor.x = 0.5;

		var currentLevelTextStyle = {font: "bold 14px Arial",fill: "#FFFF00"};
		currentLevelText = this.game.add.text(100,80,"Current Level: ",currentLevelTextStyle);
		currentLevelText.anchor.x = 0.5;

		var upgradeInfoStyle = {font: "12px Arial", fill:"#FFFFFF", wordWrap: true, wordWrapLength: 180};
		thisLevelUpgradeText = this.game.add.text(20,110,"THIS LEVEL: ",upgradeInfoStyle);
		nextLevelUpgradeText = this.game.add.text(20,190,"NEXT LEVEL: ",upgradeInfoStyle);

		var costStyle = {font: "bold 16px Arial", fill: "#AAAAFF"};
		costText = this.game.add.text(100,270,"Upgrade Cost: ",costStyle);
		costText.anchor.x = 0.5;

		$.each(upgrades,function(index,upgrade){

			var upgradeButton = game.add.button(upgrade.x,upgrade.y,'upgradeBlank',clickUpgradeButton,this);
			upgradeButton.id = index;
			var upgradeGraphics = game.add.sprite(upgrade.x+5,upgrade.y+5,'upgradeGraphics');
			upgradeGraphics.frame = upgrade.imageFrame;
			buttons.add(upgradeButton)

		});

		buyButton = this.game.add.button(100,300,"button_blank",buyUpgradeButtonClick,this,1,0,1,0);
		buyButton.anchor.x = 0.5;
		buyButton.kill();

		var buyButtonTextStyle = {font:"bold 12px Arial",fill: "#FFFFFF"};
		buyButtonText = this.game.add.text(100,320,"BUY UPGRADE",buyButtonTextStyle);
		buyButtonText.anchor.x = 0.5;
		buyButtonText.anchor.y = 0.5;
		buyButtonText.alpha = 0;

		displayTotalScore();
		calculatePlayerLevel(gameData);
		displayPlayerLevel();
		createNavigationButtons("BuyUpgrades");
	},



}

var	clickUpgradeButton = function(button) {
	buttons.forEach(function(b){b.frame=0;});
	button.frame = 1;
	fillUpgradeInfo(button.id);
}

var fillUpgradeInfo = function(id)
{
	var upgrade = upgrades[id];
	upgradeNameText.text = upgrade.name;
	thisLevelUpgradeText.text = "THIS LEVEL: "+upgrade.description.replace("{}",upgrade.value(0));
	nextLevelUpgradeText.text = "NEXT LEVEL: "+upgrade.description.replace("{}",upgrade.value(1));
	costText.text = "Upgrade Cost: "+upgrade.cost(1);
	currentLevelText.text = "Current Level: "+ 0;

	buyButton.revive();
	buyButtonText.alpha = 1;
}

var buyUpgradeButtonClick = function()
{

}