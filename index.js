//import getAllPages from './pdfPageParser';
var pdfToObject = require('./pdfPageParser').pdfToObject;
var excelUtils = require('./excelReader');
var downloadFile = require('./downloadDoc').downloadFile;
var config = require('./config');
var path= require('path');

//Importing docName from config
var docName = config.inputExcelDocName;
const pdfNameDocument = path.join(__dirname,config.pdfDocName);

const sheetName = "Sheet1"
const columnName = "A"

getResults();
async function getResults() {
    try {
        let idArray = await excelUtils.getColumnValues(docName, sheetName, columnName);
        let results = await getMatches(pdfNameDocument, idArray);
        if (results.length > 0) {
            excelUtils.writeExcel(excelUtils.writeRow(results, "Expediente", "Páginas"), config.outputExcelDocName);
            results.forEach(page => {
                console.log(`KeyWord: ${page.keyWord} -- Page: ${page.pageNumber}`);
            })
        }
        else
            console.log("Not matches were found");
    }
    catch(err){
        throw err;
    }

}



/*
    LOCAL FUNCTIONS 
*/

/**Function to fin matcher given a pdf object
 * @param {string} pdfNameDocument - Pdf document name 
 * @param {string} keyWords - String array of word to be fetched in pdf document  
 * @return {Promise} String array with results
 */
async function getMatches(pdfNameDocument, keyWords) {
        try {
            let pdfObject = await pdfToObject(pdfNameDocument);
            return pagesToArray(pdfObject);
        }
        catch (err) {
            if (err.name == "MissingPDFException") {
                try {
                    console.log("PDF not founded trying to download....");
                    let downloadFileResult = await downloadFile(pdfNameDocument);                    
                    return getMatches(pdfNameDocument, keyWords);
                    console.log(downloadFileResult);
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



