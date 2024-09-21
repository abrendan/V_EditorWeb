document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded");
    const editor = document.getElementById('editor');
    const openBtn = document.getElementById('openBtn');
    const saveBtn = document.getElementById('saveBtn');
    const findBtn = document.getElementById('findBtn');
    const printBtn = document.getElementById('printBtn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const findInput = document.getElementById('findInput');
    const findButton = document.getElementById('findButton');
    const encodingSelect = document.getElementById('encodingSelect');
    const fontSelect = document.getElementById('fontSelect');
    const wrapTextCheckbox = document.getElementById('wrapText');
    const fileInput = document.getElementById('fileInput');

    // Brendan Modal elements
    const brendanLink = document.getElementById('brendanLink');
    const brendanModal = document.getElementById('brendanModal');
    const closeBrendanModal = brendanModal.getElementsByClassName('close')[0];

    console.log("All elements selected");

    let currentFileName = 'untitled.txt';
    let currentEncoding = 'utf-8';

    // Set file input to accept only .txt files
    fileInput.setAttribute('accept', '.txt');

    openBtn.addEventListener('click', function() {
        console.log("Open button clicked");
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        console.log("File input changed");
        const file = e.target.files[0];
        if (file) {
            if (file.name.toLowerCase().endsWith('.txt')) {
                currentFileName = file.name;
                const reader = new FileReader();
                reader.onload = function(e) {
                    const content = e.target.result;
                    detectEncoding(content);
                    editor.value = content;
                    console.log("File loaded successfully");
                };
                reader.onerror = function(e) {
                    console.error("Error reading file:", e);
                    alert("An error occurred while reading the file. Please try again.");
                };
                reader.readAsText(file);
            } else {
                alert("Please select a .txt file.");
                fileInput.value = ''; // Clear the file input
            }
        }
    });

    saveBtn.addEventListener('click', function() {
        console.log("Save button clicked");
        const content = editor.value;
        fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: content, filename: currentFileName, encoding: currentEncoding }),
        })
        .then(response => response.json())
        .then(data => {
            const blob = new Blob([data.content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = data.filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            console.log("File saved successfully");
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("An error occurred while saving the file. Please try again.");
        });
    });

    findBtn.addEventListener('click', function() {
        console.log("Find button clicked");
        modal.style.display = "block";
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    findButton.addEventListener('click', function() {
        console.log("Find text button clicked");
        const searchText = findInput.value;
        if (searchText) {
            const content = editor.value;
            const startIndex = content.indexOf(searchText);
            if (startIndex !== -1) {
                editor.setSelectionRange(startIndex, startIndex + searchText.length);
                editor.focus();
                console.log("Text found and highlighted");
            } else {
                alert("Text not found!");
            }
        }
    });

    encodingSelect.addEventListener('change', function() {
        console.log("Encoding changed to:", this.value);
        currentEncoding = this.value;
    });

    function detectEncoding(content) {
        console.log("Detecting encoding");
        fetch('/detect_encoding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: content }),
        })
        .then(response => response.json())
        .then(data => {
            currentEncoding = data.encoding;
            encodingSelect.value = currentEncoding;
            console.log("Encoding detected:", currentEncoding);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("An error occurred while detecting the file encoding. Using default encoding.");
        });
    }

    // Print functionality
    printBtn.addEventListener('click', function() {
        console.log("Print button clicked");
        const content = editor.value;
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<style>body { font-family: ' + editor.style.fontFamily + '; white-space: pre-wrap; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });

    // Basic text editing features
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'x':
                    document.execCommand('cut');
                    break;
                case 'c':
                    document.execCommand('copy');
                    break;
                case 'v':
                    document.execCommand('paste');
                    break;
            }
        }
    });

    // Font selection
    fontSelect.addEventListener('change', function() {
        console.log("Font changed to:", this.value);
        editor.style.fontFamily = this.value + ', monospace';
    });

    // Text wrapping
    wrapTextCheckbox.addEventListener('change', function() {
        console.log("Text wrap changed to:", this.checked);
        if (this.checked) {
            editor.classList.add('wrap');
        } else {
            editor.classList.remove('wrap');
        }
    });

    // Set initial font
    editor.style.fontFamily = fontSelect.value + ', monospace';

    // Brendan Modal functionality
    brendanLink.addEventListener('click', function(e) {
        console.log("Brendan link clicked");
        e.preventDefault();
        brendanModal.style.display = "block";
    });

    closeBrendanModal.addEventListener('click', function() {
        brendanModal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target == brendanModal) {
            brendanModal.style.display = "none";
        }
    });

    console.log("All event listeners set up");
});

console.log("editor.js loaded");
