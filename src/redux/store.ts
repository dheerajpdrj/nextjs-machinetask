"use client";
import { configureStore } from "@reduxjs/toolkit";
import tabledataslice from "./slices/tabledataslice";
import { combineReducers } from "@reduxjs/toolkit";
import calenderSlice from "./slices/calenderSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  tableData: tabledataslice,
  calender: calenderSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
