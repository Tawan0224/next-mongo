import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  memberNumber: { type: String, required: true, unique: true }, 
  dateOfBirth: { type: Date, required: true },
  interests: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;