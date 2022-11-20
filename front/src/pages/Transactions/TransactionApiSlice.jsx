import { emptySplitApi } from "../../app/api"

const transactionApiSlice = emptySplitApi
  .enhanceEndpoints({
    addTagTypes: ["Transactions"],
  })
  .injectEndpoints({
    endpoints(builder) {
      return {
        fetchUserCards: builder.query({
          query() {
            return { url: `/cards/`, method: "get" }
          },
          providesTags: ["Transactions"],
        }),
        sendTransaction: builder.mutation({
          query(data) {
            return {
              url: `/transactions/`,
              method: "POST",
              data,
              validateStatus: (response, result) =>
                response.status === 200 && !result.isError,
            }
          },
          invalidatesTags: ["Transactions", "BankAccounts"],
        }),
        confirmTransaction: builder.mutation({
          query(data) {
            return {
              url: `/transactions/confirm`,
              method: "POST",
              data,
            }
          },
          invalidatesTags: ["Transactions", "BankAccounts"],
        }),
      }
    },
    overrideExisting: false,
  })
export default transactionApiSlice.reducer

export const {
  useFetchUserCardsQuery,
  useSendTransactionMutation,
  useConfirmTransactionMutation,
} = transactionApiSlice
