//import getAllPages from './pdfPageParser';
var getAllPages = require('./pdfPageParser').getAllPages;
var excelUtils = require('./excelReader');
var config= require('./config');

//Importing docName from config
var docName = config.inputExcelDocName;
const pdfNameDocument = "2019-10-16_1.pdf";

const sheetName="Sheet1"
const columnName="A"


var results = getMatches(pdfNameDocument, excelUtils.getColumnValues(docName,sheetName,columnName));

results.then(matches => {    
    excelUtils.writeExcel(excelUtils.writeRow(matches,"Expediente","Páginas"),config.outputExcelDocName);
    matches.forEach(page => {
        console.log(`KeyWord: ${page.keyWord} -- Page: ${page.pageNumber}`);
    })
}).catch(error=>{
    console.log(error);
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
                        results.page.keyWord = keyWords[word];
                        results.page.pageNumber = page.pageNumber;
                        //results.page.content = page.text;                        
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



