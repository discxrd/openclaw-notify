"use strict";

import AudioAPIModule from "../AudioAPIModule/index.js";
import { NotSupportedError } from "../errors/index.js";
import AudioManager from "../system/index.js";
import BaseAudioContext from "./BaseAudioContext.js";
export default class AudioContext extends BaseAudioContext {
  constructor(options) {
    if (options && options.sampleRate && (options.sampleRate < 8000 || options.sampleRate > 96000)) {
      throw new NotSupportedError(`The provided sampleRate is not supported: ${options.sampleRate}`);
    }
    const audioRuntime = AudioAPIModule.createAudioRuntime();
    super(global.createAudioContext(options?.sampleRate || AudioManager.getDevicePreferredSampleRate(), audioRuntime));
  }
  async close() {
    return this.context.close();
  }
  async resume() {
    return this.context.resume();
  }
  async suspend() {
    return this.context.suspend();
  }
}
//# sourceMappingURL=AudioContext.js.map