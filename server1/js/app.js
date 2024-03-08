class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    sendRequest(method, endpoint, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `${this.baseUrl}${endpoint}`, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr.status, xhr.responseText);
            }
        };
        if (data) {
            xhr.send(data);
        } else {
            xhr.send();
        }
    }
}

class QueryHandler {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    insertPatients() {
        const data = JSON.stringify({
            query: "INSERT INTO patients (name, dateOfBirth) VALUES ('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01')"
        });
        this.apiClient.sendRequest('POST', '/lab5/api/v1/sql', data, this.handleResponse.bind(this));
    }

    submitQuery() {
        const query = document.getElementById('sqlQuery').value.trim();
        const isSelect = query.toLowerCase().startsWith('select');
        const method = isSelect ? 'GET' : 'POST';
        const endpoint = isSelect ? `/lab5/api/v1/sql?query=${encodeURIComponent(query)}` : '/lab5/api/v1/sql';
        const data = isSelect ? null : JSON.stringify({ query: query });

        this.apiClient.sendRequest(method, endpoint, data, this.handleResponse.bind(this));
    }

    handleResponse(status, responseText) {
        document.getElementById('response').innerText = status === 200 ? responseText : `Error: ${status}`;
    }
}


const apiClient = new ApiClient('http://localhost:8080');
const queryHandler = new QueryHandler(apiClient);

document.getElementById('insert').addEventListener('click', () => {
    queryHandler.insertPatients();
});

document.getElementById('submitQuery').addEventListener('click', () => {
    queryHandler.submitQuery();
});
