import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required().min(3),
  description: Joi.string().optional(),
  price: Joi.number().required().min(0),
  discountPrice: Joi.number().min(0).optional(),
  category: Joi.string().required(), // expect ObjectId string
  stock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  specifications: Joi.object().optional()
});
