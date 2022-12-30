const express = require('express');
const {checkID} = require('../Controller/nftController');
const {checkBody}= require('../Controller/nftController');
const {
    getNfts,
    getNft,
    createNft,
    updateNft,
    deleteNft
} = require('../Controller/nftController');

const router = express.Router();

router.param("id", checkID);


const app = express();

app.use(express.json());

router.route('/')
     .get(getNfts)
     .post(checkBody,createNft);
router.route('/:id')
      .get(getNft)
      .patch(updateNft)
      .delete(deleteNft);

module.exports = router;      
