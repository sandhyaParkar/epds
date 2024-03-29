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
    port :2646, 
    host :"127.0.0.1",
    user :"multichainrpc",
    pass :"9d8nDMUxp9RoF7ZEm1cH7BhNRnU9FcLYtoAphxbmiZa7"
});

var central = "1HT51bM3bnccY6dAwp2e4WAYPK23og3FQqAq7s"; // Central  
var gujarat = "1LNwf8Xd5vN1WAkDaukuUFv4sCLewwwwz2bog4"; // State
//var orissa = "";
// //var telangana = "";
var gShop ="1UjodjNqt2yRLiknMrYUMEdNpHtQn8G7nD9WT3"; // Fair Shop
// //var oShop = "";
// //var tShop = "";
var gConsumer = "1MYXrStKKKd3GbU3gXw2tyEjXbZTsxcJUG6C7j"; // Consumer
// //var oConsumer = "";
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
app.get('/createAsset', function(req, resp){
    console.log("request",req.body,central);
    multichain.issue({address:'1HT51bM3bnccY6dAwp2e4WAYPK23og3FQqAq7s',asset:"Sugar5",qty:100000, units:0.01, details:{message:"Sugar to issued"}},(err, rval)=>{
        console.log("Sugar issued....");
        console.log(rval);
        // resp.render('createasset', {rval});
        resp.render('createsuccess', {assetqty: "100000",txid: rval});

        // resp.send(rval);
    });
});
app.get('/create', function(req, resp){
    // console.log("request",req.body);
    // multichain.issue({address:central,asset:"Sugar",qty:100000, units:0.01, details:{message:"Sugar to issued"}},(err, rval)=>{
    //     console.log("Sugar issued....");
    //     console.log(rval);
        resp.render('createasset');
        // resp.send(rval);
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
        // for(var i = 0; i < 5; i++){
            if(info[0].name == "Sugar5" || info[1].name == "Rice" || info[2].name == "Wheat"){
                sugerWallet = info[0].name + " " + info[0].qty;
                riceWallet = info[3].name + " " + info[3].qty;
                wheatWallet = info[4].name + " " + info[4].qty;
                // sugerWallet = info[0].name + " " + "0";
                // riceWallet = info[1].name + " " + "0";
                // wheatWallet = info[2].name + " " + "0";
            }
            // else if(info[1].name == "rice"){
            //     riceWallet = info[1].name + " " + info[1].qty;
            // }
            // else if(info[2].name == "wheat"){
            //     wheatWallet = info[2].name + " " + info[2].qty;
            // }
        // }
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

app.get('/shopdash', function(req, resp){
    multichain.getAddressBalances({address: gShop},(err,info) => {
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
       
       
        resp.render('shopdash',{sugar:sugerWallet,rice:riceWallet,wheat:wheatWallet});
        });
    });

    app.get('/consumerdash', function(req, resp){
        multichain.getAddressBalances({address: gConsumer},(err,info) => {
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
           
           
            resp.render('consumerdash',{sugar:sugerWallet,rice:riceWallet,wheat:wheatWallet});
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
        // for(var i = 0; i < 5; i++){
            if(info[0].name == "Sugar5" || info[1].name == "Rice" || info[2].name == "Wheat"){
                sugerWallet = info[0].name + " " + info[0].qty;
                riceWallet = info[3].name + " " + info[3].qty;
                wheatWallet = info[4].name + " " + info[4].qty;
            }
            // else if(info[1].name == "Rice"){
                
            //     riceWallet = info[1].name + " " + info[1].qty;
            // }
            // else if(info[2].name == "Wheat"){
            //     wheatWallet = info[2].name + " " + info[2].qty;
            // }
        // }
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