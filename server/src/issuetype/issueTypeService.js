const applozicClient = require("../utils/applozicClient");
const userService= require("../users/userService");
const registrationService = require("../register/registrationService");
const config = require('../../conf/config.js')
const issueTypeModel = require("../models").IssueType;

exports.getById = (issueTypeId) => {
    return Promise.resolve(issueTypeModel.findAll({where:{id:issueTypeId}}));
}

exports.getIssueType=(issueType)=>{
    let criteria={}
    if(criteria.id){
        criteria.id=issueType.id
    }
    return Promise.resolve(issueTypeModel.findAll({where:criteria}));
}


exports.createIssueType = (IssueType) => {
    return Promise.resolve(issueTypeModel.create(IssueType)).catch(err=>{
        return { code: err.parent.code, message: err.parent.sqlMessage }
    });
}

exports.updateIssueType=(issueType)=>{
    return issueTypeModel.update(IssueType, {
		where: {
			id: issueType.id
		}
	});

}

exports.deleteIssueTypeById = (issueTypeId)=>{
    return issueTypeModel.destroy( {
		where: {
			id: issueTypeId
		}
	});

}