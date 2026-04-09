import { body, validationResult } from 'express-validator'



export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

export const registerValidator = [

    // 🔤 Name
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters")
        .matches(/^[A-Za-z\s]+$/).withMessage("Name must contain only letters"),

    // 📧 Email
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Enter a valid email")
        .normalizeEmail(),

    // 🔒 Password
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .matches(/[A-Z]/).withMessage("Must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Must contain at least one number")
        .matches(/[@$!%*?&]/).withMessage("Must contain at least one special character"),

    // 👤 Role (optional but controlled)
    body("role")
        .optional()
        .isIn(["user", "admin"]).withMessage("Role must be user or admin"),

    // 📱 Contact (Indian format example)
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .matches(/^[6-9]\d{9}$/).withMessage("Enter valid 10-digit Indian phone number"),
    validate

];
export const loginValidator = [

    // 📧 Email
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Enter a valid email")
        .normalizeEmail(),

    // 🔒 Password
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .matches(/[A-Z]/).withMessage("Must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Must contain at least one number")
        .matches(/[@$!%*?&]/).withMessage("Must contain at least one special character"),
    validate
]