const csv = require('csv-parser');
const fs = require("fs");


function csvTOJSON(filePath) {
    return new Promise((resolve, reject) => {
      const lot = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          lot.push(data);
        })
        .on('end', () => {
          // Assuming the first row is the header
          console.log("-----lot is-----", lot);
          resolve(lot);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  module.exports = csvTOJSON;