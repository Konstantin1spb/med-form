const sortBtn = document.getElementById('sortButton');

let sortFlag = false;
sortBtn.addEventListener('click', () => {
	if (sortFlag === true) {
		sortFlag = false;
		sortBtn.classList.remove('active');
	} else {
		sortFlag = true;
		sortBtn.classList.add('active');
	}
	fetch('http://localhost:3000/appointments', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			sort: sortFlag,
		}),
	})
		.then((response) => response.json())
		.then((data) => console.log(data));
});

// const nextPageBtn = document.querySelector('.next-page')
// nextPageBtn.addEventListener('click', () => {

// })
