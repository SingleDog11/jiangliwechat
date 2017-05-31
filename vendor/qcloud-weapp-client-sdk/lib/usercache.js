var constants = require('./constants');
var CACHEUSER = constants.WX_CACHEUSER_KEY;
var Cacheuser = {
    get: function () {
        return wx.getStorageSync(CACHEUSER) || null;
    },

    set: function (userinfo) {
        wx.setStorageSync(CACHEUSER, userinfo);
    },

    clear: function () {
        wx.removeStorageSync(CACHEUSER);
    },
}
module.exports = Cacheuser;