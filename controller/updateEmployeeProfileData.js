var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");

router.put("/",function(req,res){
  try {
    var temp = req.body;
    var obj= {};
    var keys = ["diploma","degree","discipline","yearOfPassing","aggregateIn","finalYearPercentage","trainingInstitute","trainingPeriod","training"];
    keys.forEach(function (k) {
      if(temp[k]===undefined || temp[k]===null || temp[k]=== ''){
        throw 400;
      }else {
        obj[k]=temp[k];
      }
    });

  commonMethod.updateEmployeeData(temp.engineerId,"educational",obj).then(function(){
    res.send({"token":temp.token,"status":200,"message":"Successfully Updated"});
  }).catch(data=>{res.status(404).send("User Not Found")});
} catch (e) {
  if(e===400)
  res.status(400).send("Bad Request Parameter");
  else
  res.status(401).send("invalid token");
  }

});

module.exports=router;
