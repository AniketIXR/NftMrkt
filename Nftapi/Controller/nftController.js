
const NFT = require('../models/nftModels');
const ApiFeatures = require('../Utils/apiFeatures');
exports.getNfts =async(req, res)=>{
  
    try {

         const features = new ApiFeatures(NFT.find(),req.query)
         .filter()
         .sort()
         .limitFields()
         .pagination();
        const nfts = await features.query ;
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


exports.getNFTStats = async (req,res)=>{

    try{
       const stats = await NFT.aggregate([
        {
            $match:{ ratingsAverage: { $gte:4.5}},
        },
        {
           $group: {
            _id: null,
            Nftno :{$sum : 1},
            numRating :{$sum : "$ratingsQuantity"},
            avgRating: {$avg: "$ratingsAverage"},
            avgPrice: {$avg: "$price"},
            minPrice: {$min:"$price"},
            maxPrice: {$max: "$price"},
           }
        },
        {
            $sort: {avgRating : 1}
        }
    ]
    );
    console.log(stats);
    res.status(200).json({
        status: "success",
        data:stats
    });
    }
    
    catch(error){
        res.status(404).json({
            status:"fail",
            message: error
        });
    }
}
