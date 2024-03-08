document.getElementById('insert').addEventListener("click", function() {
    const rowData = [
        { name: 'Sara Brown', dob: '1901-01-01' },
        { name: 'John Smith', dob: '1941-01-01' },
        { name: 'Jack Ma', dob: '1961-01-30' },
        { name: 'Elon Musk', dob: '1999-01-01' }
    ];

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('Data successfully inserted', JSON.parse(xhr.responseText));
        } else if (xhr.readyState === 4) {
            console.log('Error', xhr.statusText);
        }
    };

    xhr.send(JSON.stringify(rowData));
});
