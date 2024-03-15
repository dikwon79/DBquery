//we are used chatgpt3.5 to implement these code
class SqlClient {
    constructor() {
        this.baseUrl = messages.baseUrl;
        document.addEventListener('DOMContentLoaded', () => {
            // Use arrow functions to maintain the correct context of `this`
            document.getElementById('submitQuery').addEventListener('click', () => this.submitQuery());
            document.getElementById('insert').addEventListener('click', () => this.insertPatient());
        });
    }

    insertPatient() {
        let sqlQuery = document.getElementById('sqlQuery').value.trim();

        let queryType;
        if (sqlQuery.toUpperCase().startsWith('(')) {
            queryType = 'POST';
            sqlQuery = messages.insert + sqlQuery;
			console.log(sqlQuery);
        } else {
            alert(messages.noservice);
            return;
        }
        // Use arrow function to maintain the correct context of `this`
        this.sendRequest(queryType, messages.endpoint, sqlQuery);
    }

    submitQuery() {
        const sqlQuery = document.getElementById('sqlQuery').value.trim();

        let queryType, endpoint;
        if (sqlQuery.toUpperCase().startsWith('SELECT')) {
            queryType = 'GET';
            endpoint = `/lab5/api/v1/sql/"${encodeURIComponent(sqlQuery)}"`;
        } else if (sqlQuery.toUpperCase().startsWith('INSERT')) {
            queryType = 'POST';
            endpoint = messages.endpoint;
        } else {
            alert(messages.queryAllowed);
            return;
        }
        // Use arrow function to maintain the correct context of `this`
        this.sendRequest(queryType, endpoint, sqlQuery);
    }

    sendRequest(queryType, endpoint, sqlQuery) {
        // Perform the AJAX request
        const xhr = new XMLHttpRequest();
        const url = `${this.baseUrl}${endpoint}`;
        xhr.open(queryType, url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (queryType === "GET")
                    {
                        document.getElementById('response').innerHTML = ''; // initialize before contents 
                        console.log(xhr.responseText[3]);
						if (xhr.responseText[3] == "p")
                        {
							
							
							let responseData = JSON.parse(xhr.responseText);

							// create table
							let tableHtml = '<table>';
							tableHtml += '<tr><th>Patient ID</th><th>Name</th><th>Date of Birth</th></tr>';

							responseData.forEach(function(patient) {
								tableHtml += '<tr>';
								tableHtml += '<td>' + patient.patientid + '</td>';
								tableHtml += '<td>' + patient.name + '</td>';
							   
								let dateOfBirth = patient.dateOfBirth.substring(0, 10); // YYYY-MM-DD 
								tableHtml += '<td>' + dateOfBirth + '</td>';
								tableHtml += '</tr>';
							});

							tableHtml += '</table>';

							// #response 
							document.getElementById('response').innerHTML = tableHtml;
                        }else{
							document.getElementById('response').innerHTML = xhr.responseText;
						}
                       
                    }
                    else {

                        let parsedResponse = JSON.parse(xhr.responseText);
                        console.log(xhr.responseText);
                        // info value
                        let info = parsedResponse.info == "" ? messages.zero : parsedResponse.info;

                        console.log(info);
                        document.getElementById('response').innerHTML = messages.save + info;

                    }
                } else {
                    document.getElementById('response').innerText = messages.error + xhr.responseText;
                }
            }
        };
        if (queryType === 'POST') {
             xhr.setRequestHeader('Content-Type', 'application/json');
             xhr.send(JSON.stringify({ query: sqlQuery }));
        } else {
             xhr.send();
        }
    }
}

const dbClient = new SqlClient();
