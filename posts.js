var ObjectId = require('mongodb').ObjectID;

/* The PostsDAO must be constructed with a connected database object */
function PostsDAO(db) {
    "use strict";

    if (false === (this instanceof PostsDAO)) {
        console.log('Warning: PostsDAO constructor called without "new" operator');
        return new PostsDAO(db);
    }

    var posts = db.collection("posts");

	this.insertEntry = function (title, body, author, channels, createDate, publishDate, expireDate, sticky, callback) {
        "use strict";

        // Build a new post
        var post = {"title": title,
                "author": author,
                "body": body,
                "channels": channels,
                "createDate": createDate,
				"publishDate": publishDate,
				"expireDate": expireDate,
				"sticky": sticky
			};

        posts.insert(post, function (err, result) {
            "use strict";

            if (err) return callback(err, null);
			
            callback(err, callback);
        });
    };
	
	this.updateEntry = function (postId, title, body, author, channels, createDate, publishDate, expireDate, sticky, callback) {
        "use strict";

        // Build a new post
        var post = {"title": title,
                "author": author,
                "body": body,
                "channels": channels,
                "createDate": createDate,
				"publishDate": publishDate,
				"expireDate": expireDate,
				"sticky": sticky
			};

        posts.update({"_id": ObjectId(postId)}, post, function (err, result) {
            "use strict";

            if (err) return callback(err, null);
			
            callback(err, callback);
        });
    };
	
	this.deleteEntry = function (postId, callback) {
	
		posts.remove( {_id: ObjectId(postId) }, {safe: true}, function (err, result) {
            "use strict";

            if (err) return callback(err, null);
			
            callback(err, result);
        });
	
	};

    this.getPosts = function(num, callback) {
        "use strict";

		posts.find().limit(num).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            callback(err, items);
        });
		
    };

    this.getPostsByChannel = function(channels, callback) {
        "use strict";

        posts.find({"channels": {$in: channels}}).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);
			
			callback(err, items);
        });

    };
}

module.exports.PostsDAO = PostsDAO;
