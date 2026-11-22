// Subpath stub for expo-modules-core/build/ts-declarations.
//
// expo-modules-core's entry does `import './ts-declarations/global'`.
// Those files are type-only declarations (they have no runtime exports), so
// bundlers fail with MISSING_EXPORT. Replace the subpath with minimal runtime
// classes; the rest of expo-modules-core keeps its real implementation.
export class EventEmitter {
    addListener() {
        return { remove: () => {} };
    }
    removeAllListeners() {}
    emit() {}
}
export class NativeModule {}
export class SharedObject {}
export class SharedRef {}
