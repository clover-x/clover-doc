'use strict';

/**
name: 'name',
in: 'path',
description: '需要检查的包名, 允许字符 [a-z-]',
type: 'string',
{
  "description": "",
  "tags": [
    {
      "title": "desc",
      "description": "判断包名是否存在"
    },
    {
      "title": "path",
      "description": "/:name/exists"
    },
    {
      "title": "param",
      "description": "需要检查的包名, 允许字符 [a-z-]",
      "type": {
        "type": "NameExpression",
        "name": "string#path"
      },
      "name": "name"
    },
    {
      "title": "response",
      "description": "[@Module]"
    }
  ]
}
*/

/**
 * 判断包名是否存在
 * @httpMethod get
 * @path /:name/:platform/exists
 * @param {string#path} name - 需要检查的包名, 允许字符 [a-z-]
 * @param {string#path} platform - 平台选择
 * @response [@Module]
 */
function test () {

}
