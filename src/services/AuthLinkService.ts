//#region Types
export type AuthLinkParams = {
    accessToken?: string;
    refreshToken?: string;
    code?: string;
    type?: string;
    error?: string;
    errorDescription?: string;
};
//#endregion

//#region Functions
/**
 * Supabase のリカバリリンクは implicit flow では #access_token=...、
 * PKCE では ?code=... を返す。どちらも同じ関数で扱えるようにする。
 */
export const parseAuthLink = (url?: string | null): AuthLinkParams => {
    if (!url) return {};

    const hashIndex = url.indexOf("#");
    const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
    const fragment = hashIndex >= 0 ? url.slice(hashIndex + 1) : "";
    const queryIndex = withoutHash.indexOf("?");
    const query = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";
    const params = parseParams(`${query}&${fragment}`);

    return {
        accessToken: params.access_token,
        refreshToken: params.refresh_token,
        code: params.code,
        type: params.type,
        error: params.error,
        errorDescription: params.error_description,
    };
};

export const isPasswordRecoveryUrl = (url?: string | null): boolean => {
    if (!url) return false;

    const params = parseAuthLink(url);

    return (
        params.type === "recovery" ||
        !!params.accessToken ||
        !!params.code ||
        /(^|[/:])reset-password([/?#]|$)/.test(url)
    );
};

const parseParams = (source: string): Record<string, string> => {
    const result: Record<string, string> = {};

    for (const pair of source.split("&")) {
        if (!pair) continue;

        const separatorIndex = pair.indexOf("=");
        const key = separatorIndex >= 0 ? pair.slice(0, separatorIndex) : pair;
        const value = separatorIndex >= 0 ? pair.slice(separatorIndex + 1) : "";

        result[decode(key)] = decode(value);
    }

    return result;
};

const decode = (value: string): string => {
    try {
        return decodeURIComponent(value.replace(/\+/g, " "));
    } catch {
        return value;
    }
};
//#endregion