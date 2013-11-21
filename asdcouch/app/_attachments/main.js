/* Brandon Ruger
 * ASD 1311
 * Project 4 Couch App */

$('#home').on('pageinit', function(){
    //code needed for home page goes here
});

$(document).on('pageinit', '#addalbum', function(){

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
					
					var docId = $(this).data('key');
					
					
					
					
					$.couch.db('asdmusicapp').openDoc(docId,{
						success: function(data) {
							console.log('Data can be edited');
							//console.log(docId);
							console.log(data.artist);
							$('#key').val(data._id[1]);
							$('#rev').val(data._rev[1]);
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
	$('#saveAlbumButton').on("click", function(e){
		e.preventDefault();
		
		////If there is no key, this means this is a brand new item and we need a new key.
		//if ($('key').val() == '' || $('rev').val() == '') {
		//    var randomNum = Math.floor(Math.random()*100000001);
		//    
		//    var generateId = "cd:" + randomNum;
		//    var rev = "1-" + randomNum;
		//    console.log(generateId);
		//    console.log(rev);
		//    
		//}else{
		//    //Set the id to the existing key we're editing, so it will save over the data.
		//    var generateId = $('key').val();
		//    var rev = $('rev').val();
		//    
		//    itemList._id = generateId;
		//    itemList._rev = rev;
		//    
		//    console.log(generateId);
		//    console.log(rev);
		//};
		
		//Gather up all our form field values and store in an object.
		//Object properties contain array with the form label and input value.
		var itemList = {};
		//itemList._id	= $(this).data('key');
		//itemList._rev 	= $(this).data('rev');
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
	
	//code needed for add album page goes here
    
    //Create function to submit data.
    //function submitData(key) {
        
        
        
            
       
    //}
    
    //	function getDataFromLocalStorage() {
    //    $('#addalbumform').css("display", "none");
    //    if (localStorage.length === 0) {
    //        alert("There is no data in Local Storage so default data was added.");
    //        getLsData();
    //    }
    //    
    //    //jQuery code to write data from local storage to the browser
    //    $('<div id="items"><ul></ul></div>').appendTo("#listoflsdata").css("display", "block");
    //    for (var i=0; i<localStorage.length; i++){
    //        var newListItem = $('<li></li>').appendTo("#items > ul");
    //        var key = localStorage.key(i);
    //        var dataValue = localStorage.getItem(key);
    //        //Convert string from local storage back to an object.
    //        var findObject = JSON.parse(dataValue);
    //        var subList = $('<ul></ul>').appendTo(newListItem);
    //        for (var n in findObject) {
    //            var makeNewSubList = $('<li></li>').appendTo(subList)
    //            var subText = findObject[n][0]+ " " +findObject[n][1];
    //            makeNewSubList.html(subText);
    //        }
    //        createEditDelLinks(localStorage.key(i), newListItem); //Create our edit and delete links for each item in local storage.
    //
    //    }
    //}
	
//     //Dynamically create Edit & Delete Links
//    	function createEditDelLinks(key, newListItem) {
//	        var editLink = $('<ul><li><a href="#">Edit Item</a></li></ul>').appendTo("#listoflsdata").on("click", editReminder);
//	        editLink.key = key;
//	        $(editLink).append(newListItem);
//	        console.log(editLink.key);
//	        
//	        //add line break
//	        var breakTag = $('br').appendTo("#addalbumform");
//	        
//	        //add delete single item link
//	        var deleteLink = $('<ul><li><a href="#">Delete Item</a></li></ul>').appendTo("#listoflsdata").on("click", deleteReminder);
//	        deleteLink.key = key;
//	        $(deleteLink).append(newListItem);
//	                
//    	}
    //
    //
    // //Auto populate Local Storage with data
    //function getLsData() {
    //    //Store JSON Object into Local Storage.
    //    for (var n in localStorageData) {
    //        var id = Math.floor(Math.random()*10000001);
    //        localStorage.setItem(id, JSON.stringify(localStorageData[n]));
    //    }
    //}
    
    //function editReminder() {
    //
    //	//Grab the data from our item from Local Storage.
    //    var lsData = localStorage.getItem(this.key);
    //    console.log(lsData);
    //    var itemList = JSON.parse(lsData);
    //    console.log(itemList);
    //	
    //	$('#addalbumform').css("display", "block");	//To make form display again.
    //    $('#listoflsdata').css("display", "none");	//To hide local storage data.
    //
    //   
    //    //Populate form fields with current localStorage values.
    //    $("#artist").val(itemList.artist[1]);
    //    $("#album").val(itemList.album[1]);
    //    $("#format").val(itemList.format[1]);                
    //    $("#date").val(itemList.date[1]);
    //    $("#notes").val(itemList.notes[1]);
    //    
    //    //Remove the initial listener from the imput 'create reminder' button.
    //    //createButton.off("click", validateInput);
    //    //Change Submit button value to Edit button
    //    $("#saveAlbumButton").val("Update Album");
    //    var changeButton = $("#saveAlbumButton");
    //    
    //    //Save the key value established in this function as a property of the editSubmit event.
    //    //So that we can use that value when we save the data we edited.
    //    changeButton.on("click", submitData);
    //    changeButton.key = this.key;
    //    
    //}
    //
    //function deleteReminder() {
    //    var askUser = confirm("Are you sure you want to delete this reminder?");
    //    if (askUser) {
    //        localStorage.removeItem(this.key);
    //        console.log(this.key);
    //        alert("Reminder was deleted!");
    //        window.location.reload();
    //    }else{
    //        alert("Reminder was NOT deleted.")
    //    }
    //}
    //
    //function clearLocalStorage() {
    //    if (localStorage.length === 0) {
    //        alert("Reminder list is already empty.")
    //    } else {
    //        localStorage.clear();
    //        alert("All Reminders have been deleted!");
    //        window.location.reload();
    //        return false;
    //    }
    //}
    

    
    
    //var lsData = $("#displaylsdata");
    //lsData.on("click", getDataFromLocalStorage);
    //var clearData = $("#clearlsdata");
    //clearData.on("click", clearLocalStorage);
    //var editLsData = $("#editData");
    //editLsData.on("click", editReminder);
    
    //Set Link & Submit Click Events
    
    //var saveData = $("#saveAlbumButton");
    //saveData.on("click", submitData);

	//Global Variables
	
	
        
});