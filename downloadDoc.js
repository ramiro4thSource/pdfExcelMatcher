var http = require('http');
var fs = require('fs');
var config = require('./config');


function downloadFile(url, dest) {
    console.log("Downloading file from: " + url + " ....");
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

