const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const pg = require("pg");
var cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
var sslRedirect = require('heroku-ssl-redirect');

var allowedOrigins = ["http://localhost:4000", "https://acomerapp.cl"];

app.use(sslRedirect())

app.use(
    cors({
        origin: function(origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    })
);

app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/users"));
app.use("/api/featuredbranches", require("./routes/featuredbranches"));
app.use("/api/branches", require("./routes/branches"));
app.use("/api/menus", require("./routes/menus"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/tables", require("./routes/tables"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/comentaries", require("./routes/comentaries"));
app.use("/api/restaurants", require("./routes/restaurants"));
app.use("/api/restaurant-reviews", require("./routes/restaurant_reviews"));
app.use("/api/reserves", require("./routes/reserves"));
app.use("/api/orders", require("./routes/orders"));


if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/dist"));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    );
    pg.defaults.ssl = true;
}

connectDB();

app.listen(PORT, () => {
    console.log(`Server stated on port ${PORT}`);
});