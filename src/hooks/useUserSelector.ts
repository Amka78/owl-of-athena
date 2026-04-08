import { useAuthStore } from "../store/authStore";
import type { User } from "../types";

export const useUserSelector = (): User | undefined =>
    useAuthStore((state) => state.user);
