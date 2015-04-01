var buyUpgrades = function(game){};

buyUpgrades.prototype = {

	preload: function() {
		preLoadButtons();
		game.load.spritesheet('upgradeBlank','res/upgrade_blank.png',50,50);
		game.load.spritesheet('upgradeGraphics','res/upgrade_graphics.png',40,40);
		game.load.spritesheet('muteButton','res/mute_button.png',30,20);
	},

	create: function() {

		upgradePointsAvailable = countAvailableUpgradePoints();

		buttons = this.game.add.group();
		addMuteButton(765,30);
		var currentUpgrade;

		var graphics = game.add.graphics(0, 0);
		graphics.lineStyle(1, 0xCCCCCCC, 1);
		graphics.beginFill(0x333333, 1);
    	graphics.drawRect(5,33,205,315);

		var upgradeTextStyle = {font:"22px Arial",fill: "#FFFFFF"};
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

		upgradePointsAvailableText = this.game.add.text(100,370,"Upgrade Points: "+upgradePointsAvailable,costStyle);
		upgradePointsAvailableText.anchor.x = 0.5;

		currentLevelButtonTexts = {};
		upgradeButtons = {};

		$.each(upgrades,function(index,upgrade){
			upgrade.prereq.forEach(function(pr,index){
				graphics.lineStyle(1,0x666666,1)
				graphics.moveTo(upgrade.x+25,upgrade.y+25)
				graphics.lineTo(upgrades[pr].x+25,upgrades[pr].y+25);
			});
		});

		game.world.moveDown(graphics);

		$.each(upgrades,function(index,upgrade){

			var upgradeButton = game.add.button(upgrade.x,upgrade.y,'upgradeBlank',clickUpgradeButton,this);
			upgradeButton.id = index;
			upgradeButton.upgradeGraphics = game.add.sprite(upgrade.x+5,upgrade.y+5,'upgradeGraphics');
			upgradeButton.upgradeGraphics.frame = upgrade.imageFrame;
			buttons.add(upgradeButton);
			currentLevelButtonTexts[index] = game.add.text(upgrade.x+5,upgrade.y+30,playerData.upgradeLevels[index].toFixed(0),currentLevelTextStyle);
			upgradeButtons[index] = upgradeButton;
		});

		updateUpgradeButtons();

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

var countAvailableUpgradePoints = function()
{
	var totalPlayerPoints = (playerData.level-1) * 2;
	var pointsSpent = 0;
	$.each(upgrades,function(index,upgrade){
		for (i=1; i<=playerData.upgradeLevels[index]; i ++)
		{
			pointsSpent = pointsSpent + upgrades[index].cost(i);
		}
	});
	return totalPlayerPoints - pointsSpent;
}

var	clickUpgradeButton = function(button) {
	updateUpgradeButtons();
	button.frame = 1;
	fillUpgradeInfo(button.id);
	currentUpgrade = button.id;
}

var fillUpgradeInfo = function(id)
{
	var playerUpgradeLevel = playerData.upgradeLevels[id];
	var upgrade = upgrades[id];
	upgradeNameText.text = upgrade.name;
	thisLevelUpgradeText.text = "THIS LEVEL: "+upgrade.description.replace("{}",upgrade.value(playerUpgradeLevel));
	nextLevelUpgradeText.text = "NEXT LEVEL: "+upgrade.description.replace("{}",upgrade.value(playerUpgradeLevel+1));
	costText.text = "Upgrade Cost: "+upgrade.cost(playerUpgradeLevel+1);
	currentLevelText.text = "Current Level: "+ playerUpgradeLevel;

	buyButton.revive();
	buyButtonText.alpha = 1;

	if (playerUpgradeLevel >= upgrade.maxUpgrade | upgrade.cost(playerUpgradeLevel+1) > upgradePointsAvailable)
	{
		buyButton.kill();
		buyButtonText.alpha = 0;

		if (playerUpgradeLevel >= upgrade.maxUpgrade)
		{
			nextLevelUpgradeText.text = "NEXT LEVEL: \n MAX";
		}
	}
}

var buyUpgradeButtonClick = function()
{
	playerData.upgradeLevels[currentUpgrade]++;
	upgradePointsAvailable = countAvailableUpgradePoints();
	fillUpgradeInfo(currentUpgrade);
	updateUpgradeButtons();
	savePlayerData();
}

var updateUpgradeButtons = function()
{
	var levelNeededTextStyle = {font: "bold 10px Arial", fill:"#FFFFFF", align: "center"};
	$.each(upgrades,function(index,upgrade){

		if (playerData.level < upgrade.minLevel)
		{
			upgradeButtons[index].frame=2;
			upgradeButtons[index].alpha = 0.5;
			upgradeButtons[index].upgradeGraphics.alpha = 0.5;
			if (upgradeButtons[index].levelNeededText === undefined)
			{
				upgradeButtons[index].levelNeededText = game.add.text(upgradeButtons[index].x+25,upgradeButtons[index].y+25,
					"Unlock at\nLevel "+upgrade.minLevel,levelNeededTextStyle);
				currentLevelButtonTexts[index].text = "";
				upgradeButtons[index].levelNeededText.anchor.x = 0.5;
				upgradeButtons[index].levelNeededText.anchor.y = 0.5;
			}
			upgradeButtons[index].inputEnabled = false;

		}
		else if (!checkPrereqs(upgrade))
		{
			upgradeButtons[index].frame=2;
			upgradeButtons[index].alpha = 0.5;
			upgradeButtons[index].upgradeGraphics.alpha = 0.5;
			upgradeButtons[index].inputEnabled = false;
			currentLevelButtonTexts[index].text = "";
		}
		else
		{
			currentLevelButtonTexts[index].text = playerData.upgradeLevels[index].toFixed(0);
			upgradeButtons[index].alpha = 1;
			upgradeButtons[index].frame = 0;
			upgradeButtons[index].inputEnabled = true;
		}

		
	});

	upgradePointsAvailableText.text = "Upgrade Points: "+upgradePointsAvailable;
}

var checkPrereqs = function(upgrade)
{
	reqsMet = true;
	upgrade.prereq.forEach(function(pq,index){
		if (playerData.upgradeLevels[pq]===0)
		{
			reqsMet = false;
		}
	});
	return reqsMet;
}