//Read is source form type file
//Write is instance of Code Mirror
function uploadfile(read)
{
   var file = document.getElementById(read).files;
   var reader = new FileReader();
   reader.onload = function(loadedEvent) 
   {
      // result contains loaded file.
      var data = loadedEvent.target.result;
      window.editor.setValue(data);
    }
   reader.readAsText(file[0]);
}
