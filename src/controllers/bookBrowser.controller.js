import { Books } from "../models/book.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getAllBooks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc' } = req.query;


    const filter = {};
    if (query) {
        filter.title = new RegExp(query, 'i');
    }

    const books = await Books.find(filter)
        .sort({ [sortBy]: sortType === 'desc' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    const total = await Books.countDocuments(filter);
    res.status(200).json(new ApiResponse(200, books, { total, page, limit }, "All books available"));
});

const searchBook = asyncHandler(async (req, res) => {
    const { query } = req.body;

    try {
        const pipeline = [
            {
                $match: {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { author: { $regex: query, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author: 1,
                    genre: 1,
                    bookImage: 1,
                    publishedYear: 1,
                    summary: 1,
                }
            }
        ];

        const filterData = await Books.aggregate(pipeline);

        if (filterData.length === 0) {
            throw new ApiError(400, "Data not found");
        }
        res.status(200).json(new ApiResponse(200, filterData, "Successfully retrieved Books"));

    } catch (error) {
        throw new ApiError(500, "Failed to search for books", error);
    }
});


export { getAllBooks, searchBook };
