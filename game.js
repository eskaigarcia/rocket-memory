const 
level = {
    // Information on the active level, loads levelInformation from storage.js
    id: 0,
    base: 4,
    exp: 4,
    reward: 50,
    baseSpeed: 1000,
    speed: 1000,            // Gets copied from baseSpeed to be easily modified by ramping
    time: 15000,
    pitchShift: 2,          // [0-7] currently unused, might move to player settings

    load(which) {
        // Load levelInformation from storage.js
        level.id = levelInformation[which].id
        level.base = levelInformation[which].base
        level.exp = levelInformation[which].exp
        level.reward = levelInformation[which].reward
        level.baseSpeed = levelInformation[which].baseSpeed
        level.time = levelInformation[which].time
        document.getElementById('level').textContent = level.id + 1;
        timer.rampSpeed();
        timer.reset();
    },

},

timer = {
    timer: 0,
    lastTime: null,
    tickingActive: false,
    paused: true,

    tick() {
        // Credit for the ticking implementation: https://codepen.io/samanime/pen/LYjOvpd
        if(!this.tickingActive) return;
        const now = Date.now();
        const delta = now - this.lastTime;
        this.lastTime = now;
        if (!this.paused) { this.timer -= delta; }
        this.updateTimeBar();
        requestAnimationFrame(this.tick.bind(this));
        if(timer.timer <= 0) {
            player.timeouts++;
            round.end('lost');
        };
    },

    updateTimeBar() {
        // Updates the left progress bar on gameView with the timer
        document.getElementById('timeBar').value = timer.timer / level.time * 100;
    },

    rampSpeed() {
        // Reduces speed delay making levels faster as 
        (round.streak < 26) ? (level.speed=level.baseSpeed-(round.streak*15)) : (level.speed=level.baseSpeed-(375+((round.streak-25)*8)));
    }, 

    // Management methods
    enableTicking() {
        timer.tickingActive = true;
        timer.lastTime = Date.now();
        timer.tick.bind(this)();
        timer.pause();
        timer.reset();
    },
    disableTicking() {
        timer.tickingActive = false;
    },
    pause() {
        timer.paused = true;
    },
    resume() {
        timer.paused = false;
    },
    reset() {
        timer.timer = level.time;
    },
},

