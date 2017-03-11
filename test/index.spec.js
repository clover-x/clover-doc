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

        it('重复对象', function () {
            let result = checker
                .module('{:@Module}')
                .checkAndFormat({
                    'e': {
                        name: 'weizhangTU',
                        repository: 'http://www.souche.com',
                        version: '1.2.4',
                        noEnum: 'this field will be removed'
                    },
                    'f': {
                        name: 'weizhangTU',
                        repository: 'http://www.souche.com',
                        version: '1.2.4',
                        noEnum: 'this field will be removed'
                    }
                });

            should.deepEqual(result, {
                'e': {
                    name: 'weizhangTU',
                    repository: 'http://www.souche.com',
                    version: '1.2.4',
                },
                'f': {
                    name: 'weizhangTU',
                    repository: 'http://www.souche.com',
                    version: '1.2.4',
                }
            });
        });

        it('重复对象，其中一项不符合要求', function () {
            (function () {
                checker
                    .module('{:@Module}')
                    .checkAndFormat({
                        'e': {
                            name: 'weizhangTU',
                            repository: 'http://www.souche.com',
                            version: '1.2.4',
                            noEnum: 'this field will be removed'
                        },
                        'f': {
                            name: 'weizhangTU',
                            repository: 'http://www.souche.com',
                            noEnum: 'this field will be removed'
                        }
                    });
            }).should.throw(/miss version in format Module/);

        });

        it('非重复对象', function () {
            let result = checker
                .module('{aField:@Module, bField:@Module}')
                .checkAndFormat({
                    'aField': {
                        name: 'weizhangTU',
                        repository: 'http://www.souche.com',
                        version: '12.1.2',
                        noEnum: 'this field will be removed'
                    },
                    'bField': {
                        name: 'weizhangTU',
                        repository: 'http://www.souche.com',
                        version: '12.1.2',
                        noEnum: 'this field will be removed'
                    },
                    'c': {}
                });

            should.deepEqual(result, {
                'aField': {
                    name: 'weizhangTU',
                    repository: 'http://www.souche.com',
                    version: '12.1.2',
                },
                'bField': {
                    name: 'weizhangTU',
                    repository: 'http://www.souche.com',
                    version: '12.1.2',
                },
            });
        });

        it('非重复对象，对象缺失报错', function () {
            (function () {
                checker
                    .module('{aField:@Module, bField:@Module}')
                    .checkAndFormat({
                        'aField': {
                            name: 'weizhangTU',
                            repository: 'http://www.souche.com',
                            version: '12.1.2',
                            noEnum: 'this field will be removed'
                        },
                        'c': {}
                    });
            }).should.throw(/对象缺少 bField 字段/);
        });
    });

    describe('#checker#objArrMix', function () {
        it('对象内包含数组重复模式', function () {
            let result = checker
                .module('{:[@Module]}')
                .checkAndFormat({
                    'ad': [
                        {
                            name: 'weizhangTU',
                            repository: 'http://www.souche.com',
                            version: '12.1.2',
                            noEnum: 'this field will be removed'
                        }
                    ],
                    'db': [
                        {
                            name: 'weizhangTU',
                            repository: 'http://www.souche.com',
                            version: '12.1.2',
                            noEnum: 'this field will be removed'
                        }
                    ]
                });

            should.deepEqual(result, {
                'ad': [
                    {
                        name: 'weizhangTU',
                        repository: 'http://www.souche.com',
                        version: '12.1.2',
                    }
                ],
                'db': [
                    {
                        name: 'weizhangTU',
                        repository: 'http://www.souche.com',
                        version: '12.1.2',
                    }
                ]
            });
        });

        it('对象内包含数组指定字段', function () {
            let result = checker
                .module('{ad:[@Module]}')
                .checkAndFormat({
                    'ad': [
                        {
                            name: 'weizhangTU',
                            repository: 'http://www.souche.com',
                            version: '12.1.2',
                            noEnum: 'this field will be removed'
                        }
                    ],
                    'db': [
                        {
                            name: 'weizhangTU',
                            repository: 'http://www.souche.com',
                            version: '12.1.2',
                            noEnum: 'this field will be removed'
                        }
                    ]
                });

            should.deepEqual(result, {
                'ad': [
                    {
                        name: 'weizhangTU',
                        repository: 'http://www.souche.com',
                        version: '12.1.2',
                    }
                ]
            });
        });
    });
});
