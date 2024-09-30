$('.save-file').click(function () {
    let name_file = $('.field-file-name').val();
    setTimeout(() => {
        $('li.toggle').each(function () {
            // Memeriksa apakah teks elemen li adalah "config"
            if ($(this).contents().first().text().trim() === dir_) {
                // Mengubah display dari ul menjadi block
                $(this).children('ul').css('display', 'block');
            }
        });

        let itemToFind = name_file + ".md";
        let foundItem = $('li.toggle ul li').filter(function () {
            return $(this).text().trim() === itemToFind;
        });

        if (foundItem.length) {
            // Men-trigger click pada elemen yang ditemukan
            foundItem.trigger('click');
        }
    }, 700);
});