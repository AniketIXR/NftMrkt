const express =require("express");
const fs=require("fs");

const app = express();
app.use(express.json());

const nfts = JSON.parse(
    fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
);

// console.log(nfts);

app.get('/api/v1/nfts' , (req, res)=>{
    res.status(200).json({
        status:"success",
        results: nfts.length,
        data:{
           nfts :nfts
        }
    });
});

app.get('/api/v1/nfts/:id' , (req, res)=>{
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
});

app.post('/api/v1/nfts' , (req, res)=>{
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
});

app.patch('/api/v1/nfts/:id' , (req, res)=>{

    if(req.params.id >= nfts.length)
    {
        res.status(404).json({
            status: "error",
            message: "Invalid"
        });
    }

    res.status(200).json({
        status: "success",
        message: "Updating NFt",
    });
});

//Delete Method
app.delete('/api/v1/nfts/:id', (req,res)=>{

    if(req.params.id >= nfts.length)
    {
        res.status(404).json({
            status: "error",
            message: "Invalid"
        });
       
    }
    res.status(204).json({
        status: "success",
        data:null
    });
});

const port = 3000;
app.listen(port, ()=>{
    console.log(`App runnign on port ${port}..`);
});