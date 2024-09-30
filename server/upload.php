<?php
// Pastikan direktori docs dan file path dikirimkan dari client
$targetDir = '../docs/';  // Lokasi direktori docs
$filePath = !empty($_POST['path']) ? $_POST['path'] : basename($_FILES['file']['name']);

// Pastikan full path target file
$targetFile = $targetDir . $filePath;

// Pisahkan nama file dari path
$file_name = basename($targetFile);

// Jika file sudah ada, hapus file tersebut sebelum menyimpan yang baru
if (file_exists($targetFile)) {
    unlink($targetFile);  // Menghapus file yang ada
    echo "File deleted successfully: " . $targetFile . "<br>";
}

// Cek apakah file telah dikirim melalui POST
if (isset($_FILES['file'])) {
    // Simpan file ke lokasi yang ditentukan
    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
        echo "File berhasil disimpan di: " . $targetFile;
    } else {
        echo "Gagal menyimpan file.";
    }
} else {
    echo "Tidak ada file yang diupload.";
}
