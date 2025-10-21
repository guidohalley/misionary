import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    avatar?: string
    userName?: string
    email?: string
    authority?: string[] // Legacy - deprecated, use roles instead
    roles?: string[] // New: ADMIN, CONTADOR, PROVEEDOR
}

const initialState: UserState = {
    avatar: '',
    userName: '',
    email: '',
    authority: [],
    roles: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.avatar = action.payload?.avatar
            state.email = action.payload?.email
            state.userName = action.payload?.userName
            // Support both authority (legacy) and roles (new)
            state.authority = action.payload?.authority || action.payload?.roles
            state.roles = action.payload?.roles || action.payload?.authority
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
