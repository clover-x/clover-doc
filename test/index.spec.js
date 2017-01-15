'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.10 23:40:57
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 */

const fs = require('fs');
const should = require('should');
const path = require('path');
const cloverxDoc = require('../');
const parseDS = require('../lib/data_struct_generator.js');

describe('#parseDS', function () {
    it('parse [@Module]', function () {
        let result = parseDS('[@Module]');
        let expected = {
            type: 'array',
            items: { '$ref': '#/definitions/Module' }
        };
        should.deepEqual(result, expected);
    });

    it('parse @Module', function () {
        let result = parseDS('@Module');
        let expected = {
            '$ref': '#/definitions/Module'
        };
        should.deepEqual(result, expected);
    });
});

describe('#convert', function () {
    it('translate test/fixtures', function () {
        let result = cloverxDoc.convert({
            baseDir: __dirname + '/fixtures'
        });

        fs.writeFileSync(__dirname + '/fixtures/swagger-doc.json', JSON.stringify(result, null, '  '));
        result.should.be.an.Object();
    });
});

describe('#checker', function () {
    let checker = cloverxDoc.checker({
        definitionsPath: path.join(__dirname, './fixtures/schema/swagger/definitions.js')
    });

    describe('#checker#arrayWrap', function () {
        it('return Module object in an array', function () {
            let res = checker
                .module('[@Module...]')
                .checkAndFormat([
                    {
                        name: 'weizhangTU',
                        repository: 'http://www.souche.com',
                        version: '1.0.1',
                        noEnum: 'this field will be removed'
                    },
                    {
                        name: 'weizhang',
                        repository: 'http://www.souche.com',
                        version: '1.0.1',
                        noEnum: 'this field will be removed'
                    }
                ]);

            should.deepEqual(res, [
                {
                    name: 'weizhangTU',
                    repository: 'http://www.souche.com',
                    version: '1.0.1'
                },
                {
                    name: 'weizhang',
                    repository: 'http://www.souche.com',
                    version: '1.0.1'
                }
            ]);
        });

        it('throw error miss key version', function () {
            (function () {
                checker
                    .module('[@Module...]')
                    .checkAndFormat([
                        {
                            name: 'weizhangTU',
                            repository: 'http://www.souche.com',
                            noEnum: 'this field will be removed'
                        }
                    ]);
            }).should.throw(/miss version in format Module/);
        });
    });

    describe('#checker#obj', function () {
        it('return a Module object', function () {
            let res = checker
                .module('@Module')
                .checkAndFormat({
                    name: 'weizhangTU',
                    repository: 'http://www.souche.com',
                    version: '1.0.1',
                    noEnum: 'this field will be removed'
                });

            should.deepEqual(res, {
                name: 'weizhangTU',
                repository: 'http://www.souche.com',
                version: '1.0.1'
            });
        });

        it('throw error miss key version', function () {
            (function () {
                checker
                    .module('@Module')
                    .checkAndFormat({
                        name: 'weizhangTU',
                        repository: 'http://www.souche.com',
                        noEnum: 'this field will be removed'
                    });
            }).should.throw(/miss version in format Module/);
        });
    });
});
