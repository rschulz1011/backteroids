function Achievement(nameString,thresholds,upgradePoints,value)
{
	this.nameString = nameString;
	this.thresholds = thresholds;
	this.upgradePoints = upgradePoints;
	this.value = value;

	this.draw = function(x,y,playerStats) {
		var graphics = game.add.graphics(0, 0);

		achievementsEarned = this.earned(playerStats);

		//draw box around achievement
		graphics.lineStyle(1, 0x444444, 1);
		graphics.beginFill(0x111111, 1);
    	graphics.drawRect(x,y,250,40);

    	//add achievement text
    	titleText = game.add.text(x+10,y+12,this.titleText(achievementsEarned),{font: "bold 12px Arial",fill:"#ffffff"});
    	titleText.anchor.x = 0;
    	titleText.anchor.y = 0.5;

    	//add blank progress bar
    	graphics.lineStyle(1, 0x666666, 1);
		graphics.beginFill(0x000000, 1);
    	graphics.drawRect(x+10,y+20,150,15);

    	//add reward text
    	rewardText = game.add.text(x+200,y+12,this.upgradePoints[achievementsEarned]+" UP",{font: "bold 12px Arial",fill:"#aaaaff"});
    	rewardText.anchor.x = 0.5;
    	rewardText.anchor.y = 0.5;

    	//add progress bar
    	graphics.lineStyle(0, 0x666666, 1);
		graphics.beginFill(0x006600, 1);
    	graphics.drawRect(x+11,y+21,150 * this.progress(playerStats),14);

    	//add progress text
    	progressText = game.add.text(x+85,y+30,
    		"("+this.value(playerStats)+"/"+this.thresholds[achievementsEarned]+")",
    		{font: "bold 10px Arial",fill:"#FFFF00"});
    	progressText.anchor.x = 0.5;
    	progressText.anchor.y = 0.5;

    	//add earned stars
    	game.load.image('star','res/levelStar.png');
    	for(var i = 0; i<this.thresholds.length; i++)
    	{
    		var star = game.add.sprite(x+168+i*16,y+20,'star');
    		star.width = 13;
    		star.height = 13;
    		star.anchor.x=0;
    		star.anchor.y=0;

    		if (i>=achievementsEarned) {
    			star.alpha = 0.1;
    		}

    	}
		return;
	}

	this.titleText = function(level)
	{
		return this.nameString.replace("{}",this.thresholds[level]);
	}

	this.earned = function(playerStats)
	{
		var val = this.value(playerStats);
		earned = 0;
		for (var i=0; i<this.thresholds.length; i++)
		{
			if (val >= thresholds[i]) {earned++;}
		}
		return earned;
	}

	this.progress = function(playerStats)
	{
		var val = this.value(playerStats);
		var achievementsEarned = this.earned(playerStats);

		var valStart = 0;
		if (achievementsEarned > 0 ) { valStart = this.thresholds[achievementsEarned-1];}

		var valEnd = this.thresholds[achievementsEarned]; 

		var progress = (val - valStart) / (valEnd-valStart);

		return progress;
	}

	this.upgradePointsEarned = function(playerStats)
	{
		var achievementsEarned = this.earned(playerStats);
		var pointsEarned = 0;
		for (var i=0; i<achievementsEarned; i++)
		{
			pointsEarned = pointsEarned + upgradePoints[i];
		}
		return pointsEarned;
	}

}

var achievements = {
	totalKills : new Achievement("{} Total Kills",
		[50,250,1000,5000,10000],
		[2,5,10,20,50],
		function(playerStats) {
			return playerStats.kills;
		}),
	levelsPlayed : new Achievement("{} Levels Played",
		[5,15,40,100,200],
		[2,5,10,20,50],
		function(playerStats) {
			return playerStats.levelsPlayed;
		}),
	quickKills : new Achievement("{} Quick Kills",
		[20,100,500,2000,5000],
		[2,5,10,20,50],
		function(playerStats) {
			return playerStats.quickKills;
		}),
	instantKills : new Achievement("{} Instant Kills",
		[10,50,250,1000,2500],
		[2,5,10,20,50],
		function(playerStats) {
			return playerStats.instantKills;
		}),
	directHits : new Achievement("{} Direct Hits",
		[10,50,250,1000,2500],
		[2,5,10,20,50],
		function(playerStats) {
			return playerStats.directHits;
		}),
	goodiesCollected : new Achievement("{} Goodies Collected",
		[2,25,100,500,1000],
		[2,5,10,20,50],
		function(playerStats) {
			return playerStats.goodiesCollected;
		}),

}

function AchievementEarned(displayString,upgradePoints,numStars)
{
	this.displayString = displayString;
	this.upgradePoints = upgradePoints;
	this.numStars = numStars;

	this.draw = function(x,y) {

		var achievementWidth = 250;
		var achievementHeight = 38;
		var bmd = game.add.bitmapData(achievementWidth,achievementHeight);

    	bmd.ctx.beginPath();
    	bmd.ctx.rect(0,0,achievementWidth,achievementHeight);
    	bmd.ctx.fillStyle = '#444444';
    	bmd.ctx.fill();

    	var background = game.add.sprite(x,y,bmd);

    	var achievementNameStyle = {font: "bold 16px Arial", fill: "#FFFFFF"};
    	var achievementTitle = game.add.text(0,0,this.displayString,achievementNameStyle);
    	achievementTitle.anchor.x = 0.5;
    	achievementTitle.x = achievementWidth/2;
    	background.addChild(achievementTitle);

    	var rewardStyle = {font: "bold 12px Arial",fill:"#aaaaff"};
    	var rewardText = game.add.text(achievementWidth/4,20,this.upgradePoints+" UP",{font: "bold 12px Arial",fill:"#aaaaff"});
    	rewardText.anchor.x = 0.5;
    	background.addChild(rewardText);

    	game.load.image('star','res/levelStar.png');
    	var starWidth = numStars*13;
    	for(var i = 0; i<this.numStars; i++)
    	{
    		var star = game.add.sprite(achievementWidth*0.75-starWidth/2+i*13,20,'star');
    		star.width = 13;
    		star.height = 13;
    		star.anchor.x=0;
    		star.anchor.y=0;

    		background.addChild(star);
    	}
    	

	}
}