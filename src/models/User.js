import mongoose from 'mongoose';
import crypto from 'crypto';

const identificationSchema = new mongoose.Schema({
  type: String,
  number: String
});

const userSchema = new mongoose.Schema({
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

/**
 * Middleware moderno (SEM next)
 */
userSchema.pre('save', function () {
  console.log('🟡 pre-save executado');

  if (!this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
    console.log('🟢 Token gerado:', this.token);
  }
});


export default mongoose.model('Bico', userSchema);
