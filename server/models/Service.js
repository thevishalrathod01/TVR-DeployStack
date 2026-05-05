import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: String,
  status: String,
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;