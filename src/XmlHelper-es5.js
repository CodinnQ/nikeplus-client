function _node(name, value, deep) {
    var node = '';
    if (value instanceof Array) {
        value.forEach(function (v, i) {
            return node += '\n'.repeat(i > 0 ? 1 : 0) + _node(name, v, deep);
        });
    } else if (value instanceof Object) {
        var attributes = Object.keys(value).filter(function (k) {
            return k.startsWith('@');
        });
        var childs = Object.keys(value).filter(function (k) {
            return !k.startsWith('@') && !!value[k];
        });

        var content = '';
        node = '\t'.repeat(deep) + '<' + name;
        attributes.forEach(function (k) {
            return node += ' ' + k.substr(1) + '="' + value[k] + '"';
        });
        childs.forEach(function (k, i) {
            return content += '\n' + _node(k, value[k], deep + 1) + '\n'.repeat(i + 1 == childs.length ? 1 : 0);
        });
        node += childs.length === 0 || content.replace(/\s|\n|\t/gm, '').length === 0 ? '/>' : '>' + content;
        node += childs.length > 0 && content.replace(/\s|\n|\t/gm, '').length > 0 ? '\t'.repeat(deep) + '</' + name + '>' : '';
    } else if (value !== null && value !== undefined) {
        if (name.startsWith('#cdata#')) {
            name = name.replace('#cdata#', '');
            value = '<![CDATA[' + value + ']]>';
        }
        node += '\t'.repeat(deep) + '<' + name + '>' + value.toString() + '</' + name + '>';
    }
    return node;
}

function ConvertFromObj(jsonObj) {
    var xml = '<?xml version="1.0" encoding="UTF-8" ?>\r\n';
    Object.keys(jsonObj).forEach(function (k) {
        return xml += _node(k, jsonObj[k], 0);
    });
    return xml;
}
