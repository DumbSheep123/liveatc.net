const url = 'https://metar.madebyesmel.com/KLAX';
const code = document.getElementById('code');

fetch(url)
    .then(response => response.text())
    .then(data => {
        code.textContent = data;
    })
    .catch(error => {
        console.log('Error:', error);
    });
