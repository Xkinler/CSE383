$(function(){

	$("#input-form").submit(function(e){
		e.preventDefault(); // Just don't let the GET parameters show in the URL (I think in this way our URL can be clean while we can still grab the values directly from the text fields using the code below)
	})

	/*
	 * The reason why I tried to use the click event on the button is that I didn't find a way
	 * to get which button the user clicked by evaluating the form data that has been submitted so instead the following code does the following things:
	 * When the user clicks one of those operator buttons, first we check if the values in the text fields are valid. If not valid, then HTML will let the user know and in the JavaScript side we just stop sending the request.
	 * If the values in the text fields are valid, then proceed to send the request to the API server.
	 * By saying "valid" I mean the values in the fields are numbers. The "divided by zero" error is left for the server to find out and all the code needs to do in that case is to let the user know the error by showing an alert.*/
	$("input.submit-btn").click(function(e) {

		$("#ansDiv").html("");

		$("#input-form").submit();

		//console.log($(this).text() + "clicked");
		let n1 = $("#opr1").val();
		let n2 = $("#opr2").val();

		if(isNaN(parseFloat(n1)) || isNaN(parseFloat(n2))) {
			return;
		}

		let sign = $(this).val();
		let operatorArgs = {
			'+':'Add',
			'-':'Subtract',
			'*':'Multiply',
			'/':'Divide'
		};

		if(sign != '+' && sign != '-' && sign != '*' && sign != '/') {
			alert("It looks like someone has changed the code");
			return;
		}
		// Just in case someone wants to mess up with our request by changing the button value,
		// it is impossible to do that

		let operator = operatorArgs[sign];

		$.ajax(
			"https://api.clearllc.com/api/v2/math/" + operator  + "?api_key=bed859b37ac6f1dd59387829a18db84c22ac99c09ee0f5fb99cb708364858818&n1=" + n1  + "&n2=" + n2
		)
		.done(function(data) {
			if(typeof data.result!=='undefined') {
				$("#ansDiv").html(data.result);
			} else {	
				$("#ansDiv").html(""); // Just in case...
			}
		})
		.fail(function(obj) {
			let data = obj.responseJSON;
			alert(data.error.message);
		});
	});
});
