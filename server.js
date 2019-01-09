

const express = require('express');
const mysql = require('mysql');
const creds = require('./mysql_cred.js');
const sha1 = require('sha1');
const cookieParser = require('cookie-parser');
const db = mysql.createConnection( creds );

const loggedInUsers = {

};

const server = express();
server.use(express.urlencoded({ extended: false }))
server.use( express.json() );
server.use(cookieParser());

server.use ( express.static( __dirname + '/documentroot'));

server.get('/something', (request, response)=>{
	if(loggedInUsers.hasOwnProperty( request.cookies.userauth)){
		const user = loggedInUsers[request.cookies.userauth];
		response.send(`you are user id ${user.id} and name ${user.name}`);
	} else {
		response.send('you must be logged in to do this');
	}
})

server.post('/login', (request, response)=>{
	db.connect(()=>{
		const username = request.body.user;
		const password = sha1(request.body.pass);
		delete request.body.pass;
		const query = "SELECT * FROM `users` WHERE `email`='"+username+"' AND `password`='"+password+"'";
		db.query(query, (error, data) => {
			if(error){
				response.send({success: false, error: 'error in query'});
				return;
			}
			if(data.length!==1){
				response.send({success: false, error: 'error with username or password'});
				return;
			}
			const userID = data[0].ID;
			const userName = data[0].name;

			const userToken = request.cookies.userauth || sha1(username+password+Date.now());

			const ip = (request.headers['x-forwarded-for'] || '').split(',').pop() || 
				         request.connection.remoteAddress || 
				         request.socket.remoteAddress || 
				         request.connection.socket.remoteAddress

			const connectionQuery = `INSERT INTO \`currentConnections\` 
						SET \`token\` = '${userToken}',
						\`userID\` = ${userID},
						\`connected\` = NOW(),
						\`connectionCount\` = \`connectionCount\`+1,
						\`ipAddress\` = '${ip}',
						\`lastConnection\` = NOW()
						ON DUPLICATE KEY UPDATE 
						\`connectionCount\` = \`connectionCount\`+1,
						\`ipAddress\` = '${ip}',
						\`lastConnection\` = NOW()
					`;
			db.query(connectionQuery, (error)=> {
				if(!error){
					response.cookie('userauth',userToken);
					response.send({success: true, message: 'you have logged in'});					
				} else {
					response.send({success: false, error: 'could not log you in'});
				}
			})

			//loggedInUsers[ userToken ] = { id: userID, name: userName };

		})
	})
})

server.listen( 4000, ()=>{
	console.log('carrier has arrived');
});