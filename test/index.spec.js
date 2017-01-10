'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.10 23:40:57
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 语法解析器
 */

const should = require('should');
const parseSchema = require('../lib/parse_schema.js');

describe('#parseSchema', function () {
    it('parse [@Module]', function () {
        let result = parseSchema('[@Module]');
        let expected = {
            description: 'Data object',
            type: 'array',
            items: { '$ref': '#/definitions/Module' }
        };
        should.deepEqual(result, expected);
    });

    it('parse {name:@string, module:@boolean}', function () {
        let result = parseSchema('{name:@string, module:@boolean}');
        console.log(JSON.stringify(result, null, '  '));
    });
});
