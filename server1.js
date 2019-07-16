const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 9898;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.get('/test', function(req, resp){
    resp.render('hello',{user: "Great User Sachine"});
});
app.post('/csend', function(req, resp){
    resp.render('centralsendasset');
});

app.listen(port, function(err){
    if(err) throw err;

    console.log("Port is running on : 9898");
});

