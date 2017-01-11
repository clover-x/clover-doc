'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.11 18:08:51
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 客户端上传
 */

/**jsdoc
 * 根据依赖创建 jsbundle
 * @httpMethod post
 * @path /bundle/:platform
 * @param {string#path} platform - 平台选择: android, ios
 * @param {string#formData} dependencies
 * ```javascirpt
 * rn 模块依赖关系
 *  ~ 代表只能更新 bugfix
 * ^ 代表可以更新右侧第一个非零数字后的版本号
 * 示例值
 * {
 *   "dfc": "~1.1.0"
 * }
 * ```
 * @response [@Module]
 */
function dependencies() {

}
exports.dependencies = dependencies;
