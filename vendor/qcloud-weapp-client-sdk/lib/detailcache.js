var constants = require('./constants'); 
var CACHEDETAIL = constants.WX_CACHEDETAIL_KEY;

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
module.exports = Cachedetail;