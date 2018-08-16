$(document).ready(function(){
    // ~Warning~ You must get your own API Keys for non-demo purposes.
    // ~Warning~ Get your PubNub API Keys: https://www.pubnub.com/get-started/
    // The phone *number* can by any string value
    var phone = null;
    $('#callDiv').hide();
    
    $('#setup').click(function(){
    	var mynumber = $('#mynumber').val();
    	phone = PHONE({
            number        : mynumber,
            publish_key   : 'pub-c-6ccf6097-7845-4180-95f3-b6e570c845b4',
            subscribe_key : 'sub-c-5393fbfe-ba8b-11e5-8365-02ee2ddab7fe',
            ssl           : true
        });
    	
    	// As soon as the phone is ready we can make calls
    	phone.ready(function(){

            // Dial a Number and get the Call Session
            // For simplicity the phone number is the same for both caller/receiver.
            // you should use different phone numbers for each user.
            
            console.log('phone is ready');
        });
    	
    	// When Call Comes In or is to be Connected
        phone.receive(function(session){

            // Display Your Friend's Live Video
            session.connected(function(session){
                PUBNUB.$('video-out').appendChild(session.video);
            });

        });
        
        $('#callDiv').show();
        $('#setupDiv').hide();
    });

    $('#makecall').click(function(){
    	var outnumber = $('#outnumber').val();
        var session = phone.dial(outnumber);
    });

});