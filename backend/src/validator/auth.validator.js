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
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        // Note: Strict character matching removed to match frontend simple validation

    // 👤 Role (Fixed to match buyer/seller enum)
    body("role")
        .optional()
        .isIn(["buyer", "seller"]).withMessage("Role must be buyer or seller"),

    // 📱 Contact
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .isLength({ min: 10, max: 15 }).withMessage("Contact must be between 10 and 15 digits"),
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
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    validate
]