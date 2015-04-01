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

};



