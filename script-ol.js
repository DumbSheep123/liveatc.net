var audio = document.getElementById("player2");
var loadingOverlay = document.getElementById("loadingOverlay");
var audioContainer = document.getElementById("audioContainer");
var peakMeter = document.getElementById("peakMeter");
var peakLevel = document.getElementById("peakLevel");
var peakLevelValue = document.getElementById("peakLevelValue");
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var analyser;
var scriptProcessor;
var togglePeakBar = document.getElementById("togglePeakBar");

if (window.AudioContext && 'audioWorklet' in AudioContext.prototype) {
    let audioCtx = new AudioContext();

    audioCtx.audioWorklet.addModule('audio-processor.js').then(() => {
        initAudioContext();
    }).catch((error) => {
        console.error('Failed to load audio worklet module:', error);
    });
} else {
    console.warn('AudioWorklet is not supported in this browser.');
}


togglePeakBar.addEventListener("change", function () {
    if (togglePeakBar.checked) {
        peakMeter.style.display = "block";
        if (audio.paused) {
            audio.play();
            audio.pause();
        }
    }
    else {
        peakMeter.style.display = "none";
        if (!audio.paused) {
            audio.pause();
            audio.play();
        }
    }
});

function initAudioContext() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    source = audioCtx.createMediaElementSource(audio);
    const peakMeterNode = new AudioWorkletNode(audioCtx, 'peak-meter-processor');

    source.connect(peakMeterNode).connect(audioCtx.destination);

    peakMeterNode.port.onmessage = function (event) {
        if (togglePeakBar.checked) {
            const peakLevelWidth = event.data.peakLevel * 50;
            if (peakLevelWidth === 0) {
                peakLevel.style.display = 'none';
            } else {
                peakLevel.style.display = 'block';
                peakLevel.style.width = Math.min(peakLevelWidth, 100) + "%";
            }
        }
    };
}


function startAudioContext() {
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().then(function () {
            console.log("Audio context resumed.");
        });
    }
}
audio.addEventListener("canplaythrough", function () {
    loadingOverlay.classList.add('fade-out');
    setTimeout(function () {
        loadingOverlay.classList.add('hidden');
    }, 500);
});

audio.addEventListener("play", function () {
    startAudioContext();
    // scriptProcessor.onaudioprocess = function (e) {
    //     if (togglePeakBar.checked) {
    //         var inputData = e.inputBuffer.getChannelData(0);
    //         var max = Math.max.apply(null, Array.from(inputData));
    //         var peakLevelWidth = (max) * 50;
    //         if (peakLevelWidth === 0) {
    //             peakLevel.style.display = 'none';
    //         }
    //         else {
    //             peakLevel.style.display = 'block';
    //             peakLevel.style.width = Math.min(peakLevelWidth, 100) + "%";
    //         }
    //     }
    // };
});

document.addEventListener("click", function () {
    if (!audioCtx) {
        initAudioContext();
    }
});

var loadingTimer = setTimeout(function () {
    showSkipButton();
}, 2000);

function showSkipButton() {
    var skipButton = document.getElementById('skipButton');
    skipButton.classList.remove('hidden');
    skipButton.addEventListener('click', function () {
        loadingOverlay.classList.add('fade-out');
        setTimeout(function () {
            loadingOverlay.classList.add('hidden');
        }, 500);
    });
}