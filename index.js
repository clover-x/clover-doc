'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.10 13:29:24
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * cloverx-doc
 *
 * http://editor.swagger.io/#/
 * http://usejsdoc.org/
 */

const _ = require('lodash');
const parseRouter = require('./lib/parse_router.js');
const parseSwagger = require('./lib/parse_swagger.js');
const defaultConfig = require('./lib/default.config.js');

/**
 * 文档翻译
 */
function convert(opts = {}) {
    let swaggerDoc  = _.defaultsDeep({}, opts.config, defaultConfig);
    parseSwagger(opts.baseDir, swaggerDoc);
    parseRouter(opts.baseDir, swaggerDoc);
    // console.log(JSON.stringify(swaggerDoc, null, '  '));
}

exports.convert = convert;

convert({
    baseDir: __dirname + '/test/fixtures/'
});
