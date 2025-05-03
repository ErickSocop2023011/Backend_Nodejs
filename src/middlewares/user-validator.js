import { body, param } from "express-validator";
import { emailExists, usernameExists, userExists} from "../helpers/db-validator.js";
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const registerValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("email").custom(emailExists),
    body("username").custom(usernameExists),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    validateFields,
    handleErrors
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("username").optional().isString().withMessage("Invalid username format"),
    body("password").isLength({ min: 4 }).withMessage("Password must be at least 8 characters long"),
    validateFields,
    handleErrors
];

export const deleteUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("Invalid MongoDB ID"),
    param("uid").custom(userExists),
    validateFields,
    handleErrors
];

export const deleteMeValidator = [
    validateJWT,
    body("confirm")
        .isString().withMessage("Confirmation not provided (Please type 'confirm' to delete your account)")
        .equals("confirm").withMessage("You must type 'confirm' to delete your account"),
    validateFields,
    handleErrors
];

export const updatePasswordValidator = [
    validateJWT,
    body("newPassword").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    validateFields,
    handleErrors
]

export const updateUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid", "Invalid ID").isMongoId(),
    param("uid").custom(userExists),
    validateFields,
    handleErrors
];

export const updateMeValidator = [
    validateJWT,
    body("username").optional().isString().withMessage("Username es en formáto erróneo"),
    body("email").optional().isEmail().withMessage("No es un email válido"),
    body("email").optional().custom(emailExists),
    body("username").optional().custom(usernameExists),
    validateFields,
    handleErrors
]