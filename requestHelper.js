exports.canAccess = function(err, res, log) {
    if (err) {
        if (!res) {
            log('Make sure that you are connected to the internet and can access "http://www.gitignore.io".')
        } else {
            log('An error has occurred, the response status code is:', res.statusCode);
        }
    } else {
        if (res.statusCode != 200) {
            log('An error has occurred, the response status code is:', res.statusCode);
        }
    }

    return !err;
};

exports.templateExists = function(body) {
    return !body.match(/\#!! ERROR:/i);
};

exports.getInvalidTemplates = function(body) {
    var matches = [],
        regex = new RegExp(/\#!! ERROR: (\w+)/ig),
        match;

    while (match = regex.exec(body)) {
        matches.push(match[1]);
    }

    return matches;
};