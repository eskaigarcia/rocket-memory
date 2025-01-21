document.addEventListener('keydown', function(event) {
    pressKey(event.code);
});

function pressKey(code) {
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
            // Not yet implemented
            break;
        case 'Escape':
            // Not yet implemented
            break;
        case 'Space':
            round.hideSelection();
            break;
        case 'KeyR':
            round.cleanStart();
            break;
    }
}

function simulateButtonPress(button) {
    document.getElementById(`key${button}`).classList.add('active');
    setTimeout(function() { document.getElementById(`key${button}`).classList.remove('active'); }, 200);
}