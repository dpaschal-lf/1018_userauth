

const express = require('express');
const mysql = require('mysql');
const creds = require('./mysql_cred.js');

const db = mysql.createConnection( creds );

const server = express();

server.use ( express.static( __dirname + '/documentroot'));

server.post('/login', (request, response)=>{
	response.send('yes');
})

server.listen( 4000, ()=>{
	console.log('carrier has arrived');
});