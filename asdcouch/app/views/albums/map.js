function(doc) {
  //if (doc._id.substr(0,3) === "cd:" || doc._id.substr(0,4) === "mp3:") {
    emit(doc._id, {
    	"key": doc._id,
    	"rev": doc._rev,
    	"artist": doc.artist,
    	"album": doc.album,
    	"format": doc.format,
    	"date": doc.date,
    	"notes": doc.notes
    });
 // }
};