const yaml = require('js-yaml');
const fs = require('fs');
const csvjson = require('csvjson');
var detect = require('detect-csv');

const gyml = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));

const csvtojson = (req, res) => {

    console.log(req.body)
    var options = {
        delimiter : '\t', // optional
        quote     : '"' // optional
    };
    var file_data = fs.readFileSync(req.body.ruta, { encoding : 'utf8'});
    var csv = detect(file_data);
    try{
    if(csv.delimiter != '|' && csv.delimiter != ',' && csv.delimiter != ';'){
        var result = csvjson.toObject(file_data, options);
        //console.log(result); //Converted json object from csv data
        let keys = "";       
        for(var key in result[0]){ keys = keys+key;}
        console.log(keys);
        if ("codigo" == keys.slice(0,6) && "origen" == keys.slice(6,12) && "evento" == keys.slice(12,18) && "hr_depart" == keys.slice(18,27)){
            console.log("genial");
            res.json({"status":"200","message":"Succefull", "payload":result})
        }else{
            res.json({"status":"500","message":"Error", "payload":'Error en los nombres de columnas (codigo - origen - evento - hr_depart)'})
        }
        
    } else {
        res.json({"status":"500","message":"Error", "payload":'CSV debe tener delimitador de tabulación'})
    }
}catch(err){
    console.log(err);
    res.json({"status":"500","message":"Error", "payload":'CSV debe tener delimitador de tabulación'})
}
  

}

module.exports = { csvtojson }
