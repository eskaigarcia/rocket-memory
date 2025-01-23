// Shortcuts used for debugging and testing the game
const
cheats = {
    receiver (input) {
        if(input.ctrlKey && input.shiftKey) {
            switch (input.which) {
                case 187:                               // + 
                    player.unlocks++;                   // Unlocks a level
                    UIConsole.updateUnlocks();
                    input.preventDefault();
                    break;
                case 189:                               // -
                    player.unlocks--;                   // Locks a level
                    UIConsole.updateUnlocks();
                    input.preventDefault();
                    break;
                case 78:                                // N
                    round.cleanStart();                 // Full round restart
                    input.preventDefault();
                    break;
                case 69:                                // E
                    round.end('win');                   // Triggers round win
                    input.preventDefault();
                    break;
                case 73:                                // I
                    round.end('lost');                  // Triggers round loose
                    input.preventDefault();
                    break;
                case 86:                                // V
                    round.lives += 100;                 // Infinite lives
                    round.updateStats();
                    input.preventDefault();
                case 80:                                // P
                    let bool = timer.paused;            // Toggle timer
                    timer.paused = !bool;
                    input.preventDefault();
            }
        }
    }
}
