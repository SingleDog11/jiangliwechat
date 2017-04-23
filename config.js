// 业务服务器的域名
var host = 'https://98171334.qcloud.la';
//var host = 'http://localhost:55739';

// 域名相关配置
var config = {
    host,
    // 登陆使用的地址
    //loginUrl : "${host}/home/login",
    loginUrl: `${host}/values/Login`,

    // 参数
    requestCaseByState: `${host}/values/getCasebyStat`,

    // 获取某案件下的所有裁决评论
    requestCommentsByCaseId: `${host}/values/GetPar`,

    // 请求提交新案件
    requestPutNewCase: `${host}/values/addVerdict`,

    // 请求提交新的裁决
    requestPutNewComments: `${host}/values/putParticipateData`,

    // 获取某客户的满意度曲线
    requestGetChart: `${host}/values/GetQXP`,

    // 获取个人参与的案件
    requestGetMyCase: `${host}/values/GetVerByUserID`,
    
    // 将某案件的草稿改为提交状态
    requestPutDraftok: `${host}/values/PutDraftOk`,
    // 上传图片的接口
    uploadFileUrl: "",

    // 下载图片的接口
    downloadFileUrl: ""
}

module.exports = config;