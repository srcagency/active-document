'use strict';

var activeDocument = require('../');
var test = require('tape');
var extend = require('extend');

test(function( t ){
	var year = (new Date()).getFullYear();

	function Person(){
		activeDocument.init.apply(this);

		this.born = year;
	}

	extend(Person.prototype, {
		firstName: null,
		lastName: null,
		born: null,
		unused: null,
		bff: null,
		_secret: null,

		marry: function(){},

		setLastName: function( name ){
			this.attributes.lastName = name.substr(0, 1).toUpperCase() + name.substr(1);
		},

		getName: function(){
			return this.firstName + ' ' + this.lastName;
		},
	});

	activeDocument.decorate(Person);

	t.deepEqual(Person.attributeNames, [ 'firstName', 'lastName', 'born', 'unused', 'bff', 'name' ]);

	var a = new Person();

	var friend = new Person();
	friend.firstName = 'Jacob';

	var dude = Person.fromJSON({ lastName: 'Smith' });
	dude.bff = friend;

	t.ok(a.setLastName);
	t.notOk(a.getLastName);
	t.equal(typeof a.marry, 'function');

	t.equal(friend.firstName, 'Jacob');

	t.equal(a.firstName, undefined);
	t.equal(a.firstName = 'Sara', 'Sara');
	t.equal(a.firstName, 'Sara');

	t.equal(a.lastName, undefined);
	t.equal(a.lastName = 'jones', 'jones');
	t.equal(a.lastName, 'Jones');

	t.equal(a.name, 'Sara Jones');

	t.deepEqual(a.toJSON(), { firstName: 'Sara', lastName: 'Jones', born: year });
	t.deepEqual(a.attributes, a.toJSON());

	t.deepEqual(dude.toJSON(), { bff: dude.bff, lastName: 'Smith' });

	t.equal(JSON.stringify(dude.toJSON()), '{"lastName":"Smith","bff":{"born":2014,"firstName":"Jacob"}}');

	t.end();
});
