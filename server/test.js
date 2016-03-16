var sqlite = require('sqlite3').verbose();

var db = new sqlite.Database("codedrop.db");
db.serialize(function() {
        db.each("SELECT * FROM courses", function(err, row) {
                console.log(row.name);//.id + ": " + row.cname);
        });
}); 
db.close();

