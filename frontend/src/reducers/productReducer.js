import {createReducer} from "@reduxjs/toolkit"
const intialState = {}

export const productsReducer = createReducer(intialState,{
    ALL_PRODUCT_REQUEST:(state)=>{
        state.loading = true;
        //During loading or request make the products array empty
        state.products = []
    },
    ALL_PRODUCT_SUCCESS:(state,action)=>{
        state.loading = false;
        state.products = action.payload.products;
        state.productsCount =  action.payload.productsCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredProductsCount = action.payload.filteredProductsCount
    },
    ALL_PRODUCT_FAIL:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    ADMIN_PRODUCT_REQUEST:(state)=>{
        state.loading = true;
        state.products = []
    },
    ADMIN_PRODUCT_SUCCESS:(state,action)=>{
        state.loading = false;
        state.products = action.payload;
    },
    ADMIN_PRODUCT_FAIL:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    CLEAR_ERRORS: (state)=>{
        state.error = null
    }
})

export const productReducer = createReducer(intialState,{
    DELETE_PRODUCT_REQUEST:(state)=>{
        state.loading = true;
    },
    DELETE_PRODUCT_SUCCESS:(state,action)=>{
        state.loading = false;
        state.isDeleted = action.payload;
    },
    DELETE_PRODUCT_FAIL:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    DELETE_PRODUCT_RESET:(state)=>{
        state.isDeleted = false;
    },
    UPDATE_PRODUCT_REQUEST:(state)=>{
        state.loading = true;
    },
    UPDATE_PRODUCT_SUCCESS:(state,action)=>{
        state.loading = false;
        state.isUpdated = action.payload;
    },
    UPDATE_PRODUCT_FAIL:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    UPDATE_PRODUCT_RESET:(state)=>{
        state.isUpdated = false;
    },
    CLEAR_ERRORS: (state)=>{
        state.error = null
    }
})

export const productDetailsReducer = createReducer(intialState,{
    PRODUCT_DETAILS_REQUEST:(state)=>{
        state.loading = true;
    },
    PRODUCT_DETAILS_SUCCESS:(state,action)=>{
        state.loading = false;
        state.product = action.payload;
    },
    PRODUCT_DETAILS_FAIL:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    CLEAR_ERRORS: (state)=>{
        state.error = null
    }
})

export const newProductReducer = createReducer(intialState,{
    NEW_PRODUCT_REQUEST:(state)=>{
        state.loading = true;
    },
    NEW_PRODUCT_SUCCESS:(state,action)=>{
        state.loading = false;
        state.success = action.payload.success;
        state.product = action.payload.product
    },
    NEW_PRODUCT_FAIL:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    NEW_PRODUCT_RESET:(state)=>{
        state.success = false;
    },
    CLEAR_ERRORS: (state)=>{
        state.error = null
    }
})

export const newReviewReducer = createReducer(intialState,{
    NEW_REVIEW_REQUEST:(state)=>{
        state.loading = true;
    },
    NEW_REVIEW_SUCCESS:(state,action)=>{
        state.loading = false;
        state.success = action.payload;
    },
    NEW_REVIEW_FAIL:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    NEW_REVIEW_RESET:(state)=>{
        state.success = false;
    },
    CLEAR_ERRORS: (state)=>{
        state.error = null
    }
})

export const productReviewsReducer = createReducer(intialState,{
    ALL_REVIEW_REQUEST:(state)=>{
        state.loading = true;
    },
    ALL_REVIEW_SUCCESS:(state,action)=>{
        state.loading = false;
        state.reviews = action.payload;
    },
    ALL_REVIEW_FAIL:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    CLEAR_ERRORS: (state)=>{
        state.error = null
    }
})

export const reviewReducer = createReducer(intialState,{
    DELETE_REVIEW_REQUEST:(state)=>{
        state.loading = true;
    },
    DELETE_REVIEW_SUCCESS:(state,action)=>{
        state.loading = false;
        state.isDeleted = action.payload;
    },
    DELETE_REVIEW_FAIL:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    DELETE_REVIEW_RESET:(state)=>{
        state.isDeleted = false;
    },
    CLEAR_ERRORS: (state)=>{
        state.error = null
    }
})

