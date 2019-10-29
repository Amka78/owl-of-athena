import { createAppContainer } from "react-navigation";
import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";

import { InitialNavigator } from "./navigation";
import { UserInfoReducers } from "./reducers";

const appReducer = combineReducers({
    core: UserInfoReducers
});
export const RootContainer = createAppContainer(InitialNavigator);

const middleware = () => {
    return applyMiddleware(logger);
};

export const store = createStore(appReducer, middleware());
