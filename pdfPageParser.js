const pdfjs = require('pdfjs-dist');

/**
Function to get all pages from pdf document. Results are returned in array.
@param {string} pdfName - Document name.
@return {promise} Promise with all pages as argument. 
*/
function getAllPages (pdfName){
    var loadingTask = pdfjs.getDocument(pdfName)
    return new Promise((resolve, reject) => loadingTask.promise.then(function (pdf) {
        var pages = [];
        getPageContent();
        async function getPageContent() {
            for (let i = 1; i < pdf.numPages; i++) {
                let page = await pdf.getPage(i);
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
                if (i == pdf.numPages - 1) {
                    resolve(pages);
                }

            }

        }

    }, error => {
        reject(`A2- Error while reading PDF document: ${error}`);
        console.log(reason);
    })
    )
}

module.exports={getAllPages};