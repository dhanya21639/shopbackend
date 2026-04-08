const express = require("express");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(express.json());

// make upload folder public
app.use("/upload", express.static("upload"));

// use routes
app.use("/api", uploadRoutes);

app.listen(5000, () => {
 console.log("Server running on port 5000");
});