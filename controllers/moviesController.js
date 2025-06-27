import connection from "../db.js";


const index = (req, res) => {
    console.log(req.imagePath)

    const sql = `
        SELECT movies.*, ROUND(AVG(reviews.vote), 2) as vote_avg
        FROM movies
        LEFT JOIN reviews
        ON movies.id = reviews.movie_id
        GROUP BY movies.id
    `

    connection.query(sql, (err, results) => {
        if (err) {
            return next(new Error(err))
        }
        const movies = results.map((curMovie) => {
            return {
                ...curMovie,
                image: curMovie.image ? `${req.imagePath}/${curMovie.image}` : null,
            };
        })
        res.json({
            data: movies,
        });

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
            return next(new Error(err));
        }

        if (movieResults.length === 0) {
            res.status(404).json({
                error: "Movie not found",
            });
        } else {
            connection.query(reviewSql, [id], (err, reviewResults) => {
                if (err) {
                    return next(new Error(err));
                }

                res.json({
                    data: {
                        ...movieResults[0],
                        image: movieResults[0].image ? `${req.imagePath}/${movieResults[0].image}` : null,
                        reviews: reviewResults,
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