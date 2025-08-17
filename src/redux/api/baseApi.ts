// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../store";

// export const baseApi = createApi({
//     reducerPath: "baseApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/`,
//         credentials: "include",
//         prepareHeaders: (headers, { getState }) => {
//             const token = (getState() as RootState).auth.token;
//             if (token) {
//                 headers.set("Authorization", `${token}`);
//             }
//             return headers;
//         },
//     }),
//     tagTypes: ["User", "Messages", "Notification"],
//     endpoints: () => ({}),
// });

// import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
// import { logOut, setUser, TUser } from "../features/auth/authSlice";
// import { RootState } from "../store";

// // 1. Basic fetchBaseQuery setup
// const baseQuery = fetchBaseQuery({
//     baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/`,
//     credentials: "include", // Sends cookies automatically
//     prepareHeaders: (headers, { getState }) => {
//         const token = (getState() as RootState).auth.token;
//         if (token) headers.set("Authorization", `Bearer ${token}`);
//         return headers;
//     },
// });

// const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
//     // Initial request
//     let result = await baseQuery(args, api, extraOptions);

//     if (result?.error?.status === 401) {
//         console.log("Attempting token refresh...");

//         // 1. Request new token
//         const refreshResult = await baseQuery(
//             {
//                 url: "auth/refresh-token",
//                 method: "POST",
//                 credentials: "include",
//             },
//             api,
//             extraOptions
//         );

//         console.log("Refresh result:", refreshResult?.data);

//         if (refreshResult.data) {
//             // 2. Extract new token and user data
//             const { accessToken, user } = refreshResult?.data?.data as {
//                 accessToken: string;
//                 user: TUser;
//             };

//             console.log("New token:", accessToken);
//             console.log("User data:", user);

//             // 3. Update Redux store (async)
//             api.dispatch(setUser({ user, token: accessToken }));

//             // 4. Prepare retry with MANUAL token attachment
//             const retryArgs =
//                 typeof args === "string"
//                     ? {
//                           url: args,
//                           headers: {
//                               Authorization: `Bearer ${accessToken}`,
//                           },
//                       }
//                     : {
//                           ...args,
//                           headers: {
//                               ...args.headers,
//                               Authorization: `Bearer ${accessToken}`,
//                           },
//                       };

//             // 5. Retry the original request with new token
//             result = await baseQuery(retryArgs, api, extraOptions);
//             console.log("Retry result:", result);

//             return result;
//         } else {
//             // Refresh failed - logout user
//             console.log("Refresh failed - logging out");
//             api.dispatch(logOut());
//             if (typeof window !== "undefined") window.location.href = "/";
//             return { error: { status: 401, data: "Session expired" } };
//         }
//     }

//     return result;
// };
// // 3. Create API
// export const baseApi = createApi({
//     reducerPath: "api",
//     baseQuery: baseQueryWithReauth,
//     tagTypes: ["User", "Messages", "Notification"],
//     endpoints: () => ({}),
// });

import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logOut, setUser, TUser } from "../features/auth/authSlice";
import { RootState } from "../store";

// Interface for refresh token response
interface RefreshTokenResponse {
    data: {
        accessToken: string;
        user: TUser;
    };
}

// 1. Basic fetchBaseQuery setup
const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        console.log("Attempting token refresh...");

        const refreshResult = await baseQuery(
            {
                url: "auth/refresh-token",
                method: "POST",
                credentials: "include",
            },
            api,
            extraOptions
        );

        console.log("Refresh result:", refreshResult.data);

        // Type-safe check for nested data structure
        if (refreshResult.data && typeof refreshResult.data === "object" && "data" in refreshResult.data && refreshResult.data.data && typeof refreshResult.data.data === "object") {
            const responseData = refreshResult.data as RefreshTokenResponse;
            const { accessToken, user } = responseData.data;

            console.log("New token:", accessToken);
            console.log("User data:", user);

            // Update Redux store
            api.dispatch(setUser({ user, token: accessToken }));

            // Retry with updated token from store
            result = await baseQuery(args, api, extraOptions);
            console.log("Retry result:", result);

            return result;
        } else {
            console.log("Refresh failed - logging out");
            api.dispatch(logOut());
            if (typeof window !== "undefined") window.location.href = "/";
            return { error: { status: 401, data: "Session expired" } };
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Messages", "Notification"],
    endpoints: () => ({}),
});
