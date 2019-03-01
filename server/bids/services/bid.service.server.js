var app = require('../../../express');
var bidModel = require('../model/bid.model.server');
var counterModel = require('../model/counter.model.server');
app.post('/api/add-bid', createBid);
app.get('/api/bids', getBids);
app.get('/api/bid/:bidId', getSpecificBid);
app.put('/api/update-bid/:bidId', updateBid);
app.delete('/api/remove-bid/:bidId', removeBid);
app.put('/api/save-fields/:bidId', saveFields);
app.put('/api/update-bid-meta/:bidId', updateBidMeta);
app.put('/api/remove-bid-meta/:bidId', removeBidMeta); //this is removing through an update mongo call which is why its a put instead of a delete.


function createBid(req, res) {
    var bid = req.body;
    var b_id = bid.Bid_Type;
    var fund = bid.Fund_Code.slice(-1);
    var bidNum = "";
    var d = new Date;
    console.log('creating bid')
    counterModel.getCount()
        .then(function (response) {
            console.log(response)
            bidNum = response.Count;
            counterModel.incrCount().then(function(error){
                console.log(error);
            b_id = b_id + " " + bidNum;
            if (fund != "N") {
                b_id = b_id + fund;
            }
            bid.Bid_ID = b_id +"-" + (d.getYear() - 100);

            bidModel
                .createBid(bid)
                .then(function (bid) {
                    res.send(bid);
                }, function (err) {
                    res.send(err);
                });
            });

        });
}

function saveFields(req,res){
    var bid = req.body;
    console.log(req.params.bidId);
    bidModel
        .updateBid(bid, req.params.bidId)
        .then(function (bid) {
            console.log(bid);
            res.send(bid);
        }, function (err) {
            console.log(err);
            res.send(err);
        });
}


function updateBid(req, res) {
    var bid = req.body;
    bidModel
        .updateBid(bid, req.params.bidId) //TODO what update bid is this referancing ?
        .then(function (bid) {
            console.log(bid)
            res.send(bid);
        }, function (err) {
            console.log("error");
            res.send(err);
        });
}

function getBids(req, res) {
    bidModel
        .getBids()
        .then(function (bids) {
            res.send(bids);
        }, function (err) {
            res.send(err);
        });
}

function getSpecificBid(req, res) {
    bidModel
        .getSpecificBid(req.params.bidId)
        .then(function (bid) {
            res.send(bid);
        }, function (err) {
            res.send(err);
        });
}

function removeBid(req, res) {
    bidModel
        .removeBid(req.params.bidId)
        .then(function (bid) {
            res.send(bid);
        }, function (err) {
            res.send(err);
        });
}

function updateBidMeta(req, res) { //TODO move this function all the way to the end once its functional
    console.log('we made it to the server side service');
    var Vendor = req.body;
    bidModel //reference to bid model file so below we are probably using update bid meta from whatever the model declares it as
        .addVendor(Vendor, req.params.bidId) //as defined in bid.model
        .then(function (Vendor) {
            console.log(Vendor);
            res.send(Vendor);
        }, function (err) {
            console.log("error");
            res.send(err);
        });
}
function removeBidMeta(req, res) {
    console.log("server side service");
    var VendorToRemove = req.body; //vendor to remove is a specific vendor
    console.log(VendorToRemove);
    bidModel
        .removeVendor(VendorToRemove, req.params.bidId)
        .then(function (VendorToRemove) {
            console.log(VendorToRemove);
            res.send(VendorToRemove);
        }, function (err) {
            console.log("error");
            res.send(err);
        });
}
