const metabaseService = require('./metabaseService');
const { getGroupAnalyticsQuery } = require('./metabaseQuery');
const json2xls = require('json2xls');
const {retryTemplate} = require('./metabaseObjConstant')
const fs = require('fs');
const groupAnalyticsCardId = 109;


exports.getData = (req, res) => {
    let params = {};
    let format = req.query.format
    try {
        params = {
            startDate: new Date(req.query.startDate).toLocaleString(),
            endDate: new Date(req.query.endDate).toLocaleString(),
            appKey: req.query.appKey
        }
    } catch (error) {
        return res.status(400).json({ message: "invalid parameters" })
    }
    let newQuery = getGroupAnalyticsQuery(params);
    return metabaseService.getResultSet(groupAnalyticsCardId, newQuery).then(response => {
        if (format == 'xlsx') {
            var xls = json2xls(response);
            filePath = 'Report-' + new Date().getTime() + '.xlsx';
            fs.writeFileSync(filePath, xls, 'binary');
            res.writeHead(200, {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8",
                "Content-Disposition": "attachment; filename=" + filePath
            })
            fs.createReadStream(filePath).pipe(res);
            fs.unlink(filePath, function (err) { console.log("file deleted") })
            return res.status(200);
        }
        return res.status(200).json({ code: "success", message: response })
    }).catch(error => {
        console.log("metabase data fetching error: ", error);
        return res.send(retryTemplate);
    });
}