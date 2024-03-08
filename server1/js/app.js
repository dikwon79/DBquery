document.getElementById('insert').addEventListener('click', function() {
    const data = JSON.stringify({
        query: "INSERT INTO patients (name, dateOfBirth) VALUES ('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01')"
    });
    sendRequest('POST', 'http://localhost:8080/lab5/api/v1/sql', data);
});


document.getElementById('submitQuery').addEventListener('click', function() {
    const query = document.getElementById('sqlQuery').value.trim();
    const isSelect = query.toLowerCase().startsWith('select');
    const method = isSelect ? 'GET' : 'POST';
    const url = isSelect ? `http://localhost:8080/lab5/api/v1/sql?query=${encodeURIComponent(query)}` : 'http://localhost:8080/lab5/api/v1/sql';
    const data = isSelect ? null : JSON.stringify({ query: query });

    sendRequest(method, url, data);
});

function sendRequest(method, url, data) {
    const xhr = new XMLHttpRequest();
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
