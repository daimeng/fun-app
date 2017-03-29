var App = {};

(function(exports, global) {
    var w = createElm;

    // new object (not too important for fake react since no diffing)
    var merge = Object.assign.bind(Object, {});

    // init state
    var appState = {
        repoMAX: 5,
        userMAX: 5,
        ticker: null,
        activeView: null,
        loading: false,
        items: []
    }
    
    exports.tickInterval = 2 * 60 * 1000;
    // manipulate app state
    exports.reduce = function reduceApp(action, _model) {
        var model = _model || appState;

        // debug
        console.log(action, model);

        switch (action.type) {
            case 'REQUEST_LIST':
                return merge(
                    model,
                    { activeView: action.view, loading: true }
                );
            case 'RECEIVE_LIST':
                // check if still on correct view
                if (model.activeView === action.view)
                    return merge(
                        model,
                        { activeView: action.view, loading: false, items: action.items }
                    );
                else
                    return model;
            case 'RECEIVE_FOLLOWERS':
                // check if still on users view
                if (model.activeView === 'prolific_users')
                    return merge(
                        model,
                        { loading: false, items: action.items }
                    );
                else
                    return model;
            case 'SET_TICKER':
                var ticker = setInterval(
                    () => dispatch({ type: 'REQUEST_FOLLOWERS' }),
                    exports.tickInterval
                );

                return merge(
                    model,
                    { ticker: ticker }
                );
            case 'STOP_TICKER':
                clearInterval(model.ticker);

                return merge(
                    model,
                    { ticker: null }
                );
            default:
                return model;
        }
    }

    // helpers
    function monthAgo() {
        return new Date((new Date() - 2419200000)).toISOString().split('T')[0];
    }

    function yearAgo() {
        var now = new Date();
        now.setFullYear(now.getFullYear() - 1);
        return now.toISOString().split('T')[0]
    }

    function resJSON(res) { return res.json(); }
    exports.fetch = function(/*args*/) { return global.fetch.apply(global, arguments).then(resJSON); };

    // side effect handlers
    exports.listeners = function(dispatch, action, _model) {
        var model = _model || appState;

        switch (action.type) {
            case 'REQUEST_LIST':
                if (action.view === 'hot_repo') {
                    exports.fetch('https://api.github.com/search/repositories?q=created:%3E'+monthAgo()+'&sort=stars&order=desc')
                    .then(function(json) {
                        dispatch({ type: 'RECEIVE_LIST', view: 'hot_repo', items: json.items.slice(0, model.userMAX) });
                    })
                } else {
                    exports.fetch('https://api.github.com/search/users?q=created:%3E'+yearAgo()+'&sort=followers&order=desc')
                    .then(function(json) {
                        dispatch({ type: 'RECEIVE_LIST', view: 'prolific_users', items: json.items.slice(0, model.repoMAX) });
                        dispatch({ type: 'REQUEST_FOLLOWERS' });
                    })
                }
                break;
            case 'REQUEST_FOLLOWERS':
                if (model.activeView === 'prolific_users') {
                    var promises = model.items.map(function(user) {
                        return exports.fetch('https://api.github.com/users/'+user.login);
                    });
                    Promise.all(promises).then(function(allValues) {
                        return dispatch({
                            type: 'RECEIVE_FOLLOWERS',
                            items: allValues
                        });
                    })
                    if (!model.ticker) dispatch({ type: 'SET_TICKER' });
                } else {
                    if (model.ticker) dispatch({ type: 'STOP_TICKER' });
                }
                break;
            default:
                break;
                // noop
        }
    }

    exports.view = function view(model, d) {
        return ( model.loading
            ? loader(model.activeView, d)
            : listView(model, d)
        );
    }

    var repoColumns = [
        { name: 'id' },
        { name: 'full_name' },
        { name: 'description' },
        { name: 'stargazers_count' }
    ];

    var userColumns = [
        { name: 'id' },
        { name: 'login' },
        { name: 'avatar', type: 'image' },
        { name: 'followers'  }
    ]

    // TABLE
    function listView(model, d) {

        var view;
        if (model.activeView == null)
            view = 'Select a view!';
        else if (model.activeView === 'hot_repo')
            view = w('div', null, Table.table(model.items, repoColumns));
        else
            view = w('div', null, Table.table(model.items, userColumns));

        return (
            w('div', null, [
                view,
                w('button', {
                    id: 'hot_repo',
                    on: {
                        click: function() {
                            d({ type: 'REQUEST_LIST', view: 'hot_repo' });
                        }
                    }
                }, 'Hot Repos'),
                w('button', {
                    id: 'prolific_users',
                    on: {
                        click: function() {
                            d({ type: 'REQUEST_LIST', view: 'prolific_users' });
                        }
                    }
                }, 'Prolific Users')
            ])
        );
    }

    // LOADER
    function loader(activeView) {
        return w('div', null, 'Loading ' + activeView + '...');
    }
}(App, window))


