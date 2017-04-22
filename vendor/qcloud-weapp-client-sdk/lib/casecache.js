var constants = require('./constants');
var CACHE_KEY = constants.WX_CACHECASE_KEY;
var Cachecase = {
    get: function () {
        return wx.getStorageSync(CACHE_KEY) || null;
    },

    set: function (caseinfo) {
        wx.setStorageSync(CACHE_KEY, caseinfo);
    },

    clear: function () {
        wx.removeStorageSync(CACHE_KEY);
    },
};

module.exports = Cachecase;