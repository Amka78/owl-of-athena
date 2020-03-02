import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";

import { CoreReducers, UserInfoReducers } from "./reducers";

const appReducer = combineReducers({
    core: CoreReducers,
    userInfo: UserInfoReducers
});

const middleware = () => {
    return applyMiddleware(logger);
};

export const store = createStore(appReducer, middleware());
