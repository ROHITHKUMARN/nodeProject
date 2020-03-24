
var express=require('express');
var cors = require('cors');
var app=express();
var http = require('http');
var server = http.createServer(app);
var request = require('request');
var employeeRoutes = require('./routes/employee');
app.use('/', employeeRoutes);

const bodyParser = require('body-parser')
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())
app.use(cors());

var emp = '{"1": {"firstName": "Kiran", "lastName" : "Maddi", "role": "CEO", "hireDate": "2020-03-20"}, "2": {"firstName": "Maddi", "lastName": "Maddi", "role": "vp", "hireDate": "2020-03-19"}}';

var uniqueId = 1;
var obj = JSON.parse(emp);

var externalApis = {
  'quotesApi':  'https://ron-swanson-quotes.herokuapp.com/v2/quotes',
  'jokesApi': 'http://api.icndb.com/jokes/random/'
};

app.post('/api/employees', async function(req, res){
    var empId = generateRandomId();
    //validateData(req.body);
    obj[empId] = req.body;
    const joke = await getJoke(externalApis['jokesApi']);
    const quote= await getQuote(externalApis['quotesApi']); 
    obj[empId]['joke']=joke;
    obj[empId]['quote']=quote;
    res.send('Employee details are added successfully! Employee id is ' + empId+'.');
    res.end();
});


function getJoke(api){
let joke;
return new Promise( function (resolve, reject){
        request(api, function (error, response, body) {
            if (error) {
                return console.log('Error:', error);
            }
            if (!error && response.statusCode !== 200) {
                return console.log('Invalid Status Code Returned:', response.statusCode);
            }
            joke = JSON.parse(body).value.joke;
            console.log("*** GET JOKE ***")
            console.log(joke)
            console.log("*** END JOKE ***")
            resolve(joke)
      }).end();
}
)}

function getQuote(api){ 
  let quote;
  return new Promise( function(resolve, reject){
        request(api, function (error, response, body) {
          if (error) {
              return console.log('Error:', error);
          }
          if (response.statusCode !== 200) {
              return console.log('Invalid Status Code Returned:', response.statusCode);
          }
          quote = JSON.parse(body)[0];
          console.log("*** GET QUOTE ***")
          console.log(quote)
          console.log("*** END QUOTE ***")
          resolve(quote)
      }).end();  
}
)}

function generateRandomId(){
   while(uniqueId in obj) {
     uniqueId++;
   }
   return uniqueId.toString();
}

function validateData(body){
    if(!validateName(body.firstName)) {
      console.log(typeof body.firstName)
      throw "Firstname type is not valid.";
    };
    if(!validateName(body.lastName)) {
      throw "Lastname type is not valid.";
    };
    if(!validateHireDate(body.hireDate)) {
      throw "Hiredate is not in valid format or a future date."
    };
    if(!validateRole(body.role)) {
      throw "Role is not valid."
    };
}

function validateName(name){
    return typeof name === 'string';
}

function validateHireDate(date){
    var currentDate = new Date().toString().split("T")[0];
    var regEx = /^\d{4}-\d{1,2}-\d{1,2}$/;
    return date < currentDate && !(!(date.match(regEx)));
}

function validateRole(role){
      var roles = new Set(["ceo", "vp", "manager", "lackey"]);
      return roles.has(role.toLowerCase());
}

app.put('/api/employees/:id', function(req, res){
    var changeEmployeeDetails = req.params.id;
    if(changeEmployeeDetails in obj) {
      obj[changeEmployeeDetails] = req.body;
      res.send('Employee id ' +changeEmployeeDetails+  ' is updated successfully!');
    } else {
      res.send('Employee id ' + changeEmployeeDetails+  ' is not in the list to update!');
    }
    res.end();
});

app.get('/api/employees', function(req, res){
    res.json(obj);
    res.end();
});

app.get('/api/employees/:id', function(req, res){
    var requiredId = req.params.id;
    if(requiredId in obj) {
        res.json(obj[requiredId]);
    } else {
      res.send('Employee id ' + requiredId+  ' is not in the list!');
    }
    res.end();
});

app.delete('/api/employees/:id', function(req, res){
    var deleteEmpId = req.params.id;
    if(deleteEmpId in obj) {
       delete obj[deleteEmpId];
       res.send('Employee id ' +deleteEmpId+ ' is deleted successfully!');
    } else {
       res.send('Employee id ' + deleteEmpId+  ' is not in the list!');
    }
  res.end();

});

server.listen(3000, '127.0.0.1', function() {
    console.log('Listening to port:  ' + 3000);
});
