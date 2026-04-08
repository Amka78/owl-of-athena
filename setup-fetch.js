// Provide a mockable global fetch for tests
if (typeof global.fetch !== "function" || !global.fetch._isMockFunction) {
    global.fetch = jest.fn().mockResolvedValue({
        text: async () => "",
        json: async () => ({}),
        ok: true,
        status: 200,
    });
}
