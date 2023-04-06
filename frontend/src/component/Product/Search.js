import React, { Fragment, useState } from 'react'
import "./Search.css"
import { useNavigate } from "react-router-dom"

const Search = () => {

  let navigate = useNavigate()  
  const [keyword, setKeyword] = useState("")

  const searchSubmitHandler = (e) => {
    e.preventDefault()
    //trim will eradicate all spaces
    //So after trimming if keyword is not empty
    if(keyword.trim()){
        //user will be sent to this url
        navigate(`/products/${keyword}`)
    }
    else{
        navigate("/products")
    }
  }

  return (
    <Fragment>
        <form className='searchBox' onSubmit={searchSubmitHandler}>
            <input 
                type="text"
                placeholder='Search a Product ...'
                onChange={(e) => setKeyword(e.target.value)}
            />
            <input type="submit" value="Search"/>
        </form>
    </Fragment>
  )
}

export default Search