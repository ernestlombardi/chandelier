var ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);

    // Displays the form allowing a user to add a new post.
    app.get('/posts', contentHandler.displayMainPage);	
	app.get('/posts/:id', contentHandler.getPostsByChannel);
    app.delete('/delete/:postId', contentHandler.deletePost);
	app.post('/new-post', contentHandler.handleNewPost);
	app.post('/edit-post', contentHandler.handleEditPost);
	
	app.get('/user/:id', contentHandler.getUserChannels);
	app.post('/user/:id/read-post', contentHandler.readPost);
	app.post('/user/:id/unread-post', contentHandler.unreadPost);
	app.get('/users', contentHandler.getUsers);
	app.post('/new-user', contentHandler.handleNewUser);
	app.post('/edit-user', contentHandler.handleEditUser);
	
    // Error handling middleware
    app.use(ErrorHandler);
};
