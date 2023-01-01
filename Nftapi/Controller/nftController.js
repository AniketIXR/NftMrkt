
const NFT = require('../models/nftModels');
exports.getNfts =async(req, res)=>{
   
    try {
        // console.log(req.query);
        // const nfts = await NFT.find();//find will give all the documents
        // const nfts = await NFT.find(req.query);
//Query Building
        const queryObj = {...req.query};
        const excludeFields =["page","sort","limit","fields"];
        excludeFields.forEach(field=> delete queryObj[field]);
//Filtering query
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) =>`$${match}`);
//Using the query to filter nft         
        const query = NFT.find(JSON.parse(queryString));
//Sorting the data
        if(req.query.sort)
        {
            const sortcon= req.query.sort.split(',').join(' ');
            query.sort(sortcon);
        }
        else
        {
            query.sort("-creationTime");
        }
//Filtering the Fields
       if(req.query.fields)
       {
        
        const fields = req.query.fields.split(',').join(' ');
        console.log(fields);
        query.select(fields);
       }     
//Pagination      
       const page = req.query.page *1 || 1;
       const limit = req.query.limit *1 || 5;
       const skip = (page-1)*limit;
       query.skip(skip).limit(limit);
       
//ERROR
    //     if(req.query.page)
    //    {
    //       const nftcount = await NFT.countDocuments();
    //       if(skip >= nftcount) throw new Error("This Page is not available")
    //    }

        const nfts = await query ;
//Sending the response
        res.status(200).json({
            status: 'success',
            result:nfts.length,
            data:{
                nfts
            },
        });
    } catch (error) {
        res.status(404).json({
            status:'fail',
            message:error
        });
    }
};

exports.getNft =async(req, res)=>{
    try {
        const nft =await NFT.findById(req.params.id); 
        res.status(200).json({
            status:'success',
            data : {
                nft
            }
        });
        
    } catch (error) {
        res.status(404).json({
            status:'fail',
            message:error
        });
    }

};

exports.createNft = async (req, res)=>{
    try {
        const newNFT = await NFT.create(req.body);
        res.status(201).json({
            status:"success",
            data: {
                nft : newNFT
            }
        });   
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message: error
        });
    }
};

exports.updateNft= async (req, res) => {
  try {
    const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators : true,
    });
    res.status(200).json({
        status: "success",
        data : {
            nft
        } 
    });
  } catch (error) {
    res.status(404).json({
        status:"fail",
        message: error
    });
    
  }
};

exports.deleteNft= async (req,res)=>{
    try {
    await NFT.findByIdAndDelete(req.params.id);
    //if no content is there in the body then its due to the 204 , as its define displaying no data 
    res.status(204).json({
        status: "success",
        data:null
    });
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message: error
        });
    }
};
