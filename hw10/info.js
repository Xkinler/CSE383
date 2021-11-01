var URL="https://ceclnx01.cec.miamioh.edu/~johnsok9/cse383/ajax/index.php";
var psCounter=0;
var loadCounter=0;
var networkCounter=0
var errorCounter=0;
var prevtx = 0;
var prevrx = 0;
getProcess();
getLoad();
getNetwork();


function getProcess() {

	a=$.ajax({
		url: URL + '/vi/api/ps',
		method: "GET"
	}).done(function(data) {

		// Set counter
		psCounter++;
		$("#processRun").html(psCounter);

		// Clear data
		$("#processes").html("");
		len = data.ps.length;
		for (i=0;i<len;i++) {
			$("#processes").append("<tr><td>" + data.ps[i].user+"</td><td>" + data.ps[i].pid + "</td><td>" + data.ps[i].runTime + "</td><td>" + data.ps[i].cmd  +"</td></tr>");
		}
		setTimeout(getProcess,1000);
	}).fail(function(error) {
		errorCounter++;
		$("#logRun").html(errorCounter);
		$("#log").prepend("ps error "+new Date()+"<br>");
		
		setTimeout(getProcess,1000);
	});
}

function getLoad() {

        a=$.ajax({
                url: URL + '/vi/api/loadavg',
                method: "GET"
        }).done(function(data) {

		// Set counter
                loadCounter++;
                $("#loadRun").html(loadCounter);

		// Clear data: There are many fields to clear, so I made an array of all IDs of the fields to clear and did a loop on the IDs to clear

		let dataFieldIDs = ["onemin", "fivemin", "fifteenmin", "numRunning", "ttlProc"];

		for(let i = 0; i < dataFieldIDs.length; i++) {
			$("#"+dataFieldIDs[i]).html("");
		}
                
                loadavgDat = data.loadavg;

		$("#onemin").html(loadavgDat.OneMinAvg);
		$("#fivemin").html(loadavgDat.FiveMinAvg);
		$("#fifteenmin").html(loadavgDat.FifteenMinAvg);
		$("#numRunning").html(loadavgDat.NumRunning);
		$("#ttlProc").html(loadavgDat.TtlProcesses);

                setTimeout(getLoad,1000);
        }).fail(function(error) {
                errorCounter++;
                $("#logRun").html(errorCounter);
                //console.log("error",error.statusText);
                $("#log").prepend("load error "+new Date()+"<br>");

                setTimeout(getLoad,1000);
        });
}

function getNetwork() {
        a=$.ajax({
                url: URL + '/vi/api/network',
                method: "GET"
        }).done(function(data) {
                networkCounter++;
                //Set counter
                $("#networkRun").html(networkCounter);

		// Clear data: There are many fields to clear, so I made an array of all IDs of the fields to clear and did a loop on the IDs to clear
		let dataFieldIDs = ["txbytes", "rxbytes", "txavg", "rxavg"];

                for(let i = 0; i < dataFieldIDs.length; i++) {
                        $("#"+dataFieldIDs[i]).html("");
                }

                networkDat = data.network;

		$('#txbytes').html(networkDat.txbytes);
		$('#rxbytes').html(networkDat.rxbytes);

		//On first try, we have no idea about the bytes/sec. In other trys we just do a subtraction with the previous value for each field to get the value

                if(networkCounter > 1) {
			$('#txavg').html(parseInt(networkDat.txbytes) - prevtx);
			$('#rxavg').html(parseInt(networkDat.rxbytes) - prevrx);
		}
		prevtx = networkDat.txbytes;
		prevrx = networkDat.rxbytes;

                setTimeout(getNetwork,1000);
        }).fail(function(error) {
                errorCounter++;
                $("#logRun").html(errorCounter);
                //console.log("error",error.statusText);
                $("#log").prepend("network error "+new Date()+"<br>");

                setTimeout(getNetwork,1000);
        });
}
