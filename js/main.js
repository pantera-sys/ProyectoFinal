const altura = document.body.scrollHeight - window.innerHeight;
const fondo = document.getElementById('fondo');

window.onscroll = () => {
	const anchoFondo = (window.pageYOffset / altura) * 700;
	if(anchoFondo <= 100){
		fondo.style.width = anchoFondo + '%';
	}
}

const $ = document
const App = $.getElementById('App')

$.addEventListener('DOMContentLoaded', () => {
	fetchdata()
})

const fetchdata = async () => {
	try {
		const response = await fetch('./js/api.json')
		const data = await response.json()
		displayProductsInformation(data)
		Filter(data)
	} catch (error) {
		console.log(error)
	}
}

function displayProductsInformation(obj) {
    App.innerHTML = ''
    obj.map(({source, description, price}) => {
        App.innerHTML += `
        <div class="col " >
		<div class="card shadow-sm" > 
			<img id="imagen1" src=${source} class="bd-placeholder-img card-img-top izquierda" width="100%" height="225"  role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" ><rect width="100%" height="100%" fill="#55595c"/></img>
			<div class="card-body">
			<p class="card-text">${description}</p>
			<div class="d-flex justify-content-between align-items-center">
				<div class="btn-group">
				</div>
				<p class="fw-bold">$<small class="fw-bold">${price}</small></p>
			</div>
			</div>
		</div>
		</div>
    `
    })
}

function Filter(data) {
	const input1 = $.getElementById('name')
	input1.onkeyup =  () => {
		const value = input1.value
		const filtered = data.filter((obj) => {
			const filter = obj.name.includes(value)
			return filter;
		})  
		displayProductsInformation(filtered)
	
}
}