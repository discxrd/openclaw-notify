import { IDelayNode } from '../interfaces';
import AudioNode from './AudioNode';
import AudioParam from './AudioParam';
import BaseAudioContext from './BaseAudioContext';
export default class DelayNode extends AudioNode {
    readonly delayTime: AudioParam;
    constructor(context: BaseAudioContext, delay: IDelayNode);
}
//# sourceMappingURL=DelayNode.d.ts.map