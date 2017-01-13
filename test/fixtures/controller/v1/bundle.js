'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.11 17:13:54
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 包信息创建
 */

/**jsdoc
 * 判断包名是否存在
 * @httpMethod get
 * @path /:name/exists
 * @param {string#path} name - 需要检查的包名, 允许字符 [a-z-]
 * @response @ModuleExists
 */
function bundleExists () {

}

exports.bundleExists = bundleExists;

/**jsdoc
 * rn 包信息上传
 * @tags client, cli
 * @httpMethod post
 * @path /:name/:platform
 * @param {string#path} name - 包名称
 * @param {string#path} platform - 平台选择：ios, android
 * @param {string#formData} repository - jsbundle 地址
 * @param {string#formData} version - 版本号，测试环境使用，1.3.4-beta.0 格式
 * @response @Module
 */
function create () {

}

exports.create = create;
