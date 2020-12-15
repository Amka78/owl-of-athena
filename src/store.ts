//#region Import Modules
import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { persistReducer, persistStore, Persistor } from "redux-persist";
import logger from "redux-logger";

import { AuroraReducers, AuthReducers, AppReducers } from "./reducers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SessionReducers from "./reducers/SessionReducers";
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
