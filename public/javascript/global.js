
// Userlist data array for filiing in info box
var gatewayListData = [];

// DOM Ready ================================================
$(document).ready(function() {
    //Populate the gateway table on initial page load
    populateTable();
    //GatewayName link click
    $('#gatewayList table tbody').on('click', 'td a.linkshowgateway', showGatewayInfo);
    $('#gatewayList table tbody').on('click', 'td a.linkdeletegateway', deleteGateway);
    $('#btnAddGateway').on('click', addGateway);
});

// Functions ================================================

// Fill table with data
function populateTable() {

    //Empty content string
    var tableContent = '';

    //jQuery AJAX call for JSON
    $.getJSON('/gateways/gatewaylist', function(data) {

        //Stick our user data array into a gatewaylist variable in the global object
        gatewayListData = data;
        //For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowgateway" rel="' + this.gatewayname +'">' + this.gatewayname + '</a></td>';
            tableContent += '<td>' + this.contact + '</td>'
            tableContent += '<td><a href="#" class="linkdeletegateway" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
          });

          // Inject the whole content string into out existing HTML table
          $('#gatewayList table tbody').html(tableContent);
    });
};

// Show User Info
function showGatewayInfo(event){

    //Prevent Link from firing
    event.preventDefault();

    //Retrieve username from link rel attribute
    var thisGatewayName = $(this).attr('rel');

    //Get Index of object based on id value
    var arrayPosition = gatewayListData.map(function(arrayItem) { return arrayItem.gatewayname; }).indexOf(thisGatewayName);

    //Get our Gateway object
    var thisGatewayObject = gatewayListData[arrayPosition];
    console.log(thisGatewayObject);

    //Populate Info Box
    $('#gatewayInfoName').text(thisGatewayObject.gatewayname);
    $('#serviceInfoType').text(thisGatewayObject.service);
    $('#freqInfoBand').text(thisGatewayObject.frequency);
    $('#gatewayInfoLocation').text(thisGatewayObject.location);
};

  // Add Gateway
  function addGateway(event) {
    event.preventDefault();

    //Basic validation - increase errorCount variable if field left blank
    var errorCount = 0;
    $('#addGateway input').each(function(index, val) {
        if($(this).val() === '') { errorCount++;}
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        //if it is, compile all user info into one object
        var newGateway = {
            'gatewayname' : $('#addGateway fieldset input#inputGatewayName').val(),
            'contact' : $('#addGateway fieldset input#inputGatewayContact').val(),
            'service' : $('#addGateway fieldset input#inputGatewayService').val(),
            'frequency' : $('#addGateway fieldset input#inputGatewayFreq').val(),
            'location' : $('#addGateway fieldset input#inputGatewayLocation').val(),
            'beam' : $('#addGateway fieldset input#inputGatewayBeam').val()
        }

        //Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newGateway,
            url: '/gateways/addgateway',
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addGateway fieldset input').val('');

                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
  };

  // Delete Gateway
  function deleteGateway(event){

      event.preventDefault();

      // Pop up a confirmation dialog
      var confirmation = confirm('Are you sure you want to delete this gateway?');

      // Check and make sure the user confirmed
      if (confirmation === true) {

          // If they did, do our delete
          $.ajax({
              type: 'DELETE',
              url: '/gateways/deletegateway/' + $(this).attr('rel')
          }).done(function(response) {

              // Check for a successful response
              if (response.msg === '') {

              }
              else {
                alert('Error: ' + response.msg);
              }

              // Update the table
              populateTable();
          });

      }
      else{
          //If they said no to the confirm, do nothing
          return false;
      }

  }
