<?php
header('Content-Type: application/json');

// Fungsi untuk membaca file dan folder secara rekursif
function scanDirectory($dir) {
    $results = [];
    $files = scandir($dir);

    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue; // Lewati . dan ..
        }

        $path = $dir . DIRECTORY_SEPARATOR . $file;
        if (is_dir($path)) {
            // Jika ini adalah direktori, panggil fungsi ini secara rekursif
            $results[$file] = scanDirectory($path);
        } else {
            // Jika ini adalah file Markdown, tambahkan ke hasil
            if (pathinfo($file, PATHINFO_EXTENSION) === 'md') {
                $results[] = $file; // Simpan hanya nama file
            }
        }
    }

    return $results;
}

// Ganti path ini dengan path ke direktori yang berisi file markdown Anda
$directory = '../docs';
$markdownFiles = scanDirectory($directory);

echo json_encode($markdownFiles);
?>
