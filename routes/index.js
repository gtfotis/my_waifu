'use strict';
const express = require('express');
const router = express.Router();
const waifuModel = require('../models/waifuModel');
const slugify = require('slugify');

router.get('/:slug?', async(req, res) => {
    if (!!req.params.slug) {
        const { slug } = req.params;
        const theWaifu = await waifuModel.getBySlug(slug);
        const { id } = req.params;
        console.log(id);
        const reviewData = await waifuModel.getReview(id);
        res.render('template', {
            locals: {
                title: '私のワイフ',
                data: theWaifu,
                reviewData,
                is_logged_in: req.session.is_logged_in
            },
            partials: {
                body: 'partials/waifu-review',
            }
        });
    } else {
        const waifuData = await waifuModel.getAll();
        res.render('template', {
            locals: {
                title: '私のワイフ',
                data: waifuData,
                is_logged_in: req.session.is_logged_in
            },
            partials: {
                body: 'partials/index',
            }
        });
    }
});

router.post('/', async(req, res) => {
    const { waifu_name, waifu_origin } = req.body;
    const slug = slugify(waifu_name, {
        replacement: '_',
        lower: true,
        strict: true
    });

    const newWaifu = new waifuModel(null, waifu_name, slug, waifu_origin);
    const response = await newWaifu.addEntry();
    return response;
    res.sendStatus(200);
});

router.post('/delete', async(req, res) => {
    const { id, waifu_name, slug, waifu_origin } = req.body;
    const waifuToDelete = new waifuModel(id, waifu_name, slug, waifu_origin);
    const response = await waifuToDelete.deleteEntry();
    console.log('DELETE ROUTE RESPONSE IS: ', response);
    return response;
    res.sendStatus(200);
});




module.exports = router;