//This will make a temp directory upload the java code compile it it run it the erase it
var express = require("express");
var bodyParser = require('body-parser');
var r = express.Router();
var fs= require("fs");
var multer = require("multer");
var app = express();
var spawn = require("child_process").spawn;
var exec = require("child_process").exec;
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

//Storage makes a temp working directory
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storeat)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    filename = file.originalname.split('.')[0];
  }
});
var up = multer({ storage: storage });

//Compiles and runs code
r.post('/',mkdir,function(req,res){
   //res.send(req.body);
   var stoutput="";
   var sterr="";
   var joutput="";
   var jerr="";
   //Gets filename without ext aka xXx.java->xXx
   var filename=req.body.file.split('.')[0];
   //String to denote compiler java c++ python 
   var compiletype=req.body.compiler;
   fs.writeFile(storeat+'/'+req.body.file,req.body.contents,function(err){
      if(err)
      {
         return console.error(err);
      }
      console.log("file made");
   });
   if(compiletype === "c++")
   {
      res.send("Not implemented");
   }
   if(compiletype === "java")
   {
      var javac = spawn('javac',[storeat+'/'+filename+'.java']);   
      javac.stdout.on('data', function(data){
         console.log('stdout: data'+ data);
         stoutput +=data;
      });
      javac.stderr.on('data',function(data){
         console.log('stderr: data '+data);
         sterr =+data;
      });
      javac.on('close',function(code){
         console.log('Exited on code '+code);
         var java = spawn('java',['-cp',storeat,filename]);
         java.stdout.on('data',function(data){
            console.log('output\n'+data);
            joutput +=data;
         });
         java.stderr.on('data',function(data){
            console.log('error'+data);
            jerr +=data;
         });
         java.on('close',function(code){
            jsonout = 
            {
               comout:stoutput,
               comerr:sterr,
               runout:joutput,
               runerr:jerr
            }
            console.log(jsonout);
            
         res.send("Compiler Error:\n"+jsonout.comerr+"\nCompiler Output:\n"+jsonout.comout+"\nRuntime error:\n"+jsonout.runerr+"\nRuntime Output:\n"+jsonout.runout);
      spawn('rm',['-rf','public/temp']);
         });
      });
   }
   if(compiletype === "python")
   {
      var python = spawn('python',[storeat+'/'+filename+'.py']);
      python.stderr.on('data',function(data){
         console.log('data '+data);
         jerr+=data;
      });
      python.stdout.on('data',function(data){
         console.log('data '+data);
         joutput+=data;
      });
      python.on('close',function(code){
         res.send('Errors:\n'+jerr+"\nOutput:\n"+joutput);
         spawn('rm',['-rf','public/temp']);
      });
   }
   
});

//Exports the routes
module.exports= 
{
   route:r,
};
