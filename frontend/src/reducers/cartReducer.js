import {createReducer} from "@reduxjs/toolkit"
const intialState = {
    // If cartItems are in localStorage, then retrive it and convert the cartItems string(stored as a string) into object
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
    shippingInfo: localStorage.getItem("shippingInfo")
        ? JSON.parse(localStorage.getItem("shippingInfo"))
        : {},
}

export const cartReducer = createReducer(intialState,{
    ADD_TO_CART:(state, action)=>{
        const item = action.payload

        //Finding if the items already exists in the cart or not 
        //Product is used as a reference to id of the product
        //As if we got to cartAction we can see we dispatched ADD_TO_CART reducer using product._id payload
        const isItemExist = state.cartItems.find(
            (i) => i.product === item.product
        )

        if(isItemExist) {

            //Replace the previosuly addd product in the cart to action.payload
            state.cartItems = state.cartItems.map((i) => 
                i.product === isItemExist.product ? item : i
            )
        }
        else{
            //If this product is not already added in the cart, them add it in the cartItems array
            state.cartItems = [...state.cartItems, item]
        }
    },
    REMOVE_CART_ITEM:(state, action)=>{
        // this will filter all product except for which is to be removed, that is discarded
        state.cartItems = state.cartItems.filter((i) => i.product !== action.payload)
    },
    SAVE_SHIPPING_INFO:(state, action)=>{
        state.shippingInfo = action.payload
    },
})