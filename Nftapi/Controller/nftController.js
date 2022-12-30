const fs=require("fs");

const nfts = JSON.parse(
    fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
);
exports.getNfts = (req, res)=>{
    res.status(200).json({
        status:"success",
        requestTime:req.requestTime,
        results: nfts.length,
        data:{
           nfts :nfts
        }
    });
};

exports.checkID = (req, res , next)=>{
    if(req.params.id >= nfts.length)
    {
        res.status(404).json({
            status: "error",
            message: "Invalid"
        });
    }
    next();
};

exports.checkBody = (req, res, next)=>{
    if(!req.body.name || !req.body.price){
        res.status(400).json({
            status:"failed",
            message:"Incomplete Data"
        })
    }
    next();
}

exports.getNft = (req, res)=>{
    console.log(req.params.id);

    if(req.params.id >= nfts.length)
    {
        res.status(404).json({
            status:"error",
            message : "Invalid"
        });
    }
    const nft = nfts.find(el =>(el.id == req.params.id))
        res.status(200).json({
          status:"success",
          data : {
            nft : nft
          }
    });
};

exports.createNft = (req, res)=>{
    const newID = nfts[nfts.length - 1].id +1;
    const newNFTs = Object.assign({id: newID}, req.body); // this will combine the body send by used with the id and combine it into a object 
    nfts.push(newNFTs);
    console.log(nfts);
    fs.writeFile(`${__dirname}/nft-data/data/nft-simple.json` , JSON.stringify(nfts),  err=>{
        res.status(201).json({
            status: "success",
             nft : newNFTs
        })
    } );
    // console.log(newID);
};
exports.updateNft= (req, res)=>{

  

    res.status(200).json({
        status: "success",
        message: "Updating NFt",
    });
};

exports.deleteNft= (req,res)=>{

    if(req.params.id >= nfts.length)
    {
        res.status(404).json({
            status: "error",
            message: "Invalid"
        });
       
    }
    //if no content is there in the body then its due to the 204 , as its define displaying no data 
    res.status(204).json({
        status: "success",
        data:null
    });
};
