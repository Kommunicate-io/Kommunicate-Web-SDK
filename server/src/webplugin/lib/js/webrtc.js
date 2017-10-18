'use strict';

function SignalingChannel(){
	var clientId = Math.floor((Math.random() * 1000) + 1);
	var client = new Paho.MQTT.Client('localhost', 3000, 'test' + clientId);
	
	var signal = this;
	
	client.onMessageArrived = function(message) {
		console.log("onMessageArrived:"+message.payloadString);
		signal.messageCallback(message.payloadString);
		// onMessageCallback(message.payloadString);
	};
	
	client.onConnectionLost = function(responseObject) {
		if (responseObject.errorCode !== 0) {
			console.log("onConnectionLost:"+responseObject.errorMessage);
		}
	};
	
	this.send = function(msg){
		var message = new Paho.MQTT.Message(msg);
		message.destinationName = "/webrtc";
		client.send(message);
	};
	
	this.messageCallback = null;
	
	this._setMessageCallback = function(messageCallback){
		if (typeof messageCallback === "function")
			this.messageCallback = messageCallback;
	};
	
	client.connect({
		onSuccess:function(){
			client.subscribe("/webrtc");
		}
	});
}

var pc = null;

$(document).ready(function(){
	
	var signalingChannel = new SignalingChannel();
	
	var configuration = {
		"urls": [
		    'stun:stun01.sipphone.com',
		    'stun:stun.ekiga.net',
		    'stun:stun.fwdnet.net',
		    'stun:stun.ideasip.com',
		    'stun:stun.iptel.org',
		    'stun:stun1.l.google.com:19302',
		    'stun:stun2.l.google.com:19302',
		    'stun:stun3.l.google.com:19302',
		    'stun:stun4.l.google.com:19302'
		]
	};
	
	window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
	window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
	
	pc = new window.RTCPeerConnection(configuration);
	
	var selfView = document.querySelector('#selfView');
	var remoteView = document.querySelector('#remoteView');

	// send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        if (evt.candidate)
            signalingChannel.send(JSON.stringify({ "candidate": evt.candidate }));
    };

    // let the "negotiationneeded" event trigger offer generation
    pc.onnegotiationneeded = function () {
        pc.createOffer()
        .then(function (offer) {
            return pc.setLocalDescription(offer);
        })
        .then(function () {
            // send the offer to the other peer
            signalingChannel.send(JSON.stringify({ "sdp": pc.localDescription }));
        })
        .catch(logError);
    };

    // once remote stream arrives, show it in the remote video element
    pc.onaddstream = function (evt) {
        remoteView.srcObject = evt.stream;
    };
    
    signalingChannel.messageCallback = function (evt) {
        if (!pc)
            start(false);

        var signal = JSON.parse(evt);
        if (signal.sdp)
            pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        else
            pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
    };
    
    var constraints = window.constraints = {
	  audio: false,
	  video: true
	};
    
    // get a local stream, show it in a self-view and add it to be sent
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        selfView.srcObject = stream;
        pc.addStream(stream);
    })
    .catch(logError);
	
	function logError(msg, error) {
		var errorElement = document.querySelector('#errorMsg');
	  errorElement.innerHTML += '<p>' + msg + '</p>';
	  if (typeof error !== 'undefined') {
	    console.error(error);
	  }
	}
	
});

    
