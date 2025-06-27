const errorHandler = (err, req, res, next) => {

    const resData = {
        status: "fail",
        message: "Qualcosa è andato storto",
        // error: err.message,

    }

    if (process.env.ENVIRONMENT === "development"){
        resData.error = err.message
    }
        return res.status(500).json(resData);
};

export default errorHandler;