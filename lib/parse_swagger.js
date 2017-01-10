'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.10 23:24:43
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 加载模型定义
 */

const path = require('path');

function parse(baseDir, swaggerDoc) {
    let definitions = require(path.join(baseDir, 'schema/swagger', 'definitions.js'));
    swaggerDoc.definitions = definitions;
}

module.exports = parse;
