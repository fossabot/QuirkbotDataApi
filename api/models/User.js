/**
* User.js
*
* @description :: General user
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require( 'bcrypt-nodejs' );
var uniqueNickname = false;

module.exports = {
	/**
	* Custom validation types
	*/
	types: {
		uniqueNickname: function( value ) {
			return uniqueNickname;
		}
	},

	attributes: {
		email: {
			type: 'email',
			required: true,
			protected: true
		},
		password: {
			type: 'string',
			required: true,
			protected: true
		},
		birthdate: {
			type: 'date',
			required: true,
			protected: true
		},
		country: {
			type: 'string',
			enum: [ 'se', 'cn', 'br', 'us', 'uk' ],
			protected: true
		},
		gender: {
			type: 'string',
			enum: [ 'm', 'f', 'noneof' ],
			protected: true
		},
		nickname: {
			type: 'alphanumericdashed',
			size: 30,
			uniqueNickname: true,
			required: true
		},
		region: {
			type: 'string',
			enum: [ 'china', 'world' ],
			defaultsTo: 'world'
		},
		confirmedEmail: {
			type: 'boolean',
			defaultsTo: false
		},
		toJSON: function() {
			var obj = this.toObject();

			//delete obj.id;
			delete obj.email;
			delete obj.password;
			delete obj.country;
			delete obj.gender;
			delete obj.birthdate;

			return obj;
    }
	},
	beforeCreate: function( value, next ) {
		if( !value.password ) {
			return next( { err: [ 'Password not found' ] } );
		}
		bcrypt.hash(
			value.password,
			bcrypt.genSaltSync(10),
			function() { /*progress*/ },
			function passwordEncrypted( err, encryptedPassword ) {
				if( err ) return next( err );
				value.password = encryptedPassword;
				next();
			}
		);
	},
	beforeValidate: function( values, cb ) {
		User.findOne( { email: values.email } ).exec( function ( err, record ) {
			uniqueEmail = !err && !record;
			User.findOne( { nickname: values.nickname } ).exec( function( err, record2 ) {
				uniqueNickname = !err && !record2;
				cb();
			});
		});
	},
	afterCreate: function( user, next ) {
		// Send confirmation email
		EmailService.sendConfirmation( user, function( err, response ) {});
		// Create example programs
		var promises = EXAMPLE_PROGRAMS.map(function(data){
			data.author = user.id;
			return Program.create(data);
		})
		Promise.all(promises)
		.then(function () {
			next();
		})
		.catch(next);
	}
};

