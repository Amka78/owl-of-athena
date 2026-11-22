// Vite alias target for react-native-reanimated/src/createAnimatedComponent/NativeEventsManager
// (gesture-handler の v3 detector が require する内部モジュール)。
// reanimated は mock 化済みのため、スタブの noop 実装を返す。
export class NativeEventsManager {
    static handleEvent() {}
}
export default NativeEventsManager;
