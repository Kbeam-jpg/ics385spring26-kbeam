/*
Name: Kendall Beam
# Assignment: Term Project 3
# Description: mongoose schema for volcano chart data
# Filename: volcanoSchema.js
# Date: 5/2/26
#
#
# AI usage: this is **Generated** based on /docs/volcano.json
*/
import mongoose from 'mongoose';

const volcanoSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    duration: { type: String, required: true },
    pause_duration: { type: String, required: true },
    max_height_m: { type: Number, required: true },
    volume_million_m3: { type: Number, required: true },
    description: { type: String, required: true }
}, { collection: 'Volcano' });

export default mongoose.model('Volcano', volcanoSchema, 'Volcano');