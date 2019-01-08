

const express = require('express');
const mysql = require('mysql');
const creds = require('./mysql_cred.js');
const sha1 = require('sha1');
const db = mysql.createConnection( creds );

const loggedInUsers = {

};

const server = express();
server.use(express.urlencoded({ extended: false }))
server.use( express.json() );

server.use ( express.static( __dirname + '/documentroot'));

server.post('/login', (request, response)=>{
	db.connect(()=>{
		const username = request.body.user;
		const password = sha1(request.body.pass);
		delete request.body.pass;
		const query = "SELECT * FROM `users` WHERE `email`='"+username+"' AND `password`='"+password+"'";
		db.query(query, (error, data) => {
			if(error){
				response.send('error in query');
				return;
			}
			if(fields.length!==1){
				response.send('error with username or password');
				return;
			}
			const userID = data[0].ID;
			const userName = data[0].name;

			const userToken = sha1(username+password+Date.now())
			loggedInUsers[ userToken ] = { id: userID, name: userName };
			response.cookie('userauth',userToken);
			response.send('you have logged in');
		})
	})
})

server.listen( 4000, ()=>{
	console.log('carrier has arrived');
});