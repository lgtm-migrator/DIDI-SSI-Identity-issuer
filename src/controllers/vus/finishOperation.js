const vusService = require('../../services/vusService');
const Constants = require('../../constants/Constants');
const Messages = require('../../constants/Messages');
const ResponseHandler = require('../../utils/ResponseHandler');

const finishOperation = async (req, res) => {
  const params = req.body;
  try {
    const endOperation = await vusService.simpleOperation(
      params,
      Constants.VUS_URLS.END_OPERATION,
    );
    return ResponseHandler.sendRes(res, endOperation);
  } catch (error) {
    return ResponseHandler.sendErrWithStatus(res, Messages.VUS.END_OPERATION);
  }
};

module.exports = { finishOperation };
