const validator = require("email-validator");
module.exports = {
    validateParty: function (party){
      if(!party){
        return false
      }
      party = this.toArray(party);
      for(var i = 0; i < party.length;i++){
        if(!validator.validate(party[i])){
          return false;
        }
      }
      return true;
    },
    simpleLogging: function (status, message){
      console.log(status+": "+message);
    },
    toArray: function (array){
      if(!Array.isArray(array)){
        return [array];
      }
      return array;
    }
};