const chalk = require('chalk');
const Appointment = require('./models/Appointment');

const addAppointment = async (name, phone, problem) => {
	const appointmentTime = new Date()
		.toISOString()
		.split('T')[0]
		.split('-')
		.reverse()
		.join('.');
	await Appointment.create({ name, phone, appointmentTime, problem });
	console.log(chalk.bgGreen('Appointment added'));
};

const getAppointments = async (searchValue = '') => {
	const appointments = await Appointment.find({
		$or: [
			{ name: { $regex: searchValue } },
			{ phone: { $regex: searchValue } },
			{ appointmentTime: { $regex: searchValue } },
			{ problem: { $regex: searchValue } },
		],
	});
	return appointments;
};

module.exports = {
	addAppointment,
	getAppointments,
};
