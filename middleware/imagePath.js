const imagePath = (req, res, next) => {
    const path = `${req.protocol}://${req.get("host")}/film_cover/movies`
    req.imagePath = path;
    next()
};

export default imagePath;