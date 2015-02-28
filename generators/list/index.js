var yeoman = require('yeoman-generator'),
    request = require('request'),
    _ = require('underscore'),

    requestHelper = require('../../requestHelper');

module.exports = yeoman.generators.Base.extend({
    listTemplates: function() {
        var done = this.async(),
            generator = this;


        request('https://www.gitignore.io/dropdown/templates.json', function(err, res, body) {
            if (requestHelper.canAccess(err, res, generator.log)) {
                var templates = JSON.parse(body),
                    shouldSearch = generator.arguments.length > 0,
                    searchRegex;

                if (shouldSearch) {
                    searchRegex = new RegExp(generator.arguments[0], 'i');
                    templates = _(templates).filter(function(template) {
                        return searchRegex.test(template.text) || searchRegex.test(template.id);
                    });
                }

                templates.sort(function(a, b){
                    var templateA = a.text.toLowerCase(),
                        templateB = b.text.toLowerCase();

                    if (templateA < templateB) return -1;
                    if (templateA > templateB)return 1;

                    return 0;
                });

                _(templates).each(function(template) {
                    generator.log(template.text, '-', template.id);
                });

                done();
            }
        });
    }
});
