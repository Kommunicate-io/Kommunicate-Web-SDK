/**
 * return Array of dataValues objects. 
 * return null if param is null
 * @param {Array} sequalizeModel
 * 
 */
exports.getDataArrayFromResultSet=(sequalizeResult)=>{
    if(sequalizeResult){
    console.log("extracting data values from result set");
    return sequalizeResult.map(row=>{
        return row.dataValues;
    });
}else{
    return null;
}

}