function playSound(type, pitch) {
    if(!player.sound) return;
    const sound = document.getElementById(`sfx_${type}${pitch+level.pitchShift}`);
    sound.currentTime = 0;
    sound.play();
}

// Flashes a color to give Feedback to the user - Available options are:
// [Default] correct: green, incorrect: red, golden: yellow
function colorFlash(color = 'correct') {
    document.getElementById('gameContent').classList.add(color);
    setTimeout(() => { 
        document.getElementById('gameContent').classList.remove(color);
    }, 200);
}