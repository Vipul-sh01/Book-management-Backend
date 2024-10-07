import { Books } from "../models/book.models.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js"; 
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from "../utils/asynchandler.js";
import { Types } from "mongoose";
import { isObjectIdOrHexString } from "mongoose";

const publishBook = asyncHandler(async (req, res) => {
    const { title, author, genre, publishedYear, summary } = req.body;

    if ([title, author, genre, publishedYear, summary].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingBooks = await Books.findOne({
        $or: [{ title }, { author }]
    });

    if (existingBooks) {
        throw new ApiError(409, "Book already exists");
    }

    const bookLocalPath = req.files?.bookImage?.[0]?.path;
    console.log(bookLocalPath);
    

    if (!bookLocalPath) {
        throw new ApiError(400, 'Book image is required');
    }

    const bookImage = await uploadOnCloudinary(bookLocalPath);
    if (!bookImage) {  
        throw new ApiError(400, 'Invalid book image');
    }

    const book = await Books.create({
        title,
        author,
        genre,
        publishedYear,
        summary,
        bookImage: bookImage.url
    });

    await book.save();

    if (!book) {
        throw new ApiError(500, "Book publishing failed");
    }

    return res.status(201).json(new ApiResponse(201, book, 'Book published successfully'));
});

const deleteBook = asyncHandler(async (req, res) => {
    const { booksId } = req.query;  
    console.log("booksId:", booksId);

    if (!Types.ObjectId.isValid(booksId)) {
        throw new ApiError(400, "Invalid BooksId");
    }


    const book = await Books.findById(booksId);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    
    const bookDeleted = await Books.deleteOne({ _id: booksId });
    if (!bookDeleted) {
        throw new ApiError(400, "Failed to delete the book, please try again");
    }

    await deleteOnCloudinary(book.public_id);
    return res.status(200).json(new ApiResponse(200, null, 'Book deleted successfully'));
});


export { publishBook, deleteBook };
