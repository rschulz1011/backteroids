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
			return 2+level;
		},
		value: function(level) {
			return 5 * level;
		},
		setUpgrade: function(playerData,level) {
			playerData.safeRadius = 1 - this.value(level)/100;
		},
		description: "Ships safe radius shrinks by {} %",
		maxUpgrade: 15,
	}

};



