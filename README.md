# Active Document

I encourage any user to read the source code.

Define attributes by adding properties (not prefixed with `_`) or methods (prefixed with `get` or `set`) to the prototype.

## Install

```shell
npm install active-document
```

## Use

```js
var activeDocument = require('active-document');

function Car(){
	activeDocument.init.apply(this);
}

activeDocument.decorate(Car);
```

### Constructor methods (static functions)
- `attributeNames` a list of defined attributes
- `addAttribute(name)` add attribute manually
- `toJSON` calls prototype `toJSON`
- `fromJSON(json)` 
	
	Creates an object having `json` as its `attributes` *does not invoke* constructor
	Use this for bootstrapping from a trusted external source such as a database

### Methods (added to the prototype)
- `toJSON`

	Returns a copy of `obj.attributes`
	Overwrite (define on the prototype) to customize format
	Use this for shipping of to an external source such as a database

### Elaborate example

```js
function Person(){
	// creates empty attributes container
	activeDocument.init.apply(this);

	// set some defaults
	this.born = (new Date()).getFullYear();
};

extend(Person.prototype, {
	firstName: null,
	lastName: null,
	born: null,
	_priv: null,

	setLastName: function( name ){
		this.attributes.lastName = name.substr(0, 1).toUpperCase() + name.substr(1);
	},

	getName: function(){
		return this.firstName + ' ' + this.lastName;
	},
});

activeDocument.decorate(Person);

Person.attributeNames // [ 'firstName', 'lastName', 'born', 'name' ]

var child = new Person();

child.born; // 2014
child.firstName = 'Lucas';
child.lastName = 'williams';
child.name; // 'Lucas Williams'

child.toJSON(); // { firstName: 'Lucas', lastName: 'Williams', born: 2014 }

var father = Person.fromJSON({ lastName: 'Smith' });
```
