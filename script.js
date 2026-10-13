document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file.type.startsWith('image/')) {
        console.log('Not an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const container = document.getElementById('imageContainer');

            // clear previous content
            container.innerHTML = '';

            // create and insert original image and heading
            const originalHeading = document.createElement('h2');
            originalHeading.textContent = 'Original';
            container.appendChild(originalHeading);
            const originalImage = document.createElement('img');
            originalImage.src = img.src;
            container.appendChild(originalImage);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            // back and white conversion
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                const threshold = brightness < 128 ? 0 : 255;
                data[i] = data[i + 1] = data[i + 2] = threshold;
            }
            ctx.putImageData(imageData, 0, 0);

            // create and insert black and white image and heading
            const bwHeading = document.createElement('h2');
            bwHeading.textContent = 'Black and White';
            container.appendChild(bwHeading);
            const bwImage = document.createElement('img');
            bwImage.src = canvas.toDataURL('image/png');
            container.appendChild(bwImage);

            // inversion
            ctx.globalCompositeOperation = 'difference';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // create and insert inverted image and heading
            const invertedHeading = document.createElement('h2');
            invertedHeading.textContent = 'Inverted';
            container.appendChild(invertedHeading);
            const invertedImage = document.createElement('img');
            invertedImage.src = canvas.toDataURL('image/png');
            container.appendChild(invertedImage);

            ctx.globalCompositeOperation = 'source-over';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});
