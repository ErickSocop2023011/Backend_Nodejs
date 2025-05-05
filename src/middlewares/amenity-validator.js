import { body, param } from "express-validator";
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { amenityExistsById, amenityNameExists } from "../helpers/db-validator.js";
import { hasRoles } from "./validate-roles.js";
import { validateJWT } from "./validate-jwt.js";

export const registerAmenityValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name")
        .notEmpty().withMessage("Name is required")
        .custom(amenityNameExists),
    validateFields,
    handleErrors
];

export const updateAmenityValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("aid").isMongoId().withMessage("Invalid Amenity ID"),
    param("aid").custom(amenityExistsById),
    body("name")
        .optional()
        .notEmpty().withMessage("Name cannot be empty")
        .custom(amenityNameExists),
    validateFields,
    handleErrors
];

export const deleteAmenityValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("aid").isMongoId().withMessage("Invalid Amenity ID"),
    param("aid").custom(amenityExistsById),
    validateFields,
    handleErrors
];