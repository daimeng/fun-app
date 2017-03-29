var Table = {};

(function(exports) {
    var w = createElm;

    function cell(data) {
        return w('div', { className: 'table-cell' }, data);
    }

    function imageCell(src) {
        return w('div', { className: 'table-cell' }, w('img', { src: src }, ''));
    }

    function header(columns) {
        return w('div', { className: 'table-row' }, columns.map(function(col) {
            return cell(col.name);
        }));
    }

    function body(data, columns) {
        return data.map(function(d) {
            return w('div', { className: 'table-row' }, columns.map(function(col) {
                return col.type === 'image' ? imageCell(d[col.name+'_url']) : cell(d[col.name]);
            }));
        })
    }

    exports.table = function(data, columns) {
        return (
            w('div', { className: 'table' }, [
                header(columns)
            ].concat(
                body(data, columns)
            ))
        );
    }
}(Table))