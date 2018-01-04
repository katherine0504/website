const config = require('./public/js/config');
const mongoose = require('mongoose');
const url = `mongodb://${config.mongo.user}:${config.mongo.password}@${config.mongo.host}/${config.mongo.dbname}`
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
const app = express();
const SHA256 = require("crypto-js/sha256");

//multichain
let multichain = require("multichain-node")({
  port: 6482,
  host: '140.116.177.150',
  user: 'multichainrpc',
  pass: config.multichain.pass,
});

multichain.getInfo((err, info) => {
  if(err){
      throw err;
  }
  console.log(info);
})

multichain.liststreams;

// MongoDB connection
const conn = mongoose.connect(url, { useMongoClient: true }, (err, res) => {
	if (err) console.log('MongoDB connection failed: ', err);
	else console.log('MongoDB successfully connected');
});
mongoose.Promise = global.Promise;

// Create Schema for MongoDB
const collectionName = 'Blockchain';
const stockCollection = 'StockName';

const schema = new mongoose.Schema({
  stocknum: String,
  userID: String,
  orderID: String,
  account: String,
  price: Number,
  quantity: Number,
  ID: String,
  birthday: Date,
  phone: String,
  cellphone: String,
  status: String
}, { collection: collectionName });

const stockSchema = new mongoose.Schema({
  stockNum: String,
  endtime: Date,
  checked: Number
}, {collection: stockCollection} );

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, '/public')));

app.post('/order', function(req, res) {
  console.log('FORM SUBMITTED');

  const orderModel = conn.model(collectionName, schema);

  orderModel.count({}, function(err, c) {
    console.log(c);
    var currentdate = new Date(); 
    var orderId = currentdate.getFullYear().toString() + (currentdate.getMonth()+1).toString() + currentdate.getDate().toString() + (c+1).toString();
    
    const data = new orderModel({
      stocknum: req.body.stocknum,
      userID: "test",
      orderID: orderId,
      account: req.body.account,
      price: req.body.bidprice,
      quantity: req.body.bidquantity,
      ID: req.body.idnum,
      birthday: req.body.bday,
      phone: req.body.phone,
      cellphone: req.body.cellphone,
      status: "inAuction"
    });
  
    console.log(data);

    data.save((err) => {
      if (err) console.log('Data insert failed');
      else {
        console.log('Data insert success');
        res.send(orderId);
      }
    });
  })
})

app.post("/order_query", function(req, res) {
  console.log('QUEST RECEIVED');
  
  const orderQuestModel = conn.model(collectionName, schema);
  
  var orderList = [];
  orderQuestModel.find({userID: req.body.userID}).exec((err, sresult) => {
    console.log("req userid: " + req.body.userID)
    if (err) console.log('Query failed');
    else {
      console.log(sresult);
      orderList = sresult.orderList;
      res.send(sresult);
    }
  });
})

app.post("/stockquery", function(req, res) {
  console.log('STOCK NUM QUEST RECEIVED');

  const stockNumModel = conn.model(stockCollection, stockSchema);

  stockNumModel.find({stockNum: req.body.stockNum}).exec((err, sresult) => {
    if (err) {
      console.log('Query failed');
      res.send(err);
    } else {
      console.log(sresult);
      res.send(sresult[0]);
    }
  });
})

app.post("/delete_order", function(req, res) {
  console.log('Delete request received');

  const orderDeleteModel = conn.model(collectionName, schema);
  const stockNumModel = conn.model(stockCollection, stockSchema);
  
  orderDeleteModel.findOne({orderID: req.body.orderid}).exec((err, sresult) => {
    console.log('First sresult: '+ sresult);
    if (err) {
      console.log('OrderID Query failed');
      res.send(err);
    } else {
      stockNumModel.findOne({stockNum: sresult.stocknum}).exec((err, sresult) => {
        console.log('Second sresult: '+ sresult);
        if (err) {
          console.log('Query failed');
          res.send(err);
        } else {
          if (Date.now() < Date.parse(sresult.endtime)) {
            orderDeleteModel.remove({orderID: req.body.orderid}, function(err) {
              if (err) {
                console.log('Delete not successful');
                res.send(err);
              } else {
                console.log("Successly deleted order");
                res.send('OK');
              }
            });
          } else {
            res.send('Timeout');
          }
        }
      });
    }
  });
    
})

app.listen(3000, function() {
  console.log('Server started on Port 3000 .... ');
})

function checkEndingTime() {
  var curDate = new Date();

  if(curDate.getHours() == 23 && curDate.getMinutes() >= 50) {
    const stockModel = conn.model(stockCollection, stockSchema);
    stockModel.find().exec((err, sresult) => {
      if (err) console.log('Query failed');
      else {
        for (result of sresult) {
          var d1 = new Date(result.endtime);

          if (curDate.getFullYear() == d1.getFullYear() && curDate.getDate() == d1.getDate() && curDate.getMonth() == d1.getMonth() && result.checked == 0) {
            var randNum = Math.floor(Math.random() *(240000) + (-120000));
            result.endtime = new Date(result.endtime.getTime() + (randNum));
            result.checked = 1;
            result.save();
          }
        }
      }
    });
  } else if (curDate.getHours() == 00 && curDate.getMinutes() >= 5 && curDate.getMinutes() <= 10) {
    //push to blockchain
    const orderModel = conn.model(collectionName, schema);
    
    orderModel.findOne({status: "inAuction"}).exec((err, sresult) => {
      if (err) console.log('In Auction Query Failed');
      else {
        console.log(sresult);
        console.log("Ready to push " + sresult.orderID);
        console.log("JSON string: " + JSON.stringify(sresult));
        var dataToadd = SHA256(JSON.stringify(sresult)).toString();

        console.log("SHA256: " + dataToadd);

        multichain.publish({
          stream: "stream1",
          key: config.multichain.stream1Key,
          data: dataToadd 
        },
          (err) => {
            if (err) {
              console.log("Publish failure");
              console.log(err);
            } else {
              console.log("Publish success");
              sresult.status = "End auction";
              sresult.save();
            }
          }
        );

        // for (result of sresult) {
        //   console.log("Ready to push " + result.orderID);
        //   var dataToadd = new Buffer(result).toString("hex");
        //   console.log("Hex form: " + dataToadd);
        // }
      }
    })
  }
}