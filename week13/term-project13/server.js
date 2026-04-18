/*
# Name: Kendall Beam
# Assignment: Term Project 3 wk13
# Description: express.js server for routes / api
# Filename: server.js (main backend)
# Date: 4/19/26 
*/

import express from 'express';
import mongoose from 'mongoose';
import propertiesRouter from './routes/properties.js'; 
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// *** this will hang if mongodb is not started
await mongoose.connect(process.env.MONGO_URI);

// make / route a test api to check functionality for React? admin dashboard?
app.get('/', (req, res) => {
    res.status(200).json({message: 'Api is good'});
});

// middleware for api routes
app.use('/api/properties', propertiesRouter);//({
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