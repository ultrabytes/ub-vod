'use strict';

class collection
{

    constructor()
    {

        this.routes = {};
        this.index = 0;

    }

    add(object)
    {

        if (object instanceof route) {
            if (typeof this.routes[object.getMethod()] === "undefined") {
                this.routes[object.getMethod()] = [];
            }
            this.routes[object.getMethod()].push(object);
            this.index++

            return true;
        }

        throw new Error('Invalid object in routes collection.');


    }

}

class route
{

    constructor(method, pattren, action, next)
    {

        this.method = method;
        this.pattren = pattren;
        this.action = action;
        this.next = next;

        this.dispatched = false;
    }

    getPattren()
    {
        return this.pattren;
    }

    getMethod()
    {
        return this.method;
    }

    getAction()
    {
        return this.action;
    }

}


class router
{

    constructor()
    {
        this.collection = new collection;
    }

    get(uri, action, next)
    {
        return this._add('GET', uri, action, next);
    }

    post(uri, action, next)
    {
        return this._add('POST', uri, action, next);
    }

    _add(method, uri, action, next)
    {
        var r = new route(method, uri, action, next);
        this.collection.add(r);
        return r;
    }
    ;

}

module.exports = new router;