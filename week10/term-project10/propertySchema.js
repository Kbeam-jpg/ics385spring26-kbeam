import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    island: { type: String, required: true, enum: ['Maui','Oahu','Hawaii Island','Kauai','Molokai','Lanai'] },
    type: { type: String, enum: ['hotel','vacation rental'], required: true },
    description: { type: String, maxlength: 500 },
    amenities: [String],
    targetSegment: String,
    imageURL: String,
}, { timestamps: true }); // Adds createdAt / updatedAt automatically

export default mongoose.model('Property', propertySchema);