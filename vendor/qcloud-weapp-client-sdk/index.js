var constants = require('./lib/constants');
var login = require('./lib/login');
var Session = require('./lib/session');
var request = require('./lib/request');
var Cachecase = require('./lib/casecache');
var Cachedetail = require('./lib/detailcache');
var exports = module.exports = {
    login: login.login,
    setLoginUrl: login.setLoginUrl,
    LoginError: login.LoginError,
    clearSession: Session.clear,
    getSession: Session.get,
    request: request.request,
    RequestError: request.RequestError,

    setCaseCache: Cachecase.set,
    getCaseCache: Cachecase.get,
    clearCaseCache: Cachecase.clear,

    setDetailCache: Cachedetail.set,
    getDetailCache: Cachedetail.get,
    clearDetailCache: Cachedetail.clear,

    
};

// 导出错误类型码
Object.keys(constants).forEach(function (key) {
    if (key.indexOf('ERR_') === 0) {
        exports[key] = constants[key];
    }
});