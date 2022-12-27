// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NftMrkt is ERC721URIStorage {
    using Couters for Counters.Counter; 

    Counters.Counter private _tokenIDs;
    Counters.Counter private _itemsSold;
    uint listingPrice = 0.0025 ether;
           
    struct itemMrkt {
       
        uint tokenID;
        address payable seller;
        address payable owner;
        uint price;
        bool sldstat;
    }
   
 //This contains the mapping of each ids to its market item  
    mapping(uint => itemMrkt) private idofItem;

    event idItemCreated(
        uint indexed tokenid,
        address owner,
        address seller,
        address price,
        bool sldstat

    );
    
    address payable owner;

    modifier OwnerAuth()
    {
        require(msg.sender == owner , 
        "only owner can decide the listing Price");
        _;
    }

    constructor() ERC721("NFTft" , "symbolnft"){

        owner == payable(msg.sender);
    }

    // Function for the owner of the marketplace to change the listing price
    function updateListingPrice(uint _listingPrice) public
     payable OwnerAuth{

        listingPrice = _listingPrice;
    }

    //Function to fetch the listing price

    function fetchListingPrice() public veiw returns(uint){
          return listingPrice;
    }

    //NFT creation funtion
    
    //This function will return the ID of the created token
    function createNftToken(string memory tokenURI,uint price) public payable returns(uint){
        
        _tokenIDs.increment();
        uint newtokenID = _tokenIds.current();
        _mint(msg.sender, newtokenID);
        _setTokenURI(newtokenID , tokenURI);
        createMrktItem(newtokenID, price);
        return newTokenID;
    } 

    function createMrktItem(uint tokenID,uint _price)
    {
        require(_price > 0 , "Price must be greater than 0");
        require(msg.value == listingPrice, "Price must be equal to the listing price");
    
        idofItem[tokenID] = itemMrkt(
            tokenID,
            payable(address(this)),
            payable(msg.sender),
            _price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);

        emit idItemCreated(tokenID, msg.sender , address(this) , _price, false);

    }

    //Function for resale
    function resell(uint tokenID, uint _price) public payable {

       require(idofItem[tokenID].owner == msg.sender,"Only owner can resell");
       require(msg.value == listingPrice,"Amount must be equal to the listing Price");

       idofItem[tokenID].sldstat=false;
       idofItem[tokenID].price=_price;
       idofItem[tokenID].seller = payable(msg.sender);
       idofItem[tokenID].owner = payable(address(this));

       _itemsSold.decrement();

       _transfer(msg.sender , address(this),tokenID);

    }

    //Function to buy NFT
    function BuyNft(uint tokenID) public payable{

        uint _price = idofItem[tokenID].price;
        require(msg.sender == _price ,"Put the require amount");

        idofItem[tokenID].owner = payable(msg.sender);
        idofItem[tokenID].seller = payable(address(0));//error .............................
        idofItem[tokenID].sldstat=true;

        _itemsSold.increment();

        _transfer(address(this) , msg.sender , tokenID);

        payable(owner).transfer(listingPrice);
        payable(idofItem[tokenID].seller).transfer(msg.val);

    }

    function dispMrketItem() public view returns(marketItem[] memory){
           uint itemCount = _tokenIDs.current();
           uint mrktItemCount = _tokenIDS.current() - _itemsSold.current();

           uint currindx =0;

           marketItem[] memory _items = new marketItem[](mrktItemCount);
           for(uint i=0;i<itemCount ; i++)
           {
            if(idofItem[i+1].owner == address(this)){
                uint currid =i+1;
                
                _items[currid] = idofItem[currid];
                // _items storage curritem = idofItem[currid];
                // items[currid]= curritem;
                currid += 1;

            }

           }
           return _items;
    }

    



//My items

    funtion myNFT() public view returns(itemMrkt[] memory){
        uint tcount = _tokenIds.current();
        
        uint itemCount =0;
        uint currindx = 0;

        for(uint i=0; i< tcount;i++)
        {
            if(idofItem[i+1].owner == msg.sender)
            {
                itemCount+=1;
            }
        }
        
        itemMrkt[] memory _items = new itemMrkt[](itemCount);

        for(uint i=0;i<itemCount;i++)
        {
            if(idofItem[i+1].owner== msg.sender)
            {
                uint currid = i+1;

                _items[currid] = idofItem[currid];
                // _items storage curritem = idofItem[currid];
                // items[currid]= curritem;
                currid += 1;
            
            }
          
        }
        return _items;
    }

    // Nft info

    function NFTinfo() public view return(idofItem[] memory){

        uint totalCount = _tokenIDs.current();
        uint itemCount=0;
        uint currindx =0;

        for(uint i=0; i< totalCount; i++){
            if(idofItem[i+1].seller == msg.sender)
            {
                itemCount + =1;
            }
        }
        itemMrkt[] memory _items = new itemMrkt[](itemCount);

        for(uint i=0; i<totalCount; i++)
        {
            if(idofItem[i+1].seller == msg.seller){
                uint currid = i+1;
                _items[currid] = idofItem[currid];
                // _items storage curritem = idofItem[currid];
                // items[currid]= curritem;
                currid += 1;

            }
        }
        return _items;
    }


}