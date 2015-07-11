'use strict';

/**
 * Dependancies
 */
var Graph = require('./../lib/graph');
var g = new Graph();

/*************************************************************************************
 *                              BASIC GRAPH OPERATIONS
 ************************************************************************************/

/**
 * Working WITHOUT sails-orientdb
 */
g.filter('', 'prof', {
    'firstname': 'test'
}, function(err, res) {
    if (err) throw err;
    console.log(res);
});

g.has('', 'prof', 'firstname', 'test', 'all', function(err, rec) {
    if (err) throw err;
    console.log(rec);
});

g.outE('', 'prof', 'id', '#12:5', 'E', function(err, rec) {
    if (err) throw err;
    console.log(rec);
});

g.shortestPath('', 'prof', '#12:15', '#12:9', 4, function(err, rec) {
    if (err) throw err;
    console.log(rec);
});


/**
 * Working WITH sails-orientdb
 */
var o = app.models.prof;

o.inV('id', '#12:0', function(err, resp) {
    o.dedup(resp, function(e, r) {
        console.log(r);
    });
});

o.loop('#12:15', 'loops<4', "firstname == 'test'", function(err, resp) {
    console.log(resp);
});

o.bothE('id', '#12:15', function(err, resp) {
    o.dedup(resp, function(err, r) {
        console.log(err, r);
    })
})


/*************************************************************************************
 *                              ADVANCED GRAPH OPERATIONS
 ************************************************************************************/

var s = app.models.student;
var p = app.models.prof;

// Get all classmates of a student
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

// Get all students who took courses taught by a professor and not classmates with a student
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

// Get all classmates of a student
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
