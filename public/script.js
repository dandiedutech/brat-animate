const textInput = document.getElementById('textInput');
const previewVideo = document.getElementById('previewVideo');
const generateButton = document.getElementById('generateButton');
const downloadButton = document.getElementById('downloadButton');
const loadingMessage = document.getElementById('loadingMessage');
const currentChar = document.getElementById('current-char');
const maxChar = document.getElementById('max-char');

let generatedBlob = null;

textInput.addEventListener('input', () => {
  const text = textInput.value;
  const textLength = text.length;
  const words = text.split(" ");
  currentChar.textContent = textLength;

  // Batasi hingga 15 kata (sekitar 75-90 karakter, sesuaikan sesuai kebutuhan)
  if (words.length > 15) {
      maxChar.style.color = 'red';
      alert("Maaf, maksimal 15 kata diperbolehkan.");
      textInput.value = words.slice(0, 15).join(" "); // Potong teks menjadi 15 kata
      currentChar.textContent = textInput.value.length; // Update jumlah karakter
      return;
  }

  if (textLength > 250) {
    maxChar.style.color = 'red';
  } else {
    maxChar.style.color = '#999';
  }
});

generateButton.addEventListener('click', async () => {
  const text = textInput.value;
  if (!text) {
    alert('Masukkan teks terlebih dahulu!');
    return;
  }
  if (text.length > 250) {
    alert('Karakter terbatas, max 250!');
    return;
  }

  loadingMessage.style.display = 'block';
  generateButton.disabled = true;
  previewVideo.style.display = 'none';
  downloadButton.style.display = 'none';
  generatedBlob = null;

    // Animasi titik-titik
    const loadingDots = document.getElementById('loadingDots');
    let dotCount = 0;
    const animationInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4; // Menghasilkan angka 0, 1, 2, 3 berulang
      loadingDots.textContent = '.'.repeat(dotCount);
    }, 300); // Ubah titik setiap 300ms

  try {
    const response = await fetch('/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    generatedBlob = await response.blob();
    const videoURL = URL.createObjectURL(generatedBlob);

    previewVideo.src = videoURL;
    previewVideo.style.display = 'block';
    downloadButton.style.display = 'block';
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Terjadi kesalahan saat memproses video.');
  } finally {
        clearInterval(animationInterval); // Hentikan animasi
        loadingDots.textContent = ''; // Hapus titik-titik
        loadingMessage.style.display = 'none';
        generateButton.disabled = false;
    }
});

downloadButton.addEventListener('click', () => {
  if (generatedBlob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(generatedBlob);
    a.download = 'brat-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});