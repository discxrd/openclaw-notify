import AudioNode from './AudioNode';
export default class WaveShaperNode extends AudioNode {
    private isCurveSet;
    get curve(): Float32Array | null;
    get oversample(): OverSampleType;
    set curve(curve: Float32Array | null);
    set oversample(value: OverSampleType);
}
//# sourceMappingURL=WaveShaperNode.d.ts.map