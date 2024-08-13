const mongoose = require('mongoose');
const validator = require('validator');

const AppointmentSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
		validate: {
			validator: validator.isMobilePhone,
			message: 'Некорректный номер телефона',
		},
	},
	appointmentTime: {
		type: String,
	},
	problem: {
		type: String,
	},
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
