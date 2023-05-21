const express = require('express');
const {checkID} = require('../Controller/nftController');
const {checkBody}= require('../Controller/nftController');
const {protect,rstrictTo} = require('../Controller/authController');
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
     .get(protect,getNfts)
     .post(createNft);
router.route('/:id')
      .get(getNft)
      .patch(updateNft)
      .delete(protect,rstrictTo("admin","guide"),deleteNft);

module.exports = router;      
