import { createApi } from "@reduxjs/toolkit/query/react"
import axiosPrivate from "../pages/auth/axiosPrivate"
// initialize an empty api service that we'll inject endpoints into later as needed
const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data }) => {
    try {
      const result = await axiosPrivate({ url: baseUrl + url, method, data })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError
      return {
        error: { status: err.response?.status, data: err.response?.data },
      }
    }
  }
export const emptySplitApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: "http://localhost:8080/api",
  }),
  endpoints: () => ({}),
})
export default emptySplitApi.reducer
