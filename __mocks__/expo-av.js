const mockSound = {
    getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: false }),
    stopAsync: jest.fn().mockResolvedValue(undefined),
    playAsync: jest.fn().mockResolvedValue(undefined),
    unloadAsync: jest.fn().mockResolvedValue(undefined),
    loadAsync: jest.fn().mockResolvedValue(undefined),
};

module.exports = {
    Audio: {
        Sound: jest.fn().mockImplementation(() => mockSound),
        setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    },
    Video: jest.fn(),
};
