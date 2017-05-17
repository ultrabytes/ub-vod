'use strict';

const router = require('./router.js');
const url = require('url');
const stream = require('./stream');

class vod
{


    constructor()
    {
        this._routes = false;


    }

    init(req, res, next)
    {

        res.stream = function (path) {
            var s = new stream(path);
            return s.serve(req, res, next);
        };

        if (typeof next == 'function') {
            next();
        }

    }


    router(func)
    {

        func(router);

    }

    serve(req, res)
    {

        res.stream = function (path) {
            var s = new stream(path);
            return s.serve(req, res);
        };

        var dispatch = function (route, req, res) {

            var action = route.getAction();

            action(req, res, route.next || function () {

            });

        };

        req.routeParams = {};

        var routes = router.collection.routes[req.method.toUpperCase()];
        var requestUrl = url.parse(req.url, true);

        var key_indexes = [];
        var key_collections = {};
        var route_params = {};

        var uri = requestUrl.pathname;

        console.log('Method: ' + req.method.toUpperCase());


        if (routes.length) {

            var _matched = false;

            for (var r in routes) {
                var route = routes[r];
                var r_url = '/' + (route.getPattren().ltrim('/'));


                if (r_url === uri) {

                    console.log('Pattren Matched: ' + r_url + ' with ' + uri + '.');

                    _matched = true;
                    dispatch(route, req, res);
                    break;
                } else {

                    var splited_pattren = r_url.split("/");

                    var splited_uri = uri.split("/");

                    var pattren_with_reg_ex = "/";


                    // extract placeholders
                    if (splited_pattren.length) {
                        for (var index in splited_pattren) {
                            pattren_with_reg_ex += splited_pattren[index].replace(/\{(.*)\}/, "?(.*)") + "/";

                            var extract_key = splited_pattren[index].match(/^\{(.*)\}/);

                            if (extract_key) {
                                key_collections[index] = extract_key[1];
                                key_indexes[index] = index;
                            }
                        }
                    }

                    // get values for placeholders
                    if (splited_uri.length) {

                        for (var index in splited_uri) {
                            if (key_indexes.indexOf(index) > -1) {
                                route_params[key_collections[index]] = splited_uri[index];
                            }
                        }

                    }


                    var pattren_with_reg_ex_fix_double_slash = pattren_with_reg_ex.replace(/(\/\/)/g, "/").rtrim("/");

                    var route_final_reg_ex = new RegExp(pattren_with_reg_ex_fix_double_slash);

                    var matched_results = uri.match(route_final_reg_ex);

                    if (matched_results !== null && matched_results.length > 0 && matched_results[0] == uri) {

                        req.routeParams = route_params;
                        _matched = true;
                        dispatch(route, req, res);
                        break;
                    } // match regex
                }
            } // loop ends here

            if (_matched === false) {
                res.end('Page not found!');
            }


        } else {
            throw new Error('Routes not defined.');
        }

        console.log('Serving with in-built router.');

    }

}

module.exports.app = function () {
    return new vod();
}