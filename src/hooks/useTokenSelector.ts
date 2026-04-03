import { useAuthStore } from "../store/authStore";

export const useTokenSelector = (): string | undefined =>
    useAuthStore((state) => state.token);
