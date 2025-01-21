const
display = document.getElementById('display');


const 
level = {
    id: 0,
    base: 4,
    exp: 6,
    speed: 600,
    time: 10000,
    pitchShift: 2,
    reward: 175,

    loadlevel(which) {
        // Load values from levelInformation into the level object
    }
},

timer = {
    // Credit for the basenline idea: https://codepen.io/samanime/pen/LYjOvpd
    
    timer: 0,
    lastTime: null,
    tickingActive: true,
    paused: false,

    enableTicking() {
        timer.tickingActive = true;
        this.lastTime = Date.now();
        this.tick();
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

    tick() {
        if(!this.tickingActive) return;
        const now = Date.now();
        const delta = now - this.lastTime;
        this.lastTime = now;
        if (!this.paused) { this.timer -= delta; }
        this.updateDisplay();
        requestAnimationFrame(this.tick.bind(this));
    },

    updateDisplay() {
        document.getElementById('timeBar').value = timer.timer / level.time;
    }
},

round = {
    selectionHidden: false,
    selection: [],
    input: [],
    points: 0,
    lives: 3,
    streak: 0,
    innerStreak: 0,

    displayCount: 0,
    displayTimer: null,
    
    cleanStart() {
        this.points = 0;
        this.lives = 3;
        this.start();
        this.updateLives();
        this.updatePoints();
    },

    start() {
        clearInterval(round.displayTimer);
        round.renderEmpty();
        round.selectionHidden = false;
        round.selection = [];
        round.input = [];
        round.displayCount = 0;
        
        for (let i=0; i<level.base; i++) {
            round.selection.push(Math.floor(Math.random() * level.exp));
        }

        round.displayTimer = setInterval(round.selectionDisplayNext.bind(round), level.speed);
    },

    renderEmpty() {
        display.innerHTML = '';
        for (i=0; i<level.base; i++) {
            let light = document.createElement('div');
            light.className = 'light';
            light.id = 'light'+i;
            display.appendChild(light);
        }
    },

    selectionDisplayNext() {
        if(this.displayCount >= level.base) {
            clearInterval(this.displayTimer);
            return;
        }

        let i = this.displayCount
        document.querySelector(`#display #light${i}`).classList.add(`color${this.selection[i]}`)
        playSound('note', this.selection[i]);
        this.displayCount++;
    },

    hideSelection() {
        this.selectionHidden = true;
        this.renderEmpty();
        this.displayCount = 0;
        clearInterval(this.displayTimer)
    },

    makeInput(input) {
        if(!this.selectionHidden) this.hideSelection();
        this.input.push(input);
        this.inputDisplayNext();
        playSound('note', input)
        if(this.input.length == this.selection.length) this.input.toString() == this.selection.toString() ? this.end('win') : this.end('lost');
    },

    inputDisplayNext() {
        document.querySelector(`#display #light${this.displayCount}`).classList.add(`color${this.input[this.displayCount]}`)
        this.displayCount++;
    },

    end(veredict) {

        switch (veredict) {
            case 'win':
                this.streak++
                this.innerStreak++
                pointConsole.give();
                if (this.innerStreak < 10) {
                    colorFlash()
                } else {
                    colorFlash('golden')
                    this.updateLives(); this.updatePoints(); this.updateStreak();
                    this.levelUp();
                    return;
                }
                break;
            case 'lost':
                colorFlash('incorrect');
                this.streak = 0;
                this.lives--;
                break;
        }

        this.updateLives(); this.updatePoints(); this.updateStreak();
        this.lives > 0 ? setTimeout(round.start, level.speed * 2) : gameView.defeat();
    },

    updateLives() {
        document.getElementById('lives').textContent = this.lives;
    },

    updatePoints() {
        document.getElementById('points').textContent = this.points.toFixed(0);
    },

    updateStreak() {
        document.getElementById('currentStreak').textContent = this.streak;
        document.getElementById('streakBar').value = Math.min(100, this.streak * 2.5);
    },

    levelUp() {
        if(round.innerStreak < 5) return;
        level.loadlevel(level.id + 1);
        round.innerStreak = 0;
        setTimeout(round.start, level.speed * 2);
    },

},

gameView = {
    levelSelect() {
        timer.disableTicking();
    },

    roundPlay() {
        timer.enableTicking();
    },

    defeat() {
        pointConsole.HighScore();
        alert('Has perdido pero aún no tengo hecha esa función jiji.');
    },

    menu() {
        timer.disableTicking();
    }
},

pointConsole = {
    give() {
        round.points += pointConsole.timeMultiplier() * level.reward * pointConsole.streakMultiplier();
    },

    timeMultiplier() {
        // return 1/(1-( timer.time? / level.time)+0.31)-0.5;
        return 1;
    },

    streakMultiplier() {
        console.log(round.streak);
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

    HighScore() {
        if(round.points > player.highScore) player.highScore = round.points;
    },
};