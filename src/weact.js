// handle different kinds of child nodes
function appendTo(parent, elm) {
    if (elm == null)
        return null;
    else if (elm.tagName)
        parent.appendChild(elm)
    else // text node
        parent.appendChild(document.createTextNode(elm))
}

// similar to react create element, but does simple composition of function
function createElm(tag, attrs, children) {
    var elm = document.createElement(tag);

    if (attrs) {
        Object.keys(attrs).forEach(function(k) {
            var val = attrs[k];

            // classes
            if (k === 'className') {
                elm.className = val;
            // handle events
            } else if (k === 'on')
                Object.keys(val).forEach(function(evt) {
                    elm.addEventListener(evt, val[evt]);
                })
            // normal attributes
            else
                elm.setAttribute(k, val);
        });
    }

    if (children) {
        // array of children
        if (children.forEach)
            children.forEach(function(child) {
                appendTo(elm, child);
            });
        // single nodes
        else
            appendTo(elm, children);
    }

    return elm;
}
