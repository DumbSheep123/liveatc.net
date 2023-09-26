const audio = document.getElementById("player2") as HTMLMediaElement;
const loadingOverlay = document.getElementById("loadingOverlay") as HTMLElement;
const audioContainer = document.getElementById("audioContainer") as HTMLElement;
const peakMeter = document.getElementById("peakMeter") as HTMLElement;
const peakLevel = document.getElementById("peakLevel") as HTMLElement;
const peakLevelValue = document.getElementById("peakLevelValue") as HTMLElement;

let audioCtx: AudioContext;
let source: MediaElementAudioSourceNode;
let analyser: AnalyserNode;
const togglePeakBar = document.getElementById("togglePeakBar") as HTMLInputElement;

togglePeakBar.addEventListener("change", () => {
    if (togglePeakBar.checked) {
        peakMeter.style.display = "block";
    } else {
        peakMeter.style.display = "none";
    }
});

function initAudioContext() {
    audioCtx = new AudioContext();
    source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);
}

function startAudioContext() {
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().then(() => {
            console.log("Audio context resumed.");
        });
    }
}

audio.addEventListener("canplaythrough", () => {
    loadingOverlay.classList.add('fade-out');
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 500);
});

audio.onerror = () => {
    loadingOverlay.classList.add('fade-out');
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 500);
};

audio.addEventListener("play", () => {
    startAudioContext();

    const audioProcessor = audioCtx.createScriptProcessor(2048, 1, 1);
    analyser.connect(audioProcessor);
    audioProcessor.connect(audioCtx.destination);

    audioProcessor.addEventListener("audioprocess", (e: AudioProcessingEvent) => {
        if (togglePeakBar.checked) {
            const inputData = e.inputBuffer.getChannelData(0);
            const max = Math.max(...Array.from(inputData));
            const peakLevelWidth = max * 1000;

            if (peakLevelWidth === 0) {
                peakLevel.style.display = 'none';
            } else {
                peakLevel.style.display = 'block';
                peakLevel.style.width = Math.min(peakLevelWidth, 100) + "vw";
            }
        }
    });
});

document.addEventListener("click", () => {
    if (!audioCtx) {
        initAudioContext();
    }
});

const loadingTimer = setTimeout(() => {
    showSkipButton();
}, 2000);

function showSkipButton() {
    const skipButton = document.getElementById('skipButton') as HTMLElement;
    skipButton.classList.remove('hidden');
    skipButton.addEventListener('click', () => {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 500);
    });
}

togglePeakBar.addEventListener("change", () => {
    if (togglePeakBar.checked) {
        peakMeter.style.display = "block";
        if (audio.paused) {
            audio.play();
            audio.pause();
        }
    } else {
        peakMeter.style.display = "none";
        if (!audio.paused) {
            audio.pause();
            audio.play();
        }
    }
});
