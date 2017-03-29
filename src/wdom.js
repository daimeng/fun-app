// simple render function, for concept
// not meant to be efficient
function dumbRender(mount, node) {
    mount.innerHTML = '';
    mount.appendChild(node);
}

// mount to html node and initialize
function attach(mount, view, reduce, listeners) {
    var m = reduce({ type: 'INIT' });

    function dispatch(action) {
        m = reduce(action, m);
        dumbRender(mount, view(m, dispatch));

        if (listeners) {
            listeners(dispatch, action, m);
        }
    }

    // debug
    window.dispatch = dispatch;

    dumbRender(mount, view(m, dispatch));
}
