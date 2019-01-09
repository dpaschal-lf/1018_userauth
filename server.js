

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

server.get('/gettime', (request, response)=>{
	checkForLogin( request, (isLoggedIn)=>{
		if(isLoggedIn){
			response.send( `user id ${isLoggedIn.userID} ${Date.now()}`);
		} else {
			response.send( 'you must be logged in to use this endpoint');
		}
	})
})

function getIPAddress( request ){
	return (request.headers['x-forwarded-for'] || '').split(',').pop() || 
				         request.connection.remoteAddress || 
				         request.socket.remoteAddress || 
				         request.connection.socket.remoteAddress
}

function checkForLogin( request, callback ){
	if(!request.cookies.userauth){
		callback( false );
	} else {
		const ip = getIPAddress(request);
		const updateQuery = `UPDATE \`currentConnections\`
						SET \`connectionCount\` = \`connectionCount\`+1,
						\`ipAddress\` = '${ip}',
						\`lastConnection\` = NOW()
					   WHERE \`token\` = '${request.cookies.userauth}'`;
		db.query( updateQuery, (error, result)=>{
			if(result.affectedRows === 1){
				const selectQuery = `SELECT * FROM \`currentConnections\`
			WHERE \`token\` = '${request.cookies.userauth}'`;
				db.query(selectQuery, (error, data)=>{
					if(!error && data.length === 1){
						callback( data[0]);
					} else {
						callback( false);
					}
				})				
			}
		})
	}
}

server.get('/logout', (request, response)=>{
	checkForLogin( request, (isLoggedIn)=>{
		if(isLoggedIn){
			response.cookie('userauth','', { expires: new Date(Date.now() -3600) });
			const query = "DELETE FROM `currentConnections` WHERE token='"+request.cookies.userauth+"'";
			db.query(query, (error)=>{
				if(!error){
					response.send('you are now logged out');
				} else {
					response.send('error logging you out');
				}
			})
			
		} else {
			response.send( 'you are already not logged in');
		}
	})	
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

			const ip = getIPAddress(request);

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