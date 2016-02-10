var Config = require('../common/config');

var PostPage = function() {
    var config = new Config();

    this.url = config.env + '#/post';
    this.posts = element.all(by.repeater('post in posts'));
    this.title = element(by.model('post.title'));
    this.body = element(by.model('post.body'));
    this.saveButton = element(by.css('.save-post'));

    this.enterTitle = function(title) {
        this.title.sendKeys(title);
    };

    this.enterBody = function(body) {
        this.body.sendKeys(body);
    };

    this.save = function() {
        this.saveButton.click();
    };

    this.getPostDeleteButton = function (post) {
        return post.element(by.css('.delete-post'));
    };

    this.deletePostByTitle = function(title) {
        var testPost = this.getPostByTitle(title);
        this.getPostDeleteButton(testPost).click();
    };

    this.getAllTitles = function() {
        return element.all(by.binding('post.title')).map(function (elem) {
            return elem.getText();
        });
    };

    this.getPostsCount = function () {
        return this.posts.count().then(function (num) {
            return num;
        });
    };

    this.getPostByTitle = function (title) {
        return this.posts.filter(function (post) {
            return post.element(by.css('.post-title')).getText().then(function (content) {
                return content === title;
            });
        })
        .first();
    };
};

module.exports = PostPage;