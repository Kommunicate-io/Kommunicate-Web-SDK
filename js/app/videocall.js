
function MckCallingService(identity, token, callId, toUserDisplayName,
		isCallHost, callStartTime, mckMessageService, toUserImage, isAudioCall,
		ringTone) {
	var _this = this;
	var $mckVidImageIcon = $applozic("#mck-vid-icon");
	var $mckSideBox = $applozic("#mck-sidebox");
	_this.callStartTime = callStartTime;
	_this.mckMessageService = mckMessageService;
	_this.identity = identity;
	_this.token = token;
	_this.callId = callId;
	_this.isCallHost = isCallHost;
	_this.toUserImage = toUserImage;
	_this.toUserDisplayName = toUserDisplayName;
	_this.isAudioCall = isAudioCall;
	_this.disconectedByHost;
	_this.rejectedByReceiver;
	_this.twilioService;
	console.log("is AudioCall:" , isAudioCall);

	_this.ringTone = ringTone;
	var $mck_vid_box = $applozic(".applozic-vid-container");
	var $mck_side_box = $applozic("#mck-sidebox");
	var $mck_video_call_indicator = $applozic("#mck-video-call-indicator");
	var $mck_unmute_icon = $applozic("#mck-unmute-icon");
	var $mck_mute_icon = $applozic("#mck-mute-icon");
	var $mck_mute_btn=$applozic("#mck-microfone-mute-btn");
	$applozic("#mck-microfone-mute-btn").off('click').on(
			'click',
			function() {
				//mute the local audio
				var room = _this.twilioService.activeRoom;

				if (room) {
					var localMedia = room.localParticipant.media;
					if (localMedia.isMuted) {
						$mck_unmute_icon.addClass("vis").removeClass("n-vis");
						$mck_mute_icon.addClass("n-vis").removeClass("vis");
						$mck_mute_btn.addClass("mck-unmuted").removeClass("mck-muted")
						localMedia.unmute();
					} else {
						$mck_mute_icon.addClass("vis").removeClass("n-vis");
						$mck_unmute_icon.addClass("n-vis").removeClass("vis");
						$mck_mute_btn.addClass("mck-muted").removeClass("mck-unmuted")
						localMedia.mute();
					}
					;
				}
				;
			});
	// When we are about to transition away from this page, disconnect
	$applozic("#mck-vid-disconnect").off('click').on('click',function() {

				// notify applozic server contentType 103 with call duration
				if (isCallHost) {
					_this.disconectedByHost = true;
					if (_this.twilioService.callReceivedAt) {
						// call received. send call end message.
						var callDurationInMilis = new Date().getTime()
								- _this.twilioService.callReceivedAt.getTime();
						mckMessageService.sendVideoCallEndMessage(callId,
								"CALL_END", 103, false, callDurationInMilis);
					} else {
						// call is not received. send call missed message.
						// stop ring tone
						_this.ringTone.stop();
						mckMessageService.sendVideoCallMessage(callId,
								"CALL_MISSED", 103, false);
					}
				}
				// no need to handle receiver's call disconnects message.
				// sender
				// will a notification when participent disconnects. sender
				// will
				// send meassage. its nice of you sender.
				_this.twilioService.leaveRoomIfJoined();
				_this.removeTracks([ "#mck-vid-media > video",
						"#mck-vid-media > audio", "#local-media > video",
						"#local-media > audio" ]);
				$mck_vid_box.addClass('n-vis').removeClass('vis');
				//$mck_side_box.addClass('vis').removeClass('n-vis');
				$mck_video_call_indicator.addClass("n-vis").removeClass("vis");
			});
	

	_this.startVideoCall = function() {
		// Check for WebRTC
		if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
			alert('WebRTC is not available in your browser. can not start video call');
		}
		
		if (!_this.token) {
			alert("missing token.. can not make video call");
			// window.close();
			$mck_vid_box.removeClass('vis').addClass("n-vis");
		}
		_this.twilioService = new TwilioService(_this.identity, _this.token,
				_this.callId, _this.ringTone, _this.isAudioCall,
				_this.mckMessageService, _this.isCallHost);
		var videoClient = _this.twilioService.InitializeVideoClient();

		if (isCallHost) {
			$mckVidImageIcon.html(toUserImage + "<span> Calling "
					+ toUserDisplayName + "</span>");
			$mckVidImageIcon.removeClass("n-vis").addClass("mck-videocall-toUserImage vis");
			// timer if user not receive call in 1 minute, display message and
			// notify server
			setTimeout(function() {
				// show the busy status if call not joined by participent
				if (!_this.twilioService.isCallReceived
						&& !_this.disconectedByHost
						&& !_this.rejectedByReceiver) {
					console.log("call is not answered....");
					_this.ringTone.stop();
					mckMessageService.sendVideoCallMessage(callId,
							"CALL_MISSED", 103, isAudioCall);
					alert(toUserDisplayName + " not Available....");
					_this.twilioService.leaveRoomIfJoined();
					_this.removeTracks([ "#mck-vid-media > video",
							"#mck-vid-media > audio", "#local-media > video",
							"#local-media > audio" ]);
					$mck_vid_box.addClass('n-vis').removeClass('vis');
					//$mckSideBox.addClass("vis").removeClass("n-vis");

				}
			}, 70000); 
		}

		// from the room, if joined.
		window.addEventListener('beforeunload',
				_this.twilioService.leaveRoomIfJoined);

		// attach user media to div
		_this.twilioService.attachUserMedia(isCallHost, isAudioCall);
		// join Call,connect user to room
		_this.twilioService.joinCall(isAudioCall);

	
		//$mck_side_box.addClass('n-vis').removeClass('vis');
		$mck_vid_box.removeClass('n-vis').addClass('vis');
		//reset mute button
		$mck_unmute_icon.addClass("vis").removeClass("n-vis");
		$mck_mute_icon.addClass("n-vis").removeClass("vis");
		$mck_mute_btn.addClass("mck-unmuted").removeClass("mck-muted");
	};
	_this.removeTracks = function(selectors) {
		$applozic.each(selectors, function(index, value) {
			$applozic(value).remove()
		});
	};
};

