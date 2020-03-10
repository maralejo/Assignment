(function(){

let assigmentModule = angular.module("assigment",[]);


assigmentModule.controller('castlesController',function($scope){

    $scope.terrainInput = '';
    $scope.valleys = 0;
    $scope.peaks = 0;

    $scope.processData = () => {
        //reset
        $scope.valleys = 0;
        $scope.peaks = 0;
        let terrain = '';

        try {
            terrain = $scope.terrainInput.split(',').map((item) => parseInt(item));
        }
        catch(err) {
            $scope.error = "Error trying to process the data, please make sure it is in the right format i.e. 2,6,6,3";

        }


        let cleanTerrain = removePlainTerrain(terrain);
        calculateCastles(cleanTerrain);
    }

    let removePlainTerrain = (terrain) => {
        return terrain.filter((item, index, arr) => {
            return index === 0 || item !== arr[index - 1];
        });
    }

    let calculateCastles = (data) => {
        for(const [index] of data.entries()){
            if(isValley(index + 1, data)) {
                $scope.valleys++;
            }else if(isPeak(index + 1, data)) {
                $scope.peaks++;
            }
        }
    }

    let isValley = (index, terrain) => {
        return terrain[index - 1] > terrain[index] && terrain[index] < terrain[index + 1];
    }

    let isPeak = (index, terrain) => {
        return terrain[index - 1] < terrain[index] && terrain[index] > terrain[index + 1];
    }

});

assigmentModule.controller('transformersController',function($scope){
class Bot {
    constructor(name, team, strength, intelligence, speed, endurance, rank, courage, firepower, skill, isAlive = true, hasBattled = false){
        this.name = name.toLowerCase();
        this.team = team.toUpperCase();
        this.strength = parseInt(strength);
        this.intelligence = parseInt(intelligence);
        this.speed = parseInt(speed);
        this.endurance = parseInt(endurance);
        this.rank = parseInt(rank);
        this.courage = parseInt(courage);
        this.firepower = parseInt(firepower);
        this.skill = parseInt(skill);
        this.isAlive = isAlive;
        this.hasBattled = hasBattled;
    }
}

let bots = [];
$scope.botInput = '';

$scope.gameParams = {
    gameOver : false,
    numberOfBattles: 0,
    decepticonsVictories: 0,
    autobotsVictories: 0,
    winningTeam: ''

};

$scope.onBattle = () => {
    //reset
    bots = [];
    $scope.gameParams.gameParams = false;
    $scope.gameParams.numberOfBattles = 0;
    $scope.gameParams.decepticonsVictories = 0;
    $scope.gameParams.autobotsVictories = 0;
    $scope.gameParams.winningTeam = ''

    processData();
    sortBots();
    matchUp();
    getWinningTeam();
}

let processData = () => {
    let arr = [];

    if($scope.botInput){
        arr = $scope.botInput.split('\n');
        for(let item of arr){
            bots.push(new Bot(...item.split(',')));
        }
    }
};

$scope.getSurvivingLoosers = () => {
    if ($scope.gameParams.winningTeam === _TIE) return [];
    return bots.filter((bot) => {
        return bot.team !== $scope.gameParams.winningTeam && bot.isAlive;
    });
}

const _OPTIMUS = "obtimus prime";
const _PREDAKING = "predaking";
const _DECEPTICONS = "D";
const _AUTOBOT = "A";
const _TIE = "T";

let sortBots = ()=>{
    bots.sort((a,b) => b.rank - a.rank);
}

//Finds the right oponent of the oposite team
let matchUp = ()=>{
    for (const [index, bot] of bots.entries()){
        if (bot.hasBattled) continue;
        for(let i = index + 1; i < bots.length; i++){
            if (bot.team !== bots[i].team && !bots[i].hasBattled){
                battle(bot, bots[i])
                break;
            }
        }
    }
}

let calculateOverall = (bot) => {
    return bot.strength + bot.intelligence + bot.speed + bot.endurance + bot.firepower;
}

let registerVictory = (bot) => {
    if (bot.team === _DECEPTICONS){
        $scope.gameParams.decepticonsVictories++;
    } else {
        $scope.gameParams.autobotsVictories++;
    }
}

let battleRules = {
    isDuplicate: (botA, botB) => botA.name === botB.name,
    bothBosses: (botA, botB) => (botA.name === _OPTIMUS && botB.name === _PREDAKING) || (botA.name === _PREDAKING && botB.name === _OPTIMUS),
    getWinner: (botA, botB) => {
        let skillDiff = botA.skill - botB.skill;
        let courageDiff = botA.courage - botB.courage;
        let strengthDiff = botA.strength - botB.strength;
        let overallBotA = calculateOverall(botA);
        let overallBotB = calculateOverall(botB);

        if (botA.name === _OPTIMUS || botA.name === _PREDAKING) return botA;
        if (botB.name === _OPTIMUS || botB.name === _PREDAKING) return botB;

        if (courageDiff >= 4 && strengthDiff >= 3) return botA;
        if (courageDiff <= -4 && strengthDiff <= -3) return botB;

        if (skillDiff >= 3) return botA;
        if (skillDiff <= -3) return botB;

        if (overallBotA > overallBotB) return botA;
        if (overallBotA < overallBotB) return botB;

        return null;
    },
}

//Defines the winner between two bots
let battle = (botA, botB) => {
    let winner;
    botA.isAlive = false;
    botB.isAlive = false;
    if (battleRules.isDuplicate(botA,botB) || battleRules.bothBosses(botA,botB)) {
        $scope.gameParams.gameOver = true;
        throw new Error("Game has been terminated, check for duplicate bots or boss match");
    }

    winner = battleRules.getWinner(botA, botB);
    if (winner){
        registerVictory(winner);
        winner.isAlive = true;
    }

    botA.hasBattled = true;
    botB.hasBattled = true;
    $scope.gameParams.numberOfBattles++;
    
}


let getWinningTeam = () => {
    $scope.gameParams.winningTeam = $scope.gameParams.decepticonsVictories === $scope.gameParams.autobotsVictories ? _TIE :
    $scope.gameParams.decepticonsVictories > $scope.gameParams.autobotsVictories ? 
     _DECEPTICONS: _AUTOBOT;
}


});
})();

