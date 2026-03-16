(function () {
    'use strict';

    var rowsInput = document.getElementById('mtgRows');
    var colsInput = document.getElementById('mtgCols');
    var updateBtn = document.getElementById('mtgUpdateBtn');
    var alignSelect = document.getElementById('mtgAlign');
    var applyAlignBtn = document.getElementById('mtgApplyAlignBtn');
    var inputTable = document.getElementById('mtgInputTable');
    var outputPre = document.getElementById('mtgOutput');
    var copyBtn = document.getElementById('mtgCopyBtn');
    var previewToggle = document.getElementById('mtgPreviewToggle');
    var previewDiv = document.getElementById('mtgPreview');

    var rows = 3;
    var cols = 3;
    var colAlignments = [];
    var previewVisible = false;

    function initAlignments(c) {
        colAlignments = [];
        for (var i = 0; i < c; i++) {
            colAlignments.push('left');
        }
    }

    function buildTable(r, c) {
        inputTable.innerHTML = '';
        for (var i = 0; i < r; i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < c; j++) {
                var td = document.createElement('td');
                var input = document.createElement('input');
                input.type = 'text';
                input.placeholder = i === 0 ? 'Header ' + (j + 1) : 'Cell';
                input.dataset.row = i;
                input.dataset.col = j;
                input.addEventListener('input', updateOutput);
                td.appendChild(input);
                tr.appendChild(td);
            }
            inputTable.appendChild(tr);
        }
        updateOutput();
    }

    function getTableData() {
        var data = [];
        var tableRows = inputTable.querySelectorAll('tr');
        tableRows.forEach(function (tr) {
            var rowData = [];
            tr.querySelectorAll('input').forEach(function (inp) {
                rowData.push(inp.value || '');
            });
            data.push(rowData);
        });
        return data;
    }

    function alignSep(align) {
        if (align === 'center') return ':---:';
        if (align === 'right') return '---:';
        return ':---';
    }

    function generateMarkdown(data) {
        if (!data.length) return '';
        var colCount = data[0].length;
        var colWidths = [];
        var i, j;

        for (j = 0; j < colCount; j++) {
            var maxW = 3;
            for (i = 0; i < data.length; i++) {
                maxW = Math.max(maxW, (data[i][j] || '').length);
            }
            colWidths.push(maxW);
        }

        function padCell(str, width, align) {
            str = str || '';
            var pad = width - str.length;
            if (pad <= 0) return str;
            if (align === 'right') return ' '.repeat(pad) + str;
            if (align === 'center') {
                var left = Math.floor(pad / 2);
                var right = pad - left;
                return ' '.repeat(left) + str + ' '.repeat(right);
            }
            return str + ' '.repeat(pad);
        }

        var lines = [];
        // Header row
        var headerCells = data[0].map(function (cell, j) {
            return ' ' + padCell(cell, colWidths[j], colAlignments[j] || 'left') + ' ';
        });
        lines.push('|' + headerCells.join('|') + '|');

        // Separator row
        var sepCells = colWidths.map(function (w, j) {
            var sep = alignSep(colAlignments[j] || 'left');
            // Pad separator to column width
            var inner = sep;
            while (inner.length < w) inner += '-';
            return ' ' + inner + ' ';
        });
        lines.push('|' + sepCells.join('|') + '|');

        // Data rows
        for (i = 1; i < data.length; i++) {
            var cells = data[i].map(function (cell, j) {
                return ' ' + padCell(cell, colWidths[j], colAlignments[j] || 'left') + ' ';
            });
            lines.push('|' + cells.join('|') + '|');
        }

        return lines.join('\n');
    }

    function updateOutput() {
        var data = getTableData();
        var md = generateMarkdown(data);
        outputPre.textContent = md;
        if (previewVisible) {
            renderPreview(data);
        }
    }

    function renderPreview(data) {
        if (!data.length) { previewDiv.innerHTML = ''; return; }
        var html = '<table>';
        data.forEach(function (row, i) {
            html += '<tr>';
            row.forEach(function (cell) {
                var tag = i === 0 ? 'th' : 'td';
                html += '<' + tag + '>' + escapeHtml(cell) + '</' + tag + '>';
            });
            html += '</tr>';
        });
        html += '</table>';
        previewDiv.innerHTML = html;
    }

    function escapeHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    updateBtn.addEventListener('click', function () {
        rows = Math.min(Math.max(parseInt(rowsInput.value) || 3, 1), 20);
        cols = Math.min(Math.max(parseInt(colsInput.value) || 3, 1), 10);
        rowsInput.value = rows;
        colsInput.value = cols;
        initAlignments(cols);
        buildTable(rows, cols);
    });

    applyAlignBtn.addEventListener('click', function () {
        var align = alignSelect.value;
        colAlignments = colAlignments.map(function () { return align; });
        updateOutput();
    });

    copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(outputPre.textContent).then(function () {
            copyBtn.textContent = 'Copied!';
            setTimeout(function () { copyBtn.textContent = copyBtn.dataset.orig || 'Copy'; }, 2000);
        });
    });

    previewToggle.addEventListener('click', function () {
        previewVisible = !previewVisible;
        if (previewVisible) {
            outputPre.style.display = 'none';
            previewDiv.style.display = 'block';
            renderPreview(getTableData());
            previewToggle.textContent = 'Show Markdown';
        } else {
            outputPre.style.display = 'block';
            previewDiv.style.display = 'none';
            previewToggle.textContent = previewToggle.dataset.orig || 'Preview';
        }
    });

    // Initialize
    initAlignments(cols);
    buildTable(rows, cols);
}());
