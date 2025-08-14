import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: "http://localhost:5000/api/",
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;

            if (token) {
                headers.set("Authorization", `${token}`);
            }

            return headers;
        },
    }),
    endpoints: () => ({}),
});
