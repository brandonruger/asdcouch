/* Brandon Ruger
 * ASD 1311
 * Project 3 Couch App */

$('#home').on('pageinit', function(){
    //code needed for home page goes here
});

$(document).on('pageinit', '#addalbum', function(){

	$.couch.db("asdmusicapp").view("plugin/albums",{
		success: function(data) {
			console.log(data);
			},
		error: function(data) {
		console.log(data);
		}
	});
	
	//code needed for add album page goes here
    
    //Create function to submit data.
    function submitData(key) {
        //If there is no key, this means this is a brand new item and we need a new key.
        if (!key) {
            var generateId = Math.floor(Math.random()*100000001);
        }else{
            //Set the id to the existing key we're editing, so it will save over the data.
            generateId = key;
        }
        
        //Gather up all our form field values and store in an object.
        //Object properties contain array with the form label and input value.
        var itemList           = {};
            itemList.artist    = $("#artist").val();
            itemList.album     = $("#album").val();
            itemList.format    = $("#format").val();
            itemList.date      = $("#date").val();
            itemList.notes     = $("#notes").val();
            
            //Save data into Local Storage
            localStorage.setItem(generateId, JSON.stringify(itemList));
            alert("Album has been added!");
            
       
    }
    
    	function getDataFromLocalStorage() {
        $('#addalbumform').css("display", "none");
        if (localStorage.length === 0) {
            alert("There is no data in Local Storage so default data was added.");
            getLsData();
        }
        
        //jQuery code to write data from local storage to the browser
        $('<div id="items"><ul></ul></div>').appendTo("#listoflsdata").css("display", "block");
        for (var i=0; i<localStorage.length; i++){
            var newListItem = $('<li></li>').appendTo("#items > ul");
            var key = localStorage.key(i);
            var dataValue = localStorage.getItem(key);
            //Convert string from local storage back to an object.
            var findObject = JSON.parse(dataValue);
            var subList = $('<ul></ul>').appendTo(newListItem);
            for (var n in findObject) {
                var makeNewSubList = $('<li></li>').appendTo(subList)
                var subText = findObject[n][0]+ " " +findObject[n][1];
                makeNewSubList.html(subText);
            }
            createEditDelLinks(localStorage.key(i), newListItem); //Create our edit and delete links for each item in local storage.
    
        }
    }
	
     //Dynamically create Edit & Delete Links
    	function createEditDelLinks(key, newListItem) {
	        var editLink = $('<ul><li><a href="#">Edit Item</a></li></ul>').appendTo("#listoflsdata").on("click", editReminder);
	        editLink.key = key;
	        $(editLink).append(newListItem);
	        console.log(editLink.key);
	        
	        //add line break
	        var breakTag = $('br').appendTo("#addalbumform");
	        
	        //add delete single item link
	        var deleteLink = $('<ul><li><a href="#">Delete Item</a></li></ul>').appendTo("#listoflsdata").on("click", deleteReminder);
	        deleteLink.key = key;
	        $(deleteLink).append(newListItem);
	                
    	}

    
     //Auto populate Local Storage with data
    function getLsData() {
        //Store JSON Object into Local Storage.
        for (var n in localStorageData) {
            var id = Math.floor(Math.random()*10000001);
            localStorage.setItem(id, JSON.stringify(localStorageData[n]));
        }
    }
    
    function editReminder() {
    
    	//Grab the data from our item from Local Storage.
        var lsData = localStorage.getItem(this.key);
        console.log(lsData);
        var itemList = JSON.parse(lsData);
        console.log(itemList);
    	
    	$('#addalbumform').css("display", "block");	//To make form display again.
        $('#listoflsdata').css("display", "none");	//To hide local storage data.

       
        //Populate form fields with current localStorage values.
        $("#artist").val(itemList.artist[1]);
        $("#album").val(itemList.album[1]);
        $("#format").val(itemList.format[1]);                
        $("#date").val(itemList.date[1]);
        $("#notes").val(itemList.notes[1]);
        
        //Remove the initial listener from the imput 'create reminder' button.
        //createButton.off("click", validateInput);
        //Change Submit button value to Edit button
        $("#saveAlbumButton").val("Update Album");
        var changeButton = $("#saveAlbumButton");
        
        //Save the key value established in this function as a property of the editSubmit event.
        //So that we can use that value when we save the data we edited.
        changeButton.on("click", submitData);
        changeButton.key = this.key;
        
    }
    
    function deleteReminder() {
        var askUser = confirm("Are you sure you want to delete this reminder?");
        if (askUser) {
            localStorage.removeItem(this.key);
            console.log(this.key);
            alert("Reminder was deleted!");
            window.location.reload();
        }else{
            alert("Reminder was NOT deleted.")
        }
    }
    
    function clearLocalStorage() {
        if (localStorage.length === 0) {
            alert("Reminder list is already empty.")
        } else {
            localStorage.clear();
            alert("All Reminders have been deleted!");
            window.location.reload();
            return false;
        }
    }
    

    
    
    var lsData = $("#displaylsdata");
    lsData.on("click", getDataFromLocalStorage);
    var clearData = $("#clearlsdata");
    clearData.on("click", clearLocalStorage);
    var editLsData = $("#editData");
    editLsData.on("click", editReminder);
    
    //Set Link & Submit Click Events
    
    var saveData = $("#saveAlbumButton");
    saveData.on("click", submitData);

        
});

$('#jsonpage').on('pageinit', function(){
    //code needed for home page goes here
    
    //Retrieve JSON data from Ajax
    
    function getJsonDataFromAjax(){
    	$('#jsonbutton').css("display", "none"); //This will hide JSON button when user clicks it, so only data shows.
        $.ajax({
            url: '_view/albums',
            type: 'GET',
            dataType: 'json',
            success: function(data){
			//This will loop through all the data in my json object.
			//data.rows is because rows is the first section within the data that I need to loop through.
               $.each(data.rows, function(index, value){
               console.log(value);
               var artist = value.value.artist;
               var album = value.value.album;
               var format = value.value.format;
               var date = value.value.date;
               var notes = value.value.notes;
               $('#jsonlist').append(
               		$('<li>').text(artist)
               		.append($('<li>').text(album))
               		.append($('<li>').text(format))
               		.append($('<li>').text(date))
               		.append($('<li>').text(notes))               		
               		);
               		
               })
               
               $('#jsonlist').listview('refresh');
            },
            error: function(error, parseerror){
                console.log(error, parseerror)
            }
        })
    }
    
    
    var displayJsonData = $("#jsonbutton");
    displayJsonData.on("click", getJsonDataFromAjax);
    
});