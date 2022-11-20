import { emptySplitApi } from "../../app/api"

const bankAccountsApiSlice = emptySplitApi
  .enhanceEndpoints({
    addTagTypes: ["BankAccounts"],
  })
  .injectEndpoints({
    endpoints(builder) {
      return {
        fetchUserBankAccounts: builder.query({
          query() {
            return { url: `/user/accounts`, method: "get" }
          },
          providesTags: ["BankAccounts", "Transactions"],
        }),
        fetchTransactionHistory: builder.query({
          query(id) {
            return { url: `/user/accounts/${id}`, method: "get" }
          },
          providesTags: ["Transactions"],
        }),
        updateTransactionLimit: builder.mutation({
          query(data) {
            return {
              url: `/user/accounts/updateLimit`,
              method: "PUT",
              data,
            }
          },
          invalidatesTags: ["BankAccounts"],
        }),
      }
    },
    overrideExisting: false,
  })
export default bankAccountsApiSlice.reducer

export const {
  useFetchUserBankAccountsQuery,
  useFetchTransactionHistoryQuery,
  useUpdateTransactionLimitMutation,
} = bankAccountsApiSlice
