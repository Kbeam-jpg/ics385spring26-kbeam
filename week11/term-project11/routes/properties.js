import express from 'express';
import Property from '../models/propertySchema.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const properties = await Property.find().lean(); // Use .lean() since no maniping - https://mongoosejs.com/docs/tutorials/lean.html#when-to-use-lean

    // like and if/switch block - https://expressjs.com/en/api.html#res.format
	res.format({
		html: () => res.status(200).render('properties', { properties }),
		json: () => res.status(200).json(properties),
		default: () => res.status(406).send('uh oh')
	});
});

router.get('/:id', async (req, res) => {
	const property = await Property.findById(req.params.id);

	if (!property) return res.status(404).json({ error: 'Not found' });

	res.status(200).json(property);
});

router.post('/:id/reviews', async (req, res) => {
	const property = await Property.findById(req.params.id);

	if (!property) return res.status(404).json({ error: 'Not found' });

	property.reviews.push(req.body);
	await property.save();

	res.status(201).json(property);
});

export default router;