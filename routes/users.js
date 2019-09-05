const express = require("express");
const app = express();
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const auth = require("../middlewares/auth");
const Order = require("../models/Order");

AWS.config.update({
    accessKeyId: "AKIAJTZQNE72FAH4RTUA",
    secretAccessKey: "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"
});

const S3 = new AWS.S3();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILETYPE";
        return cb(error, false);
    }

    cb(null, true);
};

const upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: "acomerapi",
        acl: "public-read",
        key: function(req, file, cb) {
            cb(null, Date.now().toString());
        }
    }),
    fileFilter,
    limits: {
        fileSize: 500000
    }
});

app.use((err, req, res, next) => {
    if (err.code === "INCORRECT_FILETYPE") {
        res.status(422).json({ error: "Only images are allowed" });
        return;
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: "File is too large" });
    }
});

// @route   POST api/users/image
// @desc    Upload image to user
// @access  Public
router.post("/image", upload.single("file"), async(req, res) => {
    const file = req.file;
    const user_id = req.body.user_id;
    try {
        const user = await User.findByPk(user_id);
        user.image = file.location;
        await user.save();

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get("/", async(req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

// @route   GET api/users/:id/restaurants
// @desc    Get all user restaurants
// @access  Private
router.get("/:id/restaurants", async(req, res) => {
    try {
        const { id } = req.params;
        const restaurants = await Restaurant.findAll({ where: { userId: id } });
        return res.status(200).json(restaurants);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

// @route   GET api/users
// @desc    Get a user
// @access  Private
router.get("/:id", auth, async(req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

router.get("/orders/:id", async(req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.params.id, "reservation": null },
            include: [{ all: true, nested: true }]
        });
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

// @route   PUT api/users
// @desc    Update a user
// @access  Private
router.put("/:id", auth, async(req, res) => {
    try {
        const {
            name,
            email,
            password,
            image,
            currentPassword,
            newPassword
        } = req.body;
        const user = await User.findByPk(req.params.id);

        if (name) user.name = name;
        if (email && password) {
            const isMatch = await bcrypt.compare(password, user.encrypted_password);
            if (!isMatch) return res.status(400).json({ msg: "Datos incorrectos." });
            user.email = email;
        }
        if (image) user.image = image;
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(
                currentPassword,
                user.encrypted_password
            );
            if (!isMatch) return res.status(400).json({ msg: "Datos incorrectos." });
            const salt = await bcrypt.genSalt(10);
            user.encrypted_password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post(
    "/register", [
        check("name", "Please add name.")
        .not()
        .isEmpty(),
        check("email", "Please include a valid email.").isEmail(),
        check(
            "password",
            "Please enter a password with 6 or more characters."
        ).isLength({ min: 6 })
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() });
        }

        const { name, email, password, image } = req.body;

        try {
            let user = await User.findOne({ where: { email } });
            if (user) {
                res.status(400).json({ msg: "Email pertenece a otro usuario." });
            }

            user = new User({
                name,
                email,
                ecrypted_password: password,
                image: image,
                branch_number: 1
            });
            const salt = await bcrypt.genSalt(10);
            user.encrypted_password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = { user: { id: user.id } };
            jwt.sign(
                payload,
                config.get("jwtSecret"), {
                    expiresIn: 3600000000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
);

module.exports = router;