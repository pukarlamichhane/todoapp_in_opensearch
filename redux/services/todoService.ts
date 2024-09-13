import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  tagTypes: ['Task'],
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  endpoints: (builder) => ({
    getTask: builder.query({
      query: () => 'gettodo',
      providesTags: ['Task'],
    }),
    addTask: builder.mutation({
      query: (task) => ({
        url: 'create',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: (updatetask) => ({
        url: `put/${updatetask.id}`,
        method: 'PUT',
        body: updatetask,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    getagg: builder.mutation({
      query: ({ startDate, endDate }) => ({
        url: 'getagg',
        method: 'POST',
        body: { start: startDate, end: endDate },
      }),
    }),
  }),
});

export const {
  useGetTaskQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetaggMutation,
} = todoApi;
