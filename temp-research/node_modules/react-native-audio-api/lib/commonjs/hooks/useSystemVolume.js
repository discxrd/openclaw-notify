"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useSystemVolume;
var _react = require("react");
var _api = require("../api");
function useSystemVolume() {
  const [volume, setVolume] = (0, _react.useState)(0);
  (0, _react.useEffect)(() => {
    _api.AudioManager.observeVolumeChanges(true);
    const listener = _api.AudioManager.addSystemEventListener('volumeChange', e => {
      setVolume(parseFloat(e.value.toFixed(2)));
    });
    return () => {
      listener?.remove();
      _api.AudioManager.observeVolumeChanges(false);
    };
  }, []);
  return volume;
}
//# sourceMappingURL=useSystemVolume.js.map