var EXAMPLE_PROGRAMS = [
	{
		name:"EXAMPLE: Balance Game",
		tree:[{"id":"circuitTouch1","node":"makey-touch","visualX":202,"visualY":142,"inputs":[{"id":"place","value":"H","type":"Constant"},{"id":"sensitivity","value":"0","type":"Number"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"}]},{"id":"servoMotor1","node":"servo-motor","visualX":627,"visualY":481,"inputs":[{"id":"position","type":"Output","value":"converter1.out"},{"id":"place","value":"SERVO_BP1","type":"Constant"}]},{"id":"led2","node":"led","visualX":882,"visualY":27,"inputs":[{"id":"light","type":"Output","value":"circuitTouch1.out"},{"id":"place","value":"LE","type":"Constant"}]},{"id":"keyPress1","node":"key-press","visualX":779,"visualY":238,"inputs":[{"id":"trigger","value":"circuitTouch1.out","type":"Output"},{"id":"key","value":"KEY_SPACE","type":"Constant"}]},{"id":"converter1","node":"converter","visualX":411,"visualY":381,"inputs":[{"id":"in","value":"circuitTouch1.out","type":"Output"},{"id":"inMin","value":"0","type":"Number"},{"id":"inMax","type":"Number","value":"1"},{"id":"outMin","value":"0.4","type":"Number"},{"id":"outMax","type":"Number","value":"0.6"}]},{"id":"led1","node":"led","visualX":687,"visualY":28,"inputs":[{"id":"light","type":"Output","value":"circuitTouch1.out"},{"id":"place","value":"RE","type":"Constant"}]}],
		apiVersion:"0"
	},
	{
		name: "EXAMPLE: Shaking Bridge",
		tree:[{"id":"wave1","node":"wave","visualX":441,"visualY":58,"inputs":[{"id":"length","type":"Number","value":"0.2"},{"id":"type","value":"WAVE_SINE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"0.1"},{"id":"offset","value":"0","type":"Number"}]},{"id":"servoMotor1","node":"servo-motor","visualX":705,"visualY":160,"inputs":[{"id":"position","type":"Output","value":"wave1.out"},{"id":"place","value":"SERVO_BP1","type":"Constant"}]},{"id":"wave2","node":"wave","visualX":442,"visualY":453,"inputs":[{"id":"length","type":"Number","value":"0.5"},{"id":"type","value":"WAVE_SINE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"0.3"},{"id":"offset","value":"0","type":"Number"}]},{"id":"servoMotor2","node":"servo-motor","visualX":705,"visualY":554,"inputs":[{"id":"position","type":"Output","value":"wave2.out"},{"id":"place","value":"NO_LOCATION","type":"Constant"}]}],
		apiVersion:"0"
	},
	{
		name:"EXAMPLE: Thinking Hat",
		tree:[{"id":"dualColorLed1","node":"dual-color-led","visualX":956,"visualY":64,"inputs":[{"id":"color","value":"wave1.out","type":"Output"},{"id":"place","value":"H","type":"Constant"},{"id":"light","type":"Number","value":"1"}]},{"id":"dualColorLed2","node":"dual-color-led","visualX":1182,"visualY":401,"inputs":[{"id":"color","value":"wave2.out","type":"Output"},{"id":"place","value":"LA","type":"Constant"},{"id":"light","type":"Number","value":"1"}]},{"id":"dualColorLed3","node":"dual-color-led","visualX":1206,"visualY":796,"inputs":[{"id":"color","value":"wave3.out","type":"Output"},{"id":"place","value":"LL","type":"Constant"},{"id":"light","type":"Number","value":"1"}]},{"id":"dualColorLed4","node":"dual-color-led","visualX":693,"visualY":796,"inputs":[{"id":"color","value":"wave4.out","type":"Output"},{"id":"place","value":"RL","type":"Constant"},{"id":"light","type":"Number","value":"1"}]},{"id":"dualColorLed5","node":"dual-color-led","visualX":691,"visualY":405,"inputs":[{"id":"color","value":"wave5.out","type":"Output"},{"id":"place","value":"RA","type":"Constant"},{"id":"light","type":"Number","value":"1"}]},{"id":"wave1","node":"wave","visualX":687,"visualY":12,"inputs":[{"id":"length","type":"Number","value":"2"},{"id":"type","value":"WAVE_TRIANGLE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0","type":"Number"}]},{"id":"wave2","node":"wave","visualX":953,"visualY":359,"inputs":[{"id":"length","type":"Number","value":"2"},{"id":"type","value":"WAVE_TRIANGLE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0.2","type":"Number"}]},{"id":"wave3","node":"wave","visualX":956,"visualY":748,"inputs":[{"id":"length","type":"Number","value":"2"},{"id":"type","value":"WAVE_TRIANGLE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0.4","type":"Number"}]},{"id":"wave4","node":"wave","visualX":465,"visualY":750,"inputs":[{"id":"length","type":"Number","value":"2"},{"id":"type","value":"WAVE_TRIANGLE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0.6","type":"Number"}]},{"id":"wave5","node":"wave","visualX":464,"visualY":357,"inputs":[{"id":"length","type":"Number","value":"2"},{"id":"type","value":"WAVE_TRIANGLE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0.8","type":"Number"}]},{"id":"wave6","node":"wave","visualX":19,"visualY":90,"inputs":[{"id":"length","type":"Number","value":"1"},{"id":"type","value":"WAVE_SINE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0","type":"Number"}]},{"id":"servoMotor1","node":"servo-motor","visualX":223,"visualY":192,"inputs":[{"id":"position","type":"Output","value":"wave6.out"},{"id":"place","value":"SERVO_BP1","type":"Constant"}]},{"id":"servoMotor2","node":"servo-motor","visualX":216,"visualY":565,"inputs":[{"id":"position","type":"Output","value":"wave7.out"},{"id":"place","value":"SERVO_BP2","type":"Constant"}]},{"id":"wave7","node":"wave","visualX":13,"visualY":462,"inputs":[{"id":"length","type":"Number","value":"0.6"},{"id":"type","value":"WAVE_SINE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0","type":"Number"}]}],
		apiVersion:"0"
	},
	{
		name:"EXAMPLE: Blinking Star",
		tree:[{"id":"wave1","node":"wave","visualX":46.99712371826172,"visualY":141.5312614440918,"inputs":[{"id":"length","type":"Number","value":"0.8"},{"id":"type","value":"WAVE_RAMP_UP","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0","type":"Number"}]},{"id":"list1","node":"list","visualX":313.99713134765625,"visualY":374.64204025268555,"inputs":[{"id":"in","value":"wave1.out","type":"Output"},{"id":"items","children":[{"id":"items.0","value":"LA","type":"Constant"},{"id":"items.1","value":"LL","type":"Constant"},{"id":"items.2","value":"RL","type":"Constant"},{"id":"items.3","value":"RA","type":"Constant"},{"id":"items.4","value":"H","type":"Constant"}]}]},{"id":"wave2","node":"wave","visualX":539.9971504211426,"visualY":54.5312614440918,"inputs":[{"id":"length","type":"Number","value":"4"},{"id":"type","value":"WAVE_SINE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0","type":"Number"}]},{"id":"dualColorLed1","node":"dual-color-led","visualX":803.2698732013546,"visualY":344.0908622741699,"inputs":[{"id":"light","type":"Number","value":"1"},{"id":"color","value":"wave2.out","type":"Output"},{"id":"place","value":"list1.out","type":"Output"}]}],
		apiVersion:"0"
	},
	{
		name:"EXAMPLE: Striderbot",
		tree:[{"id":"led1","node":"led","visualX":511.3333740234375,"visualY":43,"inputs":[{"id":"light","type":"Output","value":"wave3.out"},{"id":"place","value":"LE","type":"Constant"}]},{"id":"led2","node":"led","visualX":509.3333740234375,"visualY":257,"inputs":[{"id":"light","type":"Output","value":"wave3.out"},{"id":"place","value":"LM","type":"Constant"}]},{"id":"servoMotor1","node":"servo-motor","visualX":942.3333740234375,"visualY":176,"inputs":[{"id":"position","type":"Output","value":"wave1.out"},{"id":"place","value":"SERVO_BP1","type":"Constant"}]},{"id":"led3","node":"led","visualX":507.3333740234375,"visualY":499,"inputs":[{"id":"light","type":"Output","value":"wave4.out"},{"id":"place","value":"RE","type":"Constant"}]},{"id":"led4","node":"led","visualX":503.3333740234375,"visualY":757,"inputs":[{"id":"light","type":"Output","value":"wave4.out"},{"id":"place","value":"RM","type":"Constant"}]},{"id":"servoMotor2","node":"servo-motor","visualX":937.3333740234375,"visualY":658,"inputs":[{"id":"position","type":"Output","value":"wave2.out"},{"id":"place","value":"SERVO_BP2","type":"Constant"}]},{"id":"wave1","node":"wave","visualX":722.3333435058594,"visualY":75,"inputs":[{"id":"length","type":"Number","value":"0.8"},{"id":"type","value":"WAVE_SINE","type":"Constant"},{"id":"min","value":"0.3","type":"Number"},{"id":"max","type":"Number","value":"0.7"},{"id":"offset","value":"0","type":"Number"}]},{"id":"wave2","node":"wave","visualX":724.3333435058594,"visualY":557,"inputs":[{"id":"length","type":"Number","value":"0.4"},{"id":"type","value":"WAVE_SINE","type":"Constant"},{"id":"min","value":"0.3","type":"Number"},{"id":"max","type":"Number","value":"0.7"},{"id":"offset","value":"0","type":"Number"}]},{"id":"wave3","node":"wave","visualX":184,"visualY":73,"inputs":[{"id":"length","type":"Number","value":"0.8"},{"id":"type","value":"WAVE_SINE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0","type":"Number"}]},{"id":"wave4","node":"wave","visualX":184,"visualY":567,"inputs":[{"id":"length","type":"Number","value":"0.4"},{"id":"type","value":"WAVE_SINE","type":"Constant"},{"id":"min","value":"0","type":"Number"},{"id":"max","type":"Number","value":"1"},{"id":"offset","value":"0","type":"Number"}]},{"id":"led5","node":"led","visualX":1071.45166015625,"visualY":1080.5994427263245,"inputs":[{"id":"light","type":"Number","value":"1"},{"id":"place","value":"NO_LOCATION","type":"Constant"}]}],
		apiVersion:"0"
	}
];
