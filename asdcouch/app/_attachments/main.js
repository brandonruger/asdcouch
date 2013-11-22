/* Brandon Ruger
 * ASD 1311
 * Project 4 Couch App */

$('#home').on('pageinit', function(){
    //code needed for home page goes here
});

$(document).on('pageinit', '#addalbum', function(){
	
	var myForm = $('#addalbumform');
		    myForm.validate({
			invalidHandler: function(form, validator) {
                            errorMsgs.click();
                            var newHtml = '';
                            for (var key in validator.submitted) {
                                var label = $('label[for^="' + key + '"]').not('[generated]');
                                var legend = label.closest('fieldset').find('.ui-controlgroup-label');
                                var fieldName = legend.length ? legend.text() : label.text();
                                newHtml +='<li>' + fieldName +'</li>';
                            };
                            $("#errorMessages ul").html(newHtml)
			},
			submitHandler: function() {
		var data = myForm.serializeArray();
			saveData(data);
		}
	});

	//Function to pull data from app in order to view object in the console.
	
	$('#displaycouchdata').on("click", function(e) {
		e.preventDefault();
		$('#addalbumform').css("display", "none");
		$.couch.db("asdmusicapp").view("app/albums",{
			success: function(data){
				//This will loop through all the data in my json object.
				//data.rows is because rows is the first section within the data that I need to loop through.
				$.each(data.rows, function(index, value){
					//var keyId = $(this).data('key');
					//var rev = $(this).data('rev');
					var keyId = value.value.key;
					var rev = value.value.rev;
					var artist = value.value.artist;
					var album = value.value.album;
					var format = value.value.format;
					var date = value.value.date;
					var notes = value.value.notes;
					//Assign key and rev #'s to document.
					//var keyId = $(this).data('key');
					console.log(keyId);
					//var rev = $(this).data('rev');
					console.log(rev);
					$('#listofcouchdata').append(
						 $('<li>').text(artist)
						 .append($('<li>').text(album))
						 .append($('<li>').text(format))
						 .append($('<li>').text(date))
						 .append($('<li>').text(notes))
						 //Create Edit & Delete Links for each item
						 .append('<li><a href="#" class="editlink" data-key=' + keyId + ' data-rev=' + rev + '>Edit Album</a></li>')
						 .append('<li><a href="#" class="deletelink" data-key=' + keyId + ' data-rev=' + rev + '>Delete Album</a></li>')
						 );
					
			       })
				
				
		       
				$('#listofcouchdata').listview('refresh');
		       
				//What to do when delete links are clicked:
				$('.deletelink').on("click", function(e){
					e.preventDefault();
					console.log("attempting to run delete link function");
			 
					//Assign key and rev #'s to document.
					//var keyId = $(this).data('key');
					//var rev = $(this).data('rev');
					// 
					var myDoc = {};
					myDoc._id = $(this).data('key');
					myDoc._rev = $(this).data('rev');
					//
					console.log(myDoc);
					//console.log(keyId);
					//console.log(rev);
					//	 
					$.couch.db('asdmusicapp').removeDoc(myDoc, {
					success: function(data) {
						console.log('Data has been deleted.');
						},
					error: function(status) {console.log('Data did not delete correctly, please fix error.');}
					});
											 
				})
				
				//What to do when edit links are clicked:
				$('.editlink').on("click", function (e){
					e.preventDefault();
					console.log("attempting to run edit function");
					$('#addalbumform').css("display", "block");
					$('#listofcouchdata').css("display", "none");
					
					var myDoc = {};
					myDoc._id = $(this).data('key');
					myDoc._rev = $(this).data('rev');
					console.log(myDoc);
					
					
					
					
					$.couch.db('asdmusicapp').openDoc(myDoc._id,{
						success: function(data) {
							console.log('Data can be edited');
							//console.log(docId);
							console.log(data.artist);
							$('#key').val(myDoc._id);
							$('#rev').val(myDoc._rev);
							$('#artist').val(data.artist[1]);
							$('#album').val(data.album[1]);
							$('#format').val(data.format[1]);
							$('#date').val(data.date[1]);
							$('#notes').val(data.notes[1]);
							
						},
						error: function(status) {
							console.log ('Error trying to edit data. Need to fix');
						}
					});
					
					
		
				})
		    },
		    error: function(error, parseerror){
			console.log(error, parseerror)
		    },
		    
		    
		    
		    
		}
		
		
		
		);
	});
	
	//What to do when save button is clicked:
	var saveData = function(){
		$('#saveAlbumButton').on("click", function(e){
			e.preventDefault();
			//
			//If there is no key/rev, this means this is a brand new item and we need a new key/rev.
			
			if ($('#key').val() == '') {
				var keyId = Math.floor(Math.random()*100000001);
				console.log(keyId);
			}else{
				//Set the id to the existing key we're editing, so it will save over the data.
				var keyId = $(this).data('key');
				console.log(keyId);
			};
			
			
		
			
			
			
			//Gather up all our form field values and store in an object.
			//Object properties contain array with the form label and input value.
			
			//itemList._id	= $(this).data('key');
			//itemList._rev 	= $(this).data('rev');
			var itemList = {};
			itemList._id 	= keyId;
			itemList.artist = ["Artist's Name:",  $("#artist").val()];
			itemList.album  = ["Album Title:", $("#album").val()];
			itemList.format = ["Music Format:", $("#format").val()];
			itemList.date   = ["Release Date:", $("#date").val()];
			itemList.notes  = ["Notes:", $("#notes").val()];
			    
			    
			//Save Data Into Couch
			$.couch.db('asdmusicapp').saveDoc(itemList, {
				success: function() {
				console.log("Data has been saved correctly.")
				},
				error: function() {console.log("Data did not save, need to fix error!")}
			    });
			
		})
	}
	
	
	
});