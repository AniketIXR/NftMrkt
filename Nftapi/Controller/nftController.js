
const NFT = require('../models/nftModels');
const ApiFeatures = require('../Utils/apiFeatures');
const {catchAsync} = require('../Utils/catchAsync');

exports.getNfts =catchAsync(async(req, res,next)=>{
  
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
    
});

exports.getNft =catchAsync(async(req, res,next)=>{
        const nft =await NFT.findById(req.params.id); 
        res.status(200).json({
            status:'success',
            data : {
                nft
            }
        });
});

exports.createNft =catchAsync( async (req, res,next)=>{

        const newNFT = await NFT.create(req.body);
        res.status(201).json({
            status:"success",
            data: {
                nft : newNFT
            }
        });   
    
});

exports.updateNft= catchAsync(async (req, res,next) => {
 
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

});

exports.deleteNft=catchAsync(async (req,res,next)=>{
  
    await NFT.findByIdAndDelete(req.params.id);
    //if no content is there in the body then its due to the 204 , as its define displaying no data 
    res.status(204).json({
        status: "success",
        data:null
    });
    
});


exports.getNFTStats =catchAsync( async (req,res,next)=>{
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
});
