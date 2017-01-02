var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.get("/", function(req, res) {
    try {
        var today = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate(),
            timeStamp = req.query.timeStamp,
            date = commonMethod.getFullTimeStamp(timeStamp),
            obj = {},
            monthAttendance = [],
            totalEmployee;
        deriveDataEvent.readTotalEmployee();

        deriveDataEvent.on("totalEmployee", function(data) {
            totalEmployee = data;
        });
        var tSplit = today.split("/");
        var dSplit = date.split("/");
        for (var i = 1; i <= monthDays(timeStamp); i++) {
            if ((tSplit[0] === dSplit[0] && tSplit[1] === dSplit[1]) && tSplit[2] < i) {
                monthAttendance.push({
                    "day": i,
                    "absent": "-"
                });
            } else {
                var promise = deriveDataEvent.readEmployeeUnmarkedAttendance(dSplit[0] + "/" + dSplit[1] + "/" + i, i).then(function(data) {
                    monthAttendance.push(data);
                });
            }
        }
        Promise.all([promise]).then(function() {
            res.send({
                timeStamp,
                "attendance": monthAttendance,
                totalEmployee
            })
        })

    } catch (e) {
console.log(e);
        res.status(304).send("Bad Parameter");
    }
});

module.exports = router;


function monthDays(time) {
    var date = new Date(Number.parseInt(time));
    var d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return d.getDate();
}
