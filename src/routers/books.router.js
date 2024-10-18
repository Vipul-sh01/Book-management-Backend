import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { publishBook, updateBook, deleteBook } from "../controllers/books.controllers.js";

const router = Router();

router.route('/publish').post(upload.fields([{name: 'bookImage', maxCount:1,},],), publishBook);
router.route('/:bookId/update').put(upload.fields([{name: 'bookImage', maxCount:1,},],), publishBook);
router.delete('/bookId', deleteBook);

export default router;
