SQLiteStorageService = function () {
    var service = {};
    var db = window.sqlitePlugin ?
        window.sqlitePlugin.openDatabase({name: "demo.toptal", location: "default"}) :
        window.openDatabase("demo.toptal", "1.0", "DB para FactAV", 5000000);

    service.initialize = function() {

        var deferred = $.Deferred();
        db.transaction(function(tx) {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS notes ' +
                '(id integer primary key, name text, description text, content text, latitude real, longitude real)'
            ,[], function(tx, res) {
                tx.executeSql('DELETE FROM notes', [], function(tx, res) {
                    deferred.resolve(service);
                }, function(tx, res) {
                    deferred.reject('Error initializing database');
                });
            }, function(tx, res) {
                deferred.reject('Error initializing database');
            });
        });
        return deferred.promise();
    }

    service.getnotes = function() {
    	var deferred = $.Deferred();

        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM notes', [], function(tx, res) {

                var notes = [];
                console.log(res.rows.length);
                for(var i = 0; i < res.rows.length; i++) {
                    var note = { name: res.rows.item(i).name, content: res.rows.item(i).content, content: res.rows.item(i).content };
                    if (res.rows.item(i).latitude && res.rows.item(i).longitude) {
                        note.location = {
                            latitude: res.rows.item(i).latitude,
                            longitude: res.rows.item(i).longitude
                        }
                    }
                    notes.push(note);
                }
                deferred.resolve(notes);

            }, function(e) {
                deferred.reject(e);
            });
        });
        return deferred.promise();
    }

    service.addnote = function(name, content, content, addLocation) {
        var deferred = $.Deferred();
        console.log(db);
        if (addLocation) {
            navigator.geolocation.getCurrentPosition (
                function(position) {
                    var lat = position.coords.latitude;
                    var lon = position.coords.longitude;

                    db.transaction(
                    	function(tx) {
                            tx.executeSql('INSERT INTO notes (name, content, content, latitude, longitude) VALUES (?,?,?,?,?)',
                                [name, content, content, lat, lon],
                                function(tx, res)
                            {
                                console.log('success');
                                deferred.resolve();
                            }, function(e)
                            {
                                console.log('failure');
                                deferred.reject('Error posting a new note');
                            });
                        },
                        function() {
                            deferred.reject('Error during save process. ');
                        }
                    );
                },
                function() {
                    deferred.reject(
                            'We could not fetch your current location. ' +
                            'Please try again or post a note without adding a location');
                },
                {maximumAge: 60000, timeout: 5000, enableHighAccuracy: true}
            );
        } else {
            db.transaction(function(tx) {
                tx.executeSql('INSERT INTO notes (name, content, content) VALUES (?,?,?)', [name, content, content], function(tx, res) {
                    deferred.resolve();
                }, function(e) {
                    deferred.reject(e);
                });
            });
        }
        return deferred.promise();
    }

    return service.initialize();
}
