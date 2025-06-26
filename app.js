import express from "express"
import connection from "./db.js"
import moviesRouter from "./routes/movies.js"
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import imagePath from "./middleware/imagePath.js";

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.json({
        data: "Welcome to Movies API"
    })
})

app.use("/movies", imagePath, moviesRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=> {
    console.log(`In ascolto alla porta ${port}`);
});
