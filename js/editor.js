let modalFileManage = new bootstrap.Modal(document.getElementById('modalFileManage'));
let file_dir = "";
let dir_ = "";

// Inisialisasi Editor.js dengan List tool
const editor = new EditorJS({
    autofocus: true,
    holder: 'editorjs',
    tools: {
        header: { class: Header, inlineToolbar: true },
        code: { class: CodeTool, config: { placeholder: 'Misalnya function render()....' } },
        list: { class: List, inlineToolbar: true },
        paragraph: { inlineToolbar: true }
    },
    placeholder: 'Pikirkan bahwa kamu bisa saja salah atau keliru :)',
});

// Fungsi untuk memuat dan mengonversi Markdown ke Editor.js
document.getElementById('mdFile').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const markdownContent = e.target.result;
            const converter = new showdown.Converter();
            const htmlContent = converter.makeHtml(markdownContent);
            parseMarkdownToEditor(htmlContent);
        };
        reader.readAsText(file);
    }
});

const turndownService = new TurndownService();

// Fungsi untuk memasukkan konten HTML ke dalam Editor.js
function parseMarkdownToEditor(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const blocks = [];
    doc.body.childNodes.forEach(node => {
        if (node.nodeName === 'H1') {
            blocks.push({ type: 'header', data: { text: node.textContent, level: 1 } });
        } else if (node.nodeName === 'H2') {
            blocks.push({ type: 'header', data: { text: node.textContent, level: 2 } });
        } else if (node.nodeName === 'P') {
            blocks.push({ type: 'paragraph', data: { text: node.textContent } });
        } else if (node.nodeName === 'PRE') {
            const codeContent = node.querySelector('code').textContent;
            blocks.push({ type: 'code', data: { code: codeContent } });
        } else if (node.nodeName === 'UL') {
            const listItems = [];
            node.childNodes.forEach(li => {
                if (li.nodeName === 'LI') {
                    listItems.push(li.textContent);
                }
            });
            blocks.push({ type: 'list', data: { items: listItems, style: 'unordered' } });
        } else if (node.nodeName === 'OL') {
            const listItems = [];
            node.childNodes.forEach(li => {
                if (li.nodeName === 'LI') {
                    listItems.push(li.textContent);
                }
            });
            blocks.push({ type: 'list', data: { items: listItems, style: 'ordered' } });
        }
    });

    editor.render({ blocks: blocks });
}

document.addEventListener('keydown', (event) => {
    // Cek apakah tombol yang ditekan adalah Ctrl + S (Windows) atau Command + S (Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        editor.save().then((outputData) => {
            let htmlContent = '';

            outputData.blocks.forEach(block => {
                switch (block.type) {
                    case 'header':
                        htmlContent += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                        break;
                    case 'paragraph':
                        htmlContent += `<p>${block.data.text}</p>`;
                        break;
                    case 'code':
                        const language = 'js';
                        htmlContent += `<pre><code class="language-${language}">${block.data.code}</code></pre>`;
                        break;
                    case 'list':
                        const listType = block.data.style === 'unordered' ? 'ul' : 'ol';
                        htmlContent += `<${listType}>`;
                        block.data.items.forEach(item => {
                            htmlContent += `<li>${item}</li>`;
                        });
                        htmlContent += `</${listType}>`;
                        break;
                }
            });

            turndownService.addRule('codeBlockWithLanguage', {
                filter: function (node) {
                    return node.nodeName === 'PRE' && node.firstChild.nodeName === 'CODE';
                },
                replacement: function (content, node) {
                    const language = node.firstChild.className.replace('language-', '');
                    return `\n\`\`\`${language}\n${content}\n\`\`\`\n`;
                }
            });

            turndownService.addRule('list', {
                filter: ['ul', 'ol'],
                replacement: function (content) {
                    return content;
                }
            });

            if (file_dir == "") {
                $('.field-file-name').val('');
                modalFileManage.show();
                let dir_inside = "";
                $.each($('.sidebar').find('li.toggle'), function(k ,v){
                    const parentLi = $(v).closest('li.toggle');
    
                    // Mengambil teks dari <li> yang memiliki class 'toggle'
                    const parentText = parentLi.contents().filter(function () {
                        return this.nodeType === 3; // Mendapatkan node teks (data)
                    }).text().trim();

                    dir_inside += `<div class="alert alert-light dir-file" data-dir="${parentText}">📁 ${parentText} <button class="action-btn" data-type="delete">❌</button><button class="action-btn" data-type="rename">&#9998;</button></div>`;
                })

                dir_inside += `<button type="button" class="btn btn-sm btn-light add-dir">&#43; Buat Folder</button>`;

                $('#body-file-management').html(dir_inside);
                // console.log($('.sidebar').find('li.toggle'));
                ;
            }else{
                const markdownContent = turndownService.turndown(htmlContent);
                const blob = new Blob([markdownContent], { type: 'text/markdown' });
                const formData = new FormData();
                formData.append('file', blob, 'document.md');  // Periksa apakah blob berisi markdown
                formData.append('content', markdownContent);  // Hanya untuk debugging, kirim konten juga sebagai teks biasa
                formData.append('path', file_dir);  // Hanya untuk debugging, kirim konten juga sebagai teks biasa
    
                // Kirim file ke server
                $.ajax({
                    url: 'server/upload.php',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        console.log('File berhasil diupload:', response);
                    },
                    error: function(err) {
                        console.error('Gagal mengupload file:', err);
                    }
                });
            }

        }).catch((error) => {
            console.error('Error saving content: ', error);
        });
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        // Dapatkan elemen sidebar
        const sidebar = document.querySelector('.sidebar');
        // Tutup sidebar
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault(); // Mencegah tindakan default (seperti penambahan baris baru)
        const activeItem = $('.toggle > ul > li.actived-file');
        activeItem.removeClass('actived-file');
        editor.clear();
        file_dir = "";
    }

});

