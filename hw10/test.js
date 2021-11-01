var URL="https://ceclnx01.cec.miamioh.edu/~johnsok9/cse383/ajax/index.php";
var dfCounter=0;
var errorCounter=0;
getDisk();


function getDisk() {

	a=$.ajax({
		url: URL + '/api/v1/df',
		method: "GET"
	}).done(function(data) {
		dfCounter++;
		//clear out old data
		$("#dfRun").html(dfCounter);
		$("#disk").html("");
		$("#disk").append("<tr><th>Mount Point</th><th>Size</th><th>Used</th></tr>");
		len = data.df.length;
		for (i=0;i<len;i++) {
			$("#disk").append("<tr><td>" + data.df[i].Mount+"</td><td>" + data.df[i].Size + "</td><td>" + data.df[i].Used + "</td></tr>");
		}
		// setTimeout(getDisk,1000);
	}).fail(function(error) {
		errorCounter++;
		$("#logRun").html(errorCounter);
		console.log("error",error.statusText);
		$("#log").prepend("df error "+new Date()+"<br>");
		
		// setTimeout(getDisk,1000);
	});
}

