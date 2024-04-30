import express from "express";
const router = express.Router();

router.get('/index', (req, res) => {
    res.render("index");
});

export default router;