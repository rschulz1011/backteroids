var upgrades = {

	rockSpeed: {
		name: "Rock Speed",
		x: 300,
		y: 200,
		prereq: [],
		minLevel: 2,
		imageFrame: 0,
		cost: function(level) {
			return 2;
		},
		value: function(level) {
			return 100 + level * 10;
		},
		setUpgrade: function(playerData,level)
		{
			playerData.maxRockSpeed = this.value(level);
		},
		description: "Rocks have a max speed of {}",
		maxUpgrade: 30,
	},
	moreRocks: {
		name: "More Rocks",
		x: 400,
		y: 200,
		prereq: ["rockSpeed"],
		minLevel: 3,
		imageFrame: 1,
		cost: function(level) {
			return 1+level;
		},
		value: function(level) {
			return level+3;
		},
		setUpgrade: function(playerData,level)
		{
			playerData.maxRocks = this.value(level);
		},
		description: "Start level with {} rocks",
		maxUpgrade: 12,
	},
	numStuns : {
		name: "Stun Powers",
		x: 300,
		y: 275,
		prereq: [],
		minLevel: 4,
		imageFrame: 2,
		cost: function(level) {
			return 2 + Math.floor(level/2);
		},
		value: function(level) {
			return level;
		},
		setUpgrade: function(playerData,level)
		{
			playerData.maxStuns = level;
		},
		description: "Start level with {} Stun Powers",
		maxUpgrade: 9,
	},
	stunTime : {
		name: "StunDuration",
		x: 375,
		y: 275,
		prereq: ["numStuns"],
		minLevel: 4,
		imageFrame: 6,
		cost: function(level) {
			return 1 + Math.floor(level/2);
		},
		value: function(level) {
			return Math.round((1 + level * .1) * 10)/10;
		},
		setUpgrade: function(playerData,level) {
			playerData.stunTime = this.value(level) * 1000;
		},
		description: "Confuse Power lasts {} seconds",
		maxUpgrade: 30,
	},
	numConfuse : {
		name: "Confuse Powers",
		x: 300,
		y: 350,
		prereq: [],
		minLevel: 5,
		imageFrame: 3,
		cost: function(level) {
			return 2 + Math.floor(level/2);
		},
		value: function(level) {
			return level;
		},
		setUpgrade: function(playerData,level) {
			playerData.maxConfuse = level;
		},
		description: "Start level with {} Confuse Powers",
		maxUpgrade: 9,
	},
	confuseTime : {
		name: "ConfuseDuration",
		x: 375,
		y: 350,
		prereq: ["numConfuse"],
		minLevel: 5,
		imageFrame: 5,
		cost: function(level) {
			return 1 + Math.floor(level/3);
		},
		value: function(level) {
			return Math.round((1.4 + level * .2) * 10)/10;
		},
		setUpgrade: function(playerData,level) {
			playerData.confuseTime = this.value(level) * 1000;
		},
		description: "Confuse Power lasts {} seconds",
		maxUpgrade: 30,
	},
	numConverge : {
		name: "Converge Powers",
		x: 300,
		y: 425,
		prereq: [],
		minLevel: 7,
		imageFrame: 4,
		cost: function(level) {
			return 4 + Math.floor(level/2);
		},
		value: function(level) {
			return level;
		},
		setUpgrade: function(playerData,level) {
			playerData.maxConverge = level;
		},
		description: "Start level with {} Converge Powers",
		maxUpgrade: 9,
	},
	safeRadius : {
		name: "Safe Radius",
		x: 600,
		y: 120,
		prereq: [],
		minLevel: 15,
		imageFrame: 7,
		cost: function(level) { 
			return 1+level;
		},
		value: function(level) {
			return 5 * level;
		},
		setUpgrade: function(playerData,level) {
			playerData.safeRadius = 1 - this.value(level)/100;
		},
		description: "Ships safe radius shrinks by {} %",
		maxUpgrade: 15,
	},
	rockSplit : {
		name: "Rock Splitting",
		x: 520,
		y: 120,
		prereq: [],
		minLevel: 5,
		imageFrame: 8,
		cost: function(level) { 
			return Math.round(1+Math.floor(level/0.5));
		},
		value: function(level) {
			return 2 + 0.1 * level;
		},
		setUpgrade: function(playerData,level) {
			playerData.rockSplit = this.value(level)
		},
		description: "Rocks create an average of {} smaller rocks",
		maxUpgrade: 20,
	},
	rockRecharge : {
		name: "Rock Recharge",
		x: 420,
		y: 120,
		prereq: [],
		minLevel: 15,
		imageFrame: 9,
		cost: function(level) { 
			var levelCost = [8,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8];
			return levelCost[level-1];
		},
		value: function(level) {
			
			var rechargeTime = [null,60,50,45,40,35,30,25,22,20,18,16,14,12,10,9,8,7,6,5,4];
			// must be null if level = 0
			return rechargeTime[level];
		},
		setUpgrade: function(playerData,level) {
			playerData.recharge.rocks = this.value(level)
		},
		description: "Get a new rock every {} seconds",
		maxUpgrade: 20,
	},

};



