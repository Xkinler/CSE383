var key_mq = '2cMANpURt47Zi5gc3VKE3PrDaR55YQN7';
var chartWidth = '400';
var chartHeight = '300';

function updateShownResult(resultTypeSelectorSelector, resultListSelector, elevationSelector) {

	checkedOption = $(resultTypeSelectorSelector + ' input:checked').val();

	switch(checkedOption) {
		case 'route':
			$(elevationSelector).removeClass('show');
			$(resultListSelector).addClass('show');
			break;
		case 'elevation':
			$(resultListSelector).removeClass('show');
			$(elevationSelector).addClass('show');
			break;
		default:
			return;
	}
}

function emptyAlert(alertDOMSelector) {
	let alertDOM = $(alertDOMSelector);
	alertDOM.removeClass();
        alertDOM.addClass('alert');
        alertDOM.addClass('alert-dismissible');
        $(alertDOMSelector + '-icon').removeClass(); // Remove Icon
}

function dismissAlert(alertDOMSelector, alertDOMContainerSelector) {
        $(alertDOMContainerSelector).addClass('d-none');
	emptyAlert(alertDOMSelector);
}

function showAlert(type, text, closable) {
	let alertDOMSelector = '#alert';
	let alertDOMContainerSelector = '#alert-row';
	let alertIcon = $('#alert-icon');
        let alertContent = $('#alert-text');
	let alertCloseButton = $('#alert-close');
	let alertDOMContainer = $(alertDOMContainerSelector);
	let alertDOM = $(alertDOMSelector);
	let iconClass;
	let DOMClass;

	emptyAlert(alertDOMSelector);

	switch(type) {
		case "loading": iconClass = 'bi bi-info-circle-fill'; DOMClass='alert-primary'; break;
		case "error": iconClass = 'bi-exclamation-circle-fill'; DOMClass = 'alert-danger'; break;
	}

	if(closable) {
		alertCloseButton.removeClass('d-none');
		alertCloseButton.click(function(){
			dismissAlert(alertDOMSelector, alertDOMContainerSelector);
		});
	} else {
		alertCloseButton.addClass('d-none');
	}

	alertDOM.addClass(DOMClass);
	alertIcon.addClass(iconClass);
	alertContent.html(text);
	alertDOMContainer.removeClass('d-none');
	
}

function showResult(outputContainerSelector, resultTypeSelectorSelector, resultListSelector, elevationSelector , json, isElevationURLProvided) {

	let manNum = json.route.legs[0].maneuvers.length;
	let elevationURL;

	emptyOutput(outputContainerSelector);

	for(i = 0; i < manNum; i++) {
		let man = json.route.legs[0].maneuvers[i];
		
		/*let streets;
                let summaryStr;

                streets = man.streets;
                summaryStr = '';

                for(i = 0; i < streets.length; i++) {
                        if(i != 0) {
                                summaryStr += ', ';
                        }

                        summaryStr += streets[i];
                }*/

		$(resultListSelector).append(
			$(
				`<li class="list-group-item">
                                                        <div class="row">
                                                                <div class="row"><b>
                                                                        <span class="bi bi-pin-map"></span>
                                                                        `+ man.streets +` (` + man.distance  + ` mi)
                                                                </div></b>
                                                                <div class="row">
                                                                        <div class="col">
                                                                                <ul class="list-group list-group-flush">
                                                                                        <li class="list-group-item">
                                                                                                `+ man.narrative  +`
                                                                                        </li>
                                                                                        <li class="list-group-item">
                                                                                                Time: `+ man.formattedTime  +`
                                                                                        </li>
                                                                                </ul>
                                                                        </div>
                                                                        <div class="col-lg p-0 text-center text-lg-end">
                                                                                <img src="`+ (man.mapUrl === undefined ? '' : man.mapUrl)  +`"` + (man.mapUrl === undefined ? 'class=d-none' : '') + `>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </li>`
			)
		);
	}

	if(!isElevationURLProvided) {

		let latlngArray = [];

		for(i = 0; i < json.route.legs[0].maneuvers.length; i++) {
			man = json.route.legs[0].maneuvers;

			lat = man[i].startPoint.lat;
			lng = man[i].startPoint.lng;

			latlngArray.push(lat, lng);
		}

		latlngArray.push(json.route.locations[1].latLng.lat, json.route.locations[1].latLng.lng);

		arrStr = JSON.stringify(latlngArray);
		arrStr = arrStr.substring(1, arrStr.indexOf(']'));

		elevationURL = 'http://open.mapquestapi.com/elevation/v1/chart?key=' + key_mq + '&sessionId=' + json.route.sessionId + '&width=' + chartWidth + '&height=' + chartHeight;
	} else {

		elevationURL = json.elevation;
	}

	$(elevationSelector).prop('src', elevationURL);

	$(resultTypeSelectorSelector + ' input').click(function() {
		updateShownResult(resultTypeSelectorSelector, resultListSelector, elevationSelector);
	});

	$(resultTypeSelectorSelector).removeClass('d-none');
	updateShownResult(resultTypeSelectorSelector, resultListSelector, elevationSelector);

	return elevationURL;
}

function emptyOutput(outputContainerSelector) {
	$(outputContainerSelector + ' ul').empty();
	$(outputContainerSelector + ' img').prop('src', '');
	$(outputContainerSelector + ' .btn-group').addClass('d-none');
}
