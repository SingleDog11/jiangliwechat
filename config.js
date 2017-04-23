// 业务服务器的域名
var host = '98171334.qcloud.la';
//var host = 'localhost:55739';

// 域名相关配置
var config = {
    host,
    // 登陆使用的地址
    //loginUrl : "https://${host}/home/login",
    loginUrl: `https://${host}/values/Login`,

    // 参数
    requestCaseByState: `https://${host}/values/getCasebyStat`,

    // 获取某案件下的所有裁决评论
    requestCommentsByCaseId: `https://${host}/values/GetPar`,

    // 请求提交新案件
    requestPutNewCase: `https://${host}/values/addVerdict`,

    // 请求提交新的裁决
    requestPutNewComments: `https://${host}/values/putParticipateData`,

    // 获取某客户的满意度曲线
    requestGetChart: `https://${host}/values/GetQXP`,

    // 获取个人参与的案件
    requestGetMyCase: `https://${host}/values/GetVerByUserID`,
    
    // 将某案件的草稿改为提交状态
    requestPutDraftok: `https://${host}/values/PutDraftOk`,
    // 上传图片的接口
    uploadFileUrl: "",

    // 下载图片的接口
    downloadFileUrl: ""
}

module.exports = config;