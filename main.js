// 

let initialDuration = 60;
let finalLimit = 180;
let progressFactor = 60;
let breakDuration = 60;
let isProgramRunning = false;

const durationInput = document.getElementById('initialDuration');
const finalLimitInput = document.getElementById('finalLimit');
const progressInput = document.getElementById('progressFactor');
const breakInput = document.getElementById('breakDuration');

const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const volumeFader = document.getElementById('controlVolume');

const audioPlayer = document.getElementById('player');
audioPlayer.volume = volumeFader.value;

const output = document.getElementById('output');
const message = document.getElementById('message');
const memeImage = document.getElementById('meme');
// Sound file paths
const RUNNING_SOUND = '/clockTick.mp3';
const BREAK_SOUND = 'bellChime.mp3';
const END_SOUND = 'gameOver.mp3';
const RESET_SOUND = 'resetSound.mp3';

// Function to reset all settings to their initial values
function resetSettings() {
    // playSound(RESET_SOUND, 0.5);
    initialDuration = 60;
    finalLimit = 180;
    progressFactor = 60;
    breakDuration = 60;

    durationInput.value = initialDuration;
    finalLimitInput.value = finalLimit;
    progressInput.value = progressFactor;
    breakInput.value = breakDuration;

    audioPlayer.volume = volumeFader.value;

    output.textContent = '00:00';
    message.textContent = 'Are you Ready?'
    memeImage.src = 'banner1.jpeg';
    console.log('Settings have been reset.');
}

// Helper function to format seconds into minutes and seconds (mm:ss)
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function playSound(source, volume = 0.1) {
    audioPlayer.src = source;
    // audioPlayer.volume = volume;
    audioPlayer.play();
}


function countdown(duration, callback, isBreak = false) {
    if (duration < 0) {
        if (callback) {
            callback();
        }
        return;
    }
    output.textContent = formatTime(duration);
    
    // Play the correct audio for the countdown
    if (isBreak) {
        playSound(BREAK_SOUND, 1); // Break sounds can be a bit louder
    } else {
        playSound(RUNNING_SOUND, 1);
    }

    countdownTimer = setTimeout(function () {
        --duration;
        countdown(duration, callback, isBreak);
    }, 1000);
}

function runProgram() {
    console.log(`Running Set of ${initialDuration} seconds`);
    message.textContent = 'Hold your Breath Diver ...';
    memeImage.src = 'message-image1.png';
    if (!isProgramRunning) {
        return;
    }

    // Check if the initialDuration is now beyond the final limit.
    // This will run one final time after the last countdown.
    if (initialDuration > finalLimit) {
        isProgramRunning = false;
        playSound(END_SOUND, 1);
        memeImage.src = 'message-image3';
        alert('END OF PROGRAM - TIMERS WILL BE RESET');
        initialDuration = 60; // Reset for next run
        return;
    }

    // Check if this is the final set and log the message before the countdown
    if (initialDuration === finalLimit) {
        console.log("This is the final set. Program will finish after this Set.");
    }


    // Start the main countdown
    countdown(initialDuration, function () {
        console.log(`Current Set of ${initialDuration} finished.`);

        // The condition to skip the break for the last set
        if (initialDuration === finalLimit) {
            console.log("This was the final set. Program will now finish.");
            initialDuration += progressFactor; // Increment for the final check in the next runProgram call
            runProgram(); // Call runProgram one last time to trigger the "END OF PROGRAM" condition
            return;
        }

        console.log(`Running Break of ${breakDuration} seconds...`);
        memeImage.src = 'message-image2.png';
        message.textContent = 'You Can Breath Now...';
        // Start the break countdown as a callback
        countdown(breakDuration, function () {
            console.log('Break finished, advancing to next round.');
            initialDuration += progressFactor;
            runProgram(); // Recursively call for the next round
        }, true);
    });
}

// Event Listeners
startButton.addEventListener('click', function () {
    if (!isProgramRunning) {
        // Read values from input fields and convert them to numbers
        initialDuration = parseInt(durationInput.value);
        finalLimit = parseInt(finalLimitInput.value);
        progressFactor = parseInt(progressInput.value);
        breakDuration = parseInt(breakInput.value);

        isProgramRunning = true;
        runProgram();
    }
});

resetButton.addEventListener('click', function () {
    playSound(RESET_SOUND, 0.5);
    // Clear any active countdown timer and reset the state
    clearTimeout(countdownTimer);
    isProgramRunning = false;
    resetSettings();
});

volumeFader.addEventListener('input', function() {
    audioPlayer.volume = this.value;
});

// Initialize inputs with default values on page load
document.addEventListener('DOMContentLoaded', resetSettings);