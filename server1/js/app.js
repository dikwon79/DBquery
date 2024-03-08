document.getElementById('insert').addEventListener('click', function() {
    var data = JSON.stringify({
        query: "INSERT INTO patients (name, dateOfBirth) VALUES ('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01')"
    });
    sendRequest('POST', 'http://localhost:8080/lab5/api/v1/sql', data);
});


document.getElementById('submitQuery').addEventListener('click', function() {
    var query = document.getElementById('sqlQuery').value.trim();
    var isSelect = query.toLowerCase().startsWith('select');
    var method = isSelect ? 'GET' : 'POST';
    var url = isSelect ? `http://localhost:8080/lab5/api/v1/sql?query=${encodeURIComponent(query)}` : 'http://localhost:8080/lab5/api/v1/sql';
    var data = isSelect ? null : JSON.stringify({ query: query });

    sendRequest(method, url, data);
});

function sendRequest(method, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            document.getElementById('response').innerText = xhr.status === 200 ? xhr.responseText : `Error: ${xhr.status}`;
        }
    };
    if (data) {
        xhr.send(data);
    } else {
        xhr.send();
    }
}
