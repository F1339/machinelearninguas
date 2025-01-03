// Dictionaries for the different types
const fish_types = {0: "Anabas Testudineus", 1: "Coilia Dussumieri", 2: "Otolithoides Biauritus", 3: "Otolithoides Pama", 4: "Pethia Conchonius", 5: "Polynemus Paradiseus", 6: "Puntius Lateristriga", 7: "Setipinna Taty", 8: "Sillaginopsis Panijus"};
const fruit_types = {0: "Grapefruit", 1: "Orange"};
const pumpkin_types = {0: "Çerçevelik", 1: "Ürgüp Sivrisi"};

function changeAlgorithm() {
    const algorithm = document.getElementById('algorithmSelect').value; // Get the selected algorithm

    // Update footer texts with the selected algorithm
    document.querySelector('#footer1 div').textContent = `Hasil Prediksi Fish (${algorithm.toUpperCase()})`;
    document.querySelector('#footer2 div').textContent = `Hasil Prediksi Pumpkin (${algorithm.toUpperCase()})`;
    document.querySelector('#footer3 div').textContent = `Hasil Prediksi Fruit (${algorithm.toUpperCase()})`;
}

function resetInput(type) {
    const inputs = document.querySelectorAll(`#${type}-input input`); // Fixed the selector
    inputs.forEach(input => input.value = ''); // Reset the values
    document.getElementById(`${type}-result`).textContent = 'HASIL...?'; // Reset result
}

function predict(type) {
    const algorithm = document.getElementById('algorithmSelect').value; // Get selected algorithm
    const resultElement = document.getElementById(`${type}-result`);
    resultElement.textContent = `Predicted ${type}: [Processing...]`;

    let inputData;
    if (type === 'fish') {
        inputData = {
            type: 'fish',
            algorithm: algorithm, 
            length: parseFloat(document.getElementById('fish-length').value),
            weight: parseFloat(document.getElementById('fish-weight').value),
            wl_ratio: parseFloat(document.getElementById('fish-wl-ratio').value),
        };
    } else if (type === 'pumpkin') {
        inputData = {
            type: 'pumpkin',
            algorithm: algorithm, 
            area: parseFloat(document.getElementById('pumpkin-area').value),
            perimeter: parseFloat(document.getElementById('pumpkin-perimeter').value),
            major_axis: parseFloat(document.getElementById('pumpkin-major-axis').value),
            minor_axis: parseFloat(document.getElementById('pumpkin-minor-axis').value),
            convex_area: parseFloat(document.getElementById('pumpkin-convex-area').value),
            equiv_diameter: parseFloat(document.getElementById('pumpkin-equiv-diameter').value),
            eccentricity: parseFloat(document.getElementById('pumpkin-eccentricity').value),
            solidity: parseFloat(document.getElementById('pumpkin-solidity').value),
            extent: parseFloat(document.getElementById('pumpkin-extent').value),
            roundness: parseFloat(document.getElementById('pumpkin-roundness').value),
            aspect_ratio: parseFloat(document.getElementById('pumpkin-aspect-ratio').value),
            compactness: parseFloat(document.getElementById('pumpkin-compactness').value),
        };
    } else if (type === 'fruit') {
        inputData = {
            type: 'fruit',
            algorithm: algorithm,
            diameter: parseFloat(document.getElementById('fruit-diameter').value),
            weight: parseFloat(document.getElementById('fruit-weight').value),
            red: parseFloat(document.getElementById('fruit-red').value),
            green: parseFloat(document.getElementById('fruit-green').value),
            blue: parseFloat(document.getElementById('fruit-blue').value),
        };
    }

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.prediction !== undefined) {
                let prediction = data.prediction;

                // Map prediction to the corresponding label from the dictionary
                let label = 'Unknown Type';
                if (type === 'fish') {
                    label = fish_types[prediction] || 'Unknown Fish Type';
                } else if (type === 'pumpkin') {
                    label = pumpkin_types[prediction] || 'Unknown Pumpkin Type';
                } else if (type === 'fruit') {
                    label = fruit_types[prediction] || 'Unknown Fruit Type';
                }

                // Display the prediction as "Hasil Prediksi: 8 / Sillaginopsis Panijus"
                resultElement.textContent = `Hasil Prediksi: ${prediction} / ${label}`;
            } else {
                resultElement.textContent = 'Hasil prediksi tidak tersedia.';
            }
        })
        .catch(error => {
            resultElement.textContent = 'Terjadi kesalahan pada server.';
            console.error('Error:', error);
        });
}

window.onload = function () {
    document.getElementById('algorithmSelect').value = 'svm';
    changeAlgorithm(); // Update the footer with 'svm'
};
