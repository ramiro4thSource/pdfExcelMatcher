//import getAllPages from './pdfPageParser';
var pdfToObject = require('./pdfPageParser').pdfToObject;
var excelUtils = require('./excelReader');
var downloadFile = require('./downloadDoc').downloadFile;
var config = require('./config');
var path = require('path');



//Diario url creation
let date = new Date();
const diarioFileName=`downloads/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_1.pdf`;
var stringDate = `/docs/diario_oficial/diarios/${date.getFullYear()}/${diarioFileName}`;
const url=config.diarioUrl+stringDate;

//Importing docName from config
var docName = config.inputExcelDocName;
const pdfDestName = path.join(__dirname, diarioFileName);
//Excel configuration
const sheetName = "Sheet1"
const columnName = "A"

try {
    getResults();
}
catch (err) {
    console.log(err);
}

function getResults() {
    try {
        let idArray = excelUtils.getColumnValues(docName, sheetName, columnName);
        getMatches(url, pdfDestName, idArray).then(results => {
            if (results.length > 0) {
                excelUtils.writeExcel(excelUtils.writeRow(results, "Expediente", "Páginas"), config.outputExcelDocName);
                results.forEach(page => {
                    console.log(`KeyWord: ${page.keyWord} -- Page: ${page.pageNumber}`);
                })
            }
            else
                console.log("Not matches were found");

        }).catch(err => {
            throw err;
        })       
    }
    catch (err) {
        throw(err);
    }

}



/*
    LOCAL FUNCTIONS 
*/

/**Function to fin matcher given a pdf object
 * @param {string} pdfDestName - Pdf document name 
 * @param {string} keyWords - String array of word to be fetched in pdf document  
 * @return {Promise} String array with results
 */
async function getMatches(url,pdfDestName, keyWords) {
    try {
        let pdfObject = await pdfToObject(pdfDestName);
        return pagesToArray(pdfObject);
    }
    catch (err) {
        if (err.name == "MissingPDFException") {
            try {
                console.log("PDF not founded trying to download....");
                let downloadFileResult = await downloadFile(url,pdfDestName);
                console.log(downloadFileResult);
                return getMatches(url,pdfDestName, keyWords);                
            }
            catch (err) {
                throw new Error(`Error finding matches, details: ${err}`);
            }
        }
        else { throw new Error(`Error finding matches, details: ${err}`); }
    }
    function pagesToArray(pages) {
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
        return results;
    }
}



