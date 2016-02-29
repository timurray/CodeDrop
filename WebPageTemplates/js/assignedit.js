var x=2;

function addtest()
{
   var id = document.getElementById("tests");
   
   var st1="testinput";
   var st2="testoutput";
   var st3="testcode";
   var st4="testruns";

   //Makes table
   var table=document.createElement("table");
   table.id=x;

   //Makes rows
   var row1=document.createElement("tr");
   var row2=document.createElement("tr");
   var row3=document.createElement("tr");
   var row4=document.createElement("tr");

   //Makes columns
   var col11=document.createElement("td");
   var col12=document.createElement("td");
   var col21=document.createElement("td");
   var col22=document.createElement("td");
   var col31=document.createElement("td");
   var col32=document.createElement("td");
   var col41=document.createElement("td");
   var col42=document.createElement("td");

   //makes input boxes
   var inputin = document.createElement("input");
   inputin.type="text";
   inputin.className="singlelineinput";
   inputin.name=st1.concat(x);
   col12.appendChild(inputin);
   var inputout = document.createElement("input");
   inputout.type="text";
   inputout.className="singlelineinput";
   inputout.name=st2.concat(x);
   col22.appendChild(inputout);
   var inputcode = document.createElement("input");
   inputcode.type="text";
   inputcode.className="singlelineinput";
   inputcode.name=st3.concat(x);
   col32.appendChild(inputcode);
   var inputruns = document.createElement("input");
   inputruns.type="text";
   inputruns.className="singlelineinput";
   inputruns.name=st4.concat(x);
   col42.appendChild(inputruns);

   //Adds text to labels   
   var str = document.createTextNode("Input:");
   col11.appendChild(str);
   str = document.createTextNode("Output:");
   col21.appendChild(str);
   str = document.createTextNode("Code:");
   col31.appendChild(str);
   str = document.createTextNode("Runs:");
   col41.appendChild(str);


   //adds columns to rows
   row1.appendChild(col11);
   row1.appendChild(col12);
   row2.appendChild(col21);
   row2.appendChild(col22);
   row3.appendChild(col31);
   row3.appendChild(col32);
   row4.appendChild(col41);
   row4.appendChild(col42);
   
   //adds row to table
   table.appendChild(row1);
   table.appendChild(row2);
   table.appendChild(row3);
   table.appendChild(row4);

   //adds table to dom
   var testname = document.createElement("span");
   var tname = document.createTextNode("Test :");
   testname.appendChild(tname);
   var remove = document.createElement("button");
   var rmtext = document.createTextNode("(X)");
   remove.appendChild(rmtext);
   remove.className="remove";
   remove.id=x;

   remove.onclick=function(){id.removeChild(table);id.removeChild(testname);id.removeChild(remove);};


   
   id.appendChild(testname);
   id.appendChild(remove);
   id.appendChild(table);
   x++;   
}

//function removeTest(var child)
//{
//   child.parentNode.removeChild(child);
//}
