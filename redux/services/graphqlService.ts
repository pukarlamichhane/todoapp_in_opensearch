import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const GraphqlApi = createApi({
  reducerPath: 'GraphqlApi',
  tagTypes: ['Todo'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
  }),
  endpoints: (builder) => ({
    getGraphqlTask: builder.query({
      query: () => ({
        url: '/graphql',
        method: 'POST',
        body: {
          query: `
            query Todos {
              todos {
                id
                task
                description
                complete
                severity
                createdat
                updatedat
                status
              }
            }
          `,
        },
      }),
      providesTags: ['Todo'],
    }),
    getGraphqlAgg: builder.mutation({
      query: ({ startDate, endDate }) => ({
        url: '/graphql',
        method: 'POST',
        body: {
          query: `
            query Getdate($input: DateInput!) {
              getdate(input: $input) {
                key
                doc_count
              }
            }
          `,
          variables: {
            input: { startDate, endDate },
          },
        },
      }),
    }),
    addGraphqlTask: builder.mutation({
      query: (input) => {
        console.log('Mutation input:', input);
        return {
          url: '/graphql',
          method: 'POST',
          body: {
            query: `
              mutation CreateTodo($input: CreateTodoInput!) {
                createTodo(input: $input)
              }
            `,
            variables: { input },
          },
        };
      },
      invalidatesTags: ['Todo'],
    }),
    updateGraphqlTask: builder.mutation({
      query: (newtask) => ({
        url: '/graphql',
        method: 'POST',
        body: {
          query: `
            mutation UpdateTodo($input: UpdateTodoInput!) {
              updateTodo(input: $input)
            }
          `,
          variables: { input: newtask },
        },
      }),
      invalidatesTags: ['Todo'],
    }),
    deleteGraphqlTask: builder.mutation({
      query: (deleteTodoId) => ({
        url: '/graphql',
        method: 'POST',
        body: {
          query: `
            mutation DeleteTodo($deleteTodoId: ID!) {
              deleteTodo(id: $deleteTodoId)
            }
          `,
          variables: { deleteTodoId },
        },
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

export const {
  useGetGraphqlTaskQuery,
  useAddGraphqlTaskMutation,
  useDeleteGraphqlTaskMutation,
  useGetGraphqlAggMutation,
  useUpdateGraphqlTaskMutation,
} = GraphqlApi;
