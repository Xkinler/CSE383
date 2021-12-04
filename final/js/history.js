var historyListSelector = '#history-list';
var outputContainerSelector = '#his-output';
var resultTypeSelectorSelector = '#result-type-selector';
var resultListSelector = '#result-list';
var elevationSelector = '#elevation';
var alertDOMSelector = '#alert';
var alertDOMContainerSelector = '#alert-row';

function addHistoryItem(historyListSelector, resultTypeSelectorSelector, resultListSelector, elevationSelector, all, num) {

	if(all.result.length === 0) {
		showAlert('error', 'No result found, please try another date', true);
		return;
	}

	if(num > all.result.length || num === 0) {
		num = all.result.length;
	}

	for(i = 0; i < num; i++) {

		data = all.result[i];

		let date = data["date"];

		let locationInfo = JSON.parse(data['location']);

		let startLocation = locationInfo.from;
		let endLocation = locationInfo.to;
		let type = locationInfo.type;

		let value = JSON.parse(data['value']);
		let maneuverNum = parseInt(value.route.legs[0].maneuvers.length);

		$(historyListSelector).append(
			$(
				`<button class="list-group-item list-group-item-action" index='`+ i +`' id='history-item-`+ i  +`'>
							<div class="row">
								<b>
									<span class="bi bi-geo-alt-fill"></span>
										`+ startLocation  +` --&gt;&nbsp;` + endLocation + ` (`+ type +`)
								</b>
							</div>

							<div class="row mt-2">
								<div class="col">
									<ul class="list-group list-group-flush">
										<li class="list-group-item">
											Request Date & Time:`+ date  +`
										</li>
										<li class="list-group-item">
											Maneuvers: `+ maneuverNum +`
										</li>
									</ul>
								</div>
							</div>
						</button>`
			)
		);

		$('#history-item-' + i).click(function() {

			if($(this).hasClass('active')) {
				return; // If the user clicks on the same button that they previously selected, just ignore it
			}

			$(historyListSelector + ' button.list-group-item.list-group-item-action.active').removeClass('active');
			$(this).addClass('active');

			emptyOutput(outputContainerSelector);

			showResult(outputContainerSelector, resultTypeSelectorSelector, resultListSelector, elevationSelector, value, true);
		});
	}
}

$(document).ready(function() {

	curDate = new Date().toISOString();
	curDate = curDate.substring(0, curDate.indexOf('T'));
	$('#date-picker').prop('max', curDate); // Set the max date to the current date

	$('#search-form').on('submit', function(e) {
		let formDat;
		let date;
		let num;

		e.preventDefault();
		formDat = $(this).serializeArray();

		$('#history-list').empty();
		emptyOutput(outputContainerSelector);

		for(i = 0; i < formDat.length; i++) {
			let v = formDat[i];

                        if(v.name === "date" && v.value === "") {
                                showAlert('error', 'You must fill the <strong>Date</strong> field', true);
                                return;
                        }

			dismissAlert(alertDOMSelector, alertDOMContainerSelector);


                        switch(v.name) {
                                case "date": date = v.value; break;
                                case "number": 
					if(v.value === "") {
						num = 0;
					} else {
						num = parseInt(v.value);
						if(isNaN(num)) {
							showAlert('error', 'Please give a <b>number</b> for the number of items for the history list', true);
							return;
						}
					}
					break;
                                default: return;
                        }

		}


		$(resultTypeSelectorSelector + ' input').click(function() {
			updateShownResult(resultTypeSelectorSelector);
		});

		$.ajax({
			url: 'final.php',
			method: 'GET',
			data: {
				method: "getLookup",
				date: date,
			}
		})
		.done(function(dat) {

			dismissAlert(alertDOMSelector, alertDOMContainerSelector);
			// console.log(dat);

			addHistoryItem(historyListSelector, resultTypeSelectorSelector, resultListSelector, elevationSelector, dat, num);

		})
		.fail(function(e) {
			console.log("ERROR:");
			console.log(e);
		});

	});

});
