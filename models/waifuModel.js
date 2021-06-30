'use strict';

const { response } = require('express');
const db = require('./conn');
class waifuModel {
    constructor(id, name, slug, origin) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.origin = origin;
    }


    static async getAll() {
        try {
            const response = await db.any(
                `SELECT * FROM waifus;`
            );
            return response;
        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }

    static async getBySlug(slug) {
        try {
            const response = await db.one(
                `SELECT * FROM waifus WHERE slug = '${slug}';`
            );
            return response;

        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }

    static async getReview(id) {
        try {
            const reviewResponse = await db.one(
                `SELECT * FROM reviews WHERE waifu_id = '${id}';`
            );
            console.log(reviewResponse);
            return reviewResponse;
        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }

    async addEntry() {
        try {
            const response = await db.result(
                `INSERT INTO waifus 
                    (name, slug, origin, picture)
                VALUES
                    ('${this.name}', '${this.slug}', '${this.origin}', null)`
            );
            return response;

        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }

    async deleteEntry() {
        try {
            const response = await db.result(
                `DELETE FROM waifus WHERE id = $1;`, [this.id]
            );
            console.log('DELETE ENTRY RESPONSE: ', response);
            return response;
        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }
}

module.exports = waifuModel;