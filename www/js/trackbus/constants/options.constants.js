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
            "BUS_DISTANCE": 500, //kilometers
            "STOP_DISTANCE": 500, //kilometers
            "TOURIST_DISTANCE": 500, //kilometers
        }
    }
);