//import getAllPages from './pdfPageParser';
var getAllPages = require('./pdfPageParser').getAllPages;
var excelUtils = require('./excelReader');

//Importing docName from config
var docName = require('./config').excelDocName;
const pdfNameDocument = "2019-10-16_1.pdf";

const sheetName="Sheet1"
const columnName="D"


var results = getMatches(pdfNameDocument, excelUtils.getColumnValues(docName,sheetName,columnName));

results.then(matches => {
    matches.forEach(page => {
        console.log(`KeyWord: ${page.keyWord} -- Page: ${page.pageNumber}`);
    })
})




/*
    LOCAL FUNCTIONS 
*/

/**Function to fin matcher given a pdf object
 * @param {string} pdfNameDocument - Pdf document name 
 * @param {string} keyWords - String array of word to be fetched in pdf document  
 * @return {Promise} String array with results
 */
function getMatches(pdfNameDocument, keyWords) {
    return new Promise((resolve, reject) => {
        getAllPages(pdfNameDocument).then(pages => {
            var results = [];
            pages.forEach(page => {
                for (var word in keyWords) {
                    if (page.text.includes(keyWords[word])) {
                        results.page = {};
                        results.page.pageNumber = page.pageNumber;
                        results.page.content = page.text;
                        results.page.keyWord = keyWords[word];
                        results.push(results.page);
                    }
                }
            })
            resolve(results);
        }, error => {
            reject(`Error while finding matches ${error}`);
        })
    })
}



