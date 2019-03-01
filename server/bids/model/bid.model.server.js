var mongoose = require('mongoose');
var bidSchema = require('./bid.schema.server');
var bidModel = mongoose.model('BidModel', bidSchema);

bidModel.createBid = createBid;
bidModel.getBids = getBids;
bidModel.updateBid = updateBid;
bidModel.removeBid = removeBid;


bidModel.getSpecificBid = getSpecificBid;
bidModel.removeVendor = removeVendor;
bidModel.addVendor = addVendor;
module.exports = bidModel;

//TODO
function removeVendor(VendorToRemove, bidId) {
    //mongo has no way of cleanly dealing with array indexs at least according to a forum from 2016 so go back and pass the entire vendor information.
    console.log("hi from data access layer");
    console.log(VendorToRemove);
    return(
    bidModel.findOneAndUpdate(
        { "_id": bidId },
        { "$pull": { "Vendor": {"vName": VendorToRemove.vName, } } },
        {multi: true}
        )
    );
}

function addVendor(Vendors, bidId) { //pass a bid in here that already has the updated object in the array but its temporary. This function reads it and as an access layer to the db it puts it in.
    //find specfic bid first
    //add a vendor to the bi
    console.log('We made it to the server data access layer');
   return (
       bidModel.findOneAndUpdate(
        {"_id": bidId}, // at current bid
        { $push: { "Vendor": {"vName": Vendors.vName, "receivedBy": Vendors.receivedBy , "rDate": Vendors.rDate, "rTime": Vendors.rTime} } } //In the temporary version of the vendor array there should only be 1 therefore we have a constant index of 0
    )
   );
}

function createBid(bid) {
    bid.Timeframe = Date.parse(bid.Timeframe);
    console.log("server" + JSON.stringify(bid));

    return bidModel.create(bid);
}

function getBids() {
    return bidModel.find();
}

function getSpecificBid(bidId) {
    return bidModel.find({"_id": bidId});
}

function updateBid(bid, bidId) {
    console.log(bidId);
    console.log("UPDATING " + JSON.stringify(bid))
    return bidModel.updateOne({"_id": bidId}, {$set: bid});
}
function removeBid(bidId) {
    return bidModel.remove({"_id": bidId});
}
