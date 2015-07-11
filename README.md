# graphDB-node
Advanced graph operations for Graph Databases and that can be used as an extension for [sails-orientdb](https://github.com/appscot/sails-orientdb).

## Rexster

Rexster provides a RESTful shell to any Blueprints-complaint graph database. This HTTP web service provides: a set of standard low-level GET, POST, and DELETE methods, a flexible extension model which allows plug-in like development for external services (such as ad-hoc graph queries through Gremlin), and a browser-based interface called The Dog House.

A graph database can be configured in Rexster and then accessed using the standard RESTful interface powered by the Rexster web server.

#### Installation

You can get the latest stable release of Rexster from its Download Page. The latest stable release when this page was last updated was 2.5.0.

Or you can build a snapshot by executing the following Git and Maven commands:

```bash
$ git clone https://github.com/tinkerpop/rexster.git
$ cd rexster
$ mvn clean install
```

#### Configuration

In order to configure Rexster to connect to your OrientDB graph, locate the rexster.xml in the Rexster directory and add the following snippet of code:

```xml
<rexster>
  ...
  <graphs>
    ...
    <graph>
      <graph-enabled>true</graph-enabled>
      <graph-name>orientdbsample</graph-name>
      <graph-type>com.tinkerpop.rexster.OrientGraphConfiguration</graph-type>
      <graph-location>{{ DATABASE'S LOCATION }}</graph-location>
      <extensions>
        <allows>
           <allow>tp:gremlin</allow>
        </allows>
      </extensions>
      <properties>
        <username>{{ USERNAME }}</username>
        <password>{{ PASSWORD }}</password>
      </properties>
    </graph>
  ...
  </graphs>
</rexster>
```
For instance, for local database, replace `{{ DATABASE'S LOCATION }}` by `remote:localhost/{{ DATABASE'S NAME }}`.

#### Run

Locate the BIN folder in the Rexster directory, and enter this command line :

```bash
$ ./rexster.sh -s -c ../config/rexster.xml 
```

## Installation

```bash
$ git clone git@github.com:haythemkh/graphDB-node.git
$ cd graphDB-node && npm install
```

To run your app, you need to run these step by step :

1. Your graph database server.
2. Rexster server.
3. Node.js application.

## Examples

#### Using sails-orientdb

```javascript
var orientAdapter = require('sails-orientdb');

require('{{ PATH TO GRAPH.JS }}')(orientAdapter);

module.exports = {
  	// Setup Adapters
  	// Creates named adapters that have have been required
	adapters: {
	   'default': orientAdapter,
	   orient: orientAdapter,
	},

	// Build Connections Config
	// Setup connections using the named adapter configs
	connections: {
	   myLocalOrient: {
		   adapter: 'orient',
		   host: 'localhost',
		   port: {{ PORT }},
		   user: '{{ USERNAME }}',
		   password: '{{ PASSWORD }}',
		   database: "{{ DATABASE'S NAME }}"
	   }
	},

	defaults: {
	   migrate: 'safe'
	}
}
```

Simple request :

```javascript
  var o = app.models.{{ COLLECTION NAME }};
  o.inV('id', '#12:0', function(err, resp) {
    if (err) throw err;
    console.log(resp);
  });
```

Nested request :

```javascript
  var o = app.models.{{ COLLECTION NAME }};
  o.inV('id', '#12:0', function(error, resp) {
    if (error) throw error;
    o.dedup(resp, function(e, r){
      if (e) throw e;
      o.count(r, function(err, c){
        if (err) throw err;
        console.log(c);
      });
    });
  });
```


#### Without sails-orientdb

```javascript
var Graph = require('{{ PATH TO GRAPH.JS }}');
var g = new Graph();
g.filter('{{ CONNECTION STRING }}', '{{ COLLECTION NAME }}', {
  'lastname': 'test',
  'familySituation': 'maried'
}, function(err, res) {
    if (err) throw err;
    console.log(res);
});
```

#### Advanced graph operations

```javascript
var s = app.models.student;
var p = app.models.prof;

// Get all of the classmates of a student
function getMyClassmates(app) {
    var idStd = '#12:0';
    s.bothByLabel('out', idStd, 'follows', function(e1, r1) {
        s.each(r1, {
            name: 'inV'
        }, function(e2, r2) {
            var r3 = s.dedup(r2);
            console.log(s.without(idStd, r3));
        })
    })
}

// Get all of the students who took courses taught by a professor and not classmates with a student
function getStudentsOfProfNotClassmatesWith(app) {
    var idProf = '#11:1';
    var idStd = '#12:3';

    p.bothByLabel('out', idProf, 'teachs', function(e1, r1) {
        ss.each(r1, {
            name: 'inV'
        }, function(e2, r2) {
            var arr1 = s.dedup(r2);

            s.bothByLabel('out', idStd, 'follows', function(e1, r4) {
                s.each(r4, {
                    name: 'inV'
                }, function(e2, r5) {
                    var r6 = s.dedup(r5);
                    var arr2 = s.without(idStd, r6);

                    console.log(s.without(arr1, arr2));
                })
            })
        })
    })
}

// Get all of the classmates of a student
function getMyFriends(app) {
    var id = '#12:0';
    s.bothByLabel('out', id, 'friend', function(e1, r1) {
        console.log(s.dedup(r1));
    })
}

// Get all of the shortest paths with depth = 5
function shortestPath(app) {
    var idStart = '#12:2';
    var idEnd = '#11:2';
    s.shortestPath(idStart, idEnd, 5, function(e1, r1) {
        console.log(r1);
    })
}

// Get all of the classmates of the students who took courses taught by a professor
function getFriendsClassmates(app) {
    var idProf = '#11:2';
    p.bothByLabel('out', idProf, 'teachs', function(e1, r1) {
        s.each(r1, {
            name: 'inV'
        }, function(e2, r2) {
            r2 = s.dedup(r2);
            s.each(r2, {
                name: 'getByRelationship',
                className: 'friend'
            }, function(err, r3) {
                console.log(r3);
            })
        });
    });
}
```

## Tests

All tests are written with [mocha](http://visionmedia.github.com/mocha/) and should be run with [npm](http://npmjs.org):

``` bash
  $ npm test
```

## Contributing

Contributions to the project are most welcome, so feel free to fork and improve.
