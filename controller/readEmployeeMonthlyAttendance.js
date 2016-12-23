var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");
/**  **/
router.get("/",function(req,res){

  try {
    var token = req.query.token,
        engineerId = req.query.engineerId,
        timeStamp = req.query.timeStamp,
        date = commonMethod.getMonthTimeStamp(timeStamp);
        commonMethod.readEmployeeAttendance(engineerId,date).then(function(data){
          var tempObj={token};
          tempObj.attendanceData=data;
          deriveDataEvent.employeeSnapshot(tempObj,engineerId);
          deriveDataEvent.once("employeeSnapshot",function(obj){
            res.send(obj);
          });
        }).catch(function(){
              res.status(404).send("user is not available or no Attendance entry");
        });

  } catch (e) {
    res.status(304).send("Bad Parameter");
  }
});

module.exports=router;
