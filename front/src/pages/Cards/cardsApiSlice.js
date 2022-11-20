import { emptySplitApi } from "../../app/api"

export const apiCardSlice = emptySplitApi
  .enhanceEndpoints({
    addTagTypes: ["Cards"],
  })
  .injectEndpoints({
    endpoints(builder) {
      return {
        fetchCards: builder.query({
          query() {
            return {
              url: `/cards/`,
              method: "get",
            }
          },
          invalidatesTags: "Cards",
        }),
        addCard: builder.mutation({
          query(data) {
            return {
              url: `/cards/`,
              method: "POST",
              data,
            }
          },
          invalidatesTags: "Cards",
        }),
        fetchCardTypes: builder.query({
          query() {
            return {
              url: `/cards/cardNames`,
              method: "get",
            }
          },
          invalidatesTags: "Cards",
        }),
        blockCard: builder.mutation({
          query(data) {
            return {
              url: `/cards/` + data + "/block",
              method: "PUT",
            }
          },
          invalidatesTags: "Cards",
        }),
        deleteCard: builder.mutation({
          query(data) {
            return {
              url: `/cards/` + data,
              method: "DELETE",
            }
          },
          invalidatesTags: "Cards",
        }),
      }
    },
    overrideExisting: false,
  })

export default apiCardSlice.reducer

export const {
  useFetchCardsQuery,
  useAddCardMutation,
  useFetchCardTypesQuery,
  useBlockCardMutation,
  useDeleteCardMutation,
} = apiCardSlice
