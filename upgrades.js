var upgrades = {

	rockSpeed: {
		name: "Rock Speed",
		x: 300,
		y: 50,
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
		x: 230,
		y: 50,
		prereq: [],
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
		x: 290,
		y: 130,
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
		x: 230,
		y: 200,
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
		x: 480,
		y: 130,
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
		x: 420,
		y: 200,
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
		x: 670,
		y: 130,
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
		x: 510,
		y: 50,
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
		x: 440,
		y: 50,
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
		x: 370,
		y: 50,
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
	randomRocks : {
		name: "Random Rocks",
		x: 580,
		y: 50,
		prereq: [],
		minLevel: 10,
		imageFrame: 10,
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
			playerData.recharge.randomRocks = this.value(level)
		},
		description: "A random rock appears every {} seconds",
		maxUpgrade: 20,
	},
	confuseWarps : {
		name: "Confuse Warps",
		x: 540,
		y: 200,
		prereq: ["numConfuse"],
		minLevel: 8,
		imageFrame: 11,
		cost: function(level) { 
			return 3;
		},
		value: function(level) {
			var useWarps = [0, 25, 50, 75, 100];
			// must be null if level = 0
			return useWarps[level];
		},
		setUpgrade: function(playerData,level) {
			playerData.confuseWarps = this.value(level) / 100;
		},
		description: "Confuse has {}% chance/sec to use warp",
		maxUpgrade: 4,
	},
	numUfos : {
		name: "UFOs",
		x: 480,
		y: 280,
		prereq: [],
		minLevel: 25,
		imageFrame: 12,
		cost: function(level) {
			return 3 + level;  
		},
		value: function(level) {
			return level;
		},
		setUpgrade: function(playerData,level)
		{
			playerData.numUfos = level;
		},
		description: "Start level {} UFOs",
		maxUpgrade: 9,
	},
	ufoShield : {
		name: "UFO Shield",
		x: 320,
		y: 350,
		prereq: ["numUfos"],
		minLevel: 25,
		imageFrame: 13,
		cost: function(level) {
			return Math.floor(3+level/2);  
		},
		value: function(level) {
			return level + 1;
		},
		setUpgrade: function(playerData,level)
		{
			playerData.ufoShield = this.value(level);
		},
		description: "Ufos can take {} hits",
		maxUpgrade: 7,
	},
	ufoFireRate : {
		name: "UFO Fire Rate",
		x: 400,
		y: 350,
		prereq: ["numUfos"],
		minLevel: 28,
		imageFrame: 14,
		cost: function(level) {
			return Math.floor(2 + level/3);  
		},
		value: function(level) {
			return Math.floor(200 * Math.pow(0.9,level)) /100;
		},
		setUpgrade: function(playerData,level)
		{
			playerData.ufoFireRate = this.value(level) * 1000;
		},
		description: "Ufos fire every {} seconds",
		maxUpgrade: 12,
	},
	ufoRecharge : {
		name: "UFO Recharge",
		x: 480,
		y: 350,
		prereq: ["numUfos"],
		minLevel: 32,
		imageFrame: 15,
		cost: function(level) { 
			var levelCost = [8,4,4,4,5,5,5,5,6,6];
			return levelCost[level-1];
		},
		value: function(level) {
			
			var rechargeTime = [null,60,50,45,40,35,30,25,22,20,18];
			// must be null if level = 0
			return rechargeTime[level];
		},
		setUpgrade: function(playerData,level) {
			playerData.recharge.ufo = this.value(level)
		},
		description: "Get a new UFO every {} seconds",
		maxUpgrade: 10,
	},
	ufoAccuracy : {
		name: "UFO Accuracy",
		x: 560,
		y: 350,
		prereq: ["numUfos"],
		minLevel: 30,
		imageFrame: 17,
		cost: function(level) {
			return 2 + level;  
		},
		value: function(level) {
			return level + 1;
		},
		setUpgrade: function(playerData,level)
		{
			playerData.ufoAccuracy = this.value(level);
		},
		description: "UFO accuracy is level {}",
		maxUpgrade: 10,
	},
    ufoEvasion : {
		name: "UFO Evasion",
		x: 640,
		y: 350,
		prereq: ["numUfos"],
		minLevel: 30,
		imageFrame: 16,
		cost: function(level) {
			return 4;  
		},
		value: function(level) {
			return level +1;
		},
		setUpgrade: function(playerData,level)
		{
			playerData.ufoEvasion = this.value(level);
		},
		description: "UFO evasion is level {}",
		maxUpgrade: 4,
	},
	stunRecharge : {
		name: "Stun Recharge",
		x: 290,
		y: 200,
		prereq: ["numStuns"],
		minLevel: 15,
		imageFrame: 18,
		cost: function(level) { 
			var levelCost = [6,3,3,3,4,4,4,6,6,7];
			return levelCost[level-1];
		},
		value: function(level) {
			
			var rechargeTime = [null,60,50,45,40,35,30,25,22,20,18];
			// must be null if level = 0
			return rechargeTime[level];
		},
		setUpgrade: function(playerData,level)
		{
			playerData.recharge.stun = this.value(level);
		},
		description: "Get a new stun power every {} seconds",
		maxUpgrade: 10,
	},
	stunShields : {
		name: "Stun Shield Drain",
		x: 350,
		y: 200,
		prereq: ["numStuns"],
		minLevel: 25,
		imageFrame: 19,
		cost: function(level) { 
			return level + 2;
		},
		value: function(level) {
			return level * 2;
		},
		setUpgrade: function(playerData,level)
		{
			playerData.stunShields = this.value(level);
		},
		description: "Stun drains {}% of sheids of second",
		maxUpgrade: 10,
	},
};


//converge recharge = 610, 200
//converge velocity = 670,200
//converge follow = 730,200


