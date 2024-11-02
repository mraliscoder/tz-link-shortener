const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post(`/-/createLink`, (q, a) => {
    if (q.body.url) {
        a.send({ short: "abcde" });
    } else {
        a.send({ error: { code: 1, description: "Empty URL" } });
    }
});

app.get(`/-/qr`, (q, a) => {
    a.redirect(302, "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example");
});

app.listen(5842, () => {
    console.log(`Listening on 5842`);
});