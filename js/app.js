const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footerBd = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCart = document.getElementById('template-cart').content
const fragment = document.createDocumentFragment()
let cart = {}

document.addEventListener("DOMContentLoaded", async () => {
    fetchData()
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'))
        paintshopCart()
    }
})


cards.addEventListener('click', (e) => {
    addCart(e)
})

items.addEventListener('click', (e) => {
    btnAction(e)
})
// funcion que recupere la informacion de la api(archivo.json) y la guarde en un array
const fetchData = async () => {
    try {
        const response = await fetch('./js/api.json')
        const data = await response.json()
        printCards(data)  
        return data
    } catch (error) {
        console.log(error)
    }
}

const printCards = (data) => {
    // console.log(data)
    data.forEach(({name, price, source, id}) => {
        
        const card = templateCard.cloneNode(true)
        card.querySelector('h5').textContent = name
        card.querySelector('span').textContent = price
        card.querySelector('img').src = source
        card.querySelector('button').dataset.id = id
        fragment.appendChild(card)
    })
    cards.appendChild(fragment)
}

const addCart = async (e) => {
    if (e.target.classList.contains('btn-dark')) {
        try {
            const response = await fetch('./js/api.json')
            const data = await response.json()
            let obj = data.find(({id}) => id == e.target.dataset.id)
            setCart(obj)
        } catch (error) {
            console.log(error)
        }
    }
}

const setCart = obj => {
    console.log(obj);
    const product = {
        id: obj.id,
        name: obj.name,
        price: obj.price,
        amount: 1
    }
    if (cart.hasOwnProperty(product.id)) {
        product.amount = cart[product.id].amount + 1
    }
    cart[product.id] = {...product}
    paintshopCart()
} 

const paintshopCart = () => {
    items.innerHTML = ''
    Object.values(cart).forEach(({id, amount, price, name}) => {
        const cart = templateCart.cloneNode(true)
        cart.querySelector('th').textContent = id
        cart.querySelector('#name').textContent = name
        cart.querySelector('#amount').textContent = amount
        cart.querySelector('.btn-info').dataset.id = id
        cart.querySelector('.btn-danger').dataset.id = id
        cart.querySelector('span').textContent = `${price * amount}`

        fragment.appendChild(cart)
    })
    items.appendChild(fragment)
    printFooter()

    localStorage.setItem('cart', JSON.stringify(cart))
}

const printFooter = () => {
    footerBd.innerHTML = ''
    if(Object.keys(cart).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        
    }else{
        const total = Object.values(cart).reduce((total, {amount}) => {
            return total + amount
        }, 0)
        const totalprice = Object.values(cart).reduce((total, {price, amount}) => {
            return total + price * amount
        }, 0)
        
        const footer = templateFooter.cloneNode(true)
        footer.querySelector('#totalProducts').textContent = total
        footer.querySelector('span').textContent = totalprice
    
        fragment.appendChild(footer)
        footerBd.appendChild(fragment)
    
        const btnEmpty = document.getElementById('emptyCart')
        btnEmpty.addEventListener('click', () => {
            cart = {}
            Swal.fire({
                title: 'Información',
                text: 'El carrito se ha vaciado',
                icon: 'info',
                confirmButtonText: 'Ok'
              })
            paintshopCart()
        })
    }
}

const btnAction = e => {
    if (e.target.classList.contains('btn-info')) {
        const product = cart[e.target.dataset.id]
        product.amount++
        cart[product.id] = {...product}
        paintshopCart()
    } else if (e.target.classList.contains('btn-danger')) {
        const product = cart[e.target.dataset.id]
        product.amount--
        product.amount === 0 ? delete cart[product.id] : cart[product.id] = {...product}
        paintshopCart()
        
    }
    e.stopPropagation()
}
