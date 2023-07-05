const url = 'https://joe.esmel.workers.dev/KATL';
const codeElement = document.getElementById('code');

fetch(url)
    .then(response => response.text())
    .then(data => {
        codeElement.textContent = data;
    })
    .catch(error => {
        console.log('Error:', error);
    });
