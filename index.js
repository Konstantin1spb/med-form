const express = require('express');
const path = require('path');
const chalk = require('chalk');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { addAppointment, getAppointments } = require('./appointments.controller');
const { loginUser } = require('./users.controller');
const auth = require('./middlewares/auth');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(express.json());

app.use(cookieParser());

app.get('/login', async (req, res) => {
	res.render('login', {
		title: 'Вход',
		error: undefined,
		invalidData: undefined,
	});
});

app.post('/login', async (req, res) => {
	try {
		const token = await loginUser(req.body.email, req.body.password);

		res.cookie('token', token, { httpOnly: true });

		res.redirect('/appointments');
	} catch (e) {
		res.render('login', {
			title: 'Войти',
			error: e.message,
			invalidData: req.body,
		});
	}
});

app.get('/', async (req, res) => {
	res.render('index', {
		title: 'Запись к врачу',
		created: false,
		errorName: null,
		errorPhone: null,
		invalidData: undefined,
	});
});

app.post('/', async (req, res) => {
	try {
		await addAppointment(req.body.name, req.body.tel, req.body.problem);
		res.render('index', {
			title: 'Запись к врачу',
			created: 'Заявка отправлена',
			errorName: null,
			errorPhone: null,
			invalidData: undefined,
		});
	} catch (e) {
		console.error('Creation error:', e);
		const errorName = e?.errors?.name ? 'Поле ФИО не должно быть пустым' : null;
		let errorPhone;
		if (!e?.errors?.phone?.value) {
			errorPhone = 'Введите телефон';
		} else if (e?.errors?.phone?.value) {
			errorPhone = e?.errors?.phone;
		}
		res.render('index', {
			title: 'Запись к врачу',
			created: false,
			errorName,
			errorPhone,
			invalidData: req.body,
		});
	}
});

app.use(auth);

app.get('/appointments', async (req, res) => {
	res.render('appointments', {
		title: 'Заявки с формы',
		error: undefined,
		appointments: await getAppointments(),
		currentPage: 1,
	});
});

app.post('/appointments', async (req, res) => {
	res.render('appointments', {
		title: 'Заявки с формы',
		error: undefined,
		appointments: await getAppointments(req.body.searchValue),
	});
});

app.get('/logout', (req, res) => {
	res.cookie('token', '', { httpOnly: true });

	res.redirect('/login');
});

mongoose
	.connect(
		'mongodb+srv://LuckyNumber:k22022002@cluster0.vv5zgn4.mongodb.net/appointments?retryWrites=true&w=majority&appName=Cluster0',
	)
	.then(() => {
		app.listen(port, () => {
			console.log(chalk.green(`Server has been started on port: ${port}`));
		});
	});
