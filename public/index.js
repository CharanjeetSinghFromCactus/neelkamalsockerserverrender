const socket = io();

fetch('api/products').then(response => response.json()).then(data => {
    const modelSelector = document.getElementById('modelSelector');
    data.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.text = product.name;
        modelSelector.appendChild(option);
    });

    modelSelector.addEventListener('change', (event) => {
        const selectedProduct =  data.find(x => x.name === event.target.value);
        const selectedProductJson =  JSON.stringify(selectedProduct)
        console.log(`Model selected: ${selectedProductJson}`);
        socket.emit('modelSelected', { selectedProduct: selectedProductJson });
    });
})