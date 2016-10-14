angular
.module('trackbus')
.constant("BUS",
    {
        "DATETIME": 0,
        "ORDER": 1,
        "LINE": 2,
        "LATITUDE": 3,
        "LONGITUDE": 4,
        "SPEED": 5,
        "DIRECTION": 6
    }
).constant("BUS_ICONS",
    [
        "img/bus_red.png",
        "img/bus_blue.png",
        "img/bus_green.png",
       	"img/bus_purple.png",
        "img/bus_brown.png"
    ]
).constant("BUS_STOP_ICON", "img/bus_stop.png");
