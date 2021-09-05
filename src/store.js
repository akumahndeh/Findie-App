import { combineReducers, createStore } from "redux";
import userReducers from "./state/user-state";

const Reducers = combineReducers({ userReducers })

const store = createStore(
    Reducers
);



export default store