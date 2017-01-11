# cloverx-doc
🍀convert cloverx api definition into swagger specific format

## Usage
Install
```javascript
npm i cloverx-doc --save
```
The baseDir shoud have follow directory struct.
```shell
.
├── controller # Your api definitions must be created in this folder.
│   └── v1
│       ├── bundle.js
│       └── deep
│           └── client.js
└── schema
    └── swagger
        └── definitions.js # Your data model definations are here
```
and then
```javascript
const cloverxDoc = require('cloverx-doc');
let swaggerDoc = cloverxDoc.convert({
    baseDir: baseDir
    config: {
        host: '127.0.0.1:7078', // 服务器地址
        schemes: ['http'], // 协议支持，可选 https, http
        basePath: '/', // url path 浅醉
        // 应用描述信息
        info: {
            version: '1.0.1',
            title: 'clover doc test',
            description: 'from test'
        }
    }
});
```
