

$(document).ready( startApp );

function startApp(){
	addEventListeners();
}

function addEventListeners(){
	$("button").click( handleLogin );
}

function handleLogin(){
	const username = $("input[name=username]").val();
	const password = $("input[name=password]").val();

	$.ajax({
		url: '/login',
		method: 'post',
		dataType: 'json',
		data: {
			user: username,
			pass: password
		}
	}).then( function( response ){

	})
}