
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['laptop', 'phone', 'monitor', 'keyboard', 'mouse', 'other']
  },
  assignedAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
});

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  equipment: [equipmentSchema]
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
