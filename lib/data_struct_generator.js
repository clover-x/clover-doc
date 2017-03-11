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
 * @Module
 */
function parseSchema (query, result, startIndex, endIndex) {
    if(query[startIndex] === '[') {
        startIndex++;
        endIndex--;
        result.type = 'array';
        result.items = {};
        parseSchema(query, result.items, startIndex, endIndex);
    } else if(query[startIndex] === '{') {
        // 这是半成品
        startIndex++;
        endIndex--;
        result.type = 'object';
        result.properties = {};
        // 判断是否为重复对象
        let reg = /([^,\s]*):@([^,\s]+)/g;
        let key;
        while((key = reg.exec(query.slice(1, -1)))) {
            if(key[1] === '') {
                result.properties['_manyRandomKey'] = {
                    $ref: `#/definitions/${key[2].slice(0, -3)}`
                };
            } else {
                result.properties[key[1]] = {
                    $ref: `#/definitions/${key[2]}`
                };
            }
        }
    } else if(query[startIndex] === '@') {
        let ref = /\@(\w+)/.exec(query.slice(startIndex));
        result['$ref'] = `#/definitions/${ref[1]}`;
    }
}

function parse (query) {
    let result = {
    };
    let startIndex = 0;
    let endIndex = query.length - 1;

    parseSchema(query, result, startIndex, endIndex);

    return result;
}

module.exports = parse;
