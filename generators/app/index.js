var yeoman = require('yeoman-generator'),
    request = require('request'),
    _ = require('underscore'),
    util = require('util'),
    fs = require('fs'),
    path = require('path'),

    requestHelper = require('../../requestHelper');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        if (this.arguments.length == 0)
            this.log('Specify space delimited gitignore templates as arguments. Type in "yo gi:list" to see available templates.');
    },
    requestTemplates: function () {
        var done = this.async(),
            generator = this;

        if (this.arguments.length == 0) {
            return;
        }

        request('http://www.gitignore.io/api/', function(err, res) {
            if (!requestHelper.canAccess(err, res, generator.log))
                return;

            request('http://www.gitignore.io/api/' + generator.arguments.join(','), function(err, res, body) {
                if (err) throw err;

                var invalidTemplates = requestHelper.getInvalidTemplates(body),
                    pluralize = generator.arguments.length > 1;

                if (invalidTemplates.length > 0) {
                    generator.log(util.format('<%s> %s not exist, aborting gitignore task. Type in "yo gi:list" to see available templates.',
                        invalidTemplates.join(', '),
                        pluralize ? 'templates do' : 'template does'
                    ));
                    return;
                }

                var gitignoreFile = path.join(generator.destinationRoot(), '.gitignore'),
                    gitignoreFileExists = fs.existsSync(gitignoreFile);

                if (gitignoreFileExists) {
                    // Remove '# Created by http://www.gitignore.io' when appending.
                    var createdByRemoved = body.substr(body.indexOf('\n\n') + 2);

                    fs.appendFileSync(gitignoreFile, createdByRemoved);

                    generator.log('<%s> %s added to "%s".',
                        generator.arguments.join(', '), pluralize ? 'templates' : 'template', gitignoreFile);
                } else {
                    fs.writeFileSync(gitignoreFile, body);

                    generator.log('<%s> %s used to create "%s".',
                        generator.arguments.join(', '), pluralize ? 'templates' : 'template', gitignoreFile);
                }

                done();
            });
        });
    },
    goodbye: function() {
        if (this.arguments.length > 0) {
            this.log('Thanks for using this generator, templates are sourced from "http://www.gitignore.io".')
        }
    }
});