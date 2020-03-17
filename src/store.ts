import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { persistReducer, persistStore, Persistor } from "redux-persist";
import logger from "redux-logger";

import { AuroraReducers, UserInfoReducers } from "./reducers";
import { AsyncStorage } from "react-native";

const persitConfig = {
    key: "root",
    storage: AsyncStorage
};

const appReducer = combineReducers({
    aurora: AuroraReducers,
    userInfo: UserInfoReducers
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
