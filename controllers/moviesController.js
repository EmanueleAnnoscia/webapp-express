import connection from "../db.js";


const index = (req, res) => {
    console.log(req.imagePath)

    const sql = `
        SELECT movies.*, ROUND(AVG(reviews.vote), 2) as vote_avg
        FROM movies
        LEFT JOIN reviews
        ON movies.id = reviews.movie_id
        WHERE movies.id = 1
        GROUP BY movies.id
    `

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            const movies = results.map((curMovie) => {
                return {
                    ...curMovie,
                    image: `${req.imagePath}/${curMovie.image}`
                }
            })
            res.json({
                data: movies,
            });
        }
    });
};

const show = (req, res) => {
    const id = req.params.id;

    const movieSql = `
        SELECT movies.*, ROUND(AVG(reviews.vote), 2) as vote_avg
        FROM movies
        LEFT JOIN reviews
        ON movies.id = reviews.movie_id
        WHERE movies.id = 1
        GROUP BY movies.id
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