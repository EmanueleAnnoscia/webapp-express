import connection from "../db.js";


const index = (req, res) => {
    const sql = `
        SELECT *
        FROM movies
    `

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: "Movies INDEX"
            });
        }
    });
};

const show = (req, res) => {
    const id = req.params.id;

    const movieSql = `
        SELECT *
        FROM movies
        WHERE id = ?
    `;

    const reviewSql = `
        SELECT *
        FROM reviews
        WHERE reviews.movie_id = ?

    `;

    connection.query(movieSql, [id], (err, movieResults) => {
        if (err) {
            console.log(err);
        }

        if (movieResults.length === 0) {
            res.status(404).json({
                error: "Movie not found",
            });
        } else {
            connection.query(reviewSql, [id], (err, reviewResults) => {
                res.json({
                    data: {
                        ...movieResults[0], reviews: reviewResults
                    },
                });
            });
        }
    });
};

export default {
    index,
    show
}