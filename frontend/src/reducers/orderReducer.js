import {createReducer} from "@reduxjs/toolkit"
const intialState = {}

export const newOrderReducer = createReducer(intialState,{
    CREATE_ORDER_REQUEST:(state)=>{
        state.loading = true
    },
    CREATE_ORDER_SUCCESS:(state, action)=>{
        state.loading = false
        state.order = action.payload
    },
    CREATE_ORDER_FAIL:(state, action)=>{
        state.loading = false
        state.error = action.payload
    },
    CLEAR_ERRORS:(state)=>{
        state.error = null
    },
})


export const myOrdersReducer = createReducer(intialState,{
    MY_ORDER_REQUEST:(state)=>{
        state.loading = true
    },
    MY_ORDER_SUCCESS:(state, action)=>{
        state.loading = false
        state.orders = action.payload
    },
    MY_ORDER_FAIL:(state, action)=>{
        state.loading = false
        state.error = action.payload
    },
    CLEAR_ERRORS:(state)=>{
        state.error = null
    },
})

export const allOrdersReducer = createReducer(intialState,{
    ALL_ORDERS_REQUEST:(state)=>{
        state.loading = true
    },
    ALL_ORDERS_SUCCESS:(state, action)=>{
        state.loading = false
        state.orders = action.payload
    },
    ALL_ORDERS_FAIL:(state, action)=>{
        state.loading = false
        state.error = action.payload
    },
    CLEAR_ERRORS:(state)=>{
        state.error = null
    },
})

export const OrderReducer = createReducer(intialState,{
    UPDATE_ORDER_REQUEST:(state)=>{
        state.loading = true
    },
    UPDATE_ORDER_SUCCESS:(state, action)=>{
        state.loading = false
        state.isUpdated = action.payload
    },
    UPDATE_ORDER_FAIL:(state, action)=>{
        state.loading = false
        state.error = action.payload
    },
    UPDATE_ORDER_RESET:(state)=>{
        state.loading = false
        state.isUpdated = false
    },
    DELETE_ORDER_REQUEST:(state)=>{
        state.loading = true
    },
    DELETE_ORDER_SUCCESS:(state, action)=>{
        state.loading = false
        state.isDeleted = action.payload
    },
    DELETE_ORDER_FAIL:(state, action)=>{
        state.loading = false
        state.error = action.payload
    },
    DELETE_ORDER_RESET:(state)=>{
        state.loading = false
        state.isDeleted = false
    },
    CLEAR_ERRORS:(state)=>{
        state.error = null
    },
})

export const orderDetailReducer = createReducer(intialState,{
    ORDER_DETAILS_REQUEST:(state)=>{
        state.loading = true
    },
    ORDER_DETAILS_SUCCESS:(state, action)=>{
        state.loading = false
        state.order = action.payload
    },
    ORDER_DETAILS_FAIL:(state, action)=>{
        state.loading = false
        state.error = action.payload
    },
    CLEAR_ERRORS:(state)=>{
        state.error = null
    },
})