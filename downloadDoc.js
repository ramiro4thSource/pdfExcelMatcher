var http = require('http');
var fs = require('fs');
var config = require('./config');

var url = config.diarioUrl;
let date = new Date();
var stringDate = `/docs/diario_oficial/diarios/${date.getFullYear()}/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_1.pdf`;

const options = {
    hostname: config.diarioUrl,
    path: stringDate,
    method: 'GET'
};

function downloadFile(dest) {
    console.log("Downloading file from: " + url + stringDate + " ....");
    url = url + stringDate;
    return new Promise((resolve, reject) => {

        download_file_httpget();

        function download_file_httpget() {
            var file = fs.createWriteStream(dest);
            http.get(url, function (res) {
                res.on('data', function (data) {
                    file.write(data);
                }).on('end', function () {
                    file.end();
                    resolve('File downloaded');
                }).on('error', (e) => {
                    reject(e);
                });
            });
        };
    })
}


module.exports = { downloadFile };

