/*
Name: Kendall Beam
# Assignment: Term Project 3 wk11
# Description: express.js server for rendering ejs / handling /properties endpoints
# Filename: app.js (main)
# Date: 4/5/26 
#
# Additions: 
#       /properties is handled as middleware (see routes/properties.js)
#       updated seed.js to include review subschema 
#
# AI usage: vetting mongodb/express/ejs setup
            moving /properties logic to its own file
            generated /views/partials/filter.ejs from robust instructions
*/


import express from 'express';
import mongoose from 'mongoose';
import propertiesRouter from './routes/properties.js'; 
// GET/properties?, GET/properties/:id, POST/properties/:id/reviews
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

await mongoose.connect(process.env.MONGO_URI);

// inital load => use /properties
app.get('/', (req, res) => {
    res.redirect('/properties');
});

app.use('/properties', propertiesRouter);//({
/*
GET properties/?op=&rating= or /?gte= or /?lte=
    // Grabs all property doc info, returns JSON array or render
    -- if text/html => res.status(200).render('properties', { properties })
    -- if application/json => res.status(200).json(properties)
        -- filter: ?op=&rating= or ?gte= or ?lte=

GET properties/:id
    // find based on id, return single property
    => res.status(200).json(property);

POST properties/:id/reviews
    // if id exists, push json body (review obj) to property.reviews[]
    => res.status(201).json(property);
*///})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
