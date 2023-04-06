const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary")

//create product -- Admin
exports.createProduct = catchAsyncErrors(async (req,res,next) => {

    //Adding cloudinary for images upload
    let images = [];

    //If type is string, that means only 1 image was selected
    //otherwise multiple images are being selected at the same time(which is actually allowed)
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  //Now req.body.images will contain online cloudinary links for images
  //instead of local file urls.
  req.body.images = imagesLinks; 

    // assigning who have created the product in the backend itself(as it is mendatory field in the productSchema)
    // req.user will give us the currently logged in user as while user is saved inside req.user in isAuthenticated function in middleware/auth
    req.body.user = req.user.id

    const product = await Product.create(req.body)

    // The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource
    res.status(201).json({
        success: true,
        product
    })
});

//Get All Prduct
exports.getAllProducts = catchAsyncErrors(async (req,res,next) => {
    //This will be used for pagination(how many products should be listed in one page during search and filter)
    const resultPerPage = 3

    //to count total no. of products currently in our database.
    const productsCount = await Product.countDocuments()

    const apiFeatureWithoutPagination = new ApiFeatures(Product.find(), req.query).search().filter()


    let products = await apiFeatureWithoutPagination.query

    //For getting the count of no. of products after searching, filtering etc
    //As it will not be euqal to the productsCount always.
    let filteredProductsCount = products.length

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)

    // find all product names which are superstring of the given query(search)
    // find all products which match a given category(filter)(though, filter can also be according to prices(range of prices) and ratings)
    products = await apiFeature.query
    
    // The HTTP 200 OK success status response code indicates that the request has succeeded
    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    })
})

//Get Details of a product
exports.getProductDetails = catchAsyncErrors( async (req,res,next) => {
    const product = await Product.findById(req.params.id)

    //If the product of specified id is not found
    // console.log("product is", product)
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }

    res.status(200).json({
        success: true,
        product,
    })

})

//update Product -- Admin
 exports.updateProduct = catchAsyncErrors( async (req,res,next) => {
    let product = await Product.findById(req.params.id)

    // if product not found with this particular id(params)
    if(!product){
        // The HyperText Transfer Protocol (HTTP) 500 Internal Server Error server error response code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
        return next(new ErrorHander("Product not found", 404));
    }

    // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true,
        useFindAndModify: false
    })

    console.log("controllers", product)

    res.status(200).json({
        success: true,
        product
    })
 })

 //delete product -- Admin
exports.deleteProduct = catchAsyncErrors( async (req,res,next) => {
    const product = await Product.findById(req.params.id)

    //if product not found, that is to be deleted by the admin
    if(!product){
        return next(new ErrorHander("Product not found", 404));
    }

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    // document.remove will remove a particular document from a specigic collection
    await Product.deleteOne(product)

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})

//Create new Review or Update the review.
//If a user is giving a review, which he have already given, then the pevious review will be overridden
//User will provide the rating and comment for a particular product
exports.createProductReview = catchAsyncErrors( async (req,res,next) => {
    const {rating,comment,productId} = req.body
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => {
        return rev.user.toString() === req.user._id.toString()
    })

    console.log(isReviewed)
    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating
                rev.comment = comment
            }
        })
    }
    else{
        //pushed in database attribute review array.
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    //update the average rating of the product
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating
    })
    product.ratings = avg/product.reviews.length

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success: true
    })
})

//Get All review of a single Product
//id is the product Id that will be given as a url query
exports.getProductReviews = catchAsyncErrors( async (req,res,next) => {
    const product = await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHandler("Product not fount", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
    
})

// Delete Review
// product id is productId and review id is id
exports.deleteReview = catchAsyncErrors( async (req,res,next) => {
    const product = await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not fount", 404))
    }

    // rev._id is the review id of that product and req.query.id is the review_id provided in the query
    // This will filter all reviews which have the queries review id.
    const reviews = product.reviews.filter((rev) => {
        return rev._id.toString() !== req.query.id.toString()
    })

    //update the average rating of the product
    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating
    })

    let ratings = 0

    if(reviews.lenght===0){
        ratings=0
    }
    else{
        ratings = avg/reviews.length
    }

    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(
        req.query.productId, 
        {
            reviews, 
            ratings, 
            numOfReviews
        },
        {
            new: true, 
            runValidators: true
        },
    )

    res.status(200).json({
        success: true,
    })
    
})

//Get All Prduct -- Admin
exports.getAdminProducts = catchAsyncErrors(async (req,res,next) => {
    const products = await Product.find()
    
    // The HTTP 200 OK success status response code indicates that the request has succeeded
    res.status(200).json({
        success: true,
        products,
    })
})