round = {
    // All methods and information required for gameplay
    selection: [],                  // Stores correct values
    input: [],                      // Stores user inputed values
    points: 0,
    lives: 3,
    streak: 0,
    innerStreak: 0,                 // Amount of non-consecutive correct answers within a level. Used for leveling up
    displayCount: 0,                // Used by selectionDisplayNext method's for loop
    displayTimer: null,             // Used by start to call selectionDisplayNext in a loop
    selectionHidden: false,         // Flag for switching between memory and input modes ingame
    
    start() {
        // Starts each new round, resets necessary values and generates the selection to memorize
        clearInterval(round.displayTimer);
        round.renderEmpty();
        round.selectionHidden = false;
        round.selection = [];
        round.input = [];
        round.displayCount = 0;
        timer.rampSpeed();
        player.roundsPlayed++;
        
        for (let i=0; i<level.base; i++) {
            round.selection.push(Math.floor(Math.random() * level.exp));
        }

        round.displayTimer = setInterval(round.selectionDisplayNext.bind(round), level.speed);
    },

    cleanStart() {
        // Restores the round object to defaults for a new game run 
        this.points = 0;
        this.streak = 0;
        this.innerStreak = 0;
        this.lives = 3;
        this.start();
        this.updateStats();
        timer.reset();
        timer.enableTicking();
        player.gamesStarted++;
    },

    selectionDisplayNext() {
        // Displays ONE value on central display FROM RNG SELECTION
        if(this.displayCount >= level.base) {
            clearInterval(this.displayTimer);
            timer.resume();
            return;
        }

        let i = this.displayCount;
        document.querySelector(`#display #light${i}`).classList.add(`color${this.selection[i]}`)
        if(level.speed > 60) playSound('note', this.selection[i]);
        this.displayCount++;
    },

    inputDisplayNext() {
        // Displays ONE value on central display FROM USER INPUT
        document.querySelector(`#display #light${this.displayCount}`).classList.add(`color${this.input[this.displayCount]}`)
        this.displayCount++;
    },

    renderEmpty() {
        // Restores central display to blank values
        const display = document.getElementById('display');
        display.innerHTML = '';
        for (i=0; i<level.base; i++) {
            let light = document.createElement('div');
            light.className = 'light';
            light.id = 'light'+i;
            display.appendChild(light);
        }
    },

    hideSelection() {
        // Once selection is memorized: resumes timer and cleans up values
        timer.resume();
        this.selectionHidden = true;
        this.renderEmpty();
        this.displayCount = 0;
        clearInterval(this.displayTimer)
    },

    makeInput(input) {
        // Transforms user input into a color displayed in the central display.
        if(!this.selectionHidden) this.hideSelection();         // Test if selection hasn't already been hidden
        this.input.push(input);                                 // Save input to array
        this.inputDisplayNext();                                // Display user input
        playSound('note', input);                               // Play corresponding sound
        if(this.input.length == this.selection.length) {        // If full input is detected, test for correct or incorrect
            this.input.toString() == this.selection.toString() ? this.end('win') : this.end('lost');
        }
    },

    end(veredict) {
        // Finish a round, apply victory or defeat
        timer.pause();
        switch (veredict) {
            case 'win':
                this.streak++;
                this.innerStreak++;
                player.corrects++;
                pointConsole.give();
                if (this.innerStreak >= 10 && level.id < 12) { 
                    colorFlash('golden')
                    this.updateStats();
                    this.levelUp();
                    return;
                } else {
                    colorFlash();
                }
                break;
            case 'lost':
                colorFlash('incorrect');
                this.streak = 0;
                this.lives--;
                player.incorrects;
                break;
        }

        // Update stats and inner values for next round
        timer.reset();
        timer.rampSpeed();
        this.updateStats();
        this.handleLevelUpButton();
        
        // Start next round if enough lives available
        this.lives > 0 ? setTimeout(round.start, level.speed * 2) : UIConsole.displayDefeat();
    },

    updateStats() {
        // Update displayed stats
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('points').textContent = this.points.toFixed(0);
        document.getElementById('currentStreak').textContent = this.streak;
        document.getElementById('streakBar').value = Math.min(100, this.streak * 2.5);
    },

    levelUp() {
        // Load next level and start a round in it
        if(round.innerStreak < 5) return;                                   // Only allow level up if 5 correct answers in the level
        if(player.unlocks == level.id && level.id < 11) player.unlocks++    // Unlock the level in player's save in first access
        level.load(level.id + 1);
        round.innerStreak = 0;
        colorFlash('golden');
        round.renderEmpty();
        clearInterval(round.displayTimer);
        setTimeout(round.start, level.speed * 1.5);
        timer.reset();
        round.handleLevelUpButton();
        playSound('up', level.id);
    },

    handleLevelUpButton() {
        if(round.innerStreak < 5) {
            document.getElementById('buttonLevelUp').classList.remove('enabled');
        } else {
            document.getElementById('buttonLevelUp').classList.add('enabled');
        }
    }

},

pointConsole = {
    // Point management for gameplay rewards

    give() {
        // Calculates reward based on 3 non-linear parameters and adds to gameplay total
        round.points += pointConsole.timeMultiplier() * level.reward * pointConsole.streakMultiplier();
    },
    timeMultiplier() {
        return 1/(1-( timer.timer / level.time )+0.31)-0.5;
    },
    streakMultiplier() {
        if(round.streak < 50){
            if(round.streak < 4) return 1;
            if(round.streak == 4) return 1.1;
            if(round.streak < 10) return (1.05 + (0.15 * (round.streak - 4)));
            return (1.5 + (0.5 * Math.floor(round.streak / 5) - 1));
        } else {
            if(round.streak < 70) return 7;
            if(round.streak < 90) return 8.5;
            if(round.streak < 120) return 10;
            if(round.streak < 150) return 12;
            if(round.streak < 175) return 15;
            if(round.streak < 200) return 17.5;
            return 20;
        }
    },

    highScore() {
        // Save round.points if a new highscore is achieved
        if(round.points > player.highScore) player.highScore = round.points;
    },
};