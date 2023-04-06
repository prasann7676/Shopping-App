// This class ApiFeature have certain functions resposible for searching, filtering and pagination etc the products accirding to the query

// Search will be done according to the name of the products
// whereas, filter would be according to the category of the products.

// if url is http://localhost:4000?keyword:samosa&page:2&category:laptop
// keyword:samosa -> This means, we have to search the products with name samosa
// page:2 -> we need to render products which will show in 2nd page of the filter.
// category:laptop -> we need to filter products whose category is laptop(filter can also be according to price and rating)
// Rememer, any 1 or 2 of these queries can also be specified in the url, according to which functions will be evoked.


class ApiFeatures {
    // query is general mongoDB query like find etc.
    // queryStr is the value of the query in the url(i.e. after ? in url)
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr
    }

    //search according to the name, where all names which are superstring to the query and are case insensitive can be searched.
    //case insensitive means if we search a name in small letters, then too it will return product names related to uppercases.
    search(){
        // http://localhost:4000?keyword:samosa here, samosa is the value of the queryStr
        // which is accessed as req.query.keyword or here as this.queryStr.keyword

        //if keyword exists then we will find the name of the product where query is a substring of the name
        //for ex - if query is samosa then it will also find products with name as rfsamosatir 
        const keyword = this.queryStr.keyword ? {
            name:{
                // regex is used to find any name where query is a substring of it. 
                $regex: this.queryStr.keyword,
                // means case insensitive
                $options: "i"
            },
        }:{};

        //if there is no queryStr(i.e no query in the url), then all products will be returned.

        // changing this query so that now this query will
        // get all names which are superstring of the given original query.
        this.query = this.query.find({...keyword})

        return this;
    }

    //filter according to the category of the product, price and ratings
    //This will be case sensitive.
    filter(){
        // we need a copy of queryStr, so that if we change this copy the original should not change
        // But, we know in javascript all objects are passed through reference
        // Therefore, if we write const queryCopy = this.queryStr, then this queryCopt is actually a reference to the original queryStr
        // Which means any changes in the queryCopy will also change the original queryStr object
        // To avoid this we use spread operator.
        const queryCopy = {...this.queryStr}

        //Remove some fields from queryStr, except category, price and rating which we need to filter the products.
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach((key)=>{
            delete queryCopy[key];
        })

        // Filter for price and ratings.

        // So for filtering price, the user will provide a range of prices between which products should be shown and filtered
        // Therefore, querywill be given in the url as follows
        // http://localhost:4000?price[gt]:1000?price[lt]:1500  (gt: greater than, lt: less than, gte: greater-equal, lte: less-then-equal)
        // This means we want to filter products which have prices between 1000 and 1500

        // But for mongoDB query we need to provide this way
        // Product.find({price: {$gt: 1000, $lt: 1500}})
        // we can see we need an extra $ to be added.
        // Therefore, we convert the queryStr into string and add $ before each.
        let queryStr = JSON.stringify(queryCopy)

        //This is a regular expression format where /\b(string to be replaces are written here | separated), key => how these strings should be replaced.
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)

        //parse is used to convert queryStr string to object again.
        //now queryCopy will contain only category,range and price field.
        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }

    //used for pagination (how many products would be listed in a page while search or filter)
    pagination(resultPerPage){
        // to get the page value specified in the url as a query
        // If no page is specified in the query url, the default value will be one(all in one page)
        const currentPage = Number(this.queryStr.page) || 1;

        //Number of products that need to be skipped to start showing the current page
        // for ex - if products = 50 and page = 5, the if page: 3 the skip should be 20, which means we need to show products starting from 21 to 30 in current page.
        const skip = resultPerPage * (currentPage - 1)

        // limit will only show this starting limit no. of products of all products 
        // skip will decide the starting product from where limit no. of products will be showed.
        this.query = this.query.limit(resultPerPage).skip(skip)

        return this;
    }
}

module.exports = ApiFeatures