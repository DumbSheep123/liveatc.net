var audio = document.getElementById("player2");
var loadingOverlay = document.getElementById("loadingOverlay");
var audioContainer = document.getElementById("audioContainer");
var peakMeter = document.getElementById("peakMeter");
var peakLevel = document.getElementById("peakLevel");
var peakLevelValue = document.getElementById("peakLevelValue");
var audioCtx;
var source;
var analyser;
var scriptProcessor;
var togglePeakBar = document.getElementById("togglePeakBar");   
  

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
    audioCtx = new (window.AudioContext || window.AudioContext)();
    source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    scriptProcessor = audioCtx.createScriptProcessor(2048, 1, 1);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioCtx.destination);
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
// audio.onerror = function () {
//     loadingOverlay.classList.add('fade-out');
//     setTimeout(function () {
//         loadingOverlay.classList.add('hidden');
//     }, 500);
// };
audio.addEventListener("play", function () {
    startAudioContext();
    scriptProcessor.onaudioprocess = function (e) {
        if (togglePeakBar.checked) {
            var inputData = e.inputBuffer.getChannelData(0);
            var max = Math.max.apply(null, Array.from(inputData));
            var peakLevelWidth = (max) * 50;
            if (peakLevelWidth === 0) {
                peakLevel.style.display = 'none';
            }
            else {
                peakLevel.style.display = 'block';
                peakLevel.style.width = Math.min(peakLevelWidth, 100) + "%";
            }
        }
    };
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