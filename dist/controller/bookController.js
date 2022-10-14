"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getSingleBook = exports.getBooks = exports.createBooks = void 0;
const utils_1 = require("../utils/utils");
const bookModel = require('../model/book');
async function createBooks(req, res, next) {
    //const id = uuidv4();
    try {
        const verified = req.user;
        console.log(req.body);
        const validationResult = utils_1.createBookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await bookModel.create({
            ...req.body,
            authorsID: verified.id,
        });
        console.log(record);
        if (req.headers['postman-token']) {
            return res.status(201).json({
                msg: `You have successfully created a book`,
                record,
            });
        }
        else {
            return res.redirect("/api/dashboard");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "failed to create",
            route: "/create",
        });
    }
}
exports.createBooks = createBooks;
async function getBooks(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await BookInstance.findAll({where: {},limit, offset})
        const record = await bookModel.find().
            limit(limit).skip(offset);
        // include: [
        //   {
        //     //model: User,
        //     attributes: ["id", "AuthorName", "email", "PhoneNumber"],
        //     as: "Authors",
        //   },
        // ],
        /// permiting ejs to work
        if (req.headers["postman-token"]) {
            return res.status(201).json({
                msg: `You have successfully fetch all book`,
                record
            });
        }
        else {
            return res.render("index", { record });
        }
        // res.status(200).json({ record });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed to read",
            route: "/fetch all books",
        });
    }
}
exports.getBooks = getBooks;
async function getSingleBook(req, res, next) {
    try {
        const { id } = req.params;
        const record = await bookModel.findOne({ _id: id });
        if (req.headers['postman-token']) {
            return res.status(200).json({
                msg: "Successfully gotten user information",
                record,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read single todo",
            route: "/read/:id",
        });
    }
}
exports.getSingleBook = getSingleBook;
async function updateBook(req, res, next) {
    try {
        const { id } = req.params;
        const { Title, Description, pageCount, Genre, bookId, Publisher } = req.body;
        const validationResult = utils_1.updateBookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const updatedrecord = {
            Title: Title,
            Description: Description,
            pageCount: pageCount,
            Genre: Genre,
            bookId: bookId,
            Publisher: Publisher,
        };
        const record = await bookModel.findOneAndUpdate({ _id: id }, updatedrecord, { new: true });
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing todo",
            });
        }
        if (req.headers["postman-token"]) {
            res.status(200).json({
                msg: "You have successfully updated your todo",
                record,
            });
        }
        else {
            res.redirect("/api/dashboard");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed to update",
            route: "/update/:id",
        });
    }
}
exports.updateBook = updateBook;
async function deleteBook(req, res, next) {
    try {
        const { id } = req.params;
        const record = await bookModel.findOne({ _id: id });
        if (!record) {
            return res.status(404).json({
                msg: "Cannot find todo",
            });
        }
        const deletedRecord = await record.deleteOne();
        if (req.headers['postman-token']) {
            return res.status(200).json({
                msg: "Todo deleted successfully",
                deletedRecord,
            });
        }
        else {
            res.redirect("/api/dashboard");
        }
        //;
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to delete",
            route: "/delete/:id",
        });
    }
}
exports.deleteBook = deleteBook;
