import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import AuthService from "./authApi"

export const login = createAsyncThunk("auth/", async (values, thunkAPI) => {
  try {
    const response = await AuthService.login(
      values.phone_number,
      values.password
    )
    if (response.status !== 200) {
      return thunkAPI.rejectWithValue(
        "Error!, please check your phone number and password"
      )
    }
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue("Error!")
  }
})
export const signUp = createAsyncThunk(
  "auth/sign-up",
  async (values, thunkAPI) => {
    const response = await AuthService.register(
      values.phoneNumber,
      values.email,
      values.password,
      values.secretQuestion
    )
    return response
  }
)
export const getQR = createAsyncThunk(
  "auth/qr-code",
  async (values, thunkAPI) => {
    const response = await AuthService.getQR(values.phoneNumber)

    return response
  }
)
export const confirmPhone = createAsyncThunk(
  "auth/confirm-phone",
  async (values, thunkAPI) => {
    const response = await AuthService.confirmPhone(
      values.phoneNumber,
      values.code
    )
    return response
  }
)

const userSlice = createSlice({
  name: "user",
  initialState: {
    isSuccess: false,
    isLoading: false,
    isError: false,
    errorMessage: "",
    srcQR: "",
    loginState: "",
  },
  reducers: {
    clearState: (state) => {
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.errorMessage = ""
      return state
    },
    logout: (state) => {
      state.loginState = "log out"
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isSuccess = true
        state.loginState = "login"
      })
      .addCase(login.pending, (state, { payload }) => {
        state.isFetching = true
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isError = true
      })
      .addCase(getQR.fulfilled, (state, { payload }) => {
        state.srcQR = payload
      }),
})
export const selectUser = (state) => state.user
export const { clearState, logout } = userSlice.actions
export default userSlice.reducer
