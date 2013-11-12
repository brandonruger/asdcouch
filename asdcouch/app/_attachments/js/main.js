/* Brandon Ruger
 * ASD 1311
 * Project 3 Couch App */

$('#home').on('pageinit', function(){
    //code needed for home page goes here
});

$('#addalbum').on('pageinit', function(){
    
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
    
    //Set Link & Submit Click Events
    
    var saveData = $("#saveAlbumButton");
    saveData.on("click", submitData);

        
});

$('#jsonpage').on('pageinit', function(){
    //code needed for home page goes here
    
    //Retrieve JSON data from Ajax
    
    function getJsonDataFromAjax(){
        $("#jsoncontent").empty();
        $.ajax({
            url: 'xhr/data.json',
            type: 'GET',
            dataType: 'json',
            success: function(data, status){
                console.log(data, status)
                console.log(data);
                $(data).each(function(){
                    $(' '+
                        '<div class=albums">'+
                            '<ul>'+
                                '<li>'+ data.album.artist +'</li>'+
                                '<li>'+ data.album.album +'</li>'+
                                '<li>'+ data.album.format +'</li>'+
                                '<li>'+ data.album.date +'</li>'+
                                '<li>'+ data.album.notes +'</li>'+
                            '</ul>'+
                        '</div>'
                    ).appendTo('#jsoncontent');
                });
            },
            error: function(error, parseerror){
                console.log(error, parseerror)
            }
        })
    }
    
    
    var displayJsonData = $("#jsonbutton");
    displayJsonData.on("click", getJsonDataFromAjax);
    
});

$('#xmlpage').on('pageinit', function(){
    //code needed for home page goes here
    
    function getXmlDataFromAjax(){
        $("#xmlcontent").empty();
        $.ajax({
            url: 'xhr/data.xml',
            type: 'GET',
            dataType: 'xml',
            success: function(xml){
                var albums = $(xml);
                console.log("Artist's Name", albums.find("artist"));
                console.log(albums.find("artist").text());
                for (var i=0; i<5; i++) {
                
                    $(' '+
                        '<div class=albums">'+
                            '<ul>'+
                                '<li>'+ albums.find("artist").text() +'</li>'+
                                '<li>'+ albums.find("album").text() +'</li>'+
                                '<li>'+ albums.find("format").text() +'</li>'+
                                '<li>'+ albums.find("release").text() +'</li>'+
                                '<li>'+ albums.find("notes").text() +'</li>'+
                            '</ul>'+
                        '</div>'
                    ).appendTo('#xmlcontent');
                }
            },
        
            error: function(error, parseerror){
                console.log(error, parseerror);
            }
        })
    }

    var displayXmlData = $("#xmlbutton");
    displayXmlData.on("click", getXmlDataFromAjax);
});

$('#localstoragepage').on('pageinit', function(){
    //code needed for home page goes here
    
    function getDataFromLocalStorage() {
        if (localStorage.length === 0) {
            alert("There is no data in Local Storage so default data was added.");
            getLsData();
        }
        
        //jQuery code to write data from local storage to the browser
        $('<div id="items"><ul></ul></div>').appendTo("#lscontent").css("display", "block");
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
        var editLink = $('<ul><li><a href="#">Edit Item</a></li></ul>').appendTo("#lscontent").on("click", editReminder);
        editLink.key = key;
        $(editLink).append(newListItem);
        console.log(editLink.key);
        
        //add line break
        var breakTag = $('br').appendTo("#addAlbumForm");
        
        //add delete single item link
        var deleteLink = $('<ul><li><a href="#">Delete Item</a></li></ul>').appendTo("#lscontent").on("click", deleteReminder);
        deleteLink.key = key;
        $(deleteLink).append(newListItem);
        
        return key;
        
    }
    
    function editReminder() {
        console.log(this.key);
        //Grab the data from our item from Local Storage.
        var lsData = localStorage.getItem(this.key);
        console.log(lsData);
        var itemList = JSON.parse(lsData);
        console.log(itemList);

        
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
    
        //Auto populate Local Storage with data
    function getLsData() {
        //Store JSON Object into Local Storage.
        for (var n in localStorageData) {
            var id = Math.floor(Math.random()*10000001);
            localStorage.setItem(id, JSON.stringify(localStorageData[n]));
        }
    }
    
    
    var lsData = $("#lsbutton");
    lsData.on("click", getDataFromLocalStorage);
    var clearData = $("#clearData");
    clearData.on("click", clearLocalStorage);
    var editLsData = $("#editData");
    editLsData.on("click", editReminder);
});