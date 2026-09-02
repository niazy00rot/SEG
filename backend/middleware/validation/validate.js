
function validate(schema,src='body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[src])

        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.issues
            })
        }

        req[src] = result.data

        next()
    }
}

module.exports = {
    validate
}