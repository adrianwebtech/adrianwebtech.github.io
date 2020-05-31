/*
* FileSaver.js
* A saveAs() FileSaver implementation.
*
* By Eli Grey, http://eligrey.com
*
* License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
* source  : http://purl.eligrey.com/github/FileSaver.js
*/

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
var _global = typeof window === 'object' && window.window === window
  ? window : typeof self === 'object' && self.self === self
  ? self : typeof global === 'object' && global.global === global
  ? global
  : this

function bom (blob, opts) {
  if (typeof opts === 'undefined') opts = { autoBom: false }
  else if (typeof opts !== 'object') {
    console.warn('Deprecated: Expected third argument to be a object')
    opts = { autoBom: !opts }
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
  }
  return blob
}

function download (url, name, opts) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    saveAs(xhr.response, name, opts)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

function corsEnabled (url) {
  var xhr = new XMLHttpRequest()
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false)
  try {
    xhr.send()
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
function click (node) {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                          20, false, false, false, false, 0, null)
    node.dispatchEvent(evt)
  }
}

// Detect WebKit inside a native macOS app
var isWebKit = /AppleWebKit/.test(navigator.userAgent)

var saveAs = _global.saveAs || (
  // probably in some web worker
  (typeof window !== 'object' || window !== _global)
    ? function saveAs () { /* noop */ }

  // Use download attribute first if possible (#193 Lumia mobile) unless this is a native macOS app
  : ('download' in HTMLAnchorElement.prototype && !isWebKit)
  ? function saveAs (blob, name, opts) {
    var URL = _global.URL || _global.webkitURL
    var a = document.createElement('a')
    name = name || blob.name || 'download'

    a.download = name
    a.rel = 'noopener' // tabnabbing

    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'

    if (typeof blob === 'string') {
      // Support regular links
      a.href = blob
      if (a.origin !== location.origin) {
        corsEnabled(a.href)
          ? download(blob, name, opts)
          : click(a, a.target = '_blank')
      } else {
        click(a)
      }
    } else {
      // Support blobs
      a.href = URL.createObjectURL(blob)
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
      setTimeout(function () { click(a) }, 0)
    }
  }

  // Use msSaveOrOpenBlob as a second approach
  : 'msSaveOrOpenBlob' in navigator
  ? function saveAs (blob, name, opts) {
    name = name || blob.name || 'download'

    if (typeof blob === 'string') {
      if (corsEnabled(blob)) {
        download(blob, name, opts)
      } else {
        var a = document.createElement('a')
        a.href = blob
        a.target = '_blank'
        setTimeout(function () { click(a) })
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name)
    }
  }

  // Fallback to using FileReader and a popup
  : function saveAs (blob, name, opts, popup) {
    // Open a popup immediately do go around popup blocker
    // Mostly only available on user interaction and the fileReader is async so...
    popup = popup || open('', '_blank')
    if (popup) {
      popup.document.title =
      popup.document.body.innerText = 'downloading...'
    }

    if (typeof blob === 'string') return download(blob, name, opts)

    var force = blob.type === 'application/octet-stream'
    var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari
    var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

    if ((isChromeIOS || (force && isSafari) || isWebKit) && typeof FileReader !== 'undefined') {
      // Safari doesn't allow downloading of blob URLs
      var reader = new FileReader()
      reader.onloadend = function () {
        var url = reader.result
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
        if (popup) popup.location.href = url
        else location = url
        popup = null // reverse-tabnabbing #460
      }
      reader.readAsDataURL(blob)
    } else {
      var URL = _global.URL || _global.webkitURL
      var url = URL.createObjectURL(blob)
      if (popup) popup.location = url
      else location.href = url
      popup = null // reverse-tabnabbing #460
      setTimeout(function () { URL.revokeObjectURL(url) }, 4E4) // 40s
    }
  }
)

_global.saveAs = saveAs.saveAs = saveAs

if (typeof module !== 'undefined') {
  module.exports = saveAs;
}

