const express = require('express');
const app = express();
const port = 9494;
const bodyParser = require("body-parser");
//used for storing css and js file
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false})); 
app.use(express.urlencoded());



let multichain = require('multichain-node')({
    port :2766, 
    host :"127.0.0.1",
    user :"multichainrpc",
    pass :"9AcaQdVPSXZ1b5vFf4raHmzTET5bXTsFHiE9qgN4x8JT"
});

var central = "19QVT9g4mjEUYvkEiJRvEGepQ5rdCrwHN33ewB"; // Central  
var gujarat = "15KEZNNwM2it9m5x1goVim4HH64bMu4WSBQ38R"; // State
//var orissa = "";
//var telangana = "";
var gShop ="1GPNcYYmuv4iPBmGbfHza9RH3HAvo8R87695y2"; // Fair Shop
//var oShop = "";
//var tShop = "";
var gConsumer = "1aTtFL7Z12uLZTQfU3ruKNfbSpD8rEWeWFgprU"; // Consumer
//var oConsumer = "";
//var tConsumer = "";

var sugerWallet = "";
var wheatWallet = "";
var riceWallet = ""


app.get('/getInfo', function(req, resp){
    multichain.getInfo((err, info) =>{
        console.log("inside multichain function......");
        if(err) throw err;
        console.log(info);
        //resp.send(info);
        resp.send(info.chainname+"----"+info.nodeaddress)
    });
});
app.get('/adds', function(req, resp){
    multichain.getAddresses((err, addresses)=>{
        console.log(addresses);
        resp.send(addresses);
    });
});
app.get('/txid', function(req, resp){
    multichain.getRawTransaction({txid:"874b8985498f9ff1290d1b970094e8815b194ddceac6f335fad90bb0739a227c"},(err, tx) => {
        multichain.decodeRawTransaction({"hexstring":tx},(err, dTx) => {
            console.log("tx function.....");
            console.log(dTx);
            resp.send(dTx);
        });
    });
});
app.get('/create', function(req, resp){
    multichain.issue({address:"1C7qR8KPTURxXXNTKeq8TH9DdeymCTEXvtchQf",asset:"Pen",qty:100000, units:0.01, details:{message:"Pen to issued"}},(err, rval)=>{
        console.log("Sugar issued....");
        console.log(rval);
        resp.send(rval);
    });
});

app.post('/send', function(req, resp){
    var state = req.body.statename;
    var statename = state.toLowerCase();
    var assetqty = parseInt(req.body.assetqty);
    var assetname = req.body.assetname;
    if(statename == "gujarat"){
        statename = gujarat;
    }
    //console.log(statename1);
     multichain.sendAssetFrom({from: central,to:statename,asset:assetname,qty:assetqty}, (err, tx) => {
         console.log(tx);
         //resp.send(tx);
         resp.render('centralsuccess', {assetqty: assetqty,txid: tx});
     });
    console.log("getting data....");
   
    //console.log(statename1);
    //var statename = Document.getElementById("statename");
    console.log(statename);
    console.log(assetqty);
});
app.get('/statedash', function(req, resp){
    multichain.getAddressBalances({address: gujarat},(err,info) => {
        console.log("hi",info[0].name);
      
            if(info[0].name == "Sugar"){
                sugerWallet = info[0].name + " " + info[0].qty;
            }
            else if(info[1].name == "rice"){
                riceWallet = info[1].name + " " + info[1].qty;
            }
            else if(info[2].name == "wheat"){
                wheatWallet = info[2].name + " " + info[2].qty;
            }
       
       
        resp.render('statedash',{sugar:sugerWallet,rice:riceWallet,wheat:wheatWallet});
        });
    });

   


app.get('/dash', function(req, resp){
    multichain.getAddressBalances({
       
       address: central
    }, (err,info) => {
        console.log(info);
        //resp.send(info);

        
        //var bal = info;
        //console.log(bal.length);
         //resp.json(info[0].name + "----"+info[0].qty +"------"+info[0].assetref);
         //resp.json(info[1].name + "----"+info[1].qty +"------"+info[1].assetref);
        // resp.json(info[2].name + "----"+info[2].qty +"------"+info[2].assetref);
        for(var i = 0; i < 5; i++){
            if(info[i].name == "Sugar"){
                sugerWallet = info[i].name + " " + info[i].qty;
            }
            else if(info[i].name == "rice"){
                riceWallet = info[i].name + " " + info[i].qty;
            }
            else if(info[i].name == "wheat"){
                wheatWallet = info[i].name + " " + info[i].qty;
            }
        }
          //sugerWallet = info[4].name +" "+ info[4].qty;
          //wheatWallet = info[3].name +" "+ info[3].qty;
          //riceWallet = info[2].name +" "+ info[2].qty;
        resp.render('centralDashboard',{sugar:sugerWallet,rice:riceWallet,wheat:wheatWallet});
        //resp.render('centralDashboard');
        //  console.log(sugerWallet);
        //  console.log(riceWallet);
        //  console.log(wheatWallet);
    });
});

app.get('/csuccess', function(req, resp){
    multichain.getTotalBalances({
        "minconf":1,
        "includeWatchOnly":false,
        "includeLocked":false
    }, (err,info) => {
        console.log(info);
        //console.log("Sachin...............");
          //sugerWallet = info[4].name +" "+ info[4].qty;
          //wheatWallet = info[3].name +" "+ info[3].qty;
          //riceWallet = info[2].name +" "+ info[2].qty;
        resp.render('centralsuccess',{});
    
    });
});

app.get('/csend', function(req, resp){
    multichain.getTotalBalances({
        "minconf":1,
        "includeWatchOnly":false,
        "includeLocked":false
    }, (err,info) => {
        console.log(info);
        for(var i = 0; i < 5; i++){
            if(info[i].name == "Sugar"){
                sugerWallet = info[i].name + " " + info[i].qty;
            }
            else if(info[i].name == "rice"){
                riceWallet = info[i].name + " " + info[i].qty;
            }
            else if(info[i].name == "wheat"){
                wheatWallet = info[i].name + " " + info[i].qty;
            }
        }
          //sugerWallet = info[4].name +" "+ info[4].qty;
          //wheatWallet = info[3].name +" "+ info[3].qty;
          //riceWallet = info[2].name +" "+ info[2].qty;
        resp.render('centralsendasset',{sugar:sugerWallet,rice:riceWallet,wheat:wheatWallet});
    
    });
    
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
 });
//app.get('/dash', function(req, resp){
    //resp.render('centralDashboard',{user:"Sachin The God.....",title:"Engineer"});
//});
app.get('/csend', function(req, resp){
    resp.render('centralsendasset');
});
app.get('/csuccess', function(req, resp){
    resp.render('centralsuccess');
});

app.get('/sendstate', function(req, resp){
    resp.render('sendstate');
});
app.get('/statesuccess', function(req, resp){
    resp.render('statesuccess');
});

app.listen(port, function(err){
    if(err) throw err;

    console.log("Port is running on : 9494");
});