angular
.module('trackbus')
.constant("OPTIONS",
    {
        "SOUND": {
            "NO_SOUND": 0,
            "SOUND_ALERT": 1,
            "VOICE": 2
        },
        "DISTANCE": {
            "BUS_DISTANCE": 0.5, //kilometers
            "STOP_DISTANCE": 0.2, //kilometers
            "TOURIST_DISTANCE": 0.5, //kilometers
        },
        "PRECISION_MODE": false
    }
);