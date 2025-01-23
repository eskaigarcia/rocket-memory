const
UIConsole = {
    // Interface management methods
    currentlyOn: 'levelSelect',             // Stores active screen (levelSelect, ingame, killScreen)
    overlay: 'none',                        // Stores active overlay (paused, settings)

    startSound(enabled){
        // Handles first user input, activates or mutes sound
        // Hides sound popup to reveal game
        (enabled) ? player.sound = true : player.sound = false ;
        this.updateUnlocks();
        this.hide('enableSound');
    },

    pause() {
        // TODO: Implement
        timer.pause();
        this.display('pauseScreen');
    },

    unPause() {
        // TODO: Implement
        timer.resume();
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
        // TODO: Implement
    },

    exitSettings() {
        // TODO: Implement
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
    }
}