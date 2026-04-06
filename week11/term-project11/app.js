// express.js server with 3 routes /properties, /properties/:id, /properties/:id/reviews
// will render using ejs template called views/properties.ejs

import express from 'express';
import Property from './propertySchema.js';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

// Get /properties
app.get("/properties", async (req, res) => {
    const properties = await Property.find();
    res.json(properties);
});

// Get /properties/:id
app.get("/properties/:id", async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Not found" });
    res.json(property);
});

// POST /properties/:id/reviews
app.post("/properties/:id/reviews", async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ error: "Not found" });
    property.reviews.push(req.body); // push new review object

    await property.save(); // triggers schema validation
    res.status(201).json(property);
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
