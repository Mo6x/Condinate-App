import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { createBookSchema, options, updateBookSchema } from "../utils/utils";
const bookModel = require('../model/book')

export async function createBooks(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  //const id = uuidv4();
  try {
    const verified = req.user;
    console.log(req.body)
    const validationResult = createBookSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const record = await bookModel.create({
      ...req.body,
      authorsID: verified.id,
    });
    console.log(record)

    if(req.headers['postman-token']){
      return res.status(201).json({
        msg: `You have successfully created a book`,
        record,
      });
    }else {

     return res.redirect("/api/dashboard");
    }
    
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: "failed to create",
      route: "/create",
    });
  }
}

export async function getBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    //  const record = await BookInstance.findAll({where: {},limit, offset})
    const record = await bookModel.find().
      limit(limit).skip(offset) 

      // include: [
      //   {
      //     //model: User,
      //     attributes: ["id", "AuthorName", "email", "PhoneNumber"],
      //     as: "Authors",
      //   },
      // ],
     /// permiting ejs to work
    if (req.headers["postman-token"]){
      return res.status(201).json({
        msg: `You have successfully fetch all book`,
        record
      })
    }else {
      return res.render("index", { record });
    }
    // res.status(200).json({ record });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "failed to read",
      route: "/fetch all books",
    });
  }
}

export async function getSingleBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await bookModel.findOne({ _id : id});

    if(req.headers['postman-token']){
      return res.status(200).json({
      msg: "Successfully gotten user information",
      record,
    });
}
    
  } catch (error) {
    res.status(500).json({
      msg: "failed to read single todo",
      route: "/read/:id",
    });
  }
}

export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { Title, Description, pageCount, Genre, bookId, Publisher } =
      req.body;
    const validationResult = updateBookSchema.validate(req.body, options);
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

    const record = await bookModel.findOneAndUpdate({ _id : id }, updatedrecord, {new : true})
    if (!record) {
      return res.status(404).json({
        Error: "Cannot find existing todo",
      });
    }
    
    if(req.headers["postman-token"]){

      res.status(200).json({
          msg: "You have successfully updated your todo",
          record,
        });

    }else{

      res.redirect("/api/dashboard");
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "failed to update",
      route: "/update/:id",
    });

  }
}

export async function deleteBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await bookModel.findOne({ _id : id });
    if (!record) {
      return res.status(404).json({
        msg: "Cannot find todo",
      });
    }
    const deletedRecord = await record.deleteOne();

    if(req.headers['postman-token']){
      return res.status(200).json({
          msg: "Todo deleted successfully",
          deletedRecord,
        })

    }else{

      res.redirect("/api/dashboard");
    }
    //;
  } catch (error) {
    res.status(500).json({
      msg: "failed to delete",
      route: "/delete/:id",
    });
  }
}
