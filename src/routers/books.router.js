import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { publishBook, deleteBook } from "../controllers/books.controllers.js";

const router = Router();

router.route('/publish').post(upload.fields([{name: 'bookImage', maxCount:1,},],), publishBook);
router.route('/Delete').delete(deleteBook);

export default router;