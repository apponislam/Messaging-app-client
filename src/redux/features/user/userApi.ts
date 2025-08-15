import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyProfile: builder.query({
            query: () => ({
                url: "/user/me",
                method: "GET",
            }),
            providesTags: ["User"],
        }),

        getAllUsers: builder.query({
            query: () => ({
                url: "/user",
                method: "GET",
            }),
            providesTags: ["User"],
        }),

        getUserById: builder.query({
            query: (id) => ({
                url: `/user/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "User", id }],
        }),
    }),
});

export const { useGetMyProfileQuery, useGetAllUsersQuery, useGetUserByIdQuery } = userApi;
