"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleUser = exports.getUsers = exports.LoginUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import { Book } from "../model/book";
const bookModel = require('../model/book');
const UserTable = require("../model/user");
async function RegisterUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const duplicatEmail = await UserTable.findOne({ email: req.body.email });
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email is used, please change email",
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await UserTable.create({
            id: id,
            AuthorName: req.body.AuthorName,
            email: req.body.email,
            password: passwordHash,
            PhoneNumber: req.body.PhoneNumber,
        });
        if (req.headers["postman-token"]) {
            return res.status(201).json({
                msg: "You have successfully created a user",
                record,
            });
        }
        else {
            return res.redirect("/api/login");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "failed to register",
            route: "/register",
        });
    }
}
exports.RegisterUser = RegisterUser;
async function LoginUser(req, res, next) {
    // const id = uuidv4();
    try {
        const validationResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        // const User = await User.findOne({ email: req.body.email }, 
        //   include: [{ model: Book, as: "Books" }],
        // ) as unknown as { [key: string]: string };
        // const User = await User.findOne({ email: req.body.email },  
        // ).}
        const User = await UserTable.findOne({ email: req.body.email });
        if (!User) {
            return res.status(401).json({
                message: "Record not found",
            });
        }
        // const dUser = await UserTable.find({email: req.body.email}) as unknown as { [key: string]: string };
        const token = (0, utils_1.generateToken)({ id: User._id });
        const validUser = await bcryptjs_1.default.compare(req.body.password, User.password);
        if (!validUser) {
            return res.status(401).json({
                message: "Password do not match",
            });
        }
        if (validUser) {
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            });
            res.cookie("id", User._id, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            });
            if (req.headers["postman-token"]) {
                return res.status(200).json({
                    message: "Successfully logged in",
                    token,
                    User,
                });
            }
            else {
                return res.redirect("/api/dashboard");
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "failed to login",
            route: "/login",
        });
    }
}
exports.LoginUser = LoginUser;
async function getUsers(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await BookInstance.findAll({where: {},limit, offset})
        const record = await UserTable.find();
        // limit,
        // offset,
        // include: [
        //   {
        //     model: Book,
        //     as: "Books",
        //   },
        // ],
        // });
        res.status(200).json({
            msg: "You have successfully fetch all books",
            // count: record.count,
            // record: record.rows,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getUsers = getUsers;
async function getSingleUser(req, res, next) {
    let id = req.cookies.id;
    try {
        const record = await UserTable.findOne({ _id: id }
        // include: [
        //   {
        //     model: Book,
        //     as: "Books",
        //   },
        // ],
        );
        return res.render("dashboard", { record });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({
            msg: "failed to read",
            route: "./read",
        });
    }
}
exports.getSingleUser = getSingleUser;
