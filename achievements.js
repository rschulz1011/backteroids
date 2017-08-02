function Achievement(nameString,thresholds,upgradePoints,value)
{
	this.nameString = nameString;
	this.thresholds = thresholds;
	this.upgradePoints = upgradePoints;
	this.value = value;

	this.draw = function(x,y,playerStats) {
		var graphics = game.add.graphics(0, 0);

		earned = 1;

		//draw box around achievement
		graphics.lineStyle(1, 0x444444, 1);
		graphics.beginFill(0x111111, 1);
    	graphics.drawRect(x,y,250,40);

    	//add achievement text
    	titleText = game.add.text(x+10,y+12,this.titleText(earned),{font: "bold 12px Arial",fill:"#ffffff"});
    	titleText.anchor.x = 0;
    	titleText.anchor.y = 0.5;

    	//add blank progress bar
    	graphics.lineStyle(1, 0x666666, 1);
		graphics.beginFill(0x000000, 1);
    	graphics.drawRect(x+10,y+20,150,15);

    	//add reward text
    	rewardText = game.add.text(x+200,y+12,this.upgradePoints[earned]+" UP",{font: "bold 12px Arial",fill:"#aaaaff"});
    	rewardText.anchor.x = 0.5;
    	rewardText.anchor.y = 0.5;

    	//add progress bar
    	graphics.lineStyle(0, 0x666666, 1);
		graphics.beginFill(0x006600, 1);
    	graphics.drawRect(x+11,y+21,88,14);

    	//add progress text
    	progressText = game.add.text(x+85,y+30,"(18/30)",{font: "bold 10px Arial",fill:"#FFFF00"});
    	progressText.anchor.x = 0.5;
    	progressText.anchor.y = 0.5;

    	//add earned stars
    	game.load.image('star','res/levelStar.png');
    	for(var i = 0; i<5; i++)
    	{
    		var star = game.add.sprite(x+168+i*16,y+20,'star');
    		star.width = 13;
    		star.height = 13;
    		star.anchor.x=0;
    		star.anchor.y=0;

    		if (i>=earned) {
    			star.alpha = 0.1;
    		}

    	}
		return;
	}

	this.titleText = function(level)
	{

		return this.nameString.replace("{}",this.thresholds[level]);
	}

}

var achievements = {
	totalKills : new Achievement("{} Total Kills",
		[50,250,1000,5000,10000],
		[2,5,10,20,50],
		function(playerStats) {
			return playerStats.totalKills;
		}),
	levelsPlayed : new Achievement("{} Levels Played",
		[5,15,40,100,200],
		[2,5,10,20,50],
		function(playerStats) {
			return playerStats.levelsPlayed;
		}),
}