var resultTypeSelectorSelector = '#result-type-selector';
var resultListSelector = '#result-list';
var elevationSelector = '#elevation';
var outputContainerSelector = '#dir-output';
var alertDOMSelector = '#alert';
var alertDOMContainerSelector = '#alert-row';

$(document).ready(function() {
	$('#input-form').on('submit', function(e) {
		let formDat;
		let startAddr;
		let endAddr;
		let routeType;

		// MapQuest Info
		let key;

		e.preventDefault();
		formDat = $(this).serializeArray();

		emptyOutput(outputContainerSelector);

		for(i = 0; i < formDat.length; i++) {
			let v = formDat[i];

                        if(v.name === "from" && v.value === "" ||
                           v.name === "to" && v.value === "" ||
                           v.name === "routeType" && v.value === "") {
                                showAlert('error', 'Please fill <strong>all fields</strong>', true);
                                return;
                        }

                        switch(v.name) {
                                case "from": startAddr = v.value; break;
                                case "to": endAddr = v.value; break;
                                case "routeType": routeType = v.value; break;
                                default: return;
                        }
		}

		showAlert('loading', 'Loading...', false);

		$.ajax({
			url: 'https://www.mapquestapi.com/directions/v2/route',
			method: 'GET',
			data: {
				key: key_mq,
				from: startAddr,
				to: endAddr,
				routeType: routeType,
				/*narrativeType: 'microformat',*/
			}
		})
		.done(function(dat) {
			dismissAlert(alertDOMSelector, alertDOMContainerSelector);
			console.log(dat);
			debugDat = dat;
			let errorMsg = -1;

			if(dat.info.messages.length != 0) {
				errorMsg = dat.info.messages[0];
			} else if(dat.route.distance > 250) {
				errorMsg = "The route is too long, please make sure it is no longer than <b>250</b> miles";
			} else if(dat.route.distance === 0) {
				errorMsg = "The addresses are either representing the same location or invalid, please try another one";
			}

			if (errorMsg !== -1) {
				showAlert('error', errorMsg, true);
				return;
			}

			elevationURL = showResult(outputContainerSelector, resultTypeSelectorSelector, resultListSelector, elevationSelector, dat, false);

			// Store result to the database

			locationObj = {};
			
			locationObj.from = startAddr;
			locationObj.to = endAddr;
			locationObj.type = routeType;

			locationJson = JSON.stringify(locationObj);

			datObj = dat;

			datObj.elevation = elevationURL;

			datStr = JSON.stringify(datObj);

			$.ajax({
				url: 'final.php',
				method: 'POST',
				data: {
					method: 'setLookup',
					location: locationJson,
					sensor: 'web',
					value: datStr,
				}
			})
			.done(function(){
				console.log('Store succeeded!');
			})
			.fail(function(){
				console.log('Store failed');
			})
		})
		.fail(function(e) {
			console.log("ERROR:");
			console.log(e);
		});

	});

});
