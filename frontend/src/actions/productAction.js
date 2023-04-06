import axios from 'axios'

// action type
// ALL_PRODUCT_REQUEST, ALL_PRODUCT_SUCCESS, ALL_PRODUCT_FAIL, CLEAR_ERRORS


//This actions gets all the product fron the database
//keyord is the query that we will pass to search a product implemented in backend
export const getProduct = (keyword="", currentPage=1, price=[0,25000], category, ratings=0) => async (dispatch) => {
    try{
        dispatch({type: "ALL_PRODUCT_REQUEST"})

        let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`

        if(category){
            link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`
        }
        const {data} = await axios.get(link)

        dispatch({type: "ALL_PRODUCT_SUCCESS", payload: data})
    }catch(error){
        dispatch({type: "ALL_PRODUCT_FAIL", payload: error.response.data.message})
    }
}

//This actions gets details of a product from the database
export const getProductDetails = (id) => async (dispatch) => {
    try{
        dispatch({type: "PRODUCT_DETAILS_REQUEST"})

        const {data} = await axios.get(`/api/v1/product/${id}`)

        console.log("action", data)

        dispatch({type: "PRODUCT_DETAILS_SUCCESS", payload: data.product})
    }catch(error){
        dispatch({type: "PRODUCT_DETAILS_FAIL", payload: error.response.data.message})
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({type: "CLEAR_ERRORS"})
}

//Adding new reviews by a user on a certain product
export const newReview = (reviewData) => async (dispatch) => {
    try{
        dispatch({type: "NEW_REVIEW_REQUEST"})

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const {data} = await axios.put(`/api/v1/review`, reviewData, config)

        dispatch({type: "NEW_REVIEW_SUCCESS", payload: data.success})
    }catch(error){
        dispatch({type: "NEW_REVIEW_FAIL", payload: error.response.data.message})
    }
}

// Get All Reviews of a Product --Admin
export const getAllReviews = (id) => async (dispatch) => {
    try {
      dispatch({ type: "ALL_REVIEW_REQUEST" });
  
      const { data } = await axios.get(`/api/v1/reviews?id=${id}`);
  
      dispatch({
        type: "ALL_REVIEW_SUCCESS",
        payload: data.reviews,
      });
    } catch (error) {
      dispatch({
        type: "ALL_REVIEW_FAIL",
        payload: error.response.data.message,
      });
    }
  };
  
  // Delete Review of a Product --Admin
  export const deleteReviews = (reviewId, productId) => async (dispatch) => {
    try {
      dispatch({ type: "DELETE_REVIEW_REQUEST" });
  
      const { data } = await axios.delete(
        `/api/v1/reviews?id=${reviewId}&productId=${productId}`
      );
  
      dispatch({
        type: "DELETE_REVIEW_SUCCESS",
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: "DELETE_REVIEW_FAIL",
        payload: error.response.data.message,
      });
    }
  };

//Get All products for Admin --Admin
export const getAdminProduct = () => async (dispatch) => {
    try {
        dispatch({type: "ADMIN_PRODUCT_REQUEST"})

        const { data } = await axios.get("/api/v1/admin/products")

        dispatch({type: "ADMIN_PRODUCT_SUCCESS", payload: data.products})
    } catch(error){
        dispatch({type: "ADMIN_PRODUCT_FAIL", payload: error.response.data.message})
    }
}

//Create Product --Admin
export const createProduct = (productData) => async (dispatch) => {
    try{
        dispatch({type: "NEW_PRODUCT_REQUEST"})

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const {data} = await axios.post(`/api/v1/admin/product/new`, productData, config)

        dispatch({type: "NEW_PRODUCT_SUCCESS", payload: data})
    }catch(error){
        dispatch({type: "NEW_PRODUCT_FAIL", payload: error.response.data.message})
    }
}

//Delete Product --Admin
export const deleteProduct = (id) => async (dispatch) => {
    try{
        dispatch({type: "DELETE_PRODUCT_REQUEST"})

        const {data} = await axios.delete(`/api/v1/admin/product/${id}`)

        dispatch({type: "DELETE_PRODUCT_SUCCESS", payload: data.success})
    }catch(error){
        dispatch({type: "DELETE_PRODUCT_FAIL", payload: error.response.data.message})
    }
}

//Update Product --Admin
export const updateProduct = (id, productData) => async (dispatch) => {
    try{
        dispatch({type: "UPDATE_PRODUCT_REQUEST"})

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const {data} = await axios.put(`/api/v1/admin/product/${id}`, productData, config)

        dispatch({type: "UPDATE_PRODUCT_SUCCESS", payload: data.success})
    }catch(error){
        dispatch({type: "UPDATE_PRODUCT_FAIL", payload: error.response.data.message})
    }
}