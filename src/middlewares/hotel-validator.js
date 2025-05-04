import { body, param } from "express-validator";
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { query } from 'express-validator';

export const validCategories = [
    'Luxury',
    'Boutique',
    'Business',
    'Budget',
    'Family',
    'Romantic',
    'Eco-Friendly'
];

export const registerHotelValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().isEmail().withMessage("Invalid email format"),
    body("location").notEmpty().withMessage("Location is required"),

    body("category")
        .optional()
        .notEmpty().withMessage("Category is required")
        .custom(value => {
            if (!validCategories.includes(value)) {
                throw new Error(`Invalid category. Valid categories are: ${validCategories.join(", ")}`);
            }
            return true;
        }),

        body("phone")
    .optional()
    .matches(/^\+?\d{1,3}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,4}$/)
    .withMessage("Invalid phone number format"),
    body("starRating").optional().notEmpty().isNumeric().withMessage("Rating must be a number"),
    body("totalRooms").notEmpty().isNumeric().withMessage("Total rooms must be a number"),

    body("amenities").optional().notEmpty().withMessage("Amenities are required"),
    body("amenities").optional().isMongoId().withMessage("Amenities must be a valid MongoDB ID"),

    body("services").optional().notEmpty().withMessage("Services are required"),
    body("services").optional().isMongoId().withMessage("Services must be a valid MongoDB ID"),

    body("rooms").optional().notEmpty().withMessage("Rooms are required"),
    body("rooms").optional().isMongoId().withMessage("Rooms must be a valid MongoDB ID"),

    body("events").optional().notEmpty().withMessage("Events are required"),
    body("events").optional().isMongoId().withMessage("Events must be a valid MongoDB ID"),

    validateFields,
    handleErrors
];

export const getHotelValidator = [
    validateJWT,
    param("hid").notEmpty().withMessage("Hotel ID is required"),
    param("hid").isMongoId().withMessage("Invalid MongoDB ID"),

    validateFields,
    handleErrors
];

export const getHotelsValidator = [
    validateJWT,
    validateFields,
    handleErrors
];

export const updateHotelValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name").optional().notEmpty().withMessage("Name is required"),
    body("email").optional().notEmpty().isEmail().withMessage("Invalid email format"),
    body("location").optional().notEmpty().withMessage("Location is required"),

    body("category")
        .optional()
        .notEmpty().withMessage("Category is required")
        .custom(value => {
            if (!validCategories.includes(value)) {
                throw new Error(`Invalid category. Valid categories are: ${validCategories.join(", ")}`);
            }
            return true;
        }),

        body("phone")
    .optional()
    .matches(/^\+?\d{1,3}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,4}$/)
    .withMessage("Invalid phone number format"),
    
    body("starRating").optional().notEmpty().isNumeric().withMessage("Rating must be a number"),
    body("totalRooms").optional().notEmpty().isNumeric().withMessage("Total rooms must be a number"),

    body("amenities").optional().notEmpty().withMessage("Amenities are required"),
    body("amenities").optional().isMongoId().withMessage("Amenities must be a valid MongoDB ID"),

    body("services").optional().notEmpty().withMessage("Services are required"),
    body("services").optional().isMongoId().withMessage("Services must be a valid MongoDB ID"),

    body("rooms").optional().notEmpty().withMessage("Rooms are required"),
    body("rooms").optional().isMongoId().withMessage("Rooms must be a valid MongoDB ID"),

    body("events").optional().notEmpty().withMessage("Events are required"),
    body("events").optional().isMongoId().withMessage("Events must be a valid MongoDB ID"),

    validateFields,
    handleErrors
];

export const deleteHotelValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("hid").notEmpty().withMessage("Hotel ID is required"),
    param("hid").isMongoId().withMessage("Invalid MongoDB ID"),
    validateFields,
    handleErrors
];

export const filterHotelsValidator = [
    validateJWT,
    query('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),

    query('location')
        .optional()
        .isString()
        .withMessage('Location must be a string'),

    query('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Phone must be a valid number'),

    query('category')
        .optional()
        .isIn(validCategories)
        .withMessage(`Category must be one of: ${validCategories.join(', ')}`),

        query('starRating')
        .optional()
        .customSanitizer(value => value.split(',').map(v => v.trim()))
        .custom((value) => {
            if (value.length > 2) {
                throw new Error('Star rating must contain at most two values (min,max)');
            }
            if (value.some(v => v && (!Number.isInteger(+v) || +v < 1 || +v > 5))) {
                throw new Error('Star rating values must be integers between 1 and 5');
            }
            return true;
        }),

    query('amenities')
        .optional()
        .customSanitizer(value => {
            if (typeof value === 'string') {
                return value.split(','); 
            }
            return value;
        })
        .isArray()
        .withMessage('Amenities must be a valid MongoDB ID array'),

    query('services')
        .optional()
        .customSanitizer(value => {
            if (typeof value === 'string') {
                return value.split(','); 
            }
            return value;
        })
        .isArray()
        .withMessage('Services must be a valid MongoDB ID array'),

    query('rooms')
        .optional()
        .customSanitizer(value => {
            if (typeof value === 'string') {
                return value.split(','); 
            }
            return value;
        })
        .isArray()
        .withMessage('Rooms must be a valid MongoDB ID array'),

    query('events')
        .optional()
        .customSanitizer(value => {
            if (typeof value === 'string') {
                return value.split(','); 
            }
            return value;
        })
        .isArray()
        .withMessage('Events must be a valid MongoDB ID array'),

    validateFields,
    handleErrors
];


