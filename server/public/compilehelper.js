
  $(document).ready(function() {

     $('#uploadForm').submit(function() {
        //$("#status").empty().text("File is uploading...");
        $(this).ajaxSubmit({

            error: function(xhr) {
        status('Error: ' + xhr.status);
            },

            success: function(response) {
        $("#consolediv").append(response);
                console.log(response+"trtrt");
            }
    });
        //Very important line, it disable the page refresh.
    return false;
    });    
});

