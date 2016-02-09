describe('Posts', function () {
    var testTitle = '_Automated_Test_';
    var testBody = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

    beforeEach(function () {
        browser.get('http://localhost:3000/#/post');
    });

    it('should add a post', function () {
        var posts = element.all(by.repeater('post in posts'));
        var startPostsTotal = 0;
        posts.count().then(function (num) {
            startPostsTotal = num;
            element(by.model('post.title')).sendKeys(testTitle);
            element(by.model('post.body')).sendKeys(testBody);
            element(by.css('.md-primary')).click().then(function () {
                var titles = element.all(by.binding('post.title')).map(function (elem) {
                    return elem.getText();
                });

                //Assert a new post has been added to total number of posts
                expect(posts.count()).toEqual(startPostsTotal + 1);

                //Assert the test post was added with input values
                expect(titles).toContain(testTitle);
            });
        });
    });

    it('should delete a post', function () {

        var posts = element.all(by.repeater('post in posts'));

        var startPostsTotal = 0;

        posts.count().then(function (num) {
            startPostsTotal = num;
            var post = element.all(by.repeater('post in posts')).filter(function (post) {
                return post.element(by.css('h4')).getText().then(function (content) {
                    return content === testTitle;
                });
            })
            .first()
            .element(by.css('.md-warn'))
            .click()
            .then(function () {
                var titles = element.all(by.binding('post.title')).map(function (elem) {
                    return elem.getText();
                });

                //Assert test post has been deleted from total number of posts
                expect(posts.count()).toEqual(startPostsTotal - 1);

                //Assert the test post input values are not present in content
                expect(titles).not.toContain(testTitle);
            });
        });
    });
});