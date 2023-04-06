import axios from 'axios'

//Add to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {    

    const { data } = await axios.get(`/api/v1/product/${id}`)

    dispatch({ type: "ADD_TO_CART", payload: { 
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity
        },
    });

    //to solve the reloading problem
    //After reloading the cart should not get empty of a user
    //cart should have the same items before and after reloading
    //so we use localStoage for this purpose

    //So now, when we access the localStorage using this "cartItems string, we will get our cart items already added.
    //using getState function we can access the state in a particular reducer, here cart(the name mentionsed in the store for the reducer)
    //We will convert it to a string and store in the localstorage, so when we will extract
    //this info from localStorage we will again, convert into object and use.
    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
}

//Remove from cart
export const removeItemsFromCart = (id) => async (dispatch, getState) => { 

    dispatch({type: "REMOVE_CART_ITEM", payload: id})

    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
}   

//Saving the shipping info, after clicking checkout button from /car
//or whenever the url /shipping is invoked
export const saveShippingInfo = (data) => async (dispatch) => { 

    dispatch({type: "SAVE_SHIPPING_INFO", payload: data})

    //Saving the shipping info in the local storage
    localStorage.setItem("shippingInfo",JSON.stringify(data))
}   