$(document).on('click', '.treeview li', function (event) {
    event.stopPropagation(); // Mencegah event bubbling
});

$(document).on('click', '.treeview .toggle', function (event) {
    const $ul = $(this).find('ul');
    if ($ul.length) {
        event.stopPropagation(); // Hanya toggle jika yang diklik adalah toggle
        $ul.toggle(); // Toggle display
        $(this).toggleClass('open');
    }
});

// Treeview collapse/expand functionality
document.querySelectorAll('.treeview .toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (event) {
        const ul = this.querySelector('ul');
        if (ul) {
            // Toggle display hanya jika yang diklik adalah toggle
            if (event.target === this) {
                if (ul.style.display === 'block') {
                    ul.style.display = 'none';
                    this.classList.remove('open');
                } else {
                    ul.style.display = 'block';
                    this.classList.add('open');
                }
            }
        }
    });
});

// Mencegah penutupan saat mengklik elemen li
document.querySelectorAll('.treeview li').forEach(function (li) {
    li.addEventListener('click', function (event) {
        event.stopPropagation(); // Mencegah event bubbling ke toggle
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.treeview ul');

    // Ambil daftar file Markdown dari server
    fetch('server/directory.php')
        .then(response => response.json())
        .then(data => {
            // Urutkan data berdasarkan abjad
            const sortedData = sortData(data);

            // Panggil fungsi untuk membangun treeview dari data
            buildTreeview(sortedData, sidebar);
        })
        .catch(error => console.error('Error fetching files:', error));

    // Fungsi untuk mengurutkan data
    function sortData(data) {
        const sorted = {};
        const keys = Object.keys(data).sort(); // Mengurutkan kunci
        const files = []; // Array untuk menyimpan file dengan ekstensi

        keys.forEach(key => {
            // Cek apakah nilai adalah array (folder)
            if (Array.isArray(data[key])) {
                sorted[key] = sortDataArray(data[key]); // Mengurutkan array jika ini adalah folder
            } else {
                // Cek apakah ini adalah file dengan ekstensi .md
                if (key.endsWith('.md')) {
                    files.push({ key: key, value: data[key] }); // Masukkan file dengan ekstensi .md
                } else {
                    sorted[key] = data[key]; // Masukkan folder atau file tanpa ekstensi
                }
            }
        });

        // Menambahkan file .md di urutan terakhir
        files.sort((a, b) => a.key.localeCompare(b.key)); // Urutkan file berdasarkan nama
        files.forEach(file => {
            sorted[file.key] = file.value; // Menambahkan file ke sorted
        });

        return sorted;
    }

    // Fungsi untuk mengurutkan array
    function sortDataArray(arr) {
        return arr.sort((a, b) => a.localeCompare(b)); // Mengurutkan array secara abjad
    }

    // Fungsi untuk membangun treeview dari data
    function buildTreeview(data, parentElement) {
        for (const key in data) {
            const $li = $('<li></li>'); // Membuat elemen <li>

            if (typeof data[key] === 'object') {
                // Ini adalah folder
                $li.text(key);
                const $ul = $('<ul></ul>'); // Membuat elemen <ul> untuk subfolder
                buildTreeview(data[key], $ul); // Rekursi untuk membangun subfolder
                $li.append($ul); // Menambahkan <ul> ke <li>
                $li.addClass('toggle'); // Menambahkan kelas 'toggle'

                // Event untuk toggle visibilitas
                $li.on('click', function (event) {
                    event.stopPropagation(); // Mencegah penutupan saat mengklik folder
                    $ul.toggle(); // Toggle visibility
                });
            } else {
                // Ini adalah file Markdown
                $li.text(data[key]);
                $li.removeClass('actived-file');
                $li.on('click', function (event) {
                    $('li.toggle').find('li').removeClass('actived-file');
                    $('li').removeClass('actived-file');
                    $(this).addClass('actived-file');
                    // Mencari elemen <li> induk terdekat dengan class 'toggle'
                    const parentLi = $li.closest('li.toggle');

                    // Mengambil teks dari <li> yang memiliki class 'toggle'
                    const parentText = parentLi.contents().filter(function () {
                        return this.nodeType === 3; // Mendapatkan node teks (data)
                    }).text().trim();

                    let target;
                    if (parentText) {
                        target = parentText + "/" + data[key] 
                    }else{
                        target = data[key];
                    }

                    file_dir = target;

                    event.stopPropagation(); // Mencegah event click merambat ke elemen lain
                    loadMarkdownFile(target)
                });
            }

            $(parentElement).append($li); // Menambahkan <li> ke parentElement
        }
    }

    // Fungsi untuk memuat file Markdown ke editor
    function loadMarkdownFile(fileName) {
        fetch(`docs/${fileName}?t=${new Date().getTime()}`)
            .then(response => response.text())
            .then(content => {
                // console.log(content);

                // Mengonversi konten Markdown menjadi HTML dan memuatnya ke Editor.js
                const converter = new showdown.Converter();
                const htmlContent = converter.makeHtml(content);
                parseMarkdownToEditor(htmlContent);
            })
            .catch(error => console.error('Error loading file:', error));
    }

    $('body').on('click', '.dir-file', function(){
        $('.dir-file').removeClass('actived');
        $(this).addClass('actived');
        dir_ =  $(this).data('dir');
    });

    $('.save-file').click(function(){
        let name_file = $('.field-file-name').val();
        let new_dir = $('.new-dir').val();
        editor.save().then((outputData) => {
            let htmlContent = '';

            outputData.blocks.forEach(block => {
                switch (block.type) {
                    case 'header':
                        htmlContent += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                        break;
                    case 'paragraph':
                        htmlContent += `<p>${block.data.text}</p>`;
                        break;
                    case 'code':
                        const language = 'js';
                        htmlContent += `<pre><code class="language-${language}">${block.data.code}</code></pre>`;
                        break;
                    case 'list':
                        const listType = block.data.style === 'unordered' ? 'ul' : 'ol';
                        htmlContent += `<${listType}>`;
                        block.data.items.forEach(item => {
                            htmlContent += `<li>${item}</li>`;
                        });
                        htmlContent += `</${listType}>`;
                        break;
                }
            });

            turndownService.addRule('codeBlockWithLanguage', {
                filter: function (node) {
                    return node.nodeName === 'PRE' && node.firstChild.nodeName === 'CODE';
                },
                replacement: function (content, node) {
                    const language = node.firstChild.className.replace('language-', '');
                    return `\n\`\`\`${language}\n${content}\n\`\`\`\n`;
                }
            });

            turndownService.addRule('list', {
                filter: ['ul', 'ol'],
                replacement: function (content) {
                    return content;
                }
            });

            const markdownContent = turndownService.turndown(htmlContent);
            const blob = new Blob([markdownContent], { type: 'text/markdown' });
            const formData = new FormData();
            formData.append('file', blob, 'document.md');  // Periksa apakah blob berisi markdown
            formData.append('content', markdownContent);  // Hanya untuk debugging, kirim konten juga sebagai teks biasa
            formData.append('path', dir_ +'/'+ name_file + '.md');  // Hanya untuk debugging, kirim konten juga sebagai teks biasa
            formData.append('new_dir', new_dir); 

            // Kirim file ke server
            $.ajax({
                url: 'server/upload.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    $('.sidebar').find('ul').html('');
                    const sidebar = document.querySelector('.treeview ul');

                    // Ambil daftar file Markdown dari server
                    fetch('server/directory.php')
                        .then(response => response.json())
                        .then(data => {
                            // Urutkan data berdasarkan abjad
                            const sortedData = sortData(data);

                            // Panggil fungsi untuk membangun treeview dari data
                            buildTreeview(sortedData, sidebar);
                        })
                        .catch(error => console.error('Error fetching files:', error));
                    modalFileManage.hide();
                    console.log('File berhasil diupload:', response);
                },
                error: function(err) {
                    console.error('Gagal mengupload file:', err);
                }
            });

        }).catch((error) => {
            console.error('Error saving content: ', error);
        });
    });

    $('body').on('click', '.add-dir', function(){
        let elem = $(this);
        $('#body-file-management').append('<input type="text" class="form-control m-1 new-dir" placeholder="📁 folder baru...">');
        elem.remove();
    })

    $('body').on('click', '.action-btn', function(e){
        e.preventDefault();
        let elem = $(this);
        let type = elem.data('type');
        let dir = elem.parent().data('dir');        

        if (type == "delete") {
            $.ajax({
                url: 'server/file_handle.php',
                type: 'POST',
                data: {
                    action: type,
                    filename: '../docs/' + dir
                },
                success: function (res) {
                    console.log(res);
                    elem.parent().remove();
                    editor.clear();
    
                    file_dir = "";
                    dir_ = "";
                    $('#context-menu').hide();
                }
            })
        }else{
            console.log(elem.parent().html(`<input class="form-control" data-old="${dir}" value="${dir}"><button class="rename-dir btn btn-success mt-2 btn-sm">Simpan</button>`));
        }
    });

    $('body').on('click', '.rename-dir', function(e){
        e.preventDefault();
        let elem = $(this);
        console.log(elem);
        console.log();

        $.ajax({
            url: 'server/file_handle.php',
            type: 'POST',
            data: {
                action: 'rename',
                old : '../docs/' + elem.closest('div').find('input').data('old'),
                new: '../docs/' + elem.closest('div').find('input').val()
            },
            success: function (res) {
                window.location.reload();
            }
        })
        
    })

    setInterval(() => {
        editor.save().then((outputData) => {
            let htmlContent = '';

            outputData.blocks.forEach(block => {
                switch (block.type) {
                    case 'header':
                        htmlContent += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                        break;
                    case 'paragraph':
                        htmlContent += `<p>${block.data.text}</p>`;
                        break;
                    case 'code':
                        const language = 'js';
                        htmlContent += `<pre><code class="language-${language}">${block.data.code}</code></pre>`;
                        break;
                    case 'list':
                        const listType = block.data.style === 'unordered' ? 'ul' : 'ol';
                        htmlContent += `<${listType}>`;
                        block.data.items.forEach(item => {
                            htmlContent += `<li>${item}</li>`;
                        });
                        htmlContent += `</${listType}>`;
                        break;
                }
            });

            turndownService.addRule('codeBlockWithLanguage', {
                filter: function (node) {
                    return node.nodeName === 'PRE' && node.firstChild.nodeName === 'CODE';
                },
                replacement: function (content, node) {
                    const language = node.firstChild.className.replace('language-', '');
                    return `\n\`\`\`${language}\n${content}\n\`\`\`\n`;
                }
            });

            turndownService.addRule('list', {
                filter: ['ul', 'ol'],
                replacement: function (content) {
                    return content;
                }
            });

            const markdownContent = turndownService.turndown(htmlContent);
            const blob = new Blob([markdownContent], { type: 'text/markdown' });

            localStorage.setItem('temp_editor-'+ new Date().getTime(), markdownContent);

        }).catch((error) => {
            console.error('Error saving content: ', error);
        });
    }, 3000);

});