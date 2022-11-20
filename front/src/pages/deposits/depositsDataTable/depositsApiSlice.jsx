import { emptySplitApi } from "../../../app/api"

const apiDepositSlice = emptySplitApi
  .enhanceEndpoints({
    addTagTypes: ["Deposits"],
  })
  .injectEndpoints({
    endpoints(builder) {
      return {
        fetchDeposits: builder.query({
          query() {
            return {
              url: `/deposits/`,
              method: "get",
            }
          },
          providesTags: ["Deposits"],
        }),
        addDeposit: builder.mutation({
          query(data) {
            return {
              url: `/deposits/`,
              method: "POST",
              data,
            }
          },
          invalidatesTags: ["Deposits", "BankAccounts"],
        }),
      }
    },
    overrideExisting: false,
  })
export default apiDepositSlice.reducer

export const { useFetchDepositsQuery, useAddDepositMutation } = apiDepositSlice
