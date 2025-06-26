import express from "express"
import booksController from "../controllers/moviesController.js"
import moviesController from "../controllers/moviesController.js";

const router = express.Router();

router.get("/", moviesController.index);
router.get("/:id", moviesController.show);


export default router;