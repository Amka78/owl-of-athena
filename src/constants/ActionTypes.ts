const LOGIN = "LOGIN" as const;
const UPDATE_USER = "UPDATE_USER" as const;
const LOGOUT = "LOGOUT" as const;
const CACHE_SETTINGS = "CACHE_SETTINGS" as const;
const INIT = "INIT" as const;
const CACHE_PROFILES = "CACHE_PROFILES" as const;
const SELECT_PROFILE = "SELECT_PROFILE" as const;
const UPDATE_PROFILE = "UPDATE_PROFILE" as const;
const DELETE_PROFILE = "DELETE_PROFILE" as const;
const UPDATE_PROFILE_FILTER = "UPDATE_PROFILE_FILTER" as const;
const CACHE_SESSIONS = "CACHE_SESSIONS" as const;
const CACHE_SESSION_DETAILS = "CACHE_SESSION_DETAILS" as const;
const SELECT_SESSION = "SELECT_SESSION" as const;
const SELECT_SESSION_DETAIL = "SELECT_SESSION_DETAIL" as const;
const INITIALIZE_AURORA = "INITIALIZE_AURORA" as const;
const INITIALIZE_SESSION = "INITIALIZE_SESSION" as const;
const INITIALIZE_PROFILES = "INITIALIZE_PROFILES" as const;
const UPDATE_SESSION_FILTER = "UPDATE_SESSION_FILTER" as const;
const DELETE_SESSION = "DELETE_SESSION" as const;
const UPDATE_SESSION = "UPDATE_SESSION" as const;
const WAKELOCK = "WAKE_LOCK" as const;
export default {
    INIT,
    INITIALIZE_AURORA,
    INITIALIZE_SESSION,
    INITIALIZE_PROFILES,
    LOGIN,
    LOGOUT,
    UPDATE_USER,
    CACHE_SESSIONS,
    CACHE_SESSION_DETAILS,
    DELETE_SESSION,
    SELECT_SESSION,
    SELECT_SESSION_DETAIL,
    UPDATE_SESSION_FILTER,
    UPDATE_SESSION,
    CACHE_SETTINGS,
    CACHE_PROFILES,
    SELECT_PROFILE,
    UPDATE_PROFILE,
    DELETE_PROFILE,
    UPDATE_PROFILE_FILTER,
    WAKELOCK,
};
