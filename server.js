

const express = require('express');

const server = express();

server.use ( express.static( __dirname + '/documentroot'));

server.listen( 4000, ()=>{
	console.log('carrier has arrived');
});