const phoneInput = document.getElementById('tel');
const maskOptions = {
	mask: '+{7}0000000000',
};

const mask = new IMask(phoneInput, maskOptions);
