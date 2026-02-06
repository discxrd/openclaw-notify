"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useAudioInput;
var _react = require("react");
var _api = require("../api");
const meaningfulReasons = ['NewDeviceAvailable', 'OldDeviceUnavailable',
// e.g. system picks a different device as current one is not suitable for the new configuration
'CategoryChange', 'ConfigurationChange'];

/**
 * A hook that provides basic information and selection capabilities for audio
 * input devices on the system. (iOS only currently). The hook will
 * automatically listen for configuration changes and updates its state. If you
 * need more granular control, consider using the AudioManager API directly.
 *
 * @returns An object containing audio input information and selection
 *   capabilities
 */
function useAudioInput() {
  const [availableInputs, setAvailableInputs] = (0, _react.useState)([]);
  const [currentInput, setCurrentInput] = (0, _react.useState)(null);
  const onSelectInput = (0, _react.useCallback)(async device => {
    const success = await _api.AudioManager.setInputDevice(device.id);
    if (success) {
      setCurrentInput(device.id);
    }
    const devicesInfo = await _api.AudioManager.getDevicesInfo();
    setAvailableInputs(devicesInfo.availableInputs);
  }, []);
  (0, _react.useEffect)(() => {
    async function fetchAvailableInputs() {
      const audioDevices = await _api.AudioManager.getDevicesInfo();
      const currentDeviceId = audioDevices.currentInputs.length ? audioDevices.currentInputs[0].id : null;
      setAvailableInputs(audioDevices.availableInputs);
      setCurrentInput(currentDeviceId);
    }
    async function handleRouteChange(event) {
      if (!meaningfulReasons.includes(event.reason)) {
        return;
      }
      await fetchAvailableInputs();
    }
    const sub = _api.AudioManager.addSystemEventListener('routeChange', handleRouteChange);
    fetchAvailableInputs();
    return () => {
      sub?.remove();
    };
  }, []);
  return (0, _react.useMemo)(() => ({
    /**
     * The list of available audio input devices under current device
     * configuration.
     */
    availableInputs,
    /**
     * The currently selected audio input device, or null if none is yet
     * decided by the system.
     */
    currentInput: availableInputs.find(d => d.id === currentInput) || null,
    /**
     * Selects the given device as the current input. Returns true if
     * successful, throws otherwise.
     */
    onSelectInput
  }), [availableInputs, currentInput, onSelectInput]);
}
//# sourceMappingURL=useAudioInput.js.map