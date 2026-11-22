import type { Mock as VitestMock } from "vitest";

/**
 * Type-level compatibility for test files migrated to Vitest: runtime calls
 * (jest.fn / jest.mock / ...) were rewritten to `vi`, but type usages such as
 * `jest.Mock<T>` / `jest.SpyInstance<T>` remain. These declarations keep them
 * type-checking against Vitest's own types.
 */
declare global {
    namespace jest {
        type Mock<T extends (...args: any[]) => any = (...args: any[]) => any> = VitestMock<T>;
        type MockedFunction<T extends (...args: any[]) => any = (...args: any[]) => any> =
            import("vitest").MockedFunction<T>;
        type SpyInstance<T extends (...args: any[]) => any = (...args: any[]) => any> =
            import("vitest").MockInstance<T>;
    }
}
