var colorsys = require( 'colorsys' );
var request = require('request');
var Service, Characteristic;

const DEF_TIMEOUT = 5000;

module.exports = function( homebridge ) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory( "homebridge-http-rgb-bub", "HttpRGB", RgbAccessory );
};

function RgbAccessory( log, config ) {
  this.log = log;
  this.name = config.name;
  this.set_url = config.set_url;
  this.get_url = config.get_url;
  this.http_method = config.http_method || "GET";
  this.manufacturer = config.manufacturer || "@metbosch manufacturer";
  this.model = config.model || "Model not available";
  this.serial = config.serial || "Non-defined serial";
  this.timeout = config.timeout || DEF_TIMEOUT;
  this.hsv = {
    h: 0,
    s: 0,
    v: 0
  };

  this.log( "Initialized '" + this.name + "'" );
}

RgbAccessory.prototype.setColor = function(hsv) {
  var color = colorsys.hsv_to_hex( hsv );
  color = color.substring(1, color.length);

  var ops = {
    uri: this.set_url.replace('%s', color),
    method: this.http_method,
    timeout: this.timeout
  };
  this.log('Setting color on "' + ops.uri + '", method ' + ops.method + ', to ' + color);
  request(ops, (error, res, body) => {
     if (error) {
        this.log('HTTP bad response (' + ops.uri + '): ' + error.message);
     } else {
        this.log('HTTP successful response: Color set');
     }
  });
  
};

RgbAccessory.prototype.getColor = function(callback) {
  var ops = {
     uri:    this.get_url,
     method: this.http_method,
     timeout: this.timeout
  };
  this.log('Requesting color on "' + ops.uri + '", method ' + ops.method);
  request(ops, (error, res, body) => {
     var value = {};
     if (error) {
       this.log('HTTP bad response (' + ops.uri + '): ' + error.message);
     } else {
       var color = '#000000';
       body = body.substring(0, 7);
       color = color.substring(0, color.length - body.length).concat(body);
       value = colorsys.hex_to_hsv(color);
       this.log('HTTP successful response: ' + color + '. Parsed color is {h: ' + value.h + ', s: ' + value.s + ', v: ' + value.v + '}');
     }
     callback(error, value);
  });
};

RgbAccessory.prototype.getServices = function() {
  var lightbulbService = new Service.Lightbulb( this.name );
  var bulb = this;

  lightbulbService
    .getCharacteristic( Characteristic.On )
    .on( 'get', function( callback ) {
      bulb.getColor((err, hsv) => {
        callback(err, hsv.v !== 0);
      });
    } )
    .on( 'set', function( value, callback ) {
      bulb.log('Set Characteristic.On to ' + value);
      bulb.hsv.v = value ? (bulb.hsv.v > 0 ? bulb.hsv.v : 100) : 0;
      bulb.setColor(bulb.hsv);
      callback();
    } );

  lightbulbService
    .addCharacteristic( Characteristic.Brightness )
    .on( 'get', function( callback ) {
      bulb.getColor((err, hsv) => {
        callback( err, hsv.v );
      });
    } )
    .on( 'set', function( value, callback ) {
      bulb.log('Set Characteristic.Brightness to ' + value);
      bulb.hsv.v = value;
      bulb.setColor(bulb.hsv);
      callback();
    } );

  lightbulbService
    .addCharacteristic( Characteristic.Hue )
    .on( 'get', function( callback ) {
      bulb.getColor((err, hsv) => {
        callback( err, hsv.h );
      });
    } )
    .on( 'set', function( value, callback ) {
      bulb.log('Set Characteristic.Hue to ' + value);
      bulb.hsv.h = value;
      bulb.setColor(bulb.hsv);
      callback();
    } );

  lightbulbService
    .addCharacteristic( Characteristic.Saturation )
    .on( 'get', function( callback ) {
      bulb.getColor((err, hsv) => {
        callback( err, hsv.s );
      });
    } )
    .on( 'set', function( value, callback ) {
      bulb.log('Set Characteristic.Saturation to ' + value);
      bulb.hsv.s = value;
      bulb.setColor(bulb.hsv);
      callback();
    } );

  return [ lightbulbService ];
};
