// 业务服务器的域名
// var host = 'https://www.jianglichina.com';
var host = 'http://localhost:9305';

// 域名相关配置
var config = {
    host,
    // 登陆使用的地址
    //loginUrl : "${host}/home/login",
    loginUrl: `${host}/api/Account/Login`,
    /**
     * 通过用户id获取用户
     */
    requestGetUserById: `${host}/api/Account/GetUserById`,
    /**
     * 通过昵称获取用户列表
     */
    requestGetUsersByNickname: `${host}/api/Account/GetUsersByNickname`,

    /**
     * 通过案件的页数和状态获取案件
     */
    requestCaseByPageAndState: `${host}/api/caseapi/GetPieceByPageAndState`,
    /**
     * 通过关键词获取案件 
     */
    requestCaseByKeyWord: `${host}/api/caseapi/GetPieceByKeyWord`,
    // 通过案件的关键词获取建议案件
    requestCaseOfSuggest: `${host}/api/caseapi/GetPieceBySuggest`,

    // 通过案件id获取案件的详细内容
    requestCaseById: `${host}/api/caseapi/GetCaseDetailById`,

    // 请求提交新案件使用post
    requestPutNewCaseByPost: `${host}/api/caseapi/CreateCase`,

    // 请求提交案件带有图片
    requestCreateNewCaseByPost: `${host}/api/caseapi/CreateCaseWithImage`,

    // 修改一个案件- 带有图片--或者提交草稿请求
    requestChangeCase: `${host}/api/caseapi/ModifiedCaseWithImage`,

    // 通过案件id请求所有评论
    requestGetCommentsByCaseid: `${host}/api/caseapi/GetCommentsByCaseId`,

    // 创建一个评论
    requestCreateComment: `${host}/api/caseapi/CreateComment`,

    // 请求提交裁决
    requestCreateInvolve: `${host}/api/caseapi/CreateInvolve`,

    // 请求修改裁决
    requestModifiedInvolve: `${host}/api/caseapi/ModifiedInvolve`,

    /**
     * 提交申诉请求
     */
    requestSetAppeal: `${host}/api/caseapi/SetAppeal`,

    // 获取某客户的满意度曲线
    requestGetSinglePoints: `${host}/api/external/getSinglePoints`,

    // 获取个人参与的案件
    requestGetCaseListOwner: `${host}/api/caseapi/GetCaseListOfOwner`,

    // 将某案件的草稿改为提交状态
    requestPutDraftok: `${host}/api/caseapi/CreateDraft`,
    // 群体满意度曲线
    requestGetGroupChart: `${host}/values/GroupQXP`,
    // 上传图片的接口
    uploadFileUrl: "",

    // 下载图片的接口
    downloadFileUrl: ""
}

module.exports = config;
