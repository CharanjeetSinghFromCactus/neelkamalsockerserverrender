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
        const selectedJson =  data.find(x => x.name === event.target.value);
        const selectedProductJson =  JSON.stringify(selectedJson)
        const selectedProduct = JSON.parse(selectedProductJson);
        console.log('Received modelSelected event: ', selectedProduct);
        const selectedModel = selectedProduct.path;
        const modelViewer = document.getElementById('viewer');
        modelViewer.src = selectedModel;

        // modelViewer.setAttribute('min-camera-orbit', `auto 90deg ${selectedProduct.zoom}`);
        // modelViewer.setAttribute('max-camera-orbit', `auto 90deg ${selectedProduct.zoom}`);
        console.log(`Model selected: ${selectedProductJson}`);
        socket.emit('modelSelected', { selectedProduct: selectedProductJson });

    });
    const modelViewer = document.getElementById('viewer');
    modelViewer.addEventListener('camera-change', () => {
        const {theta} = modelViewer.getCameraOrbit();
        const degree = theta * (180 / Math.PI);
        // console.log(`Camera orbit changed: theta=${deg}`);
        socket.emit('camera-change', {deg: degree});
    })
})