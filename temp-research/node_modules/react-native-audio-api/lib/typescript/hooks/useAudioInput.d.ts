import { AudioDeviceInfo, AudioDeviceList } from '../system/types';
/**
 * A hook that provides basic information and selection capabilities for audio
 * input devices on the system. (iOS only currently). The hook will
 * automatically listen for configuration changes and updates its state. If you
 * need more granular control, consider using the AudioManager API directly.
 *
 * @returns An object containing audio input information and selection
 *   capabilities
 */
export default function useAudioInput(): {
    /**
     * The list of available audio input devices under current device
     * configuration.
     */
    availableInputs: AudioDeviceList;
    /**
     * The currently selected audio input device, or null if none is yet
     * decided by the system.
     */
    currentInput: AudioDeviceInfo | null;
    /**
     * Selects the given device as the current input. Returns true if
     * successful, throws otherwise.
     */
    onSelectInput: (device: AudioDeviceInfo) => Promise<void>;
};
//# sourceMappingURL=useAudioInput.d.ts.map