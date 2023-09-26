class PeakMeterProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        const inputData = input[0];
        const outputData = output[0];
        let max = 0;

        for (let i = 0; i < inputData.length; i++) {
            outputData[i] = inputData[i];
            if (Math.abs(inputData[i]) > max) {
                max = Math.abs(inputData[i]);
            }
        }

        this.port.postMessage({ peakLevel: max });

        return true;
    }
}

registerProcessor('peak-meter-processor', PeakMeterProcessor);
