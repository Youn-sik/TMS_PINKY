var FCM = require('fcm-node');
var serverKey = 'AAAAfXhPMwY:APA91bHSUEqHWbWFsDucyVThOkyyxZNw0DGdS10yDKRICpzhjfpxA65tCawhoHdbRhqeINProc-NyJReIS1crul877cKgZdxidNoFgEmUtPfFC1PcVXBAfPPHtlez9ryL-KihnIUPpby';
var fcm = new FCM(serverKey);

var regTokens = [
    "dnkqMk7ZQV2cSI1ManOEH8:APA91bGHi4egCRXqyieTsb6vppvCLoFRstchqaOkNXXscIN6c6tO5X_uh_9cbM1TlgbsSGAzE3krighTBpgdpeUy8aesrSOagwG51b3HWmqtG8qBexWuICcCicTsmwH5Q5IGCQSACKwn",
    "cMRjyZEwRnC0Y37HYFfEck:APA91bExKpojyKXnLuTIrB0qTSa_rA_XId_sDvZ4m8FPc3W1YPrYkrF8dI7zNE4ja-9xe8YOlzksW0Yd7hCWOpU0HLDXBotKygiFU1Ygf_iuHjdJqfVOE3bGqrzm9QdxGtzUspERLK1K",
    "fsbjTSObTUarxu-qA8z3YK:APA91bGLaIfS44CLX0NEssM7JzjGQwwR3q8sF2tGjoXuvqbS38A_6zT0ZpK1k3oyN4Pq76brEs5e9s890HAjk_nWIDIDPAs7bxmRZyE0zoDH-aFZjAC9P8Y5RWv57MKiXBz3PXwP2JRr"
]

var message = {
    //둘 이상의 멀티캐스트 메시지를 전송하려면 registration_ids 사용하기(to 대신) - 매개변수는 메세지를 보낼 등록 토큰의 배열이여야 한다. 최대 1~1,000개
    to:"fsbjTSObTUarxu-qA8z3YK:APA91bGLaIfS44CLX0NEssM7JzjGQwwR3q8sF2tGjoXuvqbS38A_6zT0ZpK1k3oyN4Pq76brEs5e9s890HAjk_nWIDIDPAs7bxmRZyE0zoDH-aFZjAC9P8Y5RWv57MKiXBz3PXwP2JRr",
    // registration_ids : regTokens,
    notification: {
        title: 'PINKY',
        body: 'pinky server started',
    },

    data: { //you can send only notification or only data(or include both)
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
