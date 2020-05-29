var i18n = require("i18n");
var Hbs = require("handlebars");
var HbsUtils = require("handlebars-utils");

var register = function(Handlebars) {
    var helpers = {
        // Textarea output: Convert \n to a working line break and remove \r
        breaklines: function(text) {
            text = HbsUtils.escapeExpression(text);
            text = text.replace(/\n/gm, '&#10;').replace(/\r/gm, '');
            return new Hbs.SafeString(text);
        },

        // l18n helpers
        __: function () {
            return i18n.__.apply(this, arguments);
        },
        __n: function () {
            return i18n.__n.apply(this, arguments);
        },

        // ifCond helper
        ifCond: function (v1, operator, v2, options) {
            v1 = String(v1);
            v2 = String(v2);
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null);
