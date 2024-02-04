const fs = require('fs');
// const inputFilePath = __dirname + 'src/';
// const outputFilePath = __dirname + 'src\assets\Jsons\citiesBefor.json';

// Read the JSON file
fs.readFile('./src/assets/Jsons/citiesBefor.json', 'utf8', (err, data) => {
   if (err) {
     console.error('Error reading JSON file:', err);
     return;
   }

   try {
     const jsonData = JSON.parse(data);

     // Define the keys to delete
     const keysToDelete = ["סמל_ישוב","סמל_נפה","שם_נפה","סמל_לשכת_מנא","לשכה","סמל_מועצה_איזורית","שם_מועצה"];


   // Iterate through each object and modify keys
   for (const obj of jsonData.cities) {
    // Delete specified keys
    for (const key of keysToDelete) {
        delete obj[key];
    }
}

// Write the modified data to the output file
fs.writeFile('./src/assets/Jsons/cities.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
    if (err) {
        console.error('Error writing modified JSON file:', err);
    } else {
        console.log('JSON file modified and saved successfully.');
    }
});
} catch (parseError) {
console.error('Error parsing JSON:', parseError);
}
});