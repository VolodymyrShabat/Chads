import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "../pages/counter/counterSlice"
import userReducer from "../pages/auth/userSlice"
import filterReducer from "../pages/deposits/depositsDataTable/depositsFilterSlice"
import { emptySplitApi } from "./api"

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    filter: filterReducer,
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
})

export default store
