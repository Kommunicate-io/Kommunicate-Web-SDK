const joi =require('joi');
module.exports.queryParams = {
    query: {
      startDate: joi.number().integer().required(),
      endDate: joi.number().integer().required(),
      appKey: joi.string().required(),
      format: joi.string().only(['json', 'csv', 'xlsx']).default('customer')
    }
  }