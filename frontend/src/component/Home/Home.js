import React, { Fragment, useEffect } from 'react'
import "./Home.css"
import Product from "./ProductCard.js"
import MetaData from '../layout/MetaData';
import { getProduct, clearErrors } from '../../actions/productAction';
import {useSelector,useDispatch} from 'react-redux'
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';

const Home = () => {

  const alert = useAlert()
  const dispatch = useDispatch()

  //Inside useSelector we give the nam eof the reducer which we mention inside the store file
  const {loading, error, products, productsCount} = useSelector((state) => state.products)

  useEffect(()=>{

    if(error){
      alert.error(error)
      dispatch(clearErrors())
    }

    dispatch(getProduct())
  },[dispatch, error, alert])

  return (
    <Fragment>
    {loading ? (<Loader/>):
    <Fragment>
    <MetaData title="Home Page is working"/>
        <div className="banner">
            <p>Welcome to Shopping App</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href="#container">
                <button>
                    Scroll     
                </button>
            </a>
        </div>

        <h2 className="homeHeading">Featured Products</h2>

        <div class="container" id="container">
          {products && products.map(product => (
            <Product product={product}/>
          ))}
        </div>
    </Fragment>}
    </Fragment>
  )
}

export default Home