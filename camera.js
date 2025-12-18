/**
 * Camera & Image Capture Module
 * Handles camera access, photo capture, and OCR processing
 */

let cameraStream = null;
let currentCamera = 'environment'; // 'user' or 'environment'
let flashEnabled = false;

// ===================================
// Camera Initialization
// ===================================

async function initializeCamera() {
    try {
        const video = document.getElementById('camera-video');
        if (!video) return;

        // Stop any existing stream
        stopCamera();

        // Request camera access
        const constraints = {
            video: {
                facingMode: currentCamera,
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        };

        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = cameraStream;

        console.log('Camera initialized successfully');
    } catch (error) {
        console.error('Camera initialization failed:', error);
        handleCameraError(error);
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    const video = document.getElementById('camera-video');
    if (video) {
        video.srcObject = null;
    }
}

// ===================================
// Camera Controls
// ===================================

async function switchCamera() {
    currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
    await initializeCamera();
}

function toggleFlash() {
    if (!cameraStream) return;

    const track = cameraStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();

    if (capabilities.torch) {
        flashEnabled = !flashEnabled;
        track.applyConstraints({
            advanced: [{ torch: flashEnabled }]
        }).catch(err => {
            console.error('Flash toggle failed:', err);
            alert('Flash not supported on this device');
        });
    } else {
        alert('Flash not supported on this device');
    }
}

async function selectFromGallery() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await processImageFile(file);
        }
    };

    input.click();
}

// ===================================
// Photo Capture
// ===================================

async function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');

    if (!video || !canvas) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Show scanning overlay
    showScanningOverlay();

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
        if (blob) {
            await processImageBlob(blob);
        }
    }, 'image/jpeg', 0.9);
}

// ===================================
// Image Processing
// ===================================

async function processImageFile(file) {
    showScanningOverlay();

    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageData = e.target.result;
        await extractMathFromImage(imageData);
    };
    reader.readAsDataURL(file);
}

async function processImageBlob(blob) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageData = e.target.result;
        await extractMathFromImage(imageData);
    };
    reader.readAsDataURL(blob);
}

async function extractMathFromImage(imageData) {
    try {
        // Simulate OCR processing (in real app, this would call backend API)
        await simulateOCR(imageData);

        // For demo, use a sample problem
        const demoProblems = [
            '2x + 5 = 13',
            'x^2 - 5x + 6 = 0',
            'd/dx(x^3 + 2x)',
            '∫(x^2 + 2x) dx'
        ];

        const randomProblem = demoProblems[Math.floor(Math.random() * demoProblems.length)];

        // Hide scanning overlay
        hideScanningOverlay();

        // Close camera
        stopCamera();

        // Set problem and solve
        document.getElementById('problem-input').value = randomProblem;
        await solveProblem(randomProblem, imageData);

    } catch (error) {
        console.error('OCR failed:', error);
        hideScanningOverlay();
        alert('Failed to extract math from image. Please try again or type the problem manually.');
        closeCamera();
    }
}

async function simulateOCR(imageData) {
    // Simulate API call delay
    return new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
}

// ===================================
// UI Helpers
// ===================================

function showScanningOverlay() {
    const overlay = document.getElementById('scanning-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideScanningOverlay() {
    const overlay = document.getElementById('scanning-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function handleCameraError(error) {
    let message = 'Camera access failed. ';

    if (error.name === 'NotAllowedError') {
        message += 'Please allow camera access in your browser settings.';
    } else if (error.name === 'NotFoundError') {
        message += 'No camera found on this device.';
    } else if (error.name === 'NotReadableError') {
        message += 'Camera is already in use by another application.';
    } else {
        message += 'Please check your camera and try again.';
    }

    alert(message);
    closeCamera();
}

// ===================================
// Cleanup
// ===================================

// Stop camera when leaving camera screen
window.addEventListener('beforeunload', () => {
    stopCamera();
});
