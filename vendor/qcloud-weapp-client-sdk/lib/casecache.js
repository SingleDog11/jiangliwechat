var constants = require('./constants');
var CACHE_KEY = constants.WX_CACHECASE_KEY;
var CACHEDETAIL = constants.WX_CACHEDETAIL_KEY;

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
/**
 * 显示详细的案件信息的缓存
 */
var Cachedetail = {
    get: function () {
        return wx.getStorageSync(CACHEDETAIL) || null;
    },

    set: function (caseinfo) {
        wx.setStorageSync(CACHEDETAIL, caseinfo);
    },

    clear: function () {
        wx.removeStorageSync(CACHEDETAIL);
    },
}
module.exports = Cachecase;
module.exports = Cachedetail;