//#region Import Modules
import AsyncStorage from "@react-native-async-storage/async-storage";
import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import logger from "redux-logger";
import { Persistor, persistReducer, persistStore } from "redux-persist";

import {
    AppReducers,
    AuroraReducers,
    AuthReducers,
    ProfileReducers,
    SessionReducers,
} from "./reducers";
//#endregion

const persitConfig = {
    key: "root",
    storage: AsyncStorage,
};

const appReducer = combineReducers({
    app: AppReducers,
    aurora: AuroraReducers,
    session: SessionReducers,
    auth: AuthReducers,
    profile: ProfileReducers,
});

const persistedReducer = persistReducer(persitConfig, appReducer);
const middleware = (): any => {
    return applyMiddleware(logger);
};

export default (): { store: Store; persistor: Persistor } => {
    const store = createStore(persistedReducer, middleware());
    const persistor = persistStore(store);
    return { store, persistor };
};
