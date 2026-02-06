"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _configPlugins = require("@expo/config-plugins");
const pkg = require('react-native-audio-api/package.json');
const withDefaultOptions = options => {
  return {
    iosBackgroundMode: true,
    androidPermissions: ['android.permission.FOREGROUND_SERVICE', 'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK'],
    androidForegroundService: true,
    androidFSTypes: ['mediaPlayback'],
    disableFFmpeg: false,
    ...options
  };
};
const withBackgroundAudio = config => {
  return (0, _configPlugins.withInfoPlist)(config, iosConfig => {
    iosConfig.modResults.UIBackgroundModes = [...Array.from(new Set([...(iosConfig.modResults.UIBackgroundModes ?? []), 'audio']))];
    return iosConfig;
  });
};
const withIosMicrophonePermission = (config, {
  iosMicrophonePermission
}) => {
  return (0, _configPlugins.withInfoPlist)(config, iosConfig => {
    iosConfig.modResults.NSMicrophoneUsageDescription = iosMicrophonePermission;
    return iosConfig;
  });
};
const withAndroidPermissions = (config, {
  androidPermissions
}) => {
  return _configPlugins.AndroidConfig.Permissions.withPermissions(config, androidPermissions);
};
const withForegroundService = (config, {
  androidFSTypes
}) => {
  return (0, _configPlugins.withAndroidManifest)(config, mod => {
    const manifest = mod.modResults;
    const mainApplication = _configPlugins.AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    const SFTypes = androidFSTypes.join('|');
    const serviceElement = {
      $: {
        'android:name': 'com.swmansion.audioapi.system.CentralizedForegroundService',
        'android:stopWithTask': 'true',
        'android:foregroundServiceType': SFTypes
      },
      intentFilter: []
    };
    if (!mainApplication.service) {
      mainApplication.service = [];
    }
    const existingServiceIndex = mainApplication.service.findIndex(service => service.$['android:name'].includes(serviceElement.$['android:name']));
    if (existingServiceIndex !== -1) {
      mainApplication.service[existingServiceIndex] = serviceElement;
      return mod;
    }
    mainApplication.service.push(serviceElement);
    return mod;
  });
};
const withFFmpegConfig = (config, options) => {
  const iosConf = (0, _configPlugins.withPodfile)(config, mod => {
    let contents = mod.modResults.contents;
    const ffmpegRegex = /^.*ENV\['DISABLE_AUDIOAPI_FFMPEG'\].*$/gm;
    const podfileString = options.disableFFmpeg ? `ENV['DISABLE_AUDIOAPI_FFMPEG'] = '1'` : '';
    // No existing setting
    if (contents.search(ffmpegRegex) === -1) {
      if (options.disableFFmpeg) {
        if (contents.endsWith('\n')) {
          contents = `${contents}${podfileString}`;
        } else {
          contents = `${contents}\n${podfileString}`;
        }
        mod.modResults.contents = contents;
      }
    } else {
      // Existing setting found, will replace
      contents = contents.replace(ffmpegRegex, podfileString);
    }
    mod.modResults.contents = contents;
    return mod;
  });
  const finalConf = (0, _configPlugins.withGradleProperties)(iosConf, mod => {
    const gradleProperties = mod.modResults;
    const existingIndex = gradleProperties.findIndex(prop => prop.type === 'property' && prop.key === 'disableAudioapiFFmpeg');
    if (existingIndex !== -1) {
      gradleProperties.splice(existingIndex, 1);
    } else if (!options.disableFFmpeg) {
      // No existing setting and FFmpeg is enabled, do nothing.
      return mod;
    }
    if (options.disableFFmpeg) {
      gradleProperties.push({
        type: 'property',
        key: 'disableAudioapiFFmpeg',
        value: options.disableFFmpeg ? 'true' : 'false'
      });
    }
    return mod;
  });
  return finalConf;
};
const withAudioAPI = (config, optionsIn) => {
  const options = withDefaultOptions(optionsIn ?? {});
  if (options.iosBackgroundMode) {
    config = withBackgroundAudio(config);
  }
  config = withAndroidPermissions(config, options);
  if (options.androidForegroundService) {
    config = withForegroundService(config, options);
  }
  if (options.iosMicrophonePermission) {
    config = withIosMicrophonePermission(config, options);
  }
  if (options.disableFFmpeg !== undefined) {
    config = withFFmpegConfig(config, options);
  }
  return config;
};
var _default = exports.default = (0, _configPlugins.createRunOncePlugin)(withAudioAPI, pkg.name, pkg.version);
//# sourceMappingURL=withAudioAPI.js.map