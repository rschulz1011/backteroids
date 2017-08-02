function Achievement(nameString,thresholds,upgradePoints,value)
{
	this.nameString = nameString;
	this.thresholds = thresholds;
	this.upgradePoints = upgradePoints;
	this.value = value;
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