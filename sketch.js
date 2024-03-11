let video;
let canvas;
let snapshot;
let grayscaleImage; // Variable to hold grayscale image
let redChannelImage; // Variable to hold red channel image
let greenChannelImage; // Variable to hold green channel image
let blueChannelImage; // Variable to hold blue channel image
let redIntensity = 0; // Initial red intensity value
let greenIntensity = 0; // Initial green intensity value
let blueIntensity = 0; // Initial blue intensity value
let space1Intensity = 0; // Initial color space intensity value
let space2Intensity = 0; // Initial color space 2 intensity value

function setup() {
    createCanvas(160, 120);
    video = createCapture(VIDEO);
    video.size(160, 120);
    video.hide();
    canvas = createCanvas(160, 120);
    canvas.parent('webcam');

    // Access the webcam
    webcam = createCapture(VIDEO, () => {
        console.log('Webcam is ready!');
    });
    webcam.size(320, 240); // Adjust if needed to better fit the new layout
    webcam.hide();

    // Capture Button
    captureButton = select('#snapshot');
    captureButton.mousePressed(takeSnapshot);

    // Range Inputs
    redIntensitySlider = select('#red-intensity');
    greenIntensitySlider = select('#green-intensity');
    blueIntensitySlider = select('#blue-intensity');
    space1IntensitySlider = select('#color-space-1-intensity');
    space2IntensitySlider = select('#color-space-2-intensity');
}

function draw() {
    background(255);

    let imgWidth = 160; // Fixed width for images
    let imgHeight = 120; // Fixed height for images

    image(video, 0, 0, 160, 120);

    if (snapshot) {
        // Resize snapshot to match the new image dimensions
        snapshot.resize(imgWidth, imgHeight);

        // Convert snapshot to grayscale
        grayscaleImage = snapshot.get();
        grayscaleImage.filter(GRAY);
        grayscaleImage.resize(imgWidth, imgHeight);

        // Convert snapshot to red channel
        redChannelImage = getRedChannel(snapshot);
        redChannelImage.resize(imgWidth, imgHeight);

        // Convert snapshot to green channel
        greenChannelImage = getGreenChannel(snapshot);
        greenChannelImage.resize(imgWidth, imgHeight);

        // Convert snapshot to blue channel
        blueChannelImage = getBlueChannel(snapshot);
        blueChannelImage.resize(imgWidth, imgHeight);

        // Update red channel image based on intensity slider value
        redIntensity = redIntensitySlider.value();
        redIntensityImage = applyIntensity(redChannelImage, redIntensity);

        // Update green channel image based on intensity slider value
        greenIntensity = greenIntensitySlider.value();
        greenIntensityImage = applyIntensity(greenChannelImage, greenIntensity);

        // Update blue channel image based on intensity slider value
        blueIntensity = blueIntensitySlider.value();
        blueIntensityImage = applyIntensity(blueChannelImage, blueIntensity);

        //Webcame repeate
        let WebImage = snapshot.get();
        WebImage.resize(imgWidth, imgHeight);

        // Update green channel image based on intensity slider value
        space1Intensity = space1IntensitySlider.value();
        space1IntensityImage = applyIntensity(grayscaleImage, space1Intensity);

        // Update blue channel image based on intensity slider value
        space2Intensity = space2IntensitySlider.value();
        space2IntensityImage = applyIntensity(redChannelImage, space2Intensity);

        // Display images
        displayImage(grayscaleImage, '#grayscale');

        displayImage(redChannelImage, '#red-channel');
        displayImage(greenChannelImage, '#green-channel');
        displayImage(blueChannelImage, '#blue-channel');

        displayImage(redIntensityImage, '#red-channel-1');
        displayImage(greenIntensityImage, '#green-channel-1');
        displayImage(blueIntensityImage, '#blue-channel-1');

        displayImage(WebImage, '#webcam-repeat');
        displayImage(grayscaleImage, '#color-space-1');
        displayImage(redChannelImage, '#color-space-2');


        displayImage(grayscaleImage, '#face-detection');
        displayImage(space1IntensityImage, '#color-space-1-1');
        displayImage(space2IntensityImage, '#color-space-2-1');



        console.log("Snapshot taken and displayed");
    }
}

// Function to display image
function displayImage(image, divId) {
    let div = select(divId);
    div.html(''); // Clear previous content
    let imgElement = createImg(image.canvas.toDataURL()); // Convert image to data URL
    imgElement.parent(div);
}

// Function to update intensity of channel image
function applyIntensity(img, intensity) {
    let newImg = img.get();
    newImg.loadPixels();
    for (let i = 0; i < newImg.pixels.length; i += 4) {
        newImg.pixels[i] = min(255, newImg.pixels[i] + intensity); // Red
        newImg.pixels[i+1] = min(255, newImg.pixels[i+1] + intensity); // Green
        newImg.pixels[i+2] = min(255, newImg.pixels[i+2] + intensity); // Blue
    }
    newImg.updatePixels();
    return newImg;
}

// Snapshot function
function takeSnapshot() {
    snapshot = webcam.get();
    snapshot.resize(160, 120);
}

// Channel Separation Functions
function getRedChannel(img) {
    let newImg = img.get();
    newImg.loadPixels();
    for (let i = 0; i < newImg.pixels.length; i += 4) {
        newImg.pixels[i+1] = 0; // Green
        newImg.pixels[i+2] = 0; // Blue
    }
    newImg.updatePixels();
    return newImg;
}

function getGreenChannel(img) {
    let newImg = img.get();
    newImg.loadPixels();
    for (let i = 0; i < newImg.pixels.length; i += 4) {
        newImg.pixels[i] = 0; // Red
        newImg.pixels[i+2] = 0; // Blue
    }
    newImg.updatePixels();
    return newImg;
}

function getBlueChannel(img) {
    let newImg = img.get();
    newImg.loadPixels();
    for (let i = 0; i < newImg.pixels.length; i += 4) {
        newImg.pixels[i] = 0; // Red
        newImg.pixels[i+1] = 0; // Green
    }
    newImg.updatePixels();
    return newImg;
}
