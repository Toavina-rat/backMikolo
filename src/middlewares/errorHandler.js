const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('💥 Express Error Handler caught:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  return errorResponse(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};

module.exports = errorHandler;
