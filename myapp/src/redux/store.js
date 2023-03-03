import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import balanceSlice from './slices/balanceSlice'
import orderSlice from './slices/orderSlice'

const store = configureStore({
    reducer: {
        // 余额 reducer
        balance: balanceSlice,
        // 订单 reducer
        order: orderSlice
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})

export default store