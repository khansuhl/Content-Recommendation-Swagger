var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.get("/",function(req,res){
  try {
  var tempData = req.query;
  var keys =["engineerId","token"];
  keys.forEach(function (k) {
    if(tempData[k]===undefined || tempData[k]===null || tempData[k]=== ''){
      throw 400;
    }
  });
commonMethod.readEmployeeByFieldData(tempData.engineerId,"tracking").then(function(data){
  var tempObj={};
  tempObj.trackingData=data;
  tempObj.token=tempData.token;
  deriveDataEvent.employeeSnapshot(tempObj,tempData.engineerId);
  deriveDataEvent.once("employeeSnapshot",function(obj){
    res.send(obj);
  });

}).catch(function(){
  res.status(404).send("engineerId invalid");
});
} catch (e) {
  if(e===400)
  res.status(400).send("Bad Request Parameter");
  else
  res.status(401).send("Bad Parameter or invalid token");
}
});

module.exports=router;
