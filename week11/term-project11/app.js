// express.js server with 3 routes /properties, /properties/:id, /properties/:id/reviews
// will render using ejs template called views/properties.ejs

import express from 'express';
import mongoose from 'mongoose';
import propertiesRouter from './routes/properties.js'; // express logic in /routes/properties.js
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

await mongoose.connect(process.env.MONGO_URI);

app.get('/', (req, res) => {
    res.redirect('/properties');
});

app.use('/properties', propertiesRouter);
/*
GET properties/ 
// Grabs all properties, returns Array of JS objects
-- if text/html => res.status(200).render('properties', { properties })
-- if application/json => res.status(200).json(properties)

GET properties/:id
// find based on id, return single property
=> res.status(200).json(property);

POST properties/:id/reviews
// if exists, push review to property doc
=> res.status(201).json(property);
*/


app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
