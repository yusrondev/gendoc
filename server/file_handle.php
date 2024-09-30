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
    if (file_exists($filename)) {
        unlink($filename);  // Menghapus file
        echo "File deleted successfully: " . $filename;
    } else {
        echo "File does not exist";
    }
}
