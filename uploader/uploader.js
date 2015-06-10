define(
[],
function() {
var uploader = {
	// Config chunkSize before use the uploader. Bytes
	chunkSize: 1024 * 1024 * 1024 / 2, //Default 1GB / 2
	
	_upload : function(options) {
		/*
		   options: uploadProgress, url, type, data, success, error
		 */
		function createXhr() {
			var xhr = $.ajaxSettings.xhr();
			if (xhr.upload) {
				xhr.upload.addEventListener('progress',
						function(event) {
							var percent = 0;
							var position = event.loaded
									|| event.position;
							var total = event.total;
							if (event.lengthComputable) {
								percent = Math.ceil(position
										/ total * 100);
							}
							options.uploadProgress(event, position,
									total, percent);
						}, false);
			}
			return xhr;
		}
		var s = $.extend(true, {}, $.ajaxSettings, {
			url : options.url,
			contentType : false,
			processData : false,
			cache : false,
			type : options.type || 'POST',
			success : options.success,
			error : options.error
		});
		s.xhr = createXhr;
		s.data = options.data;
		return $.ajax(s);
	},
	
	uploadFile : function(options) {
		var t = this;
		var jqXHR = null;
		var dfd = new $.Deferred();

		dfd.abort = function() {
			if (jqXHR) {
				jqXHR.abort();
			}
		};

		var file = options.file, url = options.url, uploadProgress = options.uploadProgress
				|| function() {
				}, success = options.success || function() {
		}, error = options.error || function() {
		};
		var totalChunkNum = Math.ceil(file.size / t.chunkSize);
		var totalSize = file.size;
		function uploadChunk(currentChunk) {
			var uploadData = new FormData();
			var start = currentChunk * t.chunkSize;
			var end = start + t.chunkSize;
			if ((currentChunk + 1) == totalChunkNum) {
				end = file.size;
			}
			var chunkData = file.slice(start, end);
			chunkData.name = "part_" + currentChunk + "_"
					+ file.name;
			uploadData.append(chunkData.name, chunkData);
			uploadData.append("start", start);
			return t._upload({
				data : uploadData,
				url : url,
				uploadProgress : function(event, position, total,
						percent) {
					console.log("upload progress: " + percent
							+ " | for block: #" + currentChunk);
					var totalPosition = currentChunk
							* t.chunkSize
							+ Math.ceil(chunkData.size * percent
									/ 100);
					var totalPercent = Math.ceil(totalPosition
							* 100 / totalSize);

					uploadProgress(event, totalPosition, totalSize,
							totalPercent);
				},
				success : function(data) {
					console.log("upload done for block: #"
							+ currentChunk);
					if (currentChunk + 1 == totalChunkNum) {
						dfd.resolve({});
						return;
					}
					jqXHR = uploadChunk(currentChunk + 1);

				},
				error : function(jqXHR) {
					console.log("upload error for block: #"
							+ currentChunk);
					// To add retry logic
					// uploadChunk(currentChunk);
					jqXHR = null;
					dfd.reject(jqXHR)
				}
			});
		}

		jqXHR = uploadChunk(0);
		return dfd;
	}
};
return uploader;

})