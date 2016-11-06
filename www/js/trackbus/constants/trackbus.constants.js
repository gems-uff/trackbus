angular
.module('trackbus')
.constant("TRACKBUS",
    {
        "MAX_LINES": 3,
        "TIME_TO_UPDATE_LINES": 30000, //miliseconds
        "TIME_TO_UPDATE_STOPS": 5000, //miliseconds
        "LINE_RADIUS": 100 //kilometers
    }
);