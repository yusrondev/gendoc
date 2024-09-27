Selamat datang
--------------

berikut adalah kode yang perlu anda gunakkan

```js
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
```

setelah itu gunakkan kode berikut juga

```js
if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
    event.preventDefault();
    // Dapatkan elemen sidebar
    const sidebar = document.querySelector('.sidebar');
    // Tutup sidebar
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}
```

Customize everything with Sass
------------------------------

Bootstrap utilizes Sass for a modular and customizable architecture. Import only the components you need, enable global options like gradients and shadows, and write your own CSS with our variables, maps, functions, and mixins.