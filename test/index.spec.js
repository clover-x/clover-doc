'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.10 23:40:57
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 */

const fs = require('fs');
const should = require('should');
const cloverxDoc = require('../');
const parseSchema = require('../lib/parse_schema.js');

describe('#parseSchema', function () {
    it('parse [@Module]', function () {
        let result = parseSchema('[@Module]');
        let expected = {
            type: 'array',
            items: { '$ref': '#/definitions/Module' }
        };
        should.deepEqual(result, expected);
    });

    it('parse @Module', function () {
        let result = parseSchema('@Module');
        let expected = {
            '$ref': '#/definitions/Module'
        };
        should.deepEqual(result, expected);
    });
});

describe('#convert', function () {
    it('translate test/fixtures', function () {
        let result = cloverxDoc.convert({
            baseDir: __dirname + '/fixtures',
            config: {
                basePath: '/',
                info: {
                    version: '1.0.1',
                    title: 'clover doc test',
                    description: 'from test'
                }
            }
        });

        fs.writeFileSync(__dirname + '/fixtures/swagger-doc.json', JSON.stringify(result, null, '  '));
        result.should.be.an.Object();
    });
});
