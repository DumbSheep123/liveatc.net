document.addEventListener('DOMContentLoaded', () => {
    const audio = document.querySelector('#player2');
    const loadingOverlay = document.querySelector('#loadingOverlay');
    const peakMeter = document.querySelector('#peakMeter');
    const peakLevel = document.querySelector('#peakLevel');
    const togglePeakBar = document.querySelector('#togglePeakBar');
    let audioCtx, source, analyser, scriptProcessor;

    const initAudioContext = () => {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
        source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;

        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        const bufferSize = window.webkitAudioContext ? 0 : 2048;
        scriptProcessor = audioCtx.createScriptProcessor(bufferSize, 1, 1);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioCtx.destination);

        console.log('Audio context initialized:', audioCtx);
    };

    const startAudioContext = async () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            await audioCtx.resume();
            console.log('Audio context resumed.');
        }
    };

    if (!audioCtx) {
        initAudioContext();
    }

    togglePeakBar.addEventListener('change', () => {
        peakMeter.style.display = togglePeakBar.checked ? 'block' : 'none';
        if (audio.paused) {
            audio.play().then(() => audio.pause());
        }
    });

    audio.addEventListener('canplay', () => {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => loadingOverlay.classList.add('hidden'), 500);
    });

    audio.addEventListener('play', () => {
        if (!audioCtx || !scriptProcessor) {
            console.error('Audio context or scriptProcessor is not initialized.');
            return;
        }

        console.log(audioCtx.state);

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        startAudioContext();
        scriptProcessor.onaudioprocess = (e) => {
            if (togglePeakBar.checked) {
                const inputData = e.inputBuffer.getChannelData(0);
                const max = Math.max(...inputData);
                const peakLevelWidth = max * 100;

                peakLevel.style.display = peakLevelWidth === 0 ? 'none' : 'block';
                peakLevel.style.width = `${Math.min(peakLevelWidth, 100)}%`;
            }
        };
    });

    document.addEventListener('click', () => {
        if (!audioCtx) {
            initAudioContext();
        }
    });

    setTimeout(() => {
        const skipButton = document.querySelector('#skipButton');
        skipButton.classList.remove('hidden');
        skipButton.addEventListener('click', () => {
            loadingOverlay.classList.add('fade-out');
            setTimeout(() => loadingOverlay.classList.add('hidden'), 500);
        });
    }, 2000);
});
