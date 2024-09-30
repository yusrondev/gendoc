setTimeout(() => {
    // Menangani klik kanan pada li di dalam li.toggle
    $('.toggle > ul > li').on('contextmenu', function (e) {
        e.preventDefault(); // Mencegah menu konteks default
        $('#context-menu')
            .css({
                display: 'block',
                top: e.pageY + 'px',
                left: e.pageX + 'px'
            });

        // Menyimpan referensi item yang diklik
        $(this).addClass('active');
    });

    // Menyembunyikan menu konteks saat mengklik di mana saja
    $(document).on('click', function () {
        $('#context-menu').hide();
        $('.toggle > ul > li').removeClass('active'); // Menghapus kelas aktif
    });

    // Menangani klik pada item menu
    $('#menu-item-2').on('click', function () {
        const parentLi = activeItem.parent().closest('li.toggle');
        const parentText = parentLi.contents().filter(function () {
            return this.nodeType === 3; // Mendapatkan node teks (data)
        }).text().trim();

        let name = activeItem.text();

        $.ajax({
            url: 'server/file_handle.php',
            type: 'POST',
            data: {
                action: 'delete',
                filename: '../docs/' + parentText + '/' + name
            },
            success: function (res) {
                console.log(res);
                activeItem.remove();
                editor.clear();

                file_dir = "";
                dir_ = "";
                $('#context-menu').hide();
            }
        })

    });

    $('#menu-item-3').on('click', function () {
        const activeItem = $('.toggle > ul > li.active');
        alert('Rename: ' + activeItem.text());
        $('#context-menu').hide();
        activeItem.removeClass('active'); // Menghapus kelas aktif
    });
}, 1000);