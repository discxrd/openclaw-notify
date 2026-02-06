import { ConfigPlugin } from '@expo/config-plugins';
interface Options {
    iosMicrophonePermission?: string;
    iosBackgroundMode: boolean;
    androidPermissions: string[];
    androidForegroundService: boolean;
    androidFSTypes: string[];
    disableFFmpeg: boolean;
}
declare const _default: ConfigPlugin<Options>;
export default _default;
//# sourceMappingURL=withAudioAPI.d.ts.map