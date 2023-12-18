const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const subscriptionValues = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionValues,
      default: "starter",
    },
    token: String,
    avatarURL: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
  }),
  subscription: Joi.string().valid(...subscriptionValues),
});

const loginSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
  }),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionValues)
    .required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  subscriptionSchema,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
