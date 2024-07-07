
const errorHandler = (err, req, res, next) => {
    const customObj = {
        errros: [
            { field: "", message: err.name }
        ]
    }
}