const express = require('express');
const app = express();
const request = require('request');
var cors = require('cors')

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors({
    "origin": "*"
}))


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log("Request")
    // console.log(req.body)
    next();
});


app.post("/api", function (req, res) {
    console.log(req.body)
    var requestSettings = {
        url: 'https://carbonara.vercel.app/api/cook',
        method: 'POST',
        json: true,
        body: req.body,
        encoding: null
    };

    request(requestSettings, function (error, response, body) {
        console.log(response.statusCode);
        res.set('Content-Type', 'image/png');
        res.send(body);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));