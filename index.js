//import getAllPages from './pdfPageParser';
var getAllPages = require('./pdfPageParser').getAllPages;

//let dataBuffer = fs.readFileSync("2019-10-16_1.pdf");
const pdfNameDocument = "2019-10-16_1.pdf";
const keyWords = ["1952/2019-D-7","850/2019-D-7","0454/2019"];

getAllPages(pdfNameDocument).then(pages => {
    const results = pages.filter(page => {
        for(var word in keyWords){
            if(page.text.includes(keyWords[word])){
                return page;
            }
        }                
    })
    results.forEach(page=>{
        console.log(page.pageNumber);
    })    
}, reason => {
    console.log(reason);
})


