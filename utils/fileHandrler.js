import fs from 'fs';

export function GetAllDataFromFile (dataPath, callback) {
    fs.readFile(dataPath, function (err, data){
        if(err){
            callback([]);
        }else {
            callback(JSON.parse(data));
        };
    }); 
};

export function saveDataInFile (dataPath, data) {
    fs.writeFile(dataPath, JSON.stringify(data, null, 2), function (err) {
        if (err) {
            console.error("Error saving data:", err);
        }
    });
};