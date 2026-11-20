import { create } from "zustand";

/**
 * 未転送（未同期）セッション件数。ステータスバー / セッションアイコンのバッジ表示に使う。
 * 転送フロー自体はダイアログが確認後に全件一括で同期するため、進行状態は保持しない
 * （iOS 版の挙動に合わせた構成）。
 */
type SessionTransferStore = {
    unsyncedCount: number;
    setUnsyncedCount: (count: number) => void;
    clearUnsyncedCount: () => void;
};

export const useSessionTransferStore = create<SessionTransferStore>()((set) => ({
    unsyncedCount: 0,
    setUnsyncedCount: (count: number) => set({ unsyncedCount: Math.max(0, count) }),
    clearUnsyncedCount: () => set({ unsyncedCount: 0 }),
}));
