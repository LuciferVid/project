import ApiError from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new ApiError(400, errorMessage));
  }
  Object.assign(req.body, value);
  return next();
};
