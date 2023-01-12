class ApiFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

filter=()=>{
      //Query Building
    const queryObj = {...this.queryString};
    const excludeFields =["page","sort","limit","fields"];
    excludeFields.forEach(field=> delete queryObj[field]);
//Filtering query
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) =>`$${match}`);
//Using the query to filter nft         
    this.query.find(JSON.parse(queryString)); 
    return this;
    }

sort=()=>{
        //Sorting the data
    if(this.queryString.sort)
    {
        const sortcon= this.queryString.sort.split(',').join(' ');
        this.query.sort(sortcon);
    }
    else
    {
        this.query.sort("-creationTime");
    }
    return this;
    }

limitFields=()=>{
     
        //Filtering the Fields
   if(this.queryString.fields)
   {
    const fields = this.queryString.fields.split(',').join(' ');
    console.log(fields);
    this.query.select(fields);
   }   
   return this;
    }
pagination = ()=>{
  //Pagination      
  const page = this.queryString.page *1 || 1;
  const limit = this.queryString.limit *1 || 5;
  const skip = (page-1)*limit;
  this.query.skip(skip).limit(limit);
  
//ERROR
//     if(this.queryString.page)
//    {
//       const nftcount = await NFT.countDocuments();
//       if(skip >= nftcount) throw new Error("This Page is not available")
//    }
return this;
}   
}

module.exports= ApiFeatures; 
