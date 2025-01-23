const
UIConsole = {
    // Interface management methods
    currentlyOn: 'none',                    // Stores active screen (levelSelect, ingame, killScreen)
    overlay: 'none',                        // Stores active overlay (paused, settings)

    startSound(enabled){
        // Handles first user input, activates or mutes sound
        // Hides sound popup to reveal game
        (enabled) ? player.sound = true : player.sound = false ;
        this.currentlyOn = 'levelSelect';
        this.updateUnlocks();
        this.hide('enableSound');
    },

    pause() {
        this.overlay = 'pause';
        timer.pause();
        this.display('pauseView', 'flex');
    },

    unpause() {
        this.overlay = 'none';
        timer.resume();
        this.hide('pauseView');
    },

    loadMenu() {
        // Unloads gameView, returns to levelSelect menu and updates displayed items
        clearInterval(round.displayTimer);
        this.currentlyOn = 'levelSelect';
        timer.pause();
        timer.disableTicking();
        playSound('out', level.id)

        this.hide('gameView');
        this.display('menuView','flex');
        UIConsole.updateUnlocks();
        pointConsole.highScore();
        document.getElementById('displayHighScore').textContent = player.highScore.toFixed(0);
    },

    updateUnlocks(){
        // Updates levelSelect marking options as locked or unlocked
        for (i = 0; i <= player.unlocks; i++) {
            document.getElementById(`buttonLevel${i}`).className = 'unlocked';
        };

        for (i = player.unlocks+1; i <12; i++) {
            document.getElementById(`buttonLevel${i}`).className = 'locked' ;
        };
    },

    loadLevel(which) {
        // Loads selected level form levelSelect if user is allowed to
        // Switches to ingame an performs a clean start
        if(which > player.unlocks) return;
        this.currentlyOn = 'ingame';
        level.load(which);
        timer.enableTicking();
        
        this.hide('menuView');
        this.display('gameView', 'flex');
        playSound('in', level.id);

        round.renderEmpty();
        setTimeout(round.cleanStart.bind(round), 500)
    },

    displayDefeat() {
        // TODO: Implement
        this.currentlyOn = 'killscreen'
        pointConsole.highScore();
    },

    openSettings() {
        this.overlay = 'settings';
        this.display('settingsView', 'block');
    },

    exitSettings() {
        this.overlay = 'none';
        this.hide('settingsView');
    },

    openStats() {
        this.overlay = 'stats';
        this.displayOverlay('statsView', 'block');
        document.getElementById('statsHigscore').textContent = player.highScore.toFixed(0);
        document.getElementById('statsGames').textContent = player.gamesStarted;
        document.getElementById('statsRounds').textContent = player.roundsPlayed;
        document.getElementById('statsWins').textContent = player.corrects;
        document.getElementById('statsLosts').textContent = player.incorrects;
        document.getElementById('statsTimeouts').textContent = player.timeouts;
    },

    exitStats() {
        this.overlay = 'none';
        this.hide('statsView');
    },

    // General functions to hide and show UI Views
    hide(id) {
        document.getElementById(id).classList.add('fadeOut');
        setTimeout(() => {
            document.getElementById(id).style.display = 'none';
            document.getElementById(id).classList.remove('fadeOut');
        }, 600);
    },
    display(id, type='flex') {
        setTimeout(() => {
            document.getElementById(id).style.display = type;
        }, 600)
    },
    displayOverlay(id, type='flex') {
        document.getElementById(id).classList.add('fadeOut');
        document.getElementById(id).style.display = type;
        setTimeout(() => {
            document.getElementById(id).classList.add('fadingIn');
            setTimeout(() => {
                document.getElementById(id).classList.remove('fadingIn');
                document.getElementById(id).classList.remove('fadeOut');
            }, 600);
        }, 10)
    }
}