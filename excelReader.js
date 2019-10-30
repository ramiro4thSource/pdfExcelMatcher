if (typeof require !== 'undefined') XLSX = require('xlsx');




/**
 * Function to create a new excel file.
 * @param {Array[Array]} table - Table (Bidimensional arrray)  
 * @param {*} documentName -  Name of the output document
 */
function writeExcel(table, documentName) {
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(table);

    /* Add the worksheet to the workbook */
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");

    /* output format determined by filename */
    try {
        XLSX.writeFile(wb, documentName);
    }
    catch (exc) {
        throw new Error(`There was an error writing document ${exc}`);
    }
}


/**
 * Function to 
 * @param {string} documentName - Name of the xlsx document. Extension should be added 
 * @param {string} sheetName - Sheet name 
 * @param {string} columnName - Column Value, i.e. "A".
 * @returns {Array} String array .
 */
function getColumnValues(documentName, sheetName, columnName) {
    try {
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
    } catch (error) {
        throw(error);
    }

}




/**
 * Function to read an object and parse it to bidimensional array.
 * @param {Object} object -  
 * @param {Array} headers - String Array with table headers
 * @returns Bidimensional array
 */
function writeRow(object, ...headers) {
    var table = [];
    if (headers.length > 0) table.push(headers);
    for (var key in object) {
        var rows = [];
        if (object.hasOwnProperty(key)) {
            var obj = object[key];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    rows.push(obj[prop]);
                }

            }

        }
        else {
            throw new Error(`${key} not found in object`);
        }

        table.push(rows);
    }
    return table;

}

module.exports = { getColumnValues, writeRow, writeExcel };
