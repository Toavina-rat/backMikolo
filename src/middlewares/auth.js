const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 'Accès non autorisé. Token manquant.', 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Token invalide ou expiré.', 403);
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 'Rôle utilisateur non spécifié.', 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Accès refusé. Rôle '${req.user.role}' non autorisé. Rôles requis : [${allowedRoles.join(', ')}]`,
        403
      );
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
