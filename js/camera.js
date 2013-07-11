/*
 * Copyright (c) 2012, Intel Corporation. All rights reserved.
 * File revision: 04 October 2012
 * Please see http://software.intel.com/html5/license/samples 
 * and the included README.md file for license terms and conditions.
 */

// Class representing a storage of cameraOptions
// with which camera.getPicture() is called
// See http://docs.phonegap.com/en/2.0.0/cordova_camera_camera.md.html for cameraOptions description

// Called on bodyLoad 
function onLoad() {
    
    document.addEventListener("deviceready", onDeviceReady, false);
    
}

// Called when Cordova is fully loaded (and calling to Cordova functions has become safe)
function onDeviceReady() {
    
    // Overwrite the default behavior of the device back button
    document.addEventListener("backbutton", onBackPress, false);
    
    // Bind application button elements with their functionality
    $("#open_camera_button").bind ("click", onCapture);
    $("#open_lib_button").bind ("click", onCapture);
    $("#open_alb_button").bind ("click", onCapture);
    $("#home_button").bind("click", removeTemporaryFiles); 
}

// Overwrites the default behavior of the device back button
function onBackPress(e) {
    
    // Skip application history and exit application if the home page (menu page) is active
    if($.mobile.activePage.is("#home_page")){
        
        e.preventDefault();
        removeTemporaryFiles();
        navigator.app.exitApp();
    }
    else {
        
        navigator.app.backHistory();
    }
}

// Removes all temporary files created by application. Is to be used when temporary files are not intended to be operated with further
function removeTemporaryFiles() {
    
    if (isIOS()) {
        
        // Currently camera.cleanup() seems not to remove files on iPad, iOS 5 and 6 (though onSuccess() function is called, 
        // as well as in the case of other PhoneGap file-remove operations).
        // Temporary directory is removed on application exit (e.g. on device switch off).
        //
        // navigator.camera.cleanup(onSuccess, onError); 
    }
    
    function onSuccess() {  }
    function onError(message) {  }
}

// Calls camera.getPicture() with cameraOptions customised by user
function onCapture(e) {
    
    var callerId = getTargetId(e, "a");
    
    navigator.camera.getPicture(onCaptureSuccess, onCaptureError, { quality : 100, 
                                                                    destinationType : Camera.DestinationType.FILE_URI, 
                                                                    sourceType : Camera.PictureSourceType.CAMERA;, 
                                                                    allowEdit : true, 
                                                                    encodingType : (typeof Camera !== "undefined") ? Camera.EncodingType.JPEG : 0,
                                                                    targetWidth : 1000,
                                                                    targetHeight : 1000,
                                                                    mediaType: Camera.MediaType.PICTURE,
                                                                    saveToPhotoAlbum : true,
                                                                    correctOrientation: true,
                                                                    popoverOptions : ((typeof Camera !== "undefined") && (typeof CameraPopoverOptions !== "undefined")) ? new CameraPopoverOptions(220, 600, 320, 480, Camera.PopoverArrowDirection.ARROW_DOWN) : null
                                                                  });
}

// Shows photo captured by camera.getPicture()
function onCaptureSuccess(imageData) {
    
    var photo = getElement("pic");
    photo.style.display = "block";
    photo.src = imageData;
    $.mobile.changePage("#result_page", "slideup");
}

// camera.getPicture() callback function that provides an error message  
function onCaptureError(message) { }

// Retrieves the underlying HTML DOM element from the event fired on jQuery element 
function getTargetId(event, tagName) {
    var target = (event.target.tagName == tagName)
                    ? event.target
                    : $(event.target).closest(tagName)[0]
    return target.id;
}

// Retrieves the HTML DOM element by the element id or returns the element if the element itself was sent to the function. 
function getElement(element) {
    
    if(typeof(element) == "string") {
    
        element = document.getElementById(element);
    }
    
    return element;
} 

// Determines whether the current device is running iOS
function isIOS() {

    var iDevices = ["iPad", "iPhone", "iPod"];

    for (var i = 0; i < iDevices.length ; i++ ) {
        
        if( navigator.platform.indexOf(iDevices[i]) !== -1){ 
            return true; 
        }
    }
    return false;
}
