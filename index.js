var express = require('express')
var app = express();
var http = require('http').createServer(app);
// var io = require('socket.io')(http);
var chatServer = require('./lib/server');
chatServer.listen(http);
app.use(express.static('public'));
app.get('/',function(req,res){
    res.sendFile(__dirname + '/public/index.html');
    // res.send('/index.html');

});




http.listen(3000,function(){
    console.log('listen on 3000');
});