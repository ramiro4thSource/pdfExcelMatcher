const pdfjs = require('pdfjs-dist');
const fs = require('fs');


/**
Function to get all pages from pdf document. Results are returned in array.
@param {string} pdfName - Document name.
@return {Promise} Ap 
*/
function pdfToObject(pdfName) {
    var loadingTask = pdfjs.getDocument(pdfName)
    return new Promise((resolve, reject) => loadingTask.promise.then(function (pdf) {
        var pages = [];
        getPageContent();
        async function getPageContent() {
            for (let i = 1; i < pdf.numPages; i++) {
                try {
                    let page = await pdf.getPage(i);
                    try {
                        let textContent = await page.getTextContent();
                        let lastY, text = '';
                        let pageObject = {};
                        for (let item of textContent.items) {
                            if (lastY == item.transform[5] || !lastY) {
                                text += item.str;
                            }
                            else {
                                text += '\n' + item.str;
                            }
                            lastY = item.transform[5];
                        }
                        pageObject = {
                            text: text,
                            pageNumber: page.pageNumber
                        }
                        pages.push(pageObject);
                    } catch (error) {
                        reject(`A1.1.1 - Error while reading content from page: ${error}`);
                    }
                } catch (error) {
                    reject(`A1.1 - Error while reading page from document: ${error}`);
                }
            }
            resolve(pages);
        }
    }, error => {
        reject(error);
        console.log(error);
    })
    )
}

module.exports = { pdfToObject };