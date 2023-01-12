const express = require('express');
const {checkID} = require('../Controller/nftController');
const {checkBody}= require('../Controller/nftController');
const {
    getNfts,
    getNft,
    createNft,
    updateNft,
    deleteNft,
    getNFTStats
} = require('../Controller/nftController');

const router = express.Router();

// router.param("id", checkID);


const app = express();

app.use(express.json());

router.route('/nfts-stats').get(getNFTStats);

router.route('/')
     .get(getNfts)
     .post(createNft);
router.route('/:id')
      .get(getNft)
      .patch(updateNft)
      .delete(deleteNft);

module.exports = router;      
