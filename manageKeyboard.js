document.addEventListener('keydown', function(event) {
    cheats.receiver(event);
    pressKey(event.code);
});

function pressKey(code) {
    if(UIConsole.currentlyOn != 'ingame') return;

    switch (code) {
        case 'KeyA':
            round.makeInput(0);
            simulateButtonPress(0);
            break;
        case 'KeyS':
            round.makeInput(1);
            simulateButtonPress(1);
            break;
        case 'KeyD':
            round.makeInput(2);
            simulateButtonPress(2);
            break;
        case 'KeyF':
            round.makeInput(3);
            simulateButtonPress(3);
            break;
        case 'KeyH':
            round.makeInput(4);
            simulateButtonPress(4);
            break;
        case 'KeyJ':
            round.makeInput(5);
            simulateButtonPress(5);
            break;
        case 'KeyK':
            round.makeInput(6);
            simulateButtonPress(6);
            break;
        case 'KeyL':
            round.makeInput(7);
            simulateButtonPress(7);
            break;
        case 'Enter':
            round.levelUp();
            break;
        case 'Escape':
            UIConsole.loadMenu();
            // Change to pause
            break;
        case 'Space':
            round.hideSelection();
            break;
    }
}

// TODO: Add key shortcuts for game restart and demonstration cheatcodes

// Visualize keyboard buttons on screen
function simulateButtonPress(button) {
    document.getElementById(`key${button}`).classList.add('active');
    setTimeout(function() { document.getElementById(`key${button}`).classList.remove('active'); }, 200);
}