function TwilioService(identity, token, callId, ringTone, isAudioCall,
		mckMessageService, isCallHost) {
	var _this = this;
	_this.identity = identity;
	_this.token = token;
	_this.callId = callId;
	_this.videoClient;
	_this.activeRoom;
	_this.previewMedia;
	_this.ringTone = ringTone;
	_this.isCallReceived;
	_this.callReceivedAt;
	_this.isAudioCall = isAudioCall;
	_this.mckMessageService = mckMessageService;
	_this.isCallHost = isCallHost;
        var $mck_videocall_btn = $applozic(".mck-videocall-btn");
	var $mckVidImageIcon = $applozic("#mck-vid-icon");
	var localMedia = "#local-media";
	var mckVidMedia = "#mck-vid-media";
	var $mcklocalVideo = $applozic("#local-media > video");
	var $mckRemoteVideo = $applozic("#mck-vid-media > video");
	var $localMedia = $applozic("#local-media");
	var $mck_vid_box = $applozic(".applozic-vid-container");
	var $mck_side_box = $applozic("#mck-sidebox");
	var $mck_video_call_indicator = $applozic("#mck-video-call-indicator");

	_this.InitializeVideoClient = function() {
		// Create a Video Client
		_this.videoClient = new Twilio.Video.Client(_this.token);
	}

	//craete a room name CallId 
	_this.joinCall = function(isAudioCall) {
		if (_this.videoClient) {
			_this.videoClient.connect({
				to : _this.callId
			}).then(_this.roomJoined, function(error) {
				console.log('Could not connect to Twilio: ' , error.message);
			});
		}
	}

	_this.attachUserMedia = function(isCallHost, isAudioCall) {
		if (!_this.previewMedia) {
			_this.previewMedia = new Twilio.Video.LocalMedia();
			Twilio.Video.getUserMedia().then(function(mediaStream) {
				_this.previewMedia.addStream(mediaStream);
				if (isCallHost) {
					_this.previewMedia.attach(mckVidMedia);
					// var vidHeight = window.innerHeight;
					// var vidWidth = (.33*vidHeight)+vidHeight;
					// //maintaining aspect ratio
					// $mckRemoteVideo.style.width=vidWidth+"px";
					// $mckRemoteVideo.style.height=vidHeight+"px";
					_this.ringTone.play();
				} else {
					_this.previewMedia.attach(localMedia)
					$localMedia.removeClass("n-vis").addClass("vis");
					// var vidHeight = $applozic(localMedia).height()
					// var vidWidth = (.33*vidHeight)+vidHeight;
					// //maintaining aspect ratio
					// $mcklocalVideo.style.width=vidWidth+"px";
					// $mcklocalVideo.style.height=vidHeight+"px";

				}
			}, function(error) {
				console.error('Unable to access local media', error);
				console.log('Unable to access Camera and Microphone');
			});
		}
		;
	}
	// call back method when anybody joined the room.
	_this.roomJoined = function(room) {
		// alert("inside room joined");
		console.log("room detail : " , room);
		_this.activeRoom = room;

		// Draw local video, if not already previewing
		if (!_this.previewMedia) {
			room.localParticipant.media.attach(mckVidMedia);
		}
		//call back, when receiver receive the call
		room.participants.forEach(function(participant) {
			console.log("Already in Room: " ,participant.identity);
			participant.media.attach('#mck-vid-media');
		});

		// callback when participent join the call.
		room.on('participantConnected', function(participant) {
			console.log("participent- " + participant.identity
					+ "connected to the room- " + room);
			// stop the ringtone
			_this.isCallReceived = true;
                       $mck_videocall_btn.removeClass('vis').addClass('n-vis');
			_this.callReceivedAt = new Date();
			console.log("callReceivedAt : " , _this.callReceivedAt);
			_this.ringTone.stop();
			// switch the local participent media to local div and attach remote
			// user media to main div
			$mckVidImageIcon.addClass("n-vis");

			$applozic("#mck-vid-media > video").remove();
			$applozic("#mck-vid-media > audio").remove();
			room.localParticipant.media.attach(localMedia);
			$localMedia.removeClass("n-vis").addClass("vis");
			participant.media.attach(mckVidMedia);

		});

		// When a participant disconnects, 
		room.on('participantDisconnected', function(participant) {
			console.log("Participant '" , participant.identity
					+ "' left the room");
			if (_this.isCallHost) {
				var callDurationInMilis = new Date().getTime()
						- _this.callReceivedAt.getTime();
				mckMessageService.sendVideoCallEndMessage(_this.callId,
						"CALL_END", 103, isAudioCall, callDurationInMilis);
			}
			participant.media.detach();
			//right now one to one calling.. if participent disconnect disconnect the call-->leave room if joined.
			_this.leaveRoomIfJoined();
			$mck_vid_box.addClass('n-vis').removeClass('vis');
			//$mck_side_box.addClass('vis').removeClass('n-vis');
			$mck_video_call_indicator.addClass('n-vis').removeClass('vis');
		});

		// When we are disconnected, stop capturing local video
		// Also remove media for all remote participants
		room.on('disconnected', function() {
			console.log('Left');
                        $mck_videocall_btn.removeClass('n-vis').addClass('vis');
			room.localParticipant.media.detach();
			room.participants.forEach(function(participant) {
				participant.media.detach();
			});
			_this.activeRoom = null;
		});

	}
	_this.leaveRoomIfJoined = function leaveRoomIfJoined() {
		if (_this.activeRoom) {
			_this.activeRoom.disconnect();
		}
		if (_this.previewMedia) {
			_this.previewMedia.stop();
		}

	}
}