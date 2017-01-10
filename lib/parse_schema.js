'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.10 23:39:28
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 语法解析器
 */

/**
 * 可解析类型
 * [@Module]
 */
function parseSchema (query, result, startIndex, endIndex) {
    if(query[startIndex] === '[') {
        startIndex++;
        endIndex--;
        result.type = 'array';
        result.items = {};
        parseSchema(query, result.items, startIndex, endIndex);
    } else if(query[startIndex] === '{') {
        startIndex++;
        endIndex--;
        result.type = 'object';
    } else if(query[startIndex] === '@') {
        let ref = /\@(\w+)/.exec(query.slice(startIndex));
        result['$ref'] = `#/definitions/${ref[1]}`;
    }
}

function parse (query) {
    let result = {
        description: 'Data object'
    };
    let startIndex = 0;
    let endIndex = query.length - 1;

    parseSchema(query, result, startIndex, endIndex);

    return result;
}

module.exports = parse;
