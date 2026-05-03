/*
Name: Kendall Beam
# Assignment: Term Project 3 wk11
# Description: middleware for /properties route
# Filename: properties.js
# Date: 4/5/26
#
# Additions:
#   GET /properties - returns list of filtered properties, renders properties.ejs if text/html, otherwise json
#       -- filter: ?op=&rating= or ?gte= or ?lte=
#   GET /properties/:id - returns single property by id as json
#   POST /properties/:id/reviews - adds review to property, returns updated property as json
#       -- catch malformed body request
#
# AI usage: implementation of res.format()
#           /properties filter logic
*/

import express from 'express';
import Property from '../models/propertySchema.js';
import Volcano from '../models/volcanoSchema.js';

const router = express.Router();

/**
 * Accepts: ?op=<gte|lte>&rating=<num> | ?gte=<num> | ?lte=<num>
 * html: res.render()
 * json: res.json()
 */
router.get('/', async (req, res) => {
	
    // grab operator
    const queryOp = req.query.op;
    // if op=gte or op=lte => set to 'gte' | 'lte'
    //      elif ?gte or ?lte => set to 'gte' | 'lte'
    //          else set null
	const op = queryOp === 'gte' || queryOp === 'lte'
		? queryOp
		: (req.query.gte !== undefined ? 'gte' : (req.query.lte !== undefined ? 'lte' : null));

    // grab rating
	const rawRating = req.query.rating ?? req.query.gte ?? req.query.lte;
	const parsedRating = Number(rawRating);
	const rating = Number.isFinite(parsedRating) //clamp to whole number for simplicity (***if adding decimal, change here)
		? Math.min(5, Math.max(1, parsedRating))
		: null; // if not 1-5, default to null

    // build filter
	const mongoFilter = {};
	if (op && rating !== null) {
                    /* example => "reviews.rating": { $gte: 4 } } */
		mongoFilter['reviews.rating'] = { [`$${op}`]: rating };
	}

	// Use .lean() since no manipulation - https://mongoosejs.com/docs/tutorials/lean.html#when-to-use-lean
    // find() based on filter
    const properties = await Property.find(mongoFilter).lean();
	
    // send query as json response
    res.status(200).json(properties);
});


/**
 * get latest volcano eruptions for charting
 */
router.get('/volcano', async (req, res) => {
    const volcanoes = await Volcano.find()
        .sort({ id: -1 })
        .limit(10)
        .lean();

    res.status(200).json(volcanoes);
});


/**
 * get by id (for React)
 */
router.get('/:id', async (req, res) => {
    // find record
	const property = await Property.findById(req.params.id).lean();

    // if not found => return 404 error
	if (!property) return res.status(404).json({ error: 'Record not found' });

    // if found => return json of property
	res.status(200).json(property);
});


/**
 * expects { "guestName": String, "rating": num, "comment": String }
 */
router.post('/:id/reviews', async (req, res) => {

    // find record
	const property = await Property.findById(req.params.id); // no .lean() since push and save

    // if not found => return 404 error
	if (!property) return res.status(404).json({ error: 'Record not found' });

    // if found, try push and save, return updated property
    try {
        property.reviews.push(req.body);
	    await property.save();

	    res.status(201).json({updatedProperty: property});

    // catch malformed POST requests
    } catch {
        console.log(`Bad properties/:id/reviews json body from ${req.host}`);
        res.status(400).json({ error: 'Bad request, check formatting of JSON body.\n Expects { "guestName": String, "rating": num, "comment": String }'});
    }
});


export default router;