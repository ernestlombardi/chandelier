var ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);

    app.get('/post', contentHandler.displayMainPage);
	app.get('/post/:id', contentHandler.getPostsByChannel);
    app.delete('/post/:id/delete', contentHandler.deletePost);
	app.post('/post/new-post', contentHandler.handleNewPost);
	app.post('/post/edit-post', contentHandler.handleEditPost);

    app.get('/user', contentHandler.getUsers);
    app.get('/user/:id', contentHandler.getUserChannels);
	app.post('/user/:id/read-post', contentHandler.readPost);
	app.post('/user/:id/unread-post', contentHandler.unreadPost);
	app.post('/user/new-user', contentHandler.handleNewUser);
	app.post('/user/edit-user', contentHandler.handleEditUser);
	
    // Error handling middleware
    app.use(ErrorHandler);
};
