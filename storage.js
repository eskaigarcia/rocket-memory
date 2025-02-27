// Information on a player's game save
const
player = {
    sound: true,
    unlocks: 0,
    highScore: 0,
    gamesStarted: 0,
    roundsPlayed: 0,
    corrects: 0,
    incorrects: 0,
    timeouts: 0,

    restart() {
        player.unlocks = 0;
        player.highScore = 0;
        player.gamesStarted = 0;
        player.roundsPlayed = 0;
        player.corrects = 0;
        player.incorrects = 0;
        player.timeouts = 0;
    },
}

// Information on all level configurations
const
levelInformation = [
    {
        id: 0,
        base: 4,
        exp: 4,
        reward: 50,
        baseSpeed: 1000,
        time: 15000,
    },
    {
        id: 1,
        base: 5,
        exp: 4,
        reward: 90,
        baseSpeed: 950,
        time: 13000,
    },
    {
        id: 2,
        base: 5,
        exp: 5,
        reward: 175,
        baseSpeed: 900,
        time: 11500,
    },
    {
        id: 3,
        base: 6,
        exp: 5,
        reward: 350,
        baseSpeed: 850,
        time: 10750,
    },
    {
        id: 4,
        base: 5,
        exp: 6,
        reward: 775,
        baseSpeed: 800,
        time: 10000,
    },
    {
        id: 5,
        base: 6,
        exp: 6,
        reward: 1250,
        baseSpeed: 750,
        time: 9500,
    },
    {
        id: 6,
        base: 7,
        exp: 6,
        reward: 1800,
        baseSpeed: 700,
        time: 9000,
    },
    {
        id: 7,
        base: 6,
        exp: 7,
        reward: 2650,
        baseSpeed: 650,
        time: 9500,
    },
    {
        id: 8,
        base: 7,
        exp: 7,
        reward: 3900,
        baseSpeed: 600,
        time: 10000,
    },
    {
        id: 9,
        base: 8,
        exp: 7,
        reward: 5225,
        baseSpeed: 550,
        time: 10500,
    },
    {
        id: 10,
        base: 7,
        exp: 8,
        reward: 8500,
        baseSpeed: 500,
        time: 11000,
    },
    {
        id: 11,
        base: 8,
        exp: 8,
        reward: 12000,
        baseSpeed: 450,
        time: 11500,
    },
    {
        id: 12,
        base: 9,
        exp: 8,
        reward: 25000,
        baseSpeed: 400,
        time: 12000,
    },
];
     