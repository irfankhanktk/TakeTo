import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import home from "./reducers/home";
import order from "./reducers/order";
import menu_orders from "./reducers/menu_orders";
import thunk from "redux-thunk";
import common_orders_list from "./reducers/common-orders";
import wallet from "./reducers/wallet";
import auth from "./reducers/auth";
import { SET_LOGOUT } from "./ActionTypes";

import common from "./reducers/common";
import inbox from "./reducers/inbox";
const rootReducer = combineReducers({
  home,
  order,
  menu_orders,
  common_orders_list,
  wallet,
  auth,
  common,
  inbox
});

// const appReducer = (state, action) => {
//   if (action.type === SET_LOGOUT) {
//     return rootReducer(
//       {
//         home: {},
//         order: {},
//         menu_orders: {},
//         common_orders_list: {},
//         wallet: {},
//         auth: {},
//         common: {},
//       },
//       action
//     );
//   }
//   return rootReducer(state, action);
// };

const composeEnhancers = window.REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
