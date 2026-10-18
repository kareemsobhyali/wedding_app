import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  CORS_ORIGIN: Joi.string().default('*'),
  ENABLE_SWAGGER: Joi.boolean().default(false),
  
  // Storage (Optional for launch, with safe defaults)
  R2_ACCOUNT_ID: Joi.string().default('dummy_account_id'),
  R2_ACCESS_KEY_ID: Joi.string().default('dummy_access_key'),
  R2_SECRET_ACCESS_KEY: Joi.string().default('dummy_secret_key'),
  R2_BUCKET_NAME: Joi.string().default('wedding-media'),
  R2_PUBLIC_URL: Joi.string().allow('').default(''),
});
