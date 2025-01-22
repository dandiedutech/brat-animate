# Brat Video Generator

Aplikasi web sederhana untuk membuat video dengan efek teks "Brat" menggunakan Node.js dan API dari [Caliph Dev](https://caliph.dev/).

## Screenshot

![Screenshot Aplikasi](https://8030.us.kg/file/4mS1nAMbGdDr.jpg)

## Fitur

*   Membuat video dengan efek teks "Brat" berdasarkan input teks.
*   Menampilkan preview video.
*   Mendownload video hasil generate.
*   Menampilkan jumlah karakter yang diketik.

## Teknologi yang Digunakan

*   **Frontend:**
    *   HTML
    *   CSS
    *   JavaScript
*   **Backend:**
    *   Node.js
    *   Express
    *   FFmpeg (melalui package `ffmpeg-static`)
    *   Axios
*   **API:**
    *   [Caliph Dev](https://caliph.dev/)) (khususnya API `https://brat.caliphdev.com/api/brat`)

## Instalasi

Berikut adalah langkah-langkah untuk menjalankan aplikasi ini secara lokal:

1.  **Clone Repositori:**

    ```bash
    git clone [https://github.com/dandiedutech/brat-animate.git](https://github.com/dandiedutech/brat-animate.git)
    ```

2.  **Masuk ke Direktori Proyek:**

    ```bash
    cd brat-generator
    ```

3.  **Install Dependencies:**

    ```bash
    npm install
    ```

4.  **Pastikan FFmpeg Terinstall:**

    *   Project ini menggunakan package `ffmpeg-static` yang mengunduh binary FFmpeg secara otomatis.
    *   Jika Anda mengalami masalah, pastikan FFmpeg terinstall dengan benar di sistem Anda dan dapat diakses melalui command `ffmpeg` di terminal.

5.  **Jalankan Aplikasi:**

    ```bash
    node server.js
    ```

    Aplikasi akan berjalan di `http://localhost:3000`.

## Cara Penggunaan

1.  Buka aplikasi di browser Anda (`http://localhost:3000`).
2.  Masukkan teks yang ingin Anda generate menjadi video "Brat" di dalam textarea.
3.  Klik tombol "Generate".
4.  Tunggu beberapa saat, video akan muncul di bawah area "Preview".
5.  Klik tombol "Download" untuk mengunduh video.
