import { isPasswordRecoveryUrl, parseAuthLink } from "../AuthLinkService";

describe("AuthLinkService", () => {
    it("parses implicit-flow recovery tokens from the fragment", () => {
        const params = parseAuthLink(
            "owl-of-athena://reset-password#access_token=abc&refresh_token=def&type=recovery&expires_in=3600",
        );

        expect(params.accessToken).toBe("abc");
        expect(params.refreshToken).toBe("def");
        expect(params.type).toBe("recovery");
    });

    it("parses a PKCE code from the query string", () => {
        const params = parseAuthLink("owl-of-athena://reset-password?code=pkce-code");

        expect(params.code).toBe("pkce-code");
    });

    it("decodes errors returned by Supabase", () => {
        const params = parseAuthLink(
            "owl-of-athena://reset-password?error=access_denied&error_description=Link+expired",
        );

        expect(params.error).toBe("access_denied");
        expect(params.errorDescription).toBe("Link expired");
    });

    it("detects password recovery links", () => {
        expect(isPasswordRecoveryUrl("owl-of-athena://reset-password")).toBe(true);
        expect(isPasswordRecoveryUrl("owl-of-athena://reset-password?code=abc")).toBe(true);
        expect(isPasswordRecoveryUrl("owl-of-athena://login")).toBe(false);
        expect(isPasswordRecoveryUrl(undefined)).toBe(false);
    });
});