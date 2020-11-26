import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { persistReducer, persistStore, Persistor } from "redux-persist";
import logger from "redux-logger";

import { AuroraReducers, AuthReducers } from "./reducers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SessionReducers from "./reducers/SessionReducers";

const persitConfig = {
    key: "root",
    storage: AsyncStorage,
};

const appReducer = combineReducers({
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
