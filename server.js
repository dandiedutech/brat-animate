const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const os = require('os');
// const ffmpegPath = require('ffmpeg-static'); // Hapus baris ini
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg'); // Tambahkan baris ini

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/process', async (req, res) => {
  const text = req.body.text;
  console.log("Teks yang diterima:", text);

  const words = text.split(" ");
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'brat-generator-'));
  console.log("Temporary directory:", tempDir);

  const framePaths = [];

  try {
    for (let i = 0; i < words.length; i++) {
      const currentText = words.slice(0, i + 1).join(" ");
      console.log("Memproses teks:", currentText);

      const apiRes = await axios.get(
        `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(
          currentText
        )}`,
        { responseType: "arraybuffer" }
      );

      if (!apiRes || apiRes.status !== 200) {
        console.error("Error response from API:", apiRes);
        throw new Error("Gagal membuat stiker");
      }

      if (apiRes.status >= 400) {
        const errorMsg = apiRes.data.message || "Gagal membuat stiker";
        console.error("Error response from API:", errorMsg);
        throw new Error(errorMsg);
      }

      const framePath = path.join(tempDir, `frame${i}.mp4`);
      fs.writeFileSync(framePath, apiRes.data);
      console.log("Frame disimpan di:", framePath);
      framePaths.push(framePath);
    }

    const fileListPath = path.join(tempDir, "filelist.txt");
    let fileListContent = "";

    for (let i = 0; i < framePaths.length; i++) {
      fileListContent += `file '${framePaths[i].replace(/\\/g, "/")}'\n`;
      fileListContent += `duration 0.7\n`;
    }

    fileListContent += `file '${framePaths[framePaths.length - 1].replace(
      /\\/g,
      "/"
    )}'\n`;
    fileListContent += `duration 2\n`;

    fs.writeFileSync(fileListPath, fileListContent);
    console.log("Filelist dibuat di:", fileListPath);

    const outputVideoPath = path.join(tempDir, "output.mp4");

    console.log("Menjalankan FFmpeg...");
    // Perbarui path ke ffmpeg
    const ffmpegPath = ffmpegInstaller.path; // Tambahkan baris ini
    const ffmpegCommand = `"${ffmpegPath}" -y -f concat -safe 0 -i "${fileListPath}" -vf "fps=30" -c:v libx264 -preset ultrafast -pix_fmt yuv420p "${outputVideoPath}"`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("FFmpeg error:", error);
        console.error("FFmpeg stderr:", stderr);
        res.status(500).send("Terjadi kesalahan saat memproses video: " + error.message);
        return;
      }

      console.log("FFmpeg selesai. Video disimpan di:", outputVideoPath);

      const videoData = fs.readFileSync(outputVideoPath);

      console.log("Membersihkan file sementara...");
      framePaths.forEach((frame) => fs.unlinkSync(frame));
      fs.unlinkSync(fileListPath);
      fs.unlinkSync(outputVideoPath);
      fs.rmdirSync(tempDir, { recursive: true });
      console.log("File sementara telah dihapus.");

      res.contentType("video/mp4");
      res.send(videoData);
    });
  } catch (e) {
    console.error("Terjadi kesalahan:", e);
    res.status(500).send("Terjadi kesalahan: " + e.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});