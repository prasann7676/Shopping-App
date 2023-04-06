// This is a file to show a single product in the home page
// https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/71iF4ayf-gL._SL1500_.jpg
// https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/71b+cUSxnRL._SL1482_.jpg
import React from 'react'
import { Link } from "react-router-dom"
import { Rating } from '@mui/material'

const ProductCard = ({product}) => {

  //options fo ReactStars package
  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
        <img src={product.images[0].url} alt={product.name}/>
        <p>{product.name}</p>
        <div>
            <Rating {...options} /> 
            <span className="productCardSpan">({product.numOfReviews} Reviews)</span>
        </div>
        <span>{`₹${product.price}`}</span>
    </Link>
  )
}

export default ProductCard