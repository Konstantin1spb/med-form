const User = require('./models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./constants');

async function loginUser(email, password) {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('User is not found');
	}

	const isPasswordCorrect = (await password) === user.password ? true : false;

	if (!isPasswordCorrect) {
		throw new Error('Wrong password');
	}

	return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' });
}

module.exports = { loginUser };
