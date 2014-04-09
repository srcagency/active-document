/* jslint node: true */
'use strict';

var activeDocument = require('./');
var test = require('tap').test;
var extend = require('extend');

test('active-document', function ( t ) {
	var Person = function ( attributes ) {
		activeDocument.init.call(this, attributes);
	};

	extend(Person.prototype, {
		firstName: null,
		lastName: null,
		born: null,
		unused: null,

		setLastName: function ( name ) {
			return this.set('lastName', name+'!');
		},

		getName: function () {
			return this.firstName+' '+this.lastName;
		},

		getBorn: function() {
			return 'nonsense';
		},
	});

	activeDocument.decorate(Person);

	var me = new Person();

	var friend = new Person();
	friend.firstName = 'Jacob';

	t.equal(me.firstName, undefined);
	t.equal(me.firstName = 'Thomas', 'Thomas');
	t.equal(me.firstName, 'Thomas');

	t.equal(me.getLastName(), undefined);
	t.equal(me.setLastName('Jensen'), 'Jensen!');
	t.equal(me.getLastName(), 'Jensen!');

	t.equal(me.name, 'Thomas Jensen!');

	t.equal(me.get('born'), undefined);
	t.equal(me.set('born', 1991), 1991);
	t.equal(me.get('born'), 1991);

	t.equal(friend.firstName, 'Jacob');

	t.deepEqual(me.attributes, { firstName: 'Thomas', lastName: 'Jensen!', 'born': 1991 });

	t.end();
});