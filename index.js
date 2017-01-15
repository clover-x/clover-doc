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
const parseConfig = require('./lib/parse_config.js');
const defaultConfig = require('./lib/config/config.default.js');

/**
 * 文档翻译
 */
function convert(opts = {}) {
    let swaggerDoc  = _.defaultsDeep({}, opts.config, defaultConfig);

    // 加载默认配置
    parseConfig(opts.baseDir, swaggerDoc);
    // 加载路由注释
    parseRouter(opts.baseDir, swaggerDoc);

    return swaggerDoc;
}

module.exports = {
    convert,
    checker: require('./lib/data_format_checker.js')
};
