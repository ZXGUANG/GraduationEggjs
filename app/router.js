'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/post', controller.home.postIndex);
  // login
  router.post('/login', controller.login.login);
  // login/test
  router.get('/test', controller.login.test);
};
