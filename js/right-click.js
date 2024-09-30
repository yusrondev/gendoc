setTimeout(() => {
    let modalRename = new bootstrap.Modal(document.getElementById('modalRename'));
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

    $('li').on('contextmenu', function (e) {
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
        const activeItem = $('.toggle > ul > li.active');
        activeItem.removeClass('active');

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
        activeItem.removeClass('active');

        const parentLi = activeItem.parent().closest('li.toggle');
        const parentText = parentLi.contents().filter(function () {
            return this.nodeType === 3; // Mendapatkan node teks (data)
        }).text().trim();

        let name = activeItem.text();

        $('.new-name').val(parentText+'/'+name);
        $('.new-name').attr('data-old', '../docs/' + parentText + '/' + name);
        ;

        modalRename.show();
    });

    $('.update').click(function(){
        $.ajax({
            url: 'server/file_handle.php',
            type: 'POST',
            data: {
                action: 'rename',
                old : $('.new-name').data('old'),
                new: '../docs/' + $('.new-name').val()
            },
            success: function (res) {
                modalRename.hide();
                window.location.reload();
                $('#context-menu').hide();
            }
        })
    })
}, 1000);