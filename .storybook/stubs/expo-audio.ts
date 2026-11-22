// Web stub for expo-audio: the real package reads the native ExpoAudio module
// (requireNativeModule) which does not exist in the browser. Mirror the
// node-side mock (setup/react-native-mock.ts) player shape.

type AudioPlayerLike = {
    id: string;
    playing: boolean;
    muted: boolean;
    loop: boolean;
    paused: boolean;
    isLoaded: boolean;
    isBuffering: boolean;
    isAudioSamplingSupported: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    play: () => void;
    pause: () => void;
    seekTo: () => Promise<void>;
    replace: () => void;
    remove: () => void;
    setPlaybackRate: () => void;
    setActiveForLockScreen: () => void;
    addListener: (event: string) => { remove: () => void };
};

const createMockPlayer = (): AudioPlayerLike => ({
    id: "mock-player",
    playing: false,
    muted: false,
    loop: false,
    paused: true,
    isLoaded: true,
    isBuffering: false,
    isAudioSamplingSupported: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    play: () => undefined,
    pause: () => undefined,
    seekTo: () => Promise.resolve(undefined),
    replace: () => undefined,
    remove: () => undefined,
    setPlaybackRate: () => undefined,
    setActiveForLockScreen: () => undefined,
    addListener: () => ({ remove: () => undefined }),
});

export const createAudioPlayer = (): AudioPlayerLike => createMockPlayer();
export const useAudioPlayer = (): AudioPlayerLike => createMockPlayer();
export const setAudioModeAsync = () => Promise.resolve(undefined);

export type AudioPlayer = AudioPlayerLike;
export type AudioMetadata = Record<string, unknown>;

export const AudioModule = { AudioPlayer: class {}, AudioRecorder: class {} };

export default { createAudioPlayer, useAudioPlayer, setAudioModeAsync };