var express = require('express');
var path = require('path');

var app = express();

// Set static path
app.use(express.static(path.join(__dirname, '/public')));

app.listen(3000, function() {
  console.log('Server started on Port 3000 .... ');
})