	function userSubmitCrimes() {
		var trustedApiKey = document.getElementById("trustedkey").value;
		
		sessionStorage.trustedApiKey = trustedApiKey;
		//document.getElementById("debug").innerHTML = '<small>Debug only: API key used (to be removed after release): ' + trustedApiKey + '</small>';
		if (trustedApiKey === '') {
			printAlert('Warning', 'You might want to enter your API key if you expect this to work...');
		} else {
			callTornAPI(trustedApiKey, 'faction', 'basic,crimes');
		}
	}
	
	
	function userSubmitReports() {
		var trustedApiKey = document.getElementById("trustedkey").value;
		
		sessionStorage.trustedApiKey = trustedApiKey;
		//document.getElementById("debug").innerHTML = '<small>Debug only: API key used (to be removed after release): ' + trustedApiKey + '</small>';

		if (trustedApiKey === '') {
			printAlert('Warning', 'You might want to enter your API key if you expect this to work...');
		} else {
			callTornAPI(trustedApiKey, 'user', 'basic,reports');
		}
	}
	
	function factionSubmitReports() {
		var trustedApiKey = document.getElementById("trustedkey").value;
		
		sessionStorage.trustedApiKey = trustedApiKey;
		//document.getElementById("debug").innerHTML = '<small>Debug only: API key used (to be removed after release): ' + trustedApiKey + '</small>';

		if (trustedApiKey === '') {
			printAlert('Warning', 'You might want to enter your API key if you expect this to work...');
		} else {
			callTornAPI(trustedApiKey, 'faction', 'basic,reports');
		}
	}
	
	function callTornAPI(key, part, selection) {
		var request = new XMLHttpRequest();

		request.open('GET', 'https://api.torn.com/' + part + '/?selections=' + selection + '&key=' + key + '&comment=Foxy', true);
		request.onload = function () {

			var jsonData = JSON.parse(this.response);

			if (request.status >= 200 && request.status < 400) {

				if (jsonData.hasOwnProperty('error')){
					if (jsonData['error'].code === 7) {
						printAlert('Warning', 'You are trying to access sensible faction data, but are not allowed to. Ask your faction leader for faction API permissions.');
					} else if (jsonData['error'].code === 2) {
						printAlert('Error', 'You are using an incorrect API key.');
					} else {
						printAlert('Error', 'Torn API returned the following error: ' + jsonData['error'].error);
					}
				} else {
					
					if (selection === 'basic,crimes') {
					if (jsonData.hasOwnProperty('crimes') && jsonData.hasOwnProperty('members')){
						printAlert('Success', 'The API Call successful, find the results below.');

						parseCrimes(jsonData['crimes'], 'output', jsonData['members']);
					} else {
						printAlert('Warning', 'Ask your faction leader for faction API permissions.');
					}
					}
					
					if (selection === 'basic,reports') {
					if (jsonData.hasOwnProperty('reports') && jsonData.hasOwnProperty('members')){
						printAlert('Success', 'The API Call successful, find the results below.');
						parseReports(jsonData['reports'], 'output', jsonData['members']);
					} else {
						printAlert('Warning', 'Ask your faction leader for faction API permissions.');
					}
					}
					
					if (selection === 'basic,reports') {
					if (jsonData.hasOwnProperty('reports')){
						printAlert('Success', 'The API Call successful, find the results below.');
//console.log('aaa');
						parseReports(jsonData['reports'], 'output', jsonData.name);
						
					}
					}
				}
				
			} else {
				printAlert('#chedded', 'Torn API is currently not available.');
			}
		}
		request.send();
	}
	
	function parseReports (reportData, element, membersList) {
		
		var type = '';
		var header = '';
				
		if (document.getElementById('money').checked) {
			type = 'money';
			header = 'Money Reports'
		}
		if (document.getElementById('stats').checked) {
			type = 'stats';
			header = 'Stat Spies'
		}
		if (document.getElementById('friendorfoe').checked) {
			type = 'friendorfoe';
			header = 'Friend or Foe Reports'
		}
		
		document.getElementById('summary').innerHTML = 'You are looking for ' + header + '.';

		var table = '<div class="col-sm-12 badge-primary" ><b> ' + header + '</b></div>';
		table = table + '<table class="table table-hover"><thead><tr>'
				  + '<th>Date</th>'
				  + '<th>Member</th>'
				  + '<th>Type</th>'
				  + '<th>Target</th>';
				  
		if (type === 'money') {
			table = table +'<th>Money</th>';
		}
		
		if (type === 'stats') {
			table = table +'<th>Total</th>';
			table = table +'<th>Str</th>';
			table = table +'<th>Def</th>';
			table = table +'<th>Spd</th>';
			table = table +'<th>Dex</th>';
					
		}
				  
		table = table + '</tr></thead><tbody>';
		
		
		for( var id in reportData ){
			var report = reportData[id];
			if (report.type === type) {

				var ts = new Date(report.timestamp * 1000);
				var formatted_date =  ts.toISOString().replace('T',' ').replace('.000Z','');
				
				table = table + '<tr>'
							+'<td>' + formatted_date + '</td>'
							+'<td><a href="https://www.torn.com/profiles.php?XID=' + report.user_id + '" target="_blank">' + membersList[report.user_id].name + '</a></td>'
							//+'<td>' + header + '</td>'
							+'<td>' + header + '</td>'
							+'<td><a href="https://www.torn.com/profiles.php?XID=' + report.target + '" target="_blank">' + report.target + '</a></td>';
				
				if (type === 'money') {
					table = table +'<td>$' + report.report.money.toLocaleString('en-US') + '</td>'
				}
				
				if (type === 'stats') {
					if (report.report.hasOwnProperty('total_battlestats')) {
						table = table +'<td>' + report.report.total_battlestats.toLocaleString('en-US') + '</td>';
					} else {
						table = table +'<td>N/A</td>';
					}
					
					if (report.hasOwnProperty('strength')) {
						table = table +'<td>' + report.report.strength.toLocaleString('en-US') + '</td>';
					} else {
						table = table +'<td>N/A</td>';
					}
					
					if (report.hasOwnProperty('defense')) {
						table = table +'<td>' + report.report.defense.toLocaleString('en-US') + '</td>';
					} else {
						table = table +'<td>N/A</td>';
					}
					
					if (report.hasOwnProperty('speed')) {
						table = table +'<td>' + report.report.speed.toLocaleString('en-US') + '</td>';
					} else {
						table = table +'<td>N/A</td>';
					}
					
					if (report.hasOwnProperty('dexterity')) {
						table = table +'<td>' + report.report.dexterity.toLocaleString('en-US') + '</td>';
					} else {
						table = table +'<td>N/A</td>';
					}
				}
				
				
				table = table + '</tr>';
			}
		}	
		table = table + '</tbody></table>';
		document.getElementById(element).innerHTML = table;
		
	}
	
	function parseCrimes (crimeData, element, membersList) {
		
		var memberMoney = {};
		var memberSuccess = {};
		var memberFailed = {};
		var factionMoney = 0;
		var factionSuccess = 0;
		var factionFailed = 0;
		var totalRespect = 0;
		var totalMoney = 0;
		var today = new Date();
		var badgeSuccess = 'badge-dark';
		var badgeFailed = 'badge-dark';
		
		if (document.getElementById('current').checked) {
			var currentMonth = today.getMonth() + 1;
			if (currentMonth > 11) { currentMonth = 0; }
		}
		if (document.getElementById('last').checked) {
			var currentMonth = today.getMonth();
		}
		if (document.getElementById('before').checked) {
			var currentMonth = today.getMonth() - 1;
			if (currentMonth < 0) { currentMonth = 11; }
		}
		
		var split = document.getElementById('range').value;
		
		
		var table = '<div class="col-sm-12 badge-primary" ><b>PA Details for ' + monthToText(currentMonth) + '</b> <input type="button" class="btn btn-outline-light btn-sm" value="select table content" onclick="selectElementContents( document.getElementById(\'totals\') );"></div>';
		table = table + '<br />';
		//table = table + '<input type="button" class="btn btn-outline-light btn-sm" value="select table content" onclick="selectElementContents( document.getElementById(\'totals\') );">';
		table = table + '<table class="table table-hover" id="totals"><thead><tr>'
				  + '<th>Date</th>'
				  + '<th>Participants</th>'
				  + '<th>Crime Type</th>'
				  + '<th>Result</th>'
				  + '<th>Money Gained<br/>'
				  + '<th>Respect Gained</th>'
				  + '</tr></thead><tbody>';
				  
				
		for( var id in crimeData ){
			var crime = crimeData[id];
			if (crime.crime_id === 8) { //8 = PA
				var ts = new Date(crime.time_completed * 1000);
				
				if (crime.initiated === 1 && ts.getMonth()+1 === currentMonth) {
					
					var crimeResult = '';
					var failed = 0;
					var success = 0;
					var participants = '';
					var tmp = '';

					if (crime.success === 0) {
						crimeResult = '<span class="badge badge-pill badge-danger">Failed</span>';
						failed = 1;
					} else {
						crimeResult = '<span class="badge badge-pill badge-success">Success</span>';
						success = 1;
					}
					
					crime.participants.forEach(obj => {
						Object.entries(obj).forEach(([key, value]) => {
							var memberID = `${key}`;

							var memberName =  '';
							if (JSON.stringify(membersList).indexOf(memberID) != -1) {
								memberName = membersList[memberID].name;
								if (memberName in memberMoney) {
									memberMoney[memberName] = memberMoney[memberName] + (crime.money_gain / split);
									memberSuccess[memberName] = memberSuccess[memberName] +success;
									memberFailed[memberName] = memberFailed[memberName] + failed;
								} else {
									memberMoney[memberName] = (crime.money_gain / split);
									memberSuccess[memberName] = success;
									memberFailed[memberName] = failed;
								}
							} else {
								memberName = memberID;
							}
							
							if (participants === '') {
								participants = memberName;
								
							} else {
								participants = participants + ', ' + memberName;
							}
						});
					});
					
					if (split == 5) {factionMoney = factionMoney + (crime.money_gain / split);}
					if (split == 4) {factionMoney = 0;}
					factionSuccess = factionSuccess + success;
					factionFailed = factionFailed + failed;
					totalRespect = totalRespect + crime.respect_gain;
					totalMoney = totalMoney + crime.money_gain;
					
					var formatted_date =  ts.toISOString().replace('T',' ').replace('.000Z','');
					
					table = table + '<tr>'
							+'<td>' + formatted_date + '</td>'
							+'<td>' + participants + '</td>'
							+'<td>' + crime.crime_name + '</td>'
							+'<td>' + crimeResult + '</td>'
							+'<td>$' + crime.money_gain.toLocaleString('en-US') + '</td>'
							+'<td>' + crime.respect_gain + '</td>'
							+'</tr>';
				}
			}
		}
		
		if (factionFailed > 0) {badgeFailed = 'badge-danger';}
		if (factionSuccess > 0) {badgeSuccess = 'badge-success';}
		
		table = table + '<tr class="table-dark">' 
						+'<td colspan = "3">Totals</td>'
						+'<td>' 
							+ '<span class="badge badge-pill '+badgeFailed+'">'+ factionFailed + '</span>-'
							+ '<span class="badge badge-pill '+badgeSuccess+'">'+ factionSuccess + '</span>'
						+'</td>'
						+'<td>$' + totalMoney.toLocaleString('en-US') + '</td>'
						+'<td>' + totalRespect + '</td>'
						+'</tr>';
		
		table = table + '</tbody></table>';
		document.getElementById(element).innerHTML = table;
		
		
		var summary = '<div class="col-sm-12 badge-primary" ><b>Individual results for ' + monthToText(currentMonth) + '</b> <input type="button" class="btn btn-outline-light btn-sm" value="select table content" onclick="selectElementContents( document.getElementById(\'individual\') );"></div>';
		summary = summary + '<br />';
		//summary = summary + '<input type="button" class="btn btn-outline-light btn-sm" value="select table content" onclick="selectElementContents( document.getElementById(\'individual\') );"><div id="copyIndiv"></div>';
		summary = summary + '<table class="table table-hover" id="individual"><thead><tr>'
				  + '<th>Name</th>'
				  + '<th>Money earned (<sup>1</sup>/<sub>' + split + '</sub>th of result)</th>'
				  + '<th>Fail</th>'
				  + '<th>Success</th>'
				  + '</tr></thead><tbody>';
				  
		memberMoney = sortObj(memberMoney);
		
		for (var name in memberMoney) {
			if (memberFailed[name] > 0) {badgeFailed = 'badge-danger';} else {badgeFailed = 'badge-dark';}
			if (memberSuccess[name] > 0) {badgeSuccess = 'badge-success';} else {badgeSuccess = 'badge-dark';}
			summary = summary + '<tr>' 
						+'<td>' + name + '</td>'
						+'<td>' +' $' + memberMoney[name].toLocaleString('en-US') + '</td>'
						+'<td><span class="badge badge-pill '+badgeFailed+'">'+ memberFailed[name] + '</span></td>'
						+'<td><span class="badge badge-pill '+badgeSuccess+'">' + memberSuccess[name] + '</span></td>'
						+'</tr>';
			
		}
		badgeSuccess = 'badge-dark';
		badgeFailed = 'badge-dark';
		if (factionFailed > 0) {badgeFailed = 'badge-danger';}
		if (factionSuccess > 0) {badgeSuccess = 'badge-success';}
		summary = summary + '<tr class="table-dark">' 
						+'<td>Faction totals</td>'
						+'<td>' +' $' + factionMoney.toLocaleString('en-US') + '</td>'
						+'<td><span class="badge badge-pill '+badgeFailed+'">'+ factionFailed + '</span></td>'
						+'<td><span class="badge badge-pill '+badgeSuccess+'">'+ factionSuccess + '</span></td>'
						+'</tr>';
		summary = summary + '</tbody></table>';
		
		document.getElementById('summary').innerHTML = summary;
	}
	
	
	function printAlert(alertType, alertText) {
		var alertClass;
		if (alertType === 'Error') { alertClass = 'alert-danger' };
		if (alertType === 'Success') { alertClass = 'alert-success' };
		if (alertType === 'Info') { alertClass = 'alert-info' };
		if (alertType === 'Warning') { alertClass = 'alert-warning' };
		if (alertType === '#chedded') { alertClass = 'alert-danger' };
		
		document.getElementById('alert').innerHTML = '<div class="alert ' + alertClass + '"><strong>' + alertType + ':</strong> ' + alertText + '</div>';
	}

	function sortObj(obj) {
	  return Object.keys(obj).sort().reduce(function (result, key) {
		result[key] = obj[key];
		return result;
	  }, {});
	}

	function monthToText(month) {
		const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"];
	  
	  return monthNames[month - 1];

	}
	
	
	function selectElementContents(el) {
		var body = document.body, range, sel;
		if (document.createRange && window.getSelection) {
			range = document.createRange();
			sel = window.getSelection();
			sel.removeAllRanges();
			try {
				range.selectNodeContents(el);
				sel.addRange(range);
			} catch (e) {
				range.selectNode(el);
				sel.addRange(range);
			}
		} else if (body.createTextRange) {
			range = body.createTextRange();
			range.moveToElementText(el);
			range.select();
	}
	
	//document.getElementById('copyIndiv').innerHTML = '<input type="button" class="btn btn-outline-light btn-sm" value="copy" onclick="selectElementContents( document.getElementById(\'individual\') );">';
	//<input type="button" class="btn btn-outline-light btn-sm" value="select table content"
	//alert("Copied the text: " + range);
	//navigator.clipboard.writeText(range);

}
	
	

function loadKeyFromSession() {
  if (typeof(Storage) !== "undefined") {
    if (sessionStorage.trustedApiKey) {
       document.getElementById("trustedkey").value = sessionStorage.trustedApiKey;
		}
	}
}
