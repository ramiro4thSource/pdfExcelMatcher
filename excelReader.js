if (typeof require !== 'undefined') XLSX = require('xlsx');



/* Get worksheet */
function getColumnValues(documentName,sheetName,columnName) {
var workbook = XLSX.readFile(documentName);
let worksheet = workbook.Sheets[sheetName];
let wordsArray = [];
    for (var cells in worksheet) {
        if (cells.includes(columnName)) {
            if (worksheet[cells].v !== worksheet[worksheet["!ref"].split(":")[0]].v.trim()) {
                wordsArray.push(worksheet[cells].v.trim());
            }
        }
    }
    return wordsArray;
}

function writeExcel(object){
    
}

var array2=["example1","example2","example3","example4"];
function writeRow(row,content){

}

module.exports={getColumnValues};
