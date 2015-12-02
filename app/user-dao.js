var ObjectId = require('mongodb').ObjectID;

/* The UserHandler must be constructed with a connected db */
function UserDAO(db) {
    "use strict";
	
    if (false === (this instanceof UserDAO)) {
        console.log('Warning: PostsDAO constructor called without "new" operator');
        return new UserDAO(db);
    }

    var user = db.collection("user");	
    
	this.getChannels = function(name, callback) {
        "use strict";

		user.find({"name": name}).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            callback(err, items);
        });		
    };
	
	this.getUsers = function(all, callback) {
        "use strict";
		
		user.find({}).toArray(function(err, users) {
            "use strict";

            if (err) return callback(err, null);

            callback(err, users);
        });		
    };	
	
	this.markPostAsRead = function(name, postId, callback) {
        "use strict";

		user.update({"name": name}, {$addToSet: {read: ObjectId(postId)}}, function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            callback(err, callback);
        });		
    };
	
	this.markPostAsUnread = function(name, postId, callback) {
        "use strict";

		user.update({"name": name}, {$pull: {read: ObjectId(postId)}}, function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            callback(err, callback);
        });		
    };
	
	this.insertUser = function (name, read, channels, callback) {
        "use strict";	
		
        // Build a new user
        var userObj = {
			"name": name,
			"read": read,
			"channels": channels,
		};		
		
		user.insert(userObj, function (err, result) {
            "use strict";

            if (err) return callback(err, null);
			
            callback(err, callback);
        });
    };
	
	this.updateUser = function (userId, name, read, channels, callback) {
        "use strict";

        // Build a new user
        var userObj = {
			"name": name,
			"read": read,
			"channels": channels,
		};	
		
        user.update({"_id": ObjectId(userId)}, userObj, function (err, result) {
            "use strict";

            if (err) return callback(err, null);
			
            callback(err, callback);
        });
    };		
}

module.exports.UserDAO = UserDAO;
