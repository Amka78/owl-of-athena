import { vi } from "vitest";

// Provide a mockable global fetch for tests
if (typeof global.fetch !== "function" || !global.fetch._isMockFunction) {
    global.fetch = vi.fn().mockResolvedValue({
        text: async () => "",
        json: async () => ({}),
        ok: true,
        status: 200,
    });
}