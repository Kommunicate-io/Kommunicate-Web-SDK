/**
 * return Array of dataValues objects. 
 * @param [Model1,Model2...]
 */
exports.getDataArrayFromResultSet=(sequalizeResult)=>{
    console.log("extracting data values from result set");
    return sequalizeResult.map(row=>{
        return row.dataValues;
    });

}