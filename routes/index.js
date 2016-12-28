exports.index = (req, res) => {
    res.render('index', {message: 'hello!!'});
};

exports.partials = (req, res) => {
    const filename = req.params.filename;
    const path = "partials/" + filename;
    if(filename) res.render(path);
};