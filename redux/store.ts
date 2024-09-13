import { configureStore } from "@reduxjs/toolkit";
import { todoApi } from "./services/todoService";
import { GraphqlApi } from "./services/graphqlService";

export const store =configureStore({
    reducer:{
        [todoApi.reducerPath] :todoApi.reducer,
        [GraphqlApi.reducerPath]:GraphqlApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(todoApi.middleware),

})