const mockSound = {
    getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: false }),
    stopAsync: jest.fn().mockResolvedValue(undefined),
    playAsync: jest.fn().mockResolvedValue(undefined),
    unloadAsync: jest.fn().mockResolvedValue(undefined),
    loadAsync: jest.fn().mockResolvedValue(undefined),
    setIsLoopingAsync: jest.fn().mockResolvedValue(undefined),
    setVolumeAsync: jest.fn().mockResolvedValue(undefined),
    setIsMutedAsync: jest.fn().mockResolvedValue(undefined),
    setPositionAsync: jest.fn().mockResolvedValue(undefined),
};

module.exports = {
    Audio: {
        Sound: jest.fn().mockImplementation(() => mockSound),
        setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    },
    InterruptionModeIOS: { MixWithOthers: 0, DoNotMix: 1, DuckOthers: 2 },
    InterruptionModeAndroid: { DoNotMix: 1, DuckOthers: 2 },
    Video: jest.fn(),
};
