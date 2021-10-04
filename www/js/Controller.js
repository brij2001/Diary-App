var Controller = function() {

    var controller = {
        self: null,
        initialize: function() {
            self = this;
            new SQLiteStorageService().done(function(service) {
                self.storageService = service;
                self.bindEvents();
                self.renderSearchView();
            }).fail(function(error) {
                alert(error);
            });

        },

        bindEvents: function() {
        	$('.tab-button').on('click', this.onTabClick);

        },

        onTabClick: function(e) {
        	e.preventDefault();
            if ($(this).hasClass('active')) {
                return;
            }

            var tab = $(this).data('tab');
            if (tab === '#add-tab') {
                self.renderPostView();
            } else {
                self.renderSearchView();
            }
        },

        renderPostView: function() {
            $('.tab-button').removeClass('active');
            $('#post-tab-button').addClass('active');

            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/post-note-view.html", function(data) {
                $('#tab-content').find('#post-note-form').on('submit', self.postnote);
            });
        },


        postnote: function(e) {

            e.preventDefault();
            var name = $('#note-name').val();
            var content = $('#note-content').val();
            var content = $('#content').val();
            var addLocation = $('#include-location').is(':checked');

            if (!name || !content || !content) {
                alert('Please fill in all fields');
                return;
            } else {
                var result = self.storageService.addnote(
                    name, content, content, addLocation);

                result.done(function() {
                    alert('note successfully added');
                    self.renderSearchView();
                }).fail(function(error) {
                    alert(error);
                });
            }
        },


        renderSearchView: function() {
            $('.tab-button').removeClass('active');
            $('#search-tab-button').addClass('active');

            var $tab = $('#tab-content');
            $tab.empty();

            var $noteTemplate = null;
            $("#tab-content").load("./views/search-note-view.html", function(data) {
                $('#addressSearch').on('click', function() {
                    alert('Not implemented');
                });

                $noteTemplate = $('.note').remove();

                var notes = self.storageService.getnotes().done(function(notes) {

                    for(var idx in notes) {
                        var $div = $noteTemplate.clone();
                        var note = notes[idx];

                        $div.find('.note-name').text(note.name);
                        $div.find('.note-description').text(note.content);
                        $div.find('.note-content').text(note.content);

                        if (note.location) {
                            var url =
                                '<a target="_blank" href="https://www.google.com.au/maps/preview/@' +
                                note.location.latitude + ',' + note.location.longitude + ',10z">Click to open map</a>';

                            $div.find('.note-location').html(url);
                        } else {
                            $div.find('.note-location').text("Not specified");
                        }

                        $tab.append($div);
                    }
                }).fail(function(error) {
                    alert(error);
                });
            });
        }
    }
    controller.initialize();
    return controller;
}
