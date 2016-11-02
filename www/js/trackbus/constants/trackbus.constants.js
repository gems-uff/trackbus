angular
.module('trackbus')
.constant("TRACKBUS",
    {
        "MAX_LINES": 3,
        "TIME_TO_UPDATE": 30000, //miliseconds
        "BUS_NOTIFICATION_DISTANCE": 500, //kilometers
        "STOP_NOTIFICATION_DISTANCE": 500, //kilometers
        "LINE_RADIUS": 100 //kilometers
    }
);