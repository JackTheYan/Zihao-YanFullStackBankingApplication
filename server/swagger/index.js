'use strict';
const router = require('koa-router')(); // 引入路由函数
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerConfig = require('../config/swagger');
const path = require('path');

// const  {SwaggerRouter} = require('koa-swagger-decorator');


// const swaggerRouter = new SwaggerRouter();

// // swagger docs avaliable at http://localhost:3000/swagger-html
// swaggerRouter.swagger({
//     title: '排课系统',
//     description: 'API DOC',
//     version: '1.0.0'
// });

// // 查找对应目录下的controller类
// swaggerRouter.mapDir(path.resolve(__dirname, './controller/'));

// export default router;
const options = {
  swaggerDefinition: swaggerConfig,
  apis: ['./routes/*.js', './controllers/image/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

router.get('/swagger.json', async (ctx) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
});

module.exports = router;
