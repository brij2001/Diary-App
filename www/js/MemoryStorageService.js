MemoryStorageService = function () {
	var service = {};
	
    var notes = [
        { name: 'PHP Integrations note', content: 'PHPStorm', content: 'Integrate our php application with eBay'},
        { name: 'Java Junior Developer', content: 'Apache', content: 'Java junior developer for web app maintenance'},
        { name: 'JavaScript Virtual DOM Expert', content: 'Google', content: 'JS expert to help us optimize our web app\'s performance' }
    ];

    service.getnotes = function() {
        var deferred = $.Deferred();

    	deferred.resolve(notes.slice(0));
        return deferred.promise();
    }

    service.addnote = function(name, content, content, addLocation) {
    	
    	var note = {
    		name: name,
    		content: content,
    		content: content
    	};

        var dfd = new $.Deferred();
        if (addLocation) {
    		navigator.geolocation.getCurrentPosition(
			    function(position) {
			        note.loc = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    notes.push(note);
                    dfd.resolve();
			    },
			    function() {
                    alert('failure');
                    dfd.reject(
                            'We could not fetch your current location. ' + 
                            'Please try again or post a note without adding a location');
			    }
			);
    	} else {
            notes.push(note);
            dfd.resolve();
        }
        return dfd.promise();
    	
    }

	return service;
}