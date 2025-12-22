import mongoose from 'mongoose';
import crypto from 'crypto';

const identificationSchema = new mongoose.Schema({
  type: String,
  number: String
});

const cardSchema = new mongoose.Schema({
  card_number: { type: String, required: true, unique: true },
  security_code: { type: String, required: true },
  expiration_month: Number,
  expiration_year: Number,
  token: String,
  cardholder: {
    name: String,
    identification: identificationSchema
  }
});

cardSchema.pre('save', function () {
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
  }
});

export default mongoose.model('Card', cardSchema);
