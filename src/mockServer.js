var mockServer = {};

(function(exports) {
    // simulate change
    var now = new Date();
    function followersInc(base, rate) {
        return Math.floor(base + rate * (new Date() - now) / 1000);
    }

    exports.fetch = function(url) {
        if (url.match(/search\/users/)) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve({ items: [
                        {
                            id: 1,
                            login: 'doge',
                            avatar_url: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg'
                        },
                        {
                            id: 2,
                            login: 'bob',
                            avatar_url: 'http://i.imgur.com/rD8FyKB.png'
                        }
                    ] });
                }, 200);
            });
        } else if (url.match(/search\/repositories/)) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve({ items: [
                        {
                            id: 1,
                            full_name: 'doge/doges',
                            description: 'cool doges pictures',
                            stargazers_count: '12018'
                        },
                        {
                            id: 2,
                            full_name: 'bob/dinosaurs',
                            description: 'bobs favorite dinosaur pictures',
                            stargazers_count: '3554'
                        }
                    ] });
                }, 200);
            });
        } else if (url.match(/users\/doge/)) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve(
                        {
                            id: 1,
                            login: 'doge',
                            avatar_url: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg',
                            followers: followersInc(13144, 1)
                        }
                    );
                }, 200);
            });
        } else if (url.match(/users\/bob/)) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve(
                        {
                            id: 2,
                            login: 'bob',
                            avatar_url: 'http://i.imgur.com/rD8FyKB.png',
                            followers: followersInc(2344, 0.4)
                        }
                    );
                }, 200);
            });
        }
    }
}(mockServer))