import { Router } from "express";
import { getAllBooks, searchBook } from "../controllers/bookBrowser.controller.js";

const router = Router();

router.route('/getAllProduct').get(getAllBooks);
router.route('/Search').post(searchBook);

export default router;