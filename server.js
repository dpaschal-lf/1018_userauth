

const express = require('express');
const mysql = require('mysql');
const creds = require('./mysql_cred.js');
const sha1 = require('sha1');
const db = mysql.createConnection( creds );

const server = express();
server.use(express.urlencoded({ extended: false }))
server.use( express.json() );

server.use ( express.static( __dirname + '/documentroot'));

server.post('/login', (request, response)=>{
	db.connect(()=>{
		const username = request.body.user;
		const password = sha1(request.body.pass);
		delete request.body.pass;
		console.log(username, password);
	})
})

server.listen( 4000, ()=>{
	console.log('carrier has arrived');
});