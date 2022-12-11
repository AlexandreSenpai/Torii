import mongoose from 'mongoose';

export const policySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false, default: null },
  effect: { type: String, required: true, enum: ['allow', 'deny'] },
  actions: [{ type: String, required: true }],
  subjects: { type: Object, required: true, default: {} },
  resource: { type: Object, required: true, default: {} },
  context: { type: Object, required: true, default: {} },
})

export const Policy = mongoose.model('policies', policySchema);