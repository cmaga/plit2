
const express = require('express');
const app = express();
//const port = process.env.PORT || 5000;
/*
// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});


//var app = require('./express'); // creates an instance of the express lib
//var express = app.express;
*/
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// configure a public directory to host static content
//app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({secret: "this is secret"}));
app.use(passport.initialize());
app.use(passport.session());
////
console.log("SERVER SIDE!");

var mongoose = require('mongoose');
// var connectionString = 'mongodb://localhost/dev';
// release is either 'prod' or 'dev', based on the argument passed to npm during project init
var release = process.argv[2];
var connectionString = "mongodb://localhost/rubix-local-prod";
console.log(connectionString);
console.log(process.argv);
if (process.env.MLAB_USERNAME_WEBDEV) {
    console.log("on heroku!");
    connectionString = process.env.MLAB_USERNAME_WEBDEV + ":" +
        process.env.MLAB_PASSWORD_WEBDEV + "@ds135444.mlab.com:35444/heroku_829kjs4t"
}

if (process.env.MLAB_USERNAME) { // check if running remotely
    connectionString = process.env.MLAB_USERNAME_WEBDEV + ":" +
        process.env.MLAB_PASSWORD_WEBDEV + "@ds135444.mlab.com:35444/heroku_829kjs4t"
}
console.log("connecting with: " + connectionString);

mongoose.connect(connectionString);
mongoose.Promise = require('q').Promise;
require("./server/user/services/user.service.server");
require("./server/bids/services/file.service.server");
require("./server/bids/services/bid.service.server");

require("./server/bids/services/bid.service.server");
require("./server/document_editor/document_editor.service.server");

require("./server/bids/services/file.service.server");
require("./server/vendors/services/vendor.service.server");
require("./server/bid-num/services/bid-num.service.server");
require("./server/update/services/update.service.server");
require("./server/item-services/item-service-server");
require("./server/po-services/po-service-server");
require("./server/req-services/req-service-server");
require("./server/dashboard/dashboard-service-server");
require("./server/trello/trello.service.server");
require("./server/contracts/contract-service-server");
require("./server/contracts/contract-request-service-server");
require("./server/last-updated/last_updated-sevice-server.js");

require("./server/tags/tag-service-server");

require("./server/cron-list");
//require("./server/mail/mail.server");

////
var release = process.argv[2];
var port = release == 'prod' ? 5000 : 8005;
console.log(port);
app.listen(port);