$(document).ready(function() {

	var video_container = $("#id-video-slider-control-container").get(0);
	var dummy_container = $("#id-dummy-container").get(0);
	var vidWindows = 0;
	var sticky = video_container.offsetTop;
	var hasInitialise = false;
	var isPlaying = false;
	var vid1 = $(".video").get(0);
	var vidDuration;
	var srtData = ''

	var previousFocus = -1;
	var showSubMain = 0;
	var myInterval;
	var interval = 10;
	var offset = 75;
	var animationTime = 1000;
	var info = {
		srcsrtresult: "",
		srcvttresult: "",
		transsrtresult: "",
		transvttresult: "",
		maxlen: 70,
		showSub: 0,
	};

	$("#id-google-translate").prop('disabled', true);

	window.onscroll = function() {stickyScroll(video_container, dummy_container, sticky)};

	vid1.addEventListener("durationchange", function() {

		$(".video").off("timeupdate.handler1");

		vidDuration = vid1.duration;

		$("#min-videotime").html(0);
		$("#max-videotime").html(vidDuration);

		$("#id-slider").slider({
			range: "max",
			min: 0,
			max: vidDuration,
			value: 0,
			slide: function(event, ui) {
				$("#curr-videotime").val(ui.value);
				vid1.currentTime = ui.value;
			}
		});
		$("#curr-videotime").val($("#id-slider").slider("value"));	
	});


	vid1.addEventListener('timeupdate', function() {
		var updatedTime = vid1.currentTime;
		$("#id-slider").slider("value", updatedTime);
		$("#curr-videotime").val(updatedTime);

	})

	$("#id-upload-video").click(function(event) {
		$('#file-input-video input').trigger('click');

	});

	$('#file-input-video input').change(function(event) {
		/* Act on the event */
		var fileName = event.target.files[0].name;
		jQuery.get('essential/video/' + fileName, function(data, textStatus, xhr) {
			document.getElementById('videosrc').setAttribute("src", "essential/video/" + fileName);
			document.getElementById('video-1').load();
			$("#id-upload-video").prop('disabled', true);
		});
	});

	$('#id-erase').click(function(event) {
		/* Act on the event */
		$(".smallvideoset").remove();
		$("#id-input-filename input").val('')
		$("#id-upload-srcsrt").prop('disabled', false);
		$("#id-upload-trnsrt").prop('disabled', false);
		$("#id-upload-video").prop('disabled', false);
		$('#file-input-srcsrt input').val("");
		$('#file-input-trnsrt input').val("");
		$("#id-input-limit input").css('background-color', 'white');
		info = {
			srcsrtresult: "",
			srcvttresult: "",
			transsrtresult: "",
			transvttresult: ""
		};
		clearInterval(myInterval);
		$("#zh").html('');
		$("#en").html('');
		hasInitialise = false;
	});

	$("#id-upload-srcsrt").click(function(event) {
		/* Act on the event */
		$('#file-input-srcsrt input').trigger('click');
	});

	$("#id-upload-trnsrt").click(function(event) {
		/* Act on the event */
		$('#file-input-trnsrt input').trigger('click');
	});

	$('#file-input-srcsrt input').change(function() {
		 // Act on the event 
		$("#id-google-translate").prop('disabled', false);
		var fileName = event.target.files[0].name;
		var mda = [];
        jQuery.get('essential/source/' + fileName, function(data, textStatus, xhr) {

        	  srtData = data;
        	  $("#id-input-limit input").css('background-color', 'white');
        	  var sourcemda = getsrttime(srtData);
        	  if (info.transsrtresult == "") {
        	  		$(".smallvideoset").remove();
	        	  	mda = getsrttime(srtData);
	        	  	info = srt2webvtt(info, srtData, mda, true);
	        	  	createInitialVidTimeSetHTML(info);
				  	updateTimeHTML(info);
				  	hasInitialise = true;
				  	updateSourceText(info);
				  	$("#id-upload-srcsrt").prop('disabled', true);
				  	myInterval = setInterval(function() {
						var curTimeSecond = vid1.currentTime;
						setTimeout(showSubtitle(info, curTimeSecond), 0);
					}, interval)

        	  } else {

        	  	if (sourcemda.length == info.metadata_arr.length) {

        	  		info = srt2webvtt(info, srtData, info.metadata_arr, true);
        	  		updateSourceText(info);
        	  		$("#id-upload-srcsrt").prop('disabled', true);

        	  	} else {
        	  		alert("Source Length [" + sourcemda.length + "] is not equivalent to Translated length [" + info.metadata_arr.length + "]");
        	  	}

        	  }

        	  $("#zh").html(info.metadata_arr[0].sourcedataraw);    	  
		});
	});


	$('#file-input-trnsrt input').change(function() {
		 // Act on the event 
		var fileName = event.target.files[0].name;
		var mda = [];
        jQuery.get('essential/googletranslated/' + fileName, function(data, textStatus, xhr) {

        	  $("#id-input-filename input").val(fileName.replace('gtr', 'trn'))

        	  srtData = data;
        	  $("#id-input-limit input").css('background-color', 'white');
	    	  var transmda = getsrttime(srtData);
	    	  if (info.srcsrtresult == "") {
	    	  		$(".smallvideoset").remove();
	        	  	mda = getsrttime(srtData);
	        	  	info = srt2webvtt(info, srtData, mda, false);
	        	  	createInitialVidTimeSetHTML(info);
				  	updateTimeHTML(info);
				  	hasInitialise = true;
				  	updateTranslatedText(info);
				  	$("#id-upload-trnsrt").prop('disabled', true);
				  	myInterval = setInterval(function() {
						var curTimeSecond = vid1.currentTime;
						setTimeout(showSubtitle(info, curTimeSecond), 0);
					}, interval)

	    	  } else {

	    	  	if (transmda.length == info.metadata_arr.length) {

	    	  		info = srt2webvtt(info, srtData, info.metadata_arr, false);
	    	  		updateTranslatedText(info);
	    	  		$("#id-upload-trnsrt").prop('disabled', true);

	    	  	} else {
	    	  		alert("Translated Length [" + transmda.length + "] is not equivalent to Source length [" + info.metadata_arr.length + "]");
	    	  	}

	    	  }

	    	  $("#en").html(info.metadata_arr[0].transdataraw);

	    	  for (var i = 0; i < info.metadata_arr.length; i++) {
        	  	var vidsetind = i;
        	  	// console.log(i);

        	  	if (vidsetind != info.metadata_arr.length - 1) {
        	  		var subblocklen = info.metadata_arr[vidsetind].transdata.length;
	        	  	var thistxt = $("#id-workable #b" + (vidsetind + 1).toString() + " .subtitle .translated #s" + (subblocklen - 1).toString() +" input").val();
	        	  	var nextlabel = $("#id-workable #b" + (vidsetind + 2).toString() + " .subtitle .translated #s0 label");

					if (thistxt.substring(thistxt.length - 3) == "...") {
						// console.log(info.metadata_arr[vidsetind + 1].transdata[0].substring(0, 3));
						if (info.metadata_arr[vidsetind + 1].transdata[0].substring(0, 3) == "...") {
							nextlabel.css('background-color', '#ecf0f1');
							info.metadata_arr[vidsetind + 1].noncompliant = false;
						} else {
							nextlabel.css('background-color', 'red');
							info.metadata_arr[vidsetind + 1].noncompliant = true;
						}
					} else {
						nextlabel.css('background-color', '#ecf0f1');
						info.metadata_arr[vidsetind + 1].noncompliant = false;
					}
				}
        	  }
		});
	});

	$("#id-download-srcsrt").click(function(event) {
		/* Act on the event */
		info.srcsrtresult = "";
		for (var i = 0; i < info.metadata_arr.length; i++) {
			info.srcsrtresult += info.metadata_arr[i].srcsrtcue;
		}

		info.srcvttresult = "";
		for (var i = 0; i < info.metadata_arr.length; i++) {
			info.srcvttresult += info.metadata_arr[i].srcvttcue;
		}

		var content = info.srcsrtresult;
		var filename = $("#id-input-filename input").val()? $("#id-input-filename input").val() : "unnamed-src.srt";
		var blob = new Blob([content], 
			{
				type: "text/plain;charset=utf-8"
			});
		saveAs(blob, filename);
	});


	$("#id-download-trnsrt").click(function(event) {
		/* Act on the event */
		info.transsrtresult = "";
		for (var i = 0; i < info.metadata_arr.length; i++) {
			info.transsrtresult += info.metadata_arr[i].transsrtcue;
		}

		info.transvttresult = "";
		for (var i = 0; i < info.metadata_arr.length; i++) {
			info.transvttresult += info.metadata_arr[i].transvttcue;
		}
		var content = info.transsrtresult;
		var filename = $("#id-input-filename input").val()? $("#id-input-filename input").val().replace('gtr', 'trn') : "unnamed-trn.srt";
		var blob = new Blob([content], 
			{
				type: "text/plain;charset=utf-8"
			});
		saveAs(blob, filename);
	});


	$("#id-play-pause").click(function(event) {
		/* Act on the event */
		$(".video").off("timeupdate.handler1");
		if (vid1.paused) {
			vid1.play();
			isPlaying = true;
		}
		else {
			vid1.pause();
			isPlaying = false;
		}
		
	}); 

	$("#id-reset").click(function(event) {
		
		$(".video").off("timeupdate.handler1");
		$(".video").each(function(index, el) {
			$(this).get(0).pause();
			$(this).get(0).currentTime = 0;
			if (isPlaying) {
				$(this).get(0).play();
			}
		});
	})

	$("#id-forward-1s").click(function(event) {
		$(".video").off("timeupdate.handler1");
		skipVid(vid1, true, 1);

		if (isPlaying) {
			vid1.play();
		}
	});

	$("#id-forward-7s").click(function(event) {
		$(".video").off("timeupdate.handler1");
		skipVid(vid1, true, 7);

		if (isPlaying) {
			vid1.play();
		}
	});

	$("#id-forward-15s").click(function(event) {
		$(".video").off("timeupdate.handler1");
		skipVid(vid1, true, 15);

		if (isPlaying) {
			vid1.play();
		}
	});

	$("#id-forward-95s").click(function(event) {
		$(".video").off("timeupdate.handler1");
		skipVid(vid1, true, 95);

		if (isPlaying) {
			vid1.play();
		}
	});

	$("#id-backward-1s").click(function(event) {
		$(".video").off("timeupdate.handler1");
		skipVid(vid1, false, 1);

		if (isPlaying) {
			vid1.play();
		}
	});

	$("#id-backward-7s").click(function(event) {
		$(".video").off("timeupdate.handler1");
		skipVid(vid1, false, 7);

		if (isPlaying) {
			vid1.play();
		}
	});

	$("#id-backward-15s").click(function(event) {
		$(".video").off("timeupdate.handler1");
		skipVid(vid1, false, 15);

		if (isPlaying) {
			vid1.play();
		}
	});

	$("#id-set-limit").click(function(event) {
		/* Act on the event */
		if ($("#id-input-limit input").val() === "") {
			$("#id-input-limit input").val(info.maxlen.toString());
		}
		else {
			info.maxlen = parseInt($("#id-input-limit input").val());
		}

		$("#id-input-limit input").css('background-color', '#dfe6e9');

		$(".translated div input").each(function(index, el) {
			$(this).attr('maxlength', info.maxlen);
			if (parseInt($(this).parent().find('.chrcount').html()) > info.maxlen) {
				$(this).parent().find('.chrcount').css('background-color', 'red');
			} else {
				$(this).parent().find('.chrcount').css('background-color', 'green');
			}
		});
	});

	$('#id-workable').on('click', '.smallvideoset .subtitle .src .srcblock button.add', function(event) {
		/* Act on the event */

		$(this).parent().find('.remove').prop('disabled', false);
		var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
		var curblkid = parseInt(($(this).parent().attr('id')).substring(1));

		info = addTextBoxToMetadata(this, info, "", true);
		info = getSrtVttCues(info, vidsetind, true);
		
		var ele = "";

		$(this).parent().parent().find(".srcblock").each(function(index, el) {
			var tgtblkid = parseInt(($(this).attr('id')).substring(1));
			if (tgtblkid == curblkid) {
				ele = ((($(this).clone()).find('input')).val('')).parent();
				ele = ((($(ele)).find('.chrcount').html('0')).parent()).attr('id', "s" + (curblkid + 1).toString());
			}
			else if (tgtblkid > curblkid) {
				$(this).attr('id', "s" + (tgtblkid + 1).toString());
			}
		});;

		$(this).parent().after($(ele));
	});

	$('#id-workable').on('click', '.smallvideoset .subtitle .translated .transblock button.add', function(event) {
		/* Act on the event */

		$(this).parent().find('.remove').prop('disabled', false);
		var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
		var curblkid = parseInt(($(this).parent().attr('id')).substring(1));

		info = addTextBoxToMetadata(this, info, " ", false);
		info = getSrtVttCues(info, vidsetind, false);

		var ele = "";

		$(this).parent().parent().find(".transblock").each(function(index, el) {
			var tgtblkid = parseInt(($(this).attr('id')).substring(1));
			if (tgtblkid == curblkid) {
				ele = ((($(this).clone()).find('input')).val('')).parent();
				ele = ((($(ele)).find('.chrcount').html('0')).parent()).attr('id', "s" + (curblkid + 1).toString());
			}
			else if (tgtblkid > curblkid) {
				$(this).attr('id', "s" + (tgtblkid + 1).toString());
			}
		});;

		$(this).parent().after($(ele));
	});

	$('#id-workable').on('click', '.smallvideoset .subtitle .src .srcblock button.remove', function(event) {
		/* Act on the event */

		// $(this).parent().find('.remove').prop('disabled', false);
		var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
		var curblkid = parseInt(($(this).parent().attr('id')).substring(1));

		info = removeTextBoxFromMetadata(this, info, "\n", true);
		info = getSrtVttCues(info, vidsetind, true);
		// console.log(info.metadata_arr);
		
		var ele = "";

		$(this).parent().parent().find(".srcblock").each(function(index, el) {
			var tgtblkid = parseInt(($(this).attr('id')).substring(1));
			if (tgtblkid > curblkid) {
				$(this).attr('id', "s" + (tgtblkid - 1).toString());
			}
		});

		$(this).parent().remove();

		var sl = "#b" + (vidsetind + 1).toString() + " .subtitle .src .srcblock";
		if ($(sl).length == 1) {
			$(sl + " button.remove").prop('disabled', true);
		}
	});

	$('#id-workable').on('click', '.smallvideoset .subtitle .translated .transblock button.remove', function(event) {
		/* Act on the event */

		// $(this).parent().find('.remove').prop('disabled', false);
		var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
		var curblkid = parseInt(($(this).parent().attr('id')).substring(1));

		info = removeTextBoxFromMetadata(this, info, "\n", false);
		info = getSrtVttCues(info, vidsetind, false);
		// console.log(info.metadata_arr);
		
		var ele = "";

		$(this).parent().parent().find(".transblock").each(function(index, el) {
			var tgtblkid = parseInt(($(this).attr('id')).substring(1));
			if (tgtblkid > curblkid) {
				$(this).attr('id', "s" + (tgtblkid - 1).toString());
			}
		});

		$(this).parent().remove();

		var sl = "#b" + (vidsetind + 1).toString() + " .subtitle .translated .transblock";
		if ($(sl).length == 1) {
			$(sl + " button.remove").prop('disabled', true);
		}
	});

	$('#id-workable').on('input', '.smallvideoset .subtitle div div input', function(event) {
		var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
		var curblkid = parseInt(($(this).parent().attr('id')).substring(1));
		var isSource = $(this).parent().attr('class').includes('srcblock');

		var chrcount = $(this).parent().find(".chrcount");
		var len = $(this).val().length.toString();
		var txt = $(this).val();

		$(chrcount).html(len);

		if (isSource) {
			info.metadata_arr[vidsetind].sourcedata[curblkid] = txt;
			info.metadata_arr[vidsetind].sourcedatalen[curblkid] = len;
			info.metadata_arr[vidsetind].sourcedataraw = info.metadata_arr[vidsetind].sourcedata.join("");

		} else {
			info.metadata_arr[vidsetind].transdata[curblkid] = txt;
			info.metadata_arr[vidsetind].transdatalen[curblkid] = len;
			info.metadata_arr[vidsetind].transdataraw = info.metadata_arr[vidsetind].transdata.join(" ");

			if (len > info.maxlen) {
				$(this).parent().find('.chrcount').css('background-color', 'red');
			} else {
				$(this).parent().find('.chrcount').css('background-color', 'green');
			}

			if (vidsetind != info.metadata_arr.length - 1) {
				if (txt.substring(txt.length - 3) == "...") {
					// console.log(info.metadata_arr[vidsetind + 1].transdata[0].substring(0, 3));
					if (info.metadata_arr[vidsetind + 1].transdata[0].substring(0, 3) == "...") {
						$("#id-workable #b" + (vidsetind + 2).toString() + " .subtitle .translated #s0 label").css('background-color', '#ecf0f1');
						info.metadata_arr[vidsetind + 1].noncompliant = false;
					} else {
						$("#id-workable #b" + (vidsetind + 2).toString() + " .subtitle .translated #s0 label").css('background-color', 'red');
						info.metadata_arr[vidsetind + 1].noncompliant = true;
					}
				} else {
					$("#id-workable #b" + (vidsetind + 2).toString() + " .subtitle .translated #s0 label").css('background-color', '#ecf0f1');
					info.metadata_arr[vidsetind + 1].noncompliant = false;
				}
			}

			if (info.metadata_arr[vidsetind].noncompliant == true && $(this).parent().attr('id') == "s0") {

				if (txt.substring(0, 3) == "...") {
					$(this).parent().find('label').css('background-color', '#ecf0f1');
					info.metadata_arr[vidsetind].noncompliant == false;
				} else {
					$(this).parent().find('label').css('background-color', 'red');
					info.metadata_arr[vidsetind].noncompliant == true;
				}
			}
		}

		info = getSrtVttCues(info, vidsetind, isSource);

		// console.log(info.metadata_arr);
		
	});	


	$('#id-workable').on('focus', '.smallvideoset .subtitle div div input', function(event) {
		
		var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
		var clicked = $(this).parent().parent().parent().parent();
		// console.log(clicked.get(0));

		if (previousFocus != vidsetind) {
			
			$("#video-1").off('timeupdate.handler1');

			vid1.pause();
			isPlaying = false;
			vid1.currentTime = (info.metadata_arr[vidsetind].stime - vidWindows) > 0? info.metadata_arr[vidsetind].stime - vidWindows : 0;
			vid1.play();
			isPlaying = true;

			$("#video-1").on('timeupdate.handler1', function() {
				if (vid1.currentTime >=  info.metadata_arr[vidsetind].etime + vidWindows) {
				  	vid1.pause();
				  	isPlaying = false;
				  	vid1.currentTime -= info.metadata_arr[vidsetind].timediff/2;
				  	$("#video-1").off('timeupdate.handler1');
				}
			});

			previousFocus = vidsetind;

		}

		$("html, body").animate({
			scrollTop: (parseInt(clicked.offset().top) - $("#id-video-slider-control-container").height() - offset).toString()
		},animationTime);
	
	});

	$('#id-workable').on('keypress', '.smallvideoset .subtitle .src .srcblock input', function(event) {
		if (event.which == 13) {
			var caretPos = $(this).get(0).selectionStart;
			$(this).parent().find('.remove').prop('disabled', false);
			var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
			var curblkid = parseInt(($(this).parent().attr('id')).substring(1));

			// The logic
			if (info.metadata_arr[vidsetind].sourcedatalen[curblkid] == undefined) {
				info = addTextBoxToMetadata(this, info, "", true);
			} else {
				info = addTextBoxToMetadataWhenEnter(this, info, "", true, caretPos);
			}
			
			info = getSrtVttCues(info, vidsetind, true);
			
			var ele = "";

			if (info.metadata_arr[vidsetind].sourcedatalen[curblkid] == undefined) {
				$(this).parent().parent().find(".srcblock").each(function(index, el) {
					var tgtblkid = parseInt(($(this).attr('id')).substring(1));
					if (tgtblkid == curblkid) {
						ele = ((($(this).clone()).find('input')).val('')).parent();
						ele = ((($(ele)).find('.chrcount').html('0')).parent()).attr('id', "s" + (curblkid + 1).toString());
					}
					else if (tgtblkid > curblkid) {
						$(this).attr('id', "s" + (tgtblkid + 1).toString());
					}
				});;
			} else {
				// The front end
				$(this).parent().parent().find(".srcblock").each(function(index, el) {
					var tgtblkid = parseInt(($(this).attr('id')).substring(1));
					var splittedFrontStr = info.metadata_arr[vidsetind].sourcedata[tgtblkid];
					var splittedFrontNum = info.metadata_arr[vidsetind].sourcedatalen[tgtblkid];
					var splittedEndStr = info.metadata_arr[vidsetind].sourcedata[tgtblkid + 1];
					var splittedEndNum = info.metadata_arr[vidsetind].sourcedatalen[tgtblkid + 1];
					if (tgtblkid == curblkid) {
						$(this).find('input').val(splittedFrontStr);
						$(this).find('.chrcount').html(splittedFrontNum);
						ele = ((($(this).clone()).find('input')).val(splittedEndStr)).parent();
						ele = ((($(ele)).find('.chrcount').html(splittedEndNum.toString())).parent()).attr('id', "s" + (curblkid + 1).toString());
					}
					else if (tgtblkid > curblkid) {
						$(this).attr('id', "s" + (tgtblkid + 1).toString());
					}
				});;
			}
			

			$(this).parent().after($(ele));
			$(this).parent().parent().find(".srcblock").each(function(index, el) {
				// console.log($(this));
				if (index == curblkid + 1) {
					$(this).find("input").focus();
				}
				
			});
			// console.log(info.metadata_arr);
		}
	});	

	$('#id-workable').on('keypress', '.smallvideoset .subtitle .translated .transblock input', function(event) {
		if (event.which == 13) {
			var caretPos = $(this).get(0).selectionStart;
			$(this).parent().find('.remove').prop('disabled', false);
			var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
			var curblkid = parseInt(($(this).parent().attr('id')).substring(1));

			// console.log(info.metadata_arr[vidsetind].transdatalen[curblkid]);

			// The logic
			if (info.metadata_arr[vidsetind].transdatalen[curblkid] == undefined) {
				info = addTextBoxToMetadata(this, info, " ", false);
			} else {
				info = addTextBoxToMetadataWhenEnter(this, info, " ", false, caretPos);
			}
			
			info = getSrtVttCues(info, vidsetind, false);
			
			var ele = "";

			if (info.metadata_arr[vidsetind].transdatalen[curblkid] == undefined) {
				$(this).parent().parent().find(".transblock").each(function(index, el) {
					var tgtblkid = parseInt(($(this).attr('id')).substring(1));
					if (tgtblkid == curblkid) {
						ele = ((($(this).clone()).find('input')).val('')).parent();
						ele = ((($(ele)).find('.chrcount').html('0')).parent()).attr('id', "s" + (curblkid + 1).toString());
					}
					else if (tgtblkid > curblkid) {
						$(this).attr('id', "s" + (tgtblkid + 1).toString());
					}
				});;
			} else {
				$(this).parent().parent().find(".transblock").each(function(index, el) {
					var tgtblkid = parseInt(($(this).attr('id')).substring(1));
					var splittedFrontStr = info.metadata_arr[vidsetind].transdata[tgtblkid];
					var splittedFrontNum = info.metadata_arr[vidsetind].transdatalen[tgtblkid];
					var splittedEndStr = info.metadata_arr[vidsetind].transdata[tgtblkid + 1];
					var splittedEndNum = info.metadata_arr[vidsetind].transdatalen[tgtblkid + 1];
					if (tgtblkid == curblkid) {
						$(this).find('input').val(splittedFrontStr);
						$(this).find('.chrcount').html(splittedFrontNum);
						ele = ((($(this).clone()).find('input')).val(splittedEndStr)).parent();
						ele = ((($(ele)).find('.chrcount').html(splittedEndNum.toString())).parent()).attr('id', "s" + (curblkid + 1).toString());
					}
					else if (tgtblkid > curblkid) {
						$(this).attr('id', "s" + (tgtblkid + 1).toString());
					}
				});;
			}
				

			$(this).parent().after($(ele));
			// console.log(info.metadata_arr);

			$(this).parent().parent().find(".transblock").each(function(index, el) {
				// console.log($(this));
				if (index == curblkid + 1) {
					$(this).find("input").focus();
				}
				
			});
		}
	});

	$('#id-workable').on('keydown', '.smallvideoset', function(event) {
		var keyCode = event.keyCode || event.which; 

		if (keyCode == 9) { 
		  	event.preventDefault();
		  	// call custom function here
		  	var curblkid = parseInt(($(this).parent().attr('id')).substring(1));
		  	var vidsetind = parseInt(($(this).attr('id')).substring(1)) - 1;

			if (vidsetind != info.metadata_arr.length - 1) {
				var v = $("#b" + (vidsetind + 2).toString() + " .subtitle .translated #s0 input").val();
				$("#b" + (vidsetind + 2).toString() + " .subtitle .translated #s0 input").focus().val("").val(v);
			}
			
		} 
	});

	$('#id-workable').on('keydown', '.smallvideoset', function(event) {
		var keyCode = event.keyCode || event.which; 

		if (event.shiftKey && keyCode == 9) {
			event.preventDefault();
		  	// call custom function here
		  	var curblkid = parseInt(($(this).parent().attr('id')).substring(1));
		  	var vidsetind = parseInt(($(this).attr('id')).substring(1)) - 1;

			if (vidsetind != 0) {
				var v = $("#b" + (vidsetind).toString() + " .subtitle .translated #s0 input").val();
				$("#b" + (vidsetind).toString() + " .subtitle .translated #s0 input").focus().val("").val(v);
			}
		}
	});

	$('#id-workable').on('keydown', '.smallvideoset .subtitle .translated .transblock input', function(event) {
		var keyCode = event.keyCode || event.which; 

		if (keyCode == 40) { 
		  	event.preventDefault();
		  	// console.log($(this).get(0)); 
		  	// call custom function here
		  	var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
		  	var curblkid = parseInt(($(this).parent().attr('id')).substring(1));
		  	// console.log(curblkid);

			if (curblkid != info.metadata_arr[vidsetind].transdata.length - 1) {
				var v = $(this).parent().parent().find('#s' + (curblkid + 1).toString()).find("input").val();
				// console.log(v);
				$(this).parent().parent().find('#s' + (curblkid + 1).toString()).find("input").focus().val("").val(v);
			}
			
		} 
	});

	$('#id-workable').on('keydown', '.smallvideoset .subtitle .translated .transblock input', function(event) {
		var keyCode = event.keyCode || event.which; 

		if (!event.ctrlKey && keyCode == 38) { 
		  	event.preventDefault();
		  	// console.log($(this).get(0)); 
		  	// call custom function here
		  	var vidsetind = parseInt(($(this).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
		  	var curblkid = parseInt(($(this).parent().attr('id')).substring(1));


			if (curblkid != 0) {
				var v = $(this).parent().parent().find('#s' + (curblkid - 1).toString()).find("input").val();
				// console.log(v);
				$(this).parent().parent().find('#s' + (curblkid - 1).toString()).find("input").focus().val("").val(v);
			}
			
		} 
	});

	$("#id-workable").on('click', '.controllable .control .skip-play', function() {
		var vidsetind = parseInt(($(this).parent().parent().parent().attr('id')).substring(1)) - 1;
		var clicked = $(this).parent().parent().parent();
		
		$("#video-1").off('timeupdate.handler1');

		vid1.pause();
		isPlaying = false;
		vid1.currentTime = (info.metadata_arr[vidsetind].stime - vidWindows) > 0? info.metadata_arr[vidsetind].stime - vidWindows : 0;
		vid1.play();
		isPlaying = true;

		$("#video-1").on('timeupdate.handler1', function() {
			if (vid1.currentTime >=  info.metadata_arr[vidsetind].etime + vidWindows) {
			  	vid1.pause();
			  	isPlaying = false;
			  	vid1.currentTime -= info.metadata_arr[vidsetind].timediff/2;
			  	$("#video-1").off('timeupdate.handler1');
			}
		});

		previousFocus = vidsetind;

		$("html, body").animate({
			scrollTop: (parseInt(clicked.offset().top) - $("#id-video-slider-control-container").height() - offset).toString()
		},animationTime);
	});

	$("#id-workable").on('click', '.controllable .control .skip', function() {
		var vidsetind = parseInt(($(this).parent().parent().parent().attr('id')).substring(1)) - 1;
		var clicked = $(this).parent().parent().parent();
			
		$("#video-1").off('timeupdate.handler1');

		vid1.pause();
		isPlaying = false;
		vid1.currentTime = info.metadata_arr[vidsetind].stime;

		previousFocus = vidsetind;

		$("html, body").animate({
			scrollTop: (parseInt(clicked.offset().top) - $("#id-video-slider-control-container").height() - offset).toString()
		},animationTime);
	});
});

function showSubtitle(info, time) {
	
	try {
		// statements
		var secondOfTimeStart = info.metadata_arr[info.showSub].stime;
		var secondOfTimeEnd = info.metadata_arr[info.showSub].etime;
		

		if (time < secondOfTimeStart) {
			var index = 0;
			info.showSub = 0;
			$("#zh").html('');
			$("#en").html('');
			for (var i = 0; i < info.metadata_arr.length; i++) {
				var timeStart = info.metadata_arr[i].stime;
				var timeEnd = info.metadata_arr[i].etime;

				if (time > timeStart) {
					info.showSub = i;
					break;
				}
			}

			$("#zh").html('');
			$("#en").html('');

		} else {

			if (time > secondOfTimeEnd) {
				info.showSub++;
				$("#zh").html('');
				$("#en").html('');

			} else {
				var fullSrcText = info.metadata_arr[info.showSub].sourcedata;
				var fullTrnText = info.metadata_arr[info.showSub].transdata;
				var div = "";

				for (var i = 0; i < fullSrcText.length; i++) {
					div += '<div id=' + i + '>' + fullSrcText[i] + '</div><br>';
					
				}
				$("#zh").html(div);

				div = "";
				for (var i = 0; i < fullTrnText.length; i++) {
					div += '<div id=' + i + '>' + fullTrnText[i] + '</div><br>';
				}

				$("#en").html(div);
			}
		}
		
		
	} catch(e) {

		try {
			var index = 0;
			info.showSub = 0;
			$("#zh").html('');
			$("#en").html('');
			for (var i = 0; i < info.metadata_arr.length; i++) {
				var timeStart = info.metadata_arr[i].stime;
				var timeEnd = info.metadata_arr[i].etime;

				if (time > timeStart) {
					info.showSub = i;
					break;
				}
			}

		} catch(e) {
			console.log(e);
		}
	}

	
}

function addTextBoxToMetadataWhenEnter(clickedEle, info, separator, isSource, caretPos) {
	var vidsetind = parseInt(($(clickedEle).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
	var curblkid = parseInt(($(clickedEle).parent().attr('id')).substring(1));
	var endstr = "";
	var frontstr = "";

	if (isSource) {
		if (curblkid == info.metadata_arr[vidsetind].sourcedata.length - 1) {

			// Remove the characters behind the caret
			endstr = info.metadata_arr[vidsetind].sourcedata[curblkid].substring(caretPos);
			frontstr = info.metadata_arr[vidsetind].sourcedata[curblkid].substring(0, caretPos);
			info.metadata_arr[vidsetind].sourcedata[curblkid] = frontstr;
			info.metadata_arr[vidsetind].sourcedatalen[curblkid] = info.metadata_arr[vidsetind].sourcedata[curblkid].length;

			info.metadata_arr[vidsetind].sourcedata.push(endstr);
			info.metadata_arr[vidsetind].sourcedatalen.push(endstr.length);
		} else {
			// Remove the characters behind the caret
			endstr = info.metadata_arr[vidsetind].sourcedata[curblkid].substring(caretPos);
			frontstr = info.metadata_arr[vidsetind].sourcedata[curblkid].substring(0, caretPos);
			info.metadata_arr[vidsetind].sourcedata[curblkid] = frontstr;
			info.metadata_arr[vidsetind].sourcedatalen[curblkid] = info.metadata_arr[vidsetind].sourcedata[curblkid].length;

			// Add the characters into the caret next line
			info.metadata_arr[vidsetind].sourcedata.splice(curblkid + 1, 0, endstr);
			info.metadata_arr[vidsetind].sourcedatalen.splice(curblkid + 1, 0, endstr.length);
		}
		info.metadata_arr[vidsetind].sourcedataraw = info.metadata_arr[vidsetind].sourcedata.join(separator);

	} else {
		if (curblkid == info.metadata_arr[vidsetind].transdata.length - 1) {
			// Remove the characters behind the caret
			endstr = info.metadata_arr[vidsetind].transdata[curblkid].substring(caretPos);
			frontstr = info.metadata_arr[vidsetind].transdata[curblkid].substring(0, caretPos);
			info.metadata_arr[vidsetind].transdata[curblkid] = frontstr;
			info.metadata_arr[vidsetind].transdatalen[curblkid] = info.metadata_arr[vidsetind].transdata[curblkid].length;

			info.metadata_arr[vidsetind].transdata.push(endstr);
			info.metadata_arr[vidsetind].transdatalen.push(endstr.length);
		} else {
			// Remove the characters behind the caret
			endstr = info.metadata_arr[vidsetind].transdata[curblkid].substring(caretPos);
			frontstr = info.metadata_arr[vidsetind].transdata[curblkid].substring(0, caretPos);
			info.metadata_arr[vidsetind].transdata[curblkid] = frontstr;
			info.metadata_arr[vidsetind].transdatalen[curblkid] = info.metadata_arr[vidsetind].transdata[curblkid].length;

			// Add the characters into the caret next line
			info.metadata_arr[vidsetind].transdata.splice(curblkid + 1, 0, endstr);
			info.metadata_arr[vidsetind].transdatalen.splice(curblkid + 1, 0, endstr.length);
		}
		info.metadata_arr[vidsetind].transdataraw = info.metadata_arr[vidsetind].transdata.join(separator);
	}
	

	return info
}

function addTextBoxToMetadata(clickedEle, info, separator, isSource) {
	var vidsetind = parseInt(($(clickedEle).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
	var curblkid = parseInt(($(clickedEle).parent().attr('id')).substring(1));

	if (isSource) {
		if (curblkid == info.metadata_arr[vidsetind].sourcedata.length - 1) {
			info.metadata_arr[vidsetind].sourcedata.push("");
			info.metadata_arr[vidsetind].sourcedatalen.push(0);
		} else {
			info.metadata_arr[vidsetind].sourcedata.splice(curblkid + 1, 0, "");
			info.metadata_arr[vidsetind].sourcedatalen.splice(curblkid + 1, 0, 0);
		}
		info.metadata_arr[vidsetind].sourcedataraw = info.metadata_arr[vidsetind].sourcedata.join(separator);

	} else {
		if (curblkid == info.metadata_arr[vidsetind].transdata.length - 1) {
			info.metadata_arr[vidsetind].transdata.push("");
			info.metadata_arr[vidsetind].transdatalen.push(0);
		} else {
			info.metadata_arr[vidsetind].transdata.splice(curblkid + 1, 0, "");
			info.metadata_arr[vidsetind].transdatalen.splice(curblkid + 1, 0, 0);
		}
		info.metadata_arr[vidsetind].transdataraw = info.metadata_arr[vidsetind].transdata.join(separator);
	}
	

	return info
}

function removeTextBoxFromMetadata(clickedEle, info, separator, isSource) {
	var vidsetind = parseInt(($(clickedEle).parent().parent().parent().parent().attr('id')).substring(1)) - 1;
	var curblkid = parseInt(($(clickedEle).parent().attr('id')).substring(1));

	if (isSource) {
		if (info.metadata_arr[vidsetind].sourcedata.length > 1) {
			info.metadata_arr[vidsetind].sourcedata.splice(curblkid, 1);
			info.metadata_arr[vidsetind].sourcedatalen.splice(curblkid, 1);
		}
		info.metadata_arr[vidsetind].sourcedataraw = info.metadata_arr[vidsetind].sourcedata.join(separator);

	} else {
		if (info.metadata_arr[vidsetind].transdata.length > 1) {
			info.metadata_arr[vidsetind].transdata.splice(curblkid, 1);
			info.metadata_arr[vidsetind].transdatalen.splice(curblkid, 1);
		}
		info.metadata_arr[vidsetind].transdataraw = info.metadata_arr[vidsetind].transdata.join(separator);
	}
	

	return info
}

function stickyScroll(video_container, dummy_container, stickyOffset) {
  if (window.pageYOffset >= stickyOffset) {

    video_container.classList.add("sticky");
    dummy_container.classList.add("expand");


  } else {

    video_container.classList.remove("sticky");
    dummy_container.classList.remove("expand");

  }
}

function skipVid(v1, isForward, skipDuration) {
	v1.pause();

	if (isForward == true) {
		v1.currentTime += skipDuration;
	}
	else {
		if (v1.currentTime - skipDuration > 0) {
			v1.currentTime -= skipDuration;
		}
		else {
			v1.currentTime = 0;
		}
	}
}

function convert() {
  var input = document.getElementById("srt");
  var output = document.getElementById("webvtt");
  var srt = input.value;
  var webvtt = srt2webvtt(srt);
  output.innerHTML = "<textarea rows=20 cols=80>"
                     + webvtt +
                     "</textarea>";
}

function getsrttime(data) {
  // remove dos newlines
  var srt = data.replace(/\r+/g, '');

  // trim white space start and end
  srt = srt.replace(/^\s+|\s+$/g, '');

  // get cues
  var cuelist = srt.split('\n\n');
  var vttresult = "";
  var metadata_arr = [];

  if (cuelist.length > 0) {
    for (var i = 0; i < cuelist.length; i=i+1) {
      var s = cuelist[i].split(/\n/);
	  var line = 0;
	  var metadata = {};

	  // detect identifier
	  if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
	    line += 1;
	  }

	  metadata.itemnum = s[0];

	  // get time strings
	  if (s[line].match(/\d+:\d+:\d+/)) {
	    // convert time string
	    var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);

	    if (m) {
	      metadata.shour = m[1];
	      metadata.smin = m[2];
	      metadata.ssecond = m[3];
	      metadata.smsecond = m[4];
	      metadata.stime = parseInt(m[1])*3600 + parseInt(m[2])*60 + parseInt(m[3]) + parseInt(m[4])/1000;
	      metadata.ehour = m[5];
	      metadata.emin = m[6];
	      metadata.esecond = m[7];
	      metadata.emsecond = m[8];
	      metadata.etime = parseInt(m[5])*3600 + parseInt(m[6])*60 + parseInt(m[7]) + parseInt(m[8])/1000;
	      metadata.timediff = metadata.etime - metadata.stime;
	      var v = convertTimeNumToString(metadata.timediff);
	      metadata.dhour = v[0];
	      metadata.dmin = v[1];
	      metadata.dsecond = v[2];
	      metadata.dmsecond = v[3];
	      metadata.sourcedata = [];
		  metadata.sourcedatalen = [];
		  metadata.sourcedataraw = "";
		  metadata.srcsrtcue = "";
		  metadata.srcvttcue = "";
		  metadata.transsrtcue = "";
		  metadata.transvttcue = "";
	  	  metadata.transdata = [];
		  metadata.transdatalen = [];
		  metadata.transdataraw = "";
		  metadata.noncompliant = false;
	  	} else {
	      // Unrecognized timestring
	      return "";
	    }
	  } else {
	  	// file format error or comment lines
	  	return "";
	  }
	  metadata_arr.push(metadata);
    }
  }

  // console.log(metadata_arr);

  return metadata_arr
}

function srt2webvtt(overall, data, metadata_arr, isSource) {
  // remove dos newlines
  var srt = data.replace(/\r+/g, '');

  // trim white space start and end
  srt = srt.replace(/^\s+|\s+$/g, '');

  overall.srcvttresult = "";
  overall.srcsrtresult = "";
  overall.transvttresult = "";
  overall.transsrtresult = "";

  // get cues
  var cuelist = srt.split('\n\n');

  if (metadata_arr.length > 0) {
  	if (isSource) {
  	  overall.srcvttresult = "WEBVTT\n\n";
  	} else {
  	  overall.transvttresult = "WEBVTT\n\n";
  	}
    
    for (var i = 0; i < metadata_arr.length; i=i+1) {
      convertSrtCue(cuelist[i], metadata_arr[i], isSource);
      if (isSource) {
      	overall.srcvttresult += metadata_arr[i].srcvttcue;
      	overall.srcsrtresult += metadata_arr[i].srcsrtcue;
      } else {
      	overall.transvttresult += metadata_arr[i].transvttcue;
      	overall.transsrtresult += metadata_arr[i].transsrtcue;
      }   
    }

    overall.metadata_arr = metadata_arr;
  }
  
  return overall;
}

function getSrtVttCues(info, mdaind, isSource) {
	var itemnum = info.metadata_arr[mdaind].itemnum + "\n";

	var shour = info.metadata_arr[mdaind].shour;
	var smin = info.metadata_arr[mdaind].smin;
	var ssecond = info.metadata_arr[mdaind].ssecond;
	var smsecond = info.metadata_arr[mdaind].smsecond;

	var ehour = info.metadata_arr[mdaind].ehour;
	var emin = info.metadata_arr[mdaind].emin;
	var esecond = info.metadata_arr[mdaind].esecond;
	var emsecond = info.metadata_arr[mdaind].emsecond;

	var timeSrt = shour+":"+smin+":"+ssecond+","+smsecond+" --> "+ehour+":"+emin+":"+esecond+","+emsecond+"\n";
	var timeVtt = shour+":"+smin+":"+ssecond+"."+smsecond+" --> "+ehour+":"+emin+":"+esecond+"."+emsecond+"\n";

	var data = isSource == true? info.metadata_arr[mdaind].sourcedata.join("\n") : info.metadata_arr[mdaind].transdata.join("\n");

	if (isSource) {
		info.metadata_arr[mdaind].srcsrtcue = itemnum + timeSrt + data + "\n\n";
		info.metadata_arr[mdaind].srcvttcue = itemnum + timeVtt + data + "\n\n";
	} else {
		info.metadata_arr[mdaind].transsrtcue = itemnum + timeSrt + data + "\n\n";
		info.metadata_arr[mdaind].transvttcue = itemnum + timeVtt + data + "\n\n";
	}

	return info
}

function convertSrtCue(caption, metadata, isSource) {
  // remove all html tags for security reasons
  //srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');

  var vttcue = "";
  var srtcue = "";
  var s = caption.split(/\n/);
  var line = 0;

  if (isSource) {
	  metadata.sourcedata.push(s[2]);
	  metadata.sourcedatalen.push(s[2].length);
	  metadata.sourcedataraw = s[2];
  } else {
	  metadata.transdata.push(s[2]);
	  metadata.transdatalen.push(s[2].length);
	  metadata.transdataraw = s[2];
  }
  

  // concatenate muilt-line string separated in array into one
  while (s.length > 3) {
      for (var i = 3; i < s.length; i++) {
      	  if (isSource) {
      	  	metadata.sourcedata.push(s[i]);
      	    metadata.sourcedatalen.push(s[i].length);
      	    metadata.sourcedataraw = metadata.sourcedataraw + s[i];
      	  } else {
      	  	metadata.transdata.push(s[i]);
      	    metadata.transdatalen.push(s[i].length);
      	    metadata.transdataraw = metadata.transdataraw + " " + s[i];
      	  }
      	  
          s[2] += "\n" + s[i]
      }

      s.splice(3, s.length - 3);
  }

  // detect identifier
  if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
    vttcue += s[0].match(/\w+/) + "\n";
    srtcue = vttcue;
    line += 1;
  }
  
  // get time strings
  if (s[line].match(/\d+:\d+:\d+/)) {
    // convert time string
    var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);

    if (m) {
      vttcue += m[1]+":"+m[2]+":"+m[3]+"."+m[4]+" --> "
            +m[5]+":"+m[6]+":"+m[7]+"."+m[8]+"\n";
      srtcue += m[1]+":"+m[2]+":"+m[3]+","+m[4]+" --> "
            +m[5]+":"+m[6]+":"+m[7]+","+m[8]+"\n";

      line += 1;

    } else {
      // Unrecognized timestring
      return "";
    }
  } else {
    // file format error or comment lines
    return "";
  }

  // get cue text
  if (s[line]) {
    vttcue += s[line] + "\n\n";
    srtcue += s[line] + "\n\n";
  }

  if (isSource) {
  	  metadata.srcvttcue = vttcue;
	  metadata.srcsrtcue = srtcue;
  } else {
      metadata.transvttcue = vttcue;
	  metadata.transsrtcue = srtcue;
  }
  
}

function convertTimeNumToString(time) {
	var v = [];
	var hour = Math.trunc(time / 3600);
	var min = Math.trunc(time / 60) - hour * 60;
	var second = Math.trunc(time) - (Math.trunc(time / 60) * 60);
	var msecond = Math.round((time - Math.trunc(time)) * 1000);
	v.push(padZero(hour.toString(), 2));
	v.push(padZero(min.toString(), 2));
	v.push(padZero(second.toString(), 2));
	v.push(padZero(msecond.toString(), 3));

	return v
}

function padZero(numstring, size) {
	var s = numstring + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function updateTimeHTML(info) {
	for (var i = 0; i < info.metadata_arr.length; i++) {
		var itemnum = info.metadata_arr[i].itemnum;

		var shour = info.metadata_arr[i].shour;
		var smin = info.metadata_arr[i].smin;
		var ssecond = info.metadata_arr[i].ssecond;
		var smsecond = info.metadata_arr[i].smsecond;

		var ehour = info.metadata_arr[i].ehour;
		var emin = info.metadata_arr[i].emin;
		var esecond = info.metadata_arr[i].esecond;
		var emsecond = info.metadata_arr[i].emsecond;

		var dhour = info.metadata_arr[i].dhour;
		var dmin = info.metadata_arr[i].dmin;
		var dsecond = info.metadata_arr[i].dsecond;
		var dmsecond = info.metadata_arr[i].dmsecond;

		var blk = "#b" + itemnum + " "; 

		var qshour = blk + ".controllable .timedisp .realtime .srctime #shour";
		var qsmin = blk + ".controllable .timedisp .realtime .srctime #smin";
		var qssecond = blk + ".controllable .timedisp .realtime .srctime #ssecond";
		var qsmsecond = blk + ".controllable .timedisp .realtime .srctime #smsecond";

		var qehour = blk + ".controllable .timedisp .realtime .desttime #ehour";
		var qemin = blk + ".controllable .timedisp .realtime .desttime #emin";
		var qesecond = blk + ".controllable .timedisp .realtime .desttime #esecond";
		var qemsecond = blk + ".controllable .timedisp .realtime .desttime #emsecond";

		var qdhour = blk + ".controllable .timedisp .timediff #dhour";
		var qdmin = blk + ".controllable .timedisp .timediff #dmin";
		var qdsecond = blk + ".controllable .timedisp .timediff #dsecond";
		var qdmsecond = blk + ".controllable .timedisp .timediff #dmsecond";

		$(qshour).html(shour);
		$(qsmin).html(smin);
		$(qssecond).html(ssecond);
		$(qsmsecond).html(smsecond);

		$(qehour).html(ehour);
		$(qemin).html(emin);
		$(qesecond).html(esecond);
		$(qemsecond).html(emsecond);

		$(qdhour).html(dhour);
		$(qdmin).html(dmin);
		$(qdsecond).html(dsecond);
		$(qdmsecond).html(dmsecond);
	}
}

// To be put into the #id-workable
function createInitialVidTimeSetHTML(info) {
	var div_Csmallvideoset_const = '<div class="smallvideoset block"';
	var div_Csubtitle = '<div class="subtitle block">';

	for (var i = 0; i < info.metadata_arr.length; i++) {
		var div_Csmallvideoset = div_Csmallvideoset_const + ' id="b' + info.metadata_arr[i].itemnum.toString() + '">'
		var htmlele_time = createInitialLoopableHTML_time(info, i);
		var htmlele_src = createInitialLoopableHTML_src(info, i);
		var htmlele_translate = createInitialLoopableHTML_translate(info, i);

		$("#id-workable")
			.append($(div_Csmallvideoset)
				.append(htmlele_time)
				.append($(div_Csubtitle)
					.append(htmlele_src)
					.append(htmlele_translate)));
	}  
}

function createInitialLoopableHTML_time(info, index) {
	var div_Ccontrollable = '<div class="controllable block">';
	var itemnum = info.metadata_arr[index].itemnum;

	var div_Citemnum = '<div class="itemnum inline-block">' + itemnum + '</div>';
	var div_Ctimedisp = '<div class="timedisp inline-block">';
	var div_Crealtime = '<div class="realtime inline-block">';
	var div_Csrctime = '<div class="srctime inline-block">';
	var div_Ishour = '<div id="shour" class="timelabel inline-block">??</div>: ';
	var div_Ismin = '<div id="smin" class="timelabel inline-block">??</div>: ';
	var div_Issecond = '<div id="ssecond" class="timelabel inline-block">??</div>: ';
	var div_Ismsecond = '<div id="smsecond" class="timelabel inline-block">??</div>';

	var div_Crightarrow = '<div class="rightarrow inline-block"><i class="fas fa-arrow-right"></i></i></div>';

	var div_Cdesttime = '<div class="desttime inline-block">';
	var div_Iehour = '<div id="ehour" class="timelabel inline-block">??</div>: ';
	var div_Iemin = '<div id="emin" class="timelabel inline-block">??</div>: ';
	var div_Iesecond = '<div id="esecond" class="timelabel inline-block">??</div>: ';
	var div_Iemsecond = '<div id="emsecond" class="timelabel inline-block">??</div>';

	var div_Cpointtimediff = '<div class="point-timediff inline-block"><i class="far fa-hand-point-right"></i></div>';

	var div_Ctimediff = '<div class="timediff inline-block">';
	var div_Idhour = '<div id="dhour" class="timelabel inline-block">??</div> h ';
	var div_Idmin = '<div id="dmin" class="timelabel inline-block">??</div> m ';
	var div_Idsecond = '<div id="dsecond" class="timelabel inline-block">??</div> s ';
	var div_Idmsecond = '<div id="dmsecond" class="timelabel inline-block">??</div> ms ';

	var div_Ccontrol = '<div class="control inline-block">';
	var div_Bskipplay = '<button id="id-b1-skip-play" class="skip-play button inline-block"><i class="fas fa-play"></i></button>';
	var div_Bskip = '<button id="id-b1-skip" class="skip button inline-block"><i class="fas fa-shipping-fast"></i></button>';

	var htmlele = $(div_Ccontrollable).append(div_Citemnum)
									  .append($(div_Ctimedisp)
									  	.append($(div_Crealtime)
									  		.append($(div_Csrctime)
									  			.append(div_Ishour)
									  			.append(div_Ismin)
									  			.append(div_Issecond)
									  			.append(div_Ismsecond))
									  		.append(div_Crightarrow)
									  		.append($(div_Cdesttime)
									  			.append(div_Iehour)
									  			.append(div_Iemin)
									  			.append(div_Iesecond)
									  			.append(div_Iemsecond)))
									  	.append(div_Cpointtimediff)
									  	.append($(div_Ctimediff)
									  		.append(div_Idhour)
									  		.append(div_Idmin)
									  		.append(div_Idsecond)
									  		.append(div_Idmsecond)))
									  .append($(div_Ccontrol)
									  	.append(div_Bskipplay)
									  	.append(div_Bskip))

	return htmlele;
}

function updateSourceText(info) {
	for (var i = 0; i < info.metadata_arr.length; i++) {
		var itemnum = info.metadata_arr[i].itemnum;
		var sourcedata = info.metadata_arr[i].sourcedata;
		var sourcedatalen = info.metadata_arr[i].sourcedatalen;

		var blk = "#b" + itemnum + " ";
		var qsrctxt = blk + ".subtitle .src #s0";
		var qsrc = blk + ".subtitle .src";

		$(qsrctxt).remove();

		for (var j = 0; j < sourcedata.length; j++) {

			var div_Cblock = '<div id="s' + j.toString() + '" class="srcblock block">';
			var label_Clabel = '<label for="srctxt" class="inline-block label">S:</label>';
			var button_Cremove = '<button class="remove inline-block button"><i class="fas fa-trash-alt"></i></button>';
			var button_Cadd = '<button class="add inline-block button"><i class="fas fa-plus"></i></button>'
			var input_Isrctxt = '<input type="text" name="srctxt" class="srctxt inline-block" value="' + sourcedata[j] + '">';
			var div_Cchrcount = '<div class="chrcount inline-block">' + sourcedatalen[j] + '</div>';
			
			$(qsrc).append($(div_Cblock)
	       				.append(label_Clabel)
	       				.append(input_Isrctxt)
	       				.append(div_Cchrcount)
	       				.append(button_Cremove)
	       				.append(button_Cadd));

			if (sourcedata.length == 1) {
				$(qsrc + " #s" + j.toString() + " .remove").prop("disabled", true);
			}
		}
	}

	
}

function createInitialLoopableHTML_src(info, index) {
	var itemnum = info.metadata_arr[index].itemnum;

	var div_Csrc = '<div class="src inline-block">';

	var div_Cblock = '<div id="s0" class="srcblock block">';
	var label_Clabel = '<label for="srctxt" class="inline-block label">S:</label>';
	var button_Cremove = '<button class="remove inline-block button"><i class="fas fa-trash-alt"></i></button>';
	var button_Cadd = '<button class="add inline-block button"><i class="fas fa-plus"></i></button>'
	var input_Isrctxt = '<input type="text" name="srctxt" class="srctxt inline-block" value="">';
	var div_Cchrcount = '<div class="chrcount inline-block">0</div>';

	var htmlele = $(div_Csrc).append($(div_Cblock)
			       				.append(label_Clabel)
			       				.append(input_Isrctxt)
			       				.append(div_Cchrcount)
			       				.append($(button_Cremove).prop('disabled', true))
			       				.append(button_Cadd));

	return htmlele
}

function updateTranslatedText(info) {
	for (var i = 0; i < info.metadata_arr.length; i++) {
		var itemnum = info.metadata_arr[i].itemnum;
		var transdata = info.metadata_arr[i].transdata;
		var transdatalen = info.metadata_arr[i].transdatalen;

		var blk = "#b" + itemnum + " ";
		var qtrntxt = blk + ".subtitle .translated #s0";
		var qtrn = blk + ".subtitle .translated";

		$(qtrntxt).remove();

		for (var j = 0; j < transdata.length; j++) {

			var div_Cblock = '<div id="s' + j.toString() + '" class="transblock block">';
			var label_Clabel = '<label for="srctxt" class="inline-block label">D:</label>';
			var button_Cremove = '<button class="remove inline-block button"><i class="fas fa-trash-alt"></i></button>';
			var button_Cadd = '<button class="add inline-block button"><i class="fas fa-plus"></i></button>'
			var input_Itranstxt = '<input type="text" name="subtxt" class="subtxt inline-block" value="' + transdata[j] + '">';
			var div_Cchrcount = '<div class="chrcount inline-block">' + transdatalen[j] + '</div>';
			
			$(qtrn).append($(div_Cblock)
	       				.append(label_Clabel)
	       				.append(input_Itranstxt)
	       				.append(div_Cchrcount)
	       				.append(button_Cremove)
	       				.append(button_Cadd));

			if (transdata.length == 1) {
				$(qtrn + " #s" + j.toString() + " .remove").prop("disabled", true);
			}
		}
	}
}

function createInitialLoopableHTML_translate(info, index) {
	var itemnum = info.metadata_arr[index].itemnum;

	var div_Ctranslated = '<div class="translated inline-block">';

	var div_Cblock = '<div id="s0" class="transblock block">';
	var label_Clabel = '<label for="subtxt" class="inline-block label">D:</label>';
	var button_Cremove = '<button class="remove inline-block button"><i class="fas fa-trash-alt"></i></button>';
	var button_Cadd = '<button class="add inline-block button"><i class="fas fa-plus"></i></button>'
	var input_Itranstxt = '<input type="text" name="subtxt" class="subtxt inline-block" value="">';
	var div_Cchrcount = '<div class="chrcount inline-block">0</div>';


	var htmlele = $(div_Ctranslated).append($(div_Cblock)
			       				  		.append(label_Clabel)
			       				  		.append(input_Itranstxt)
			       				  		.append(div_Cchrcount)
			       				  		.append($(button_Cremove).prop('disabled', true))
			       				  		.append(button_Cadd));

	return htmlele
}

function createLoopableHTML_time(info, index) {
	var div_Ccontrollable = '<div class="controllable block">';

	var itemnum = info.metadata_arr[index].itemnum;
	var shour = info.metadata_arr[index].shour;
	var smin = info.metadata_arr[index].smin;
	var ssecond = info.metadata_arr[index].ssecond;
	var smsecond = info.metadata_arr[index].smsecond;
	var ehour = info.metadata_arr[index].ehour;
	var emin = info.metadata_arr[index].emin;
	var esecond = info.metadata_arr[index].esecond;
	var emsecond = info.metadata_arr[index].emsecond;
	var dhour = info.metadata_arr[index].dhour;
	var dmin = info.metadata_arr[index].dmin;
	var dsecond = info.metadata_arr[index].dsecond;
	var dmsecond = info.metadata_arr[index].dmsecond;
	
	
	var div_Citemnum = '<div class="itemnum inline-block">' + itemnum + '</div>';
	var div_Ctimedisp = '<div class="timedisp inline-block">';
	var div_Crealtime = '<div class="realtime inline-block">';
	var div_Csrctime = '<div class="srctime inline-block">';
	var div_Ishour = '<div id="shour" class="timelabel inline-block">' + shour + '</div>:';
	var div_Ismin = '<div id="smin" class="timelabel inline-block">' + smin + '</div>:';
	var div_Issecond = '<div id="ssecond" class="timelabel inline-block">' + ssecond + '</div>:';
	var div_Ismsecond = '<div id="smsecond" class="timelabel inline-block">' + smsecond + '</div>';

	var div_Crightarrow = '<div class="rightarrow inline-block"><i class="fas fa-arrow-right"></i></i></div>';

	var div_Cdesttime = '<div class="desttime inline-block">';
	var div_Iehour = '<div id="ehour" class="timelabel inline-block">' + ehour + '</div>:';
	var div_Iemin = '<div id="emin" class="timelabel inline-block">' + emin + '</div>:';
	var div_Iesecond = '<div id="esecond" class="timelabel inline-block">' + esecond + '</div>:';
	var div_Iemsecond = '<div id="emsecond" class="timelabel inline-block">' + emsecond + '</div>';

	var div_Cpointtimediff = '<div class="point-timediff inline-block"><i class="far fa-hand-point-right"></i></div>';

	var div_Ctimediff = '<div class="timediff inline-block">';
	var div_Idhour = '<div id="dhour" class="timelabel inline-block">' + dhour + '</div> h ';
	var div_Idmin = '<div id="dmin" class="timelabel inline-block">' + dmin + '</div> m ';
	var div_Idsecond = '<div id="dsecond" class="timelabel inline-block">' + dsecond + '</div> s ';
	var div_Idmsecond = '<div id="dmsecond" class="timelabel inline-block">' + dmsecond + '</div> ms ';

	var div_Ccontrol = '<div class="control inline-block">';
	var div_Bskipplay = '<button id="id-b1-skip-play" class="skip-play button inline-block"><i class="fas fa-play"></i></button>';
	var div_Bskip = '<button id="id-b1-skip" class="skip button inline-block"><i class="fas fa-shipping-fast"></i></button>';


	var htmlele = $(div_Ccontrollable).append(div_Citemnum)
									  .append($(div_Ctimedisp)
									  	.append($(div_Crealtime)
									  		.append($(div_Csrctime)
									  			.append(div_Ishour)
									  			.append(div_Ismin)
									  			.append(div_Issecond)
									  			.append(div_Ismsecond))
									  		.append(div_Crightarrow)
									  		.append($(div_Cdesttime)
									  			.append(div_Iehour)
									  			.append(div_Iemin)
									  			.append(div_Iesecond)
									  			.append(div_Iemsecond)))
									  	.append(div_Cpointtimediff)
									  	.append($(div_Ctimediff)
									  		.append(div_Idhour)
									  		.append(div_Idmin)
									  		.append(div_Idsecond)
									  		.append(div_Idmsecond)))
									  .append($(div_Ccontrol)
									  	.append(div_Bskipplay)
									  	.append(div_Bskip))

	// console.log(htmlele);
	return htmlele
}

function createLoopableHTML_src(info, index) {
	var itemnum = info.metadata_arr[index].itemnum;
	var sourcedata = info.metadata_arr[index].sourcedata;
	var sourcedatalen = info.metadata_arr[index].sourcedatalen;

	var div_Cblock = [];

	var div_Csrc = '<div class="src inline-block">';
	var label_Clabel = '<label for="srctxt" class="inline-block label">S:</label>';
	var button_Cremove = '<button class="remove inline-block button"><i class="fas fa-trash-alt"></i></button>';
	var button_Cadd = '<button class="remove inline-block button"><i class="fas fa-plus"></i></button>'
	var input_Isrctxt = [];
	var div_Cchrcount = [];

	var htmlele = $(div_Csrc);

	for (var i = 0; i < sourcedata.length; i++) {
		div_Cblock.push('<div id="src-b' + itemnum.toString() + 's' + i.toString() + '" class="block">');
		input_Isrctxt.push('<input type="text" id="id-input-src-b' + itemnum.toString() + 's' + i.toString() + '-srctxt" name="srctxt" class="inline-block" value="' + sourcedata[i] + '">');
		div_Cchrcount.push('<div class="chrcount inline-block">' + sourcedatalen[i].toString() + '</div>');

		htmlele = $(htmlele).append($(div_Cblock[i])
				       			.append(label_Clabel)
				       			.append(input_Isrctxt[i])
				       			.append(div_Cchrcount[i]));

		$(htmlele).find('#src-b' + itemnum.toString() + 's' + i.toString()).append(button_Cremove);
		$(htmlele).find('#src-b' + itemnum.toString() + 's' + i.toString()).append(button_Cadd);
	}

	return htmlele
}

function createLoopableHTML_translate(info, index) {
	var itemnum = info.metadata_arr[index].itemnum;
	var sourcedata = info.metadata_arr[index].sourcedata;
	var sourcedatalen = info.metadata_arr[index].sourcedatalen;

	var div_Cblock = [];

	var div_Ctrans = '<div class="translated inline-block">';
	var label_Clabel = '<label for="subtxt" class="inline-block label">D:</label>';
	var button_Cremove = '<button class="remove inline-block button"><i class="fas fa-trash-alt"></i></button>';
	var button_Cadd = '<button class="remove inline-block button"><i class="fas fa-plus"></i></button>'
	var input_Itranstxt = [];
	var div_Cchrcount = [];

	var htmlele = $(div_Ctrans);

	for (var i = 0; i < sourcedata.length; i++) {
		div_Cblock.push('<div id="trn-b' + itemnum.toString() + 's' + i.toString() + '" class="block">');
		input_Itranstxt.push('<input type="text" id="id-input-trn-b' + itemnum.toString() + 's' + i.toString() + '-subtxt" name="subtxt" class="inline-block" value="' + sourcedata[i] + '">');
		div_Cchrcount.push('<div class="chrcount inline-block">' + sourcedatalen[i].toString() + '</div>');

		htmlele = $(htmlele).append($(div_Cblock[i])
				       			.append(label_Clabel)
				       			.append(input_Itranstxt[i])
				       			.append(div_Cchrcount[i]));

		$(htmlele).find('#trn-b' + itemnum.toString() + 's' + i.toString()).append(button_Cremove);
		$(htmlele).find('#trn-b' + itemnum.toString() + 's' + i.toString()).append(button_Cadd);
	}
	

	return htmlele
}

// $("#id-google-translate").click(function(event) {
	// 	/* Act on the event */
	// 	var Http = new XMLHttpRequest();
	// 	var srclang = "zh";
	// 	var tgtlang = "en";
	// 	var resp = "";

	// 	for (var i = 0; i < info.metadata_arr.length; i++) {

	// 		var url = 'http://translate.googleapis.com/translate_a/single?client=gtx&sl=' + srclang + '&tl=' + tgtlang + '&dt=t&q=';
	// 		var srctext = info.metadata_arr[i].sourcedataraw;
	// 		url += encodeURI(srctext);
	// 		console.log(url);
	// 		Http.open("GET", url);
	// 		Http.send();

	// 		console.log(Http.readyState);
	// 		wait(5000);
	// 		console.log(Http.readyState);

	// 		resp = JSON.parse(Http.responseText);
	// 		info.metadata_arr[i].transdataraw = resp[0][0][0];
	// 		console.log(info.metadata_arr[i].transdataraw);
	// 	}
	// });

// Template HTML
// <div class="smallvideoset block">
// 	<div class="controllable block">
// 		<div class="itemnum inline-block">
// 			1
// 		</div>

// 		<div class="timedisp inline-block">
// 			<div class="realtime inline-block">
// 				<div class="srctime block">
// 					<div id="shour" class="timelabel inline-block">
// 						00
// 					</div>:

// 					<div id="smin" class="timelabel inline-block">
// 						02
// 					</div>:

// 					<div id="ssecond" class="timelabel inline-block">
// 						03
// 					</div>:

// 					<div id="smsecond" class="timelabel inline-block">
// 						500
// 					</div>
// 				</div>

// 				<div class="downarrow block">
// 					<i class="fas fa-long-arrow-alt-down"></i>
// 				</div>

// 				<div class="desttime block">
// 					<div id="ehour" class="timelabel inline-block">
// 						00
// 					</div>:

// 					<div id="emin" class="timelabel inline-block">
// 						02
// 					</div>:

// 					<div id="esecond" class="timelabel inline-block">
// 						07
// 					</div>:

// 					<div id="emsecond" class="timelabel inline-block">
// 						600
// 					</div>
// 				</div>
// 			</div>

// 			<div class="point-timediff inline-block">
// 				<i class="far fa-hand-point-right"></i>
// 			</div>
			
// 			<div class="timediff inline-block">
// 				<div id="dhour" class="timelabel inline-block">
// 					00
// 				</div>:

// 				<div id="dmin" class="timelabel inline-block">
// 					00
// 				</div>:

// 				<div id="dsecond" class="timelabel inline-block">
// 					04
// 				</div>:

// 				<div id="dmsecond" class="timelabel inline-block">
// 					100
// 				</div>
// 			</div>	
// 		</div>

// 		<div class="control inline-block">
// 			<button id="id-b1-skip-play" class="skip-play button block">
// 				<i class="fas fa-play"></i>
// 			</button>

// 			<button id="id-b1-skip" class="skip button block">
// 				<i class="fas fa-shipping-fast"></i>
// 			</button>
// 		</div>
// 	</div>

// 	<div class="subtitle block">
// 		<div class="src inline-block">
// 			<div class="block">
// 				<label for="srctxt" class="inline-block label">S:</label>
// 				<input type="text" id="id-b1-srctxt" name="srctxt" class="inline-block" value="I am so good...">
// 				<div class="chrcount inline-block">35</div>
// 			</div>

// 			<div class="block">
// 				<label for="srctxt" class="inline-block label">S:</label>
// 				<input type="text" id="id-b1-srctxt" name="srctxt" class="inline-block" value="...in the...">
// 				<div class="chrcount inline-block">35</div>
// 			</div>
// 		</div>

// 		<div class="translated inline-block">
// 			<div class="block">
// 				<label for="subtxt" class="inline-block label">D:</label>
// 				<input type="text" id="id-b1-subtxt" name="subtxt" class="inline-block">
// 				<div class="chrcount inline-block">30</div>
// 			</div>
// 		</div>
// 	</div>
// </div>