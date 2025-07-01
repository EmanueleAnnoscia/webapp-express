import connection from "../db.js";


const index = (req, res, next) => {
    const search = req.query.search;

    let sql = `
        SELECT movies.*, ROUND(AVG(reviews.vote), 2) as vote_avg
        FROM movies
        LEFT JOIN reviews ON movies.id = reviews.movie_id
    `;
    const params = [];

    if (search !== undefined) {
        sql += ' WHERE movies.title LIKE ?';
        params.push(`%${search}%`);
    }

    sql += ' GROUP BY movies.id';

    connection.query(sql, params, (err, results) => {
        if (err) {
            return next(new Error(err));
        }

        const movies = results.map((curMovie) => {
            return {
                ...curMovie,
                image: curMovie.image ? `${req.imagePath}/${curMovie.image}` : null,
            };
        });

        res.json({
            data: movies,
        });
    });
};


const show = (req, res) => {
    const slug = req.params.slug;


    const movieSql = `
        SELECT movies.*, ROUND(AVG(reviews.vote), 2) as vote_avg
        FROM movies
        LEFT JOIN reviews
        ON movies.id = reviews.movie_id
        WHERE movies.slug = ?
        GROUP BY movies.id
    `;

    const reviewSql = `
        SELECT *
        FROM reviews
        WHERE reviews.movie_id = ?

    `;

    connection.query(movieSql, [slug], (err, movieResults) => {
        if (err) {
            return next(new Error(err));
        }

        if (movieResults.length === 0) {
            res.status(404).json({
                error: "Movie not found",
            });
        } else {
            const movieData = movieResults[0];
            connection.query(reviewSql, [movieData.id], (err, reviewResults) => {
                if (err) {
                    return next(new Error(err));
                }

                res.json({
                    data: {
                        ...movieData,
                        image: movieResults[0].image ? `${req.imagePath}/${movieData.image}` : null,
                        reviews: reviewResults,
                    },
                });
            });
        }
    });
};

const store = (req, res, next) =>{
    //prendiamo i dati del film dal body della richiesta
    const {title, director, genre, release_year, abstract} = req.body;
    //scriviamo la PREPARED STATEMENT QUERY
    const sql = `
        INSERT INTO movies (title, director, genre, release_year, abstract)
        VALUES (?, ?, ?, ?, ?)
    `
    //eseguiamo la query
    connection.query(sql, [slug, title, director, abstract], (err, result)=>{
        //gestione dell'errore
        if(err){
            return next (newError(err));
        }
        //invio della risposta con il codice 201 id e e slug
        return res.status(201).json({
            id: result.insertId,
            slug,
        })
    })
}

const storeReview = (req,res) => {
    const {id} = req.params;
    //verifichaimo che il film con questo id esista
    const movieSql = `
        SELECT *
        FROM movies
        WHERE id = ?
    `
    //se il libro essite
    connection.query(movieSql, [id], (err, movieResults) =>{
        if (movieResults.length === 0){
            return res.status(404).json({
                error: "Film non trovato",
            })
        }
        //preleviamo dal body la richiesta dati
        const {name, vote, text} = req.body;
        //salviamo la nuova review nel database
        const newReviewSql= `
            INSERT INTO  reviews (movie_id, name, vote, text)
            VALUES (?, ?, ?, ?)
        `;

        connection.query(
            newReviewSql, 
            [id, name, vote, text],
            (err, results)=>{
                if (err){
                    return next(newError(err))
                }
                return res.status(201).json({
                    message: "Recensione creata",
                    id: results.insertId,
                })
            }
        )
    })
}

export default {
    index,
    show,
    store,
    storeReview
}