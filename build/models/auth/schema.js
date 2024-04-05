import { body } from "express-validator";
import { Roles } from "../../types/enum.js";
export const signUpSchema = [
    body("fullName")
        .notEmpty()
        .withMessage("fullName is required")
        .isString()
        .withMessage("User most be a string"),
    body("userName")
        .notEmpty()
        .withMessage("userName is required")
        .isString()
        .withMessage("User most be a string"),
    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("password too short")
        .notEmpty()
        .withMessage("password is required"),
    body("profilePicture")
        .optional({ nullable: true })
        .isString()
        .withMessage("Debe ser un string"),
    body("userRole")
        .toLowerCase()
        .isIn(Object.values(Roles).map((e) => e.toLocaleLowerCase()))
        .withMessage("Invalid role")
        .optional(),
];
export const signInSchema = [
    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("password too short")
        .notEmpty()
        .withMessage("password is required"),
];
