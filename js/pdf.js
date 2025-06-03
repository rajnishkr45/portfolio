document.querySelectorAll('.skill.learning').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const pdfUrl = this.getAttribute('href');
        const modal = document.getElementById('pdfModal');
        const spinner = document.getElementById('spinner');
        const canvas = document.getElementById('pdfCanvas');
        const ctx = canvas.getContext('2d');

        spinner.style.display = 'block';
        canvas.style.display = 'none';
        modal.style.display = 'flex';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        loadingTask.promise.then(pdf => {
            return pdf.getPage(1);
        }).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            return page.render({
                canvasContext: ctx,
                viewport: viewport
            }).promise;
        }).then(() => {
            spinner.style.display = 'none';
            canvas.style.display = 'block';
        }).catch(error => {
            alert("Error loading PDF: " + error.message);
            modal.style.display = 'none';
        });
    });
});

document.querySelector('.close').onclick = function () {
    document.getElementById('pdfModal').style.display = 'none';
    document.getElementById('pdfCanvas').style.display = 'none';
    document.getElementById('spinner').style.display = 'none';
};

window.onclick = function (event) {
    const modal = document.getElementById('pdfModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        document.getElementById('pdfCanvas').style.display = 'none';
        document.getElementById('spinner').style.display = 'none';
    }
};
