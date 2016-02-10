var PostPage = require('./pages/post-page');

describe('Posts page', function () {

    var postPage = new PostPage();
    var testTitle = '_Automated_Test_';
    var testBody = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    var posts, startPostsTotal;

    beforeEach(function () {
        browser.get(postPage.url);
        posts = postPage.posts;
        postPage.getPostsCount().then(function (num) {
            startPostsTotal = num;
        });
    });

    it('should add a post', function () {
        postPage.enterTitle(testTitle);
        postPage.enterBody(testBody);
        postPage.save();

        //Assert a new post has been added to total number of posts
        expect(postPage.getPostsCount()).toEqual(startPostsTotal + 1);

        //Assert the test post was added with input values
        expect(postPage.getAllTitles()).toContain(testTitle);
    });

    it('should delete a post given a title', function () {
        postPage.deletePostByTitle(testTitle);

        //Assert test post has been deleted from total number of posts
        expect(postPage.getPostsCount()).toEqual(startPostsTotal - 1);

        //Assert the test post input values are not present in content
        expect(postPage.getAllTitles()).not.toContain(testTitle);
    });
});