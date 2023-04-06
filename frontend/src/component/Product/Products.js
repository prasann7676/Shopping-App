import React, { Fragment, useEffect, useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { clearErrors, getProduct } from '../../actions/productAction'
import Loader from '../layout/Loader/Loader'
import './Products.css'
import ProductCard from '../Home/ProductCard'
import { useParams } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Pagination, Slider, Typography, ratingClasses } from '@mui/material';

// "/Products" will list all the products
// "Products?keyword=key" this query will search all products names such that key is a substring of the product name.

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {

  const dispatch = useDispatch()  
  const alert = useAlert()

  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([0,25000])
  const [category, setCategory] = useState("")

  //Rating useState will be used to filter all products having rating equal to or above this ratings value
  const [ratings, setRatings] = useState(0)

  const {loading, products, error, productsCount, resultPerPage, filteredProductsCount} = useSelector((state) => state.products)

  //If any query is being given to search
  // :id will be the keyword that is searched by the user from /products/search url
  const keyword = useParams()

  const setCurrentPageNo = (e) => {
    setCurrentPage(e)
  }

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice)
  }

  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProduct(keyword.id, currentPage, price, category, ratings))
  },[dispatch, keyword.id, currentPage, price, category, ratings, error, alert])  

  let count = filteredProductsCount

  const noOfPages = Math.ceil(count/resultPerPage);

  return (
    <Fragment>
        {loading ? <Loader /> :
            <Fragment>
              <h2 className='productsHeading'>Products</h2>
              <div className='products'>
                {products && 
                  products.map((product) => (
                    <ProductCard key={product._id} product={product}/>
                  ))
                }
              </div>
    
              <div className='filterBox'>
                <Typography>Price</Typography>
                <Slider
                  value={price}
                  onChange={priceHandler}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  min={0}
                  max={25000}
                />
              </div>

              <div className='categoryDiv'>
                <Typography>Category</Typography>
                <ul className='categoryBox'>
                  {categories.map((category) => (
                    <li 
                      className='category-link' 
                      key={category} 
                      onClick={() => setCategory(category)}
                    >
                    {category}
                    </li>
                  ))}
                </ul>
              </div>  

              <div className="ratingsDiv">    
                <fieldset>
                  <Typography component="legend">Ratings Above</Typography>
                  <Slider 
                    value={ratings}
                    onChange={(e, newRatings) => {
                      setRatings(newRatings)
                    }}
                    aria-labelledby="continuous-slider"
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                  />
                </fieldset>
              </div>  

              {resultPerPage < count && (
                <div className='paginationBox'>
                  <Pagination 
                    count={noOfPages}
                    onChange={(_,value) => {
                      setCurrentPage(value)
                    }}
                  />
                </div>
              )}  
            </Fragment>
        }
    </Fragment>
  )
}

export default Products