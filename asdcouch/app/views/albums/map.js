function(doc) {
  if (doc._id.substr(0,3) === "cd:") {
    emit(doc._id, {
    	"artist": doc.artist,
    	"album": doc.album,
    	"format": doc.format,
    	"date": doc.date,
    	"notes": doc.notes
    });
  }
};