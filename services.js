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
    },
    prepareParties: function (requestingParty, receivingParties ){
      let allParties = [...requestingParty];
      for(let i = 0; i < receivingParties.length;i++){
        allParties = [...allParties,{ fields: [{ type: "email", value: receivingParties[i] }]}];
      }
      return allParties
    }
};