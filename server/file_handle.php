<?php

if ($_POST['action'] == 'create') {
    $filename = $_POST['filename'];
    $file = fopen($filename, 'w');  // Membuat file baru
    if ($file) {
        echo "File created successfully: " . $filename;
        fclose($file);
    } else {
        echo "Failed to create file";
    }
}

if ($_POST['action'] == 'delete') {
    $filename = $_POST['filename'];
    if (is_dir($filename)) {
        deleteDirectory($filename);
    }else{
        if (file_exists($filename)) {
            unlink($filename);  // Menghapus file
            echo "File deleted successfully: " . $filename;
        } else {
            echo "File does not exist";
        }
    }
}

if ($_POST['action'] == 'rename') {
    $old = $_POST['old'];
    $new = $_POST['new'];
    if (file_exists($old)) {
        // Coba untuk mengganti nama file
        if (rename($old, $new)) {
            echo "File berhasil diganti namanya dari '$old' menjadi '$new'.";
        } else {
            echo "Gagal mengganti nama file.";
        }
    } else {
        echo "File '$old' tidak ditemukan.";
    }
}

function deleteDirectory($dir) {
    if (!is_dir($dir)) {
        return false;
    }
    
    // Scan semua file dan direktori di dalam $dir, kecuali '.' dan '..'
    $items = array_diff(scandir($dir), ['.', '..']);
    
    foreach ($items as $item) {
        $path = "$dir/$item";
        
        // Jika item adalah direktori, lakukan rekursi untuk menghapus isi dalamnya
        if (is_dir($path)) {
            deleteDirectory($path);
        } else {
            // Hapus file
            unlink($path);
        }
    }
    
    // Hapus direktori setelah isinya kosong
    return rmdir($dir);
}
