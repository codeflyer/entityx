var defineAddressStruct = require('../../structs/address.json');
var Builder = require('entityx').Builder;

var Address = Builder.buildValueObject(defineAddressStruct);
module.exports = Address;
