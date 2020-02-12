import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";

import { UserInfoReducers } from "./reducers";

const appReducer = combineReducers({
    core: UserInfoReducers
});

const middleware = () => {
    return applyMiddleware(logger);
};

export const store = createStore(appReducer, middleware());
