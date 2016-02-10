var PostsDAO = require('./posts-dao').PostsDAO
  , sanitize = require('validator').sanitize // Helper to sanitize form input
  , UserDAO = require('./user-dao').UserDAO;

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    var posts = new PostsDAO(db);
	var user = new UserDAO(db);
    
	this.deletePost = function(req, res, next) {
        "use strict";
		
        var postId = req.params.id;
		
        posts.deleteEntry(postId, function(err, result) {
            "use strict";
            
			if (err) return next(err);
			
			return res.send([{response: 'post delete: done' + result}]);
        });
    };
	
    this.displayMainPage = function(req, res, next) {
        "use strict";

        //TODO: Impliment configurable maxShow
        posts.getPosts(10, function(err, results) {
            "use strict";

            if (err) return next(err);

			return res.send(results);
        });
    };

    this.getPostsByChannel = function(req, res, next) {
        "use strict";

        var channels = req.query.channels;
		
		//Clean-up if not an Array
		if(!Array.isArray(channels)){
			channels = [];
			channels[0] = req.query.channels;
		}

        posts.getPostsByChannel(channels, function(err, results) {
            "use strict";

            if (err) return next(err);

            return res.send(results);
        });
    };

	this.readPost = function(req, res, next) {
        "use strict";

        var userId = req.params.id;
		
		var postId = req.body.postId;
	
		user.markPostAsRead(userId, postId, function(err, callback) {
			"use strict";
            
			if (err) return next(err);
			
			return res.send([{response: 'post marked as read: done'}]);
		});
    };
	
	this.unreadPost = function(req, res, next) {
        "use strict";

        var userId = req.params.id;
		
		var postId = req.body.postId;
	
		user.markPostAsUnread(userId, postId, function(err, callback) {
			"use strict";
            
			if (err) return next(err);
			
			return res.send([{response: 'post marked as unread: done'}]);
		});
    };	
	
	this.getUserChannels = function(req, res, next) {
        "use strict";
		
		var userId = req.params.id;
		
		user.getChannels(userId, function(err, channels) {
			"use strict";
            
			if (err) return next(err);
			
			return res.send(channels);
		});
    };
	
	this.getUsers = function(req, res, next) {
        "use strict";
		
		user.getUsers({}, function(err, users) {
			"use strict";
            
			if (err) return next(err);
			
			return res.send(users);
		});
    };	
	
    this.displayPostNotFound = function(req, res, next) {
        "use strict";
        return res.send('Sorry, post not found', 404);
    };

    function extract_channels(channels) {
        "use strict";
		
        var cleaned = [];

        var channels_array = channels;

        for (var i = 0; i < channels_array.length; i++) {
            if ((cleaned.indexOf(channels_array[i]) == -1) && channels_array[i] != "") {
                cleaned.push(channels_array[i].replace(/\s/g,''));
            }
        }

        return cleaned
    }

    this.handleNewUser = function(req, res, next) {
        "use strict";
		
		var name = req.body.name;
		var channels = req.body.channels || ["all"];
		var read = req.body.read || [];
		
        var channels_array = extract_channels(channels);
	
        user.insertUser( name, read, channels_array, function(err, callback) {
            
			"use strict";

            if (err) return next(err);

            return res.send([{response: 'user add: done'}]);
        });
    };	
	
    this.handleEditUser = function(req, res, next) {
        "use strict";
		
		var userId = req.body._id;
		var name = req.body.name;
		var read = req.body.read;
		var channels = req.body.channels;
        var channels_array = extract_channels(channels);
		
        user.updateUser(userId, name, read, channels_array, function(err, callback) {
            
			"use strict";

            if (err) return next(err);

            return res.send([{response: 'user update: done'}]);
        });
    };	
	
    this.handleNewPost = function(req, res, next) {
        "use strict";
		
        var title = req.body.title;
        var post = req.body.body;
		var author = req.body.author;
		var channels = req.body.channels;
        var createDate = req.body.createDate;
		var publishDate = req.body.publishDate;
		var expireDate = req.body.expireDate;
		var sticky = req.body.sticky;

        var channels_array = extract_channels(channels);

        // looks like a good entry, insert it escaped
        var escaped_post = sanitize(post).escape();

        // substitute some <br> for the paragraph breaks
        var formatted_post = escaped_post.replace(/\r?\n/g,'<br>');
		
        posts.insertEntry(title, formatted_post, author, channels_array, 
			createDate, publishDate, expireDate, sticky, function(err, callback) {
            
			"use strict";

            if (err) return next(err);

            return res.send([{response: 'post add: done'}]);
        });
    };
	
    this.handleEditPost = function(req, res, next) {
        "use strict";
		
		var postId = req.body._id;
        var title = req.body.title;
        var post = req.body.body;
		var author = req.body.author;
		var channels = req.body.channels;
        var createDate = req.body.createDate;
		var publishDate = req.body.publishDate;
		var expireDate = req.body.expireDate;
		var sticky = req.body.sticky;

        var channels_array = extract_channels(channels);

        // looks like a good entry, insert it escaped
        var escaped_post = sanitize(post).escape();

        // substitute some <br> for the paragraph breaks
        var formatted_post = escaped_post.replace(/\r?\n/g,'<br>');
		
        posts.updateEntry(postId, title, formatted_post, author, channels_array, 
			createDate, publishDate, expireDate, sticky, function(err, callback) {
            
			"use strict";

            if (err) return next(err);

            return res.send([{response: 'post add: done'}]);
        });
    };	
}

module.exports = ContentHandler;
