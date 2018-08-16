/**
.---------------------------------------------------------------------------.
| The Francium Project                                                      |
| ------------------------------------------------------------------------- |
| This software "voice" is a part of the Francium (Fr) project.             |
| http://subinsb.com/the-francium-project                                   |
| ------------------------------------------------------------------------- |
|    Author: Subin Siby                                                     |
| Copyright (c) 2014 - 2015, Subin Siby. All Rights Reserved.               |
| ------------------------------------------------------------------------- |
|   License: Distributed under the Apache License, Version 2.0              |
|            http://www.apache.org/licenses/LICENSE-2.0                     |
| This program is distributed in the hope that it will be useful - WITHOUT  |
| ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or     |
| FITNESS FOR A PARTICULAR PURPOSE.                                         |
'---------------------------------------------------------------------------'
*/

/**
.---------------------------------------------------------------------------.
|  Software:      Francium Voice                                            |
|  Version:       0.6 (Last Updated on 2017 Feruary 01)                     |
|  Documentation: http://subinsb.com/html5-record-mic-voice                 |
|  Contribute:    https://github.com/subins2000/Francium-voice              |
'---------------------------------------------------------------------------'
*/

(function(window){
	window.Fr = window.Fr || {};
	Fr.voice = {

		/**
		 * Path to mp3Worker.js
		 * Only needed if you're gonna use MP3 conversion
		 * You should also include libmp3lame.min.js
		 * You can get both files from https://github.com/subins2000/Francium-voice/blob/master/js/
		 */
		mp3WorkerPath: "src/mp3Worker.js",

		stream: false,
		input: false,

		init_called: false,

		/**
		 * @type function setTimeout() function will be stored here
		 */
		stopRecordingTimeout: false,

		/**
		 * Initialize. Set up variables.
		 */
		init: function(){
			try {
				// Fix up for prefixing
				window.AudioContext = window.AudioContext||window.webkitAudioContext;
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
					|| navigator.mozGetUserMedia || navigator.msGetUserMedia;
				window.URL = window.URL || window.webkitURL;

				if(navigator.getUserMedia === false){
					alert('getUserMedia() is not supported in your browser');
				}
				this.context = new AudioContext();
			}catch(e) {
				alert('Web Audio API is not supported in this browser');
			}
		},

		/**
		 * Start recording audio
		 */
		record: function(output, finishCallback, recordingCallback){
			var finishCallback = finishCallback || function(){};
			var recordingCallback = recordingCallback || function(){};

			if(this.init_called === false){
				this.init();
				this.init_called = true;
			}

			var $that = this;
			navigator.getUserMedia({audio: true}, function(stream){

			/**
			 * Live Output
			 */
			$that.input = $that.context.createMediaStreamSource(stream);
				if(output === true){
					$that.input.connect($that.context.destination);
				}

				$that.recorder = new Recorder($that.input, {
					'mp3WorkerPath': $that.mp3WorkerPath,
					'recordingCallback': recordingCallback
				});

				$that.stream = stream;
				$that.recorder.record();
				finishCallback(stream);
			}, function() {
				alert('No live audio input');
			});
		},

		/**
		 * Pause the recording
		 */
		pause: function(){
			this.recorder.stop();
		},

		resume: function(){
			this.recorder.record();
		},

		/**
		 * Stop recording audio.
		 * This will reset the recorded audio and the
		 * recorded audio can't be played or exported after.
		 * @return {Fr.voice}
		 */
		stop: function(){
			this.recorder.stop();
			this.recorder.clear();
			this.stream.getTracks().forEach(function (track) {
				track.stop();
			});
			return this;
		},

		/**
		 * Export the recorded audio as WAV in different formats
		 * @param {[type]} [varname] [description]
		 */
		export: function(callback, type){
			this.recorder.exportWAV(function(blob){
				Fr.voice.callExportCallback(blob, callback, type);
			});
		},

		exportMP3: function(callback, type){
			this.recorder.exportMP3(function(blob){
				Fr.voice.callExportCallback(blob, callback, type);
			});
		},

		/**
		 * Call the export callback with data it requires
		 * @param  {Blob}     blob     Exported blob
		 * @param  {string}   type     Type of data to export
		 * @param  {Function} callback Export callback
		 */
		callExportCallback: function(blob, callback, type) {
			if(typeof type === "undefined" || type == "blob"){
				callback(blob);
			}else if (type === "base64"){
				var reader = new window.FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = function() {
					base64data = reader.result;
					callback(base64data);
				};
			}else if(type === "URL"){
				var url = URL.createObjectURL(blob);
				callback(url);
			}
		},

		/**
		 * Pause the recording after a specific time
		 * @param  integer time Time in milliseconds
		 * @return void
		 */
		stopRecordingAfter: function(time, callback){
			var callback = callback || function(){};

			clearTimeout(this.stopRecordingTimeout);
			this.stopRecordingTimeout = setTimeout(function(){
				Fr.voice.pause();
				callback();
			}, time);
		}
	};
})(window);
