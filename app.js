const config = require('./public/js/config');
const mongoose = require('mongoose');
const url = `mongodb://${config.mongo.user}:${config.mongo.password}@${config.mongo.host}/${config.mongo.dbname}`
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
const app = express();

// MongoDB connection
const conn = mongoose.connect(url, { useMongoClient: true }, (err, res) => {
	if (err) console.log('MongoDB connection failed: ', err);
	else console.log('MongoDB successfully connected');
});
mongoose.Promise = global.Promise;

// Create Schema for MongoDB
const collectionName = 'Blockchain';
const schema = new mongoose.Schema({
  orderID: String,
  account: String,
  price: Number,
  quantity: Number,
  ID: String,
  birthday: Date,
  phone: String,
  cellphone: String
}, { collection: collectionName });

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
      orderID: orderId,
      account: req.body.account,
      price: req.body.bidprice,
      quantity: req.body.bidquantity,
      ID: req.body.idnum,
      birthday: req.body.bday,
      phone: req.body.phone,
      cellphone: req.body.cellphone
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

app.get("/ajax_data", function(req, res) {
  res.send("Ajax !")
})

app.listen(3000, function() {
  console.log('Server started on Port 3000 .... ');
})

