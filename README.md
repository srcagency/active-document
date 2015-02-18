# Active Document

I encourage to read the source code as it is shorter and more precise than the
documentation.

Adds getter and setter methods to an object based on existing properties or
methods in their prototype.

Define attributes by adding properties (not prefixed with `_`) or methods
(prefixed with `get` or `set`) to the prototype before calling `decorate`.

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

The `decorate` function is simply a mixin. It copies functions to the
constructor and the prototype of the given object. This is known as
*concatenative inheritance*.

### Statics

In the car example these would be accessed as `Car.<name>` (e.g.
`Car.attributeNames`).

- `attributeNames`

	A list (`Array`) of defined attributes

- `addAttribute(name)`

	Add an attribute manually

- `toJSON(document)`

	Delegates to `document.toJSON()` (convenient for `.map` etc.)

- `fromJSON(json)` 
	
	Creates an object having `json` as its `attributes`.

	**Does not invoke constructor**.

	Use this for bootstrapping from a trusted external source such as a
	database or a web service.

### Methods (added to the prototype)

- `toJSON`

	Returns a copy of `obj.attributes`.

	Overwrite (define on the prototype) to customize format.

	Use this for shipping of to an external source such as a database or a web
	service.

### Elaborate example

```js
function Person(){
	// creates empty attributes container
	activeDocument.init.apply(this);

	// set some defaults
	this.born = (new Date()).getFullYear();
}

Object.assign(Person.prototype, {
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

Person.attributeNames; // [ 'firstName', 'lastName', 'born', 'name' ]

var child = new Person();

child.born; // 2014
child.firstName = 'Lucas';
child.lastName = 'williams';
child.name; // 'Lucas Williams'

child.toJSON(); // { firstName: 'Lucas', lastName: 'Williams', born: 2014 }

var father = Person.fromJSON({ lastName: 'Smith' });
```
