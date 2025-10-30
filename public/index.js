const socket = io();

fetch('api/products').then(response => response.json()).then(data => {
    const modelSelector = document.getElementById('modelSelector');
    const modelViewer = document.getElementById('viewer');
    data.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.text = product.name;
        modelSelector.appendChild(option);
    });
    SelectProduct(data[0].name);

    modelSelector.addEventListener('change', (event) => {
        SelectProduct(event.target.value);
    });

    function SelectProduct(value)
    {
        const selectedJson =  data.find(x => x.name === value);
        const selectedProductJson =  JSON.stringify(selectedJson)
        const selectedProduct = JSON.parse(selectedProductJson);
        console.log('Received modelSelected event: ', selectedProduct);
        const selectedModel = selectedProduct.path;
        modelViewer.src = selectedModel;

        // modelViewer.setAttribute('min-camera-orbit', `auto 90deg ${selectedProduct.zoom}`);
        // modelViewer.setAttribute('max-camera-orbit', `auto 90deg ${selectedProduct.zoom}`);
        console.log(`Model selected: ${selectedProductJson}`);
        socket.emit('modelSelected', { selectedProduct: selectedProductJson });
    }
    modelViewer.addEventListener('camera-change', () => {
        const {theta} = modelViewer.getCameraOrbit();
        const degree = theta * (180 / Math.PI);
        // console.log(`Camera orbit changed: theta=${deg}`);
        socket.emit('camera-change', {deg: degree});
    })
})