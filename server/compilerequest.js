//This will make a temp directory upload the java code compile it it run it the erase it
var express = require("express");
var r = express.Router();
var fs= require("fs");
var multer = require("multer");
var app = express();
var spawn = require("child_process").spawn;
var filename;
var jsonout;
//Not implemented yet will be used to separate users
//var username ='username';
//Makes a directory for the class add username after
var storeat = './public/temp';
//Function to make a temporary directory
var mkdir = function(req,res,next)
{
   var md = spawn('mkdir',[storeat]);
   md.on('close',function(code)
   {
      next();
   });
};

//Storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storeat)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    filename = file.originalname.split('.java')[0];
  }
});
var up = multer({ storage: storage });

//Compiles
r.post('/',mkdir,up.any(),function(req,res){
   var stoutput="";
   var sterr="";
   var joutput="";
   var jerr="";
   var javac = spawn('javac',[storeat+'/'+filename+'.java']);
   
   
   javac.stdout.on('data', function(data){
      console.log('stdout: data'+ data);
      stoutput ='stdout: data'+data; 
   });
   javac.stderr.on('data',function(data){
      console.log('stderr: data '+data);
      sterr = 'stderr: data'+data;
   });
   javac.on('close',function(code){
      console.log('Exited on code '+code);
      var java = spawn('java',['-cp',storeat,filename]);
      java.stdout.on('data',function(data){
         console.log('output\n'+data);
         joutput ='Output:'+data;
      });
      java.stderr.on('data',function(data){
         console.log('error'+data);
         jerr = 'Errors:'+data;
       });
      java.on('close',function(code){
         jsonout = 
         {
            comout:stoutput,
            comerr:sterr,
            runout:joutput,
            runerr:jerr
         }
         res.send(JSON.stringify(jsonout));
      //spawn('rm',['-rf','public/temp']);
         });
   });  
});

module.exports= 
{
route:r,
compiler:function()
{
   var stoutput="";
   var sterr="";
   var joutput="";
   var jerr="";
   var javac = spawn('javac',[storeat+'/'+filename+'.java']);
   
   
   javac.stdout.on('data', function(data){
      console.log('stdout: data'+ data);
      stoutput ='stdout: data'+data; 
   });
   javac.stderr.on('data',function(data){
      console.log('stderr: data '+data);
      sterr = 'stderr: data'+data;
   });
   javac.on('close',function(code){
      console.log('Exited on code '+code);
      var java = spawn('java',['-cp',storeat,filename]);
      java.stdout.on('data',function(data){
         console.log('output\n'+data);
         joutput ='Output:'+data;
      });
      java.stderr.on('data',function(data){
         console.log('error'+data);
         jerr = 'Errors:'+data;
       });
      java.on('close',function(code){
         jsonout = 
         {
            comout:stoutput,
            comerr:sterr,
            runout:joutput,
            runerr:jerr
         }
         //res.send(JSON.stringify(jsonout));
      //spawn('rm',['-rf','public/temp']);
         });
   });
   return jsonout;
}
};
