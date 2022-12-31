
const NFT = require('../models/nftModels');
exports.getNfts =async(req, res)=>{
   
    try {
        console.log(req.query);
        const nfts = await NFT.find();//find will give all the documents
        res.status(200).json({
            status: 'success',
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
