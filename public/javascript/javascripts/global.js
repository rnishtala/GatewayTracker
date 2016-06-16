
// Userlist data array for filiing in info box
var userListData = [];

// DOM Ready ================================================
$(document).ready(function() {
    //Populate the user table on initial page load
    console.log('Before populate');
    populateTable();
    console.log(userListData);
    $('#userList table tbody').on('click', 'td a.linksshowuser', showUserInfo);
});

// Functions ================================================

// Fill table with data
function populateTable() {

    //Empty content string
    var tableContent = '';

    //jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {

        userListData = data;
        //For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linksshowuser" rel="' + this.username +'">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>'
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
          });

          // Inject the whole content string into out existing HTML table
          $('#userList table tbody').html(tableContent);
    });
};

  function showUserInfo(event) {
      //Prevent Link from Firing
      event.preventDefault();

      // Retrieve username from the link rel attribute
      var thisUserName = $(this).attr('rel');

      // Get Index of object based on id value
      var arrayPosition = userListData.map(function(arrayItem) {
        return arrayItem.username; }).indexOf(thisUserName);

      // Get our User Object
      var thisUserObject = userListData[arrayPosition];
      console.log(thisUserObject);

      //Populate Info Box
      $('#userInfoName').text(thisUserObject.fullname);
      $('#userInfoAge').text(thisUserObject.age);
      $('userInfoGender').text(thisUserObject.gender);
      $('#userInfoLocation').text(thisUserObject.location);
  };
