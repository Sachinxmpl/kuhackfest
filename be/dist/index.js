import express from "express";
const app = express();
app.get("/", (req, res) => {
    res.send("hello ");
});
app.listen(4000, () => {
    console.log("Server running on port 4000");
});
//# sourceMappingURL=index.js.map