var FCM = require('fcm-node');
var serverKey = 'AAAAfXhPMwY:APA91bHSUEqHWbWFsDucyVThOkyyxZNw0DGdS10yDKRICpzhjfpxA65tCawhoHdbRhqeINProc-NyJReIS1crul877cKgZdxidNoFgEmUtPfFC1PcVXBAfPPHtlez9ryL-KihnIUPpby';
var fcm = new FCM(serverKey);

var message = {
to:'dZq8djW-SPC88u7Pm1VJuv:APA91bE1I4EykLhK1hctGmnSIsaT9gGzZRTyVdjdGBYpv2qY9mjudsLXJJBI973D-TuvuRr8Y0l5ZwTNAq6zu7nYy3pEUS4g9oyA522S24mc3U-77rhHLr8CTXArlU8zG9UjDKc6PZEK',
    notification: {
        title: 'PINKY',
        body: 'pinky server started',
    },

    data: { //you can send only notification or only data(or include both)
        title: 'ok cdfsdsdfsd',
        body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
    },

    priority: 'high'

};

fcm.send(message, function(err, response) {
    if (err) {
        console.log("Something has gone wrong!"+err);
        console.log("Respponse:! "+response);
    } else {
        // showToast("Successfully sent with response");
        console.log("Successfully sent with response: ", response);
    }

});
