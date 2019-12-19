'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  
  // common
  router.get('/getAdmins', controller.common.getAdmins);
  // login
  router.post('/login', controller.login.login);
  // home
  router.get('/', controller.home.index);
  router.get('/homeinit', controller.home.init);
  router.get('/logout', controller.home.logout);
  router.post('/updateAvatar', controller.home.updateAvatar);
  // laboratory
  router.post('/addLab', controller.laboratory.addLab);
  router.post('/getLab', controller.laboratory.getLab);
  router.post('/updateLab', controller.laboratory.updateLab);
  router.post('/delLab', controller.laboratory.delLab);
  router.post('/searchLabs', controller.laboratory.searchLabs);
  router.post('/loadLabPage', controller.laboratory.loadLabPage);
  
};
