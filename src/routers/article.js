const express = require("express");
const Article = require("../models/article");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/articles", auth, async (req, res) => {
    try {
        const article = new Article({ ...req.body, owner: req.user._id });
        await article.save();
        res.status(200).send(article);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.get("/articles", auth, async (req, res) => {
    try {
        const articles = await Article.find({ owner: req.user._id });
        res.status(200).send(articles);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/articles/:id", auth, async (req, res) => {
    try {
        console.log(req.user._id);
        const _id = req.params.id;
        const article = await Article.findOne({ _id, owner: req.user._id });
        if (!article) {
            return res.status(404).send("No article found with that id");
        }
        res.status(200).send(article);
    } catch (e) {
        res.status(500).send("error: " + e.message);
    }
});

router.patch("/articles/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const article = await Article.findOneAndUpdate({ _id, owner: req.user._id },
            req.body, {
            new: true,
            runValidators: true
        });
        if (!article) {
            return res.status(404).send("No article found with that id");
        }
        res.status(200).send(article);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.delete("/articles/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const article = await Article.findOneAndDelete({ _id });
        if (!article) {
            return res.status(404).send("No article found with that id");
        }
        res.status(200).send(article);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router