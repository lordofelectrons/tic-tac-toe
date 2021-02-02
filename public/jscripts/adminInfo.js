let sendAjaxRequest = function(method, path, args, callback) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.overrideMimeType("application/json");
    ajaxRequest.onreadystatechange = callback;
    ajaxRequest.open(method, path, true);
    ajaxRequest.send();
};

document.getElementById("feedbackLog").onclick = function () {
    let callback = function () {
        if (this.readyState == 4 && this.status == 200) {
            let records = JSON.parse(this.responseText);
            let html = '';
            for (record of records) {
                html += `<div id=oneRecord${record['id']} class="oneRecord">`;
                for (value in record) {
                    if (value != "file_path" && record[value] != undefined) {
                        html += `<font><b>${value}</b> - ${record[value]}</font>`;
                    }
                    else if (value == "file_path" && record[value] != undefined) {
                        html +=
                        `<picture class="image">
                            <source srcset="${record['file_path']}">
                            <img src="${record['file_path']}" alt="image${record['id']}/">
                        </picture>`;
                    }
                }
                html += "</div>";
            }
            document.getElementById("logspace").innerHTML = html;
            document.getElementById("logspace").className = "feedbacklog";
        }
    }
    sendAjaxRequest("GET", `/storage/database.db?table=feedbacklog`, null, callback);
};

document.getElementById("gameLog").onclick = function() {
    let callback = function () {
        if (this.readyState == 4 && this.status == 200) {
            let records = JSON.parse(this.responseText);
            let html = "";
            for (record of records) {
                html += `<div id=record${record['id']} class="oneRecord">`;
                html += `<font>${record.id}  -  ${record.time}</font>`;
                html += `<font>${record['record']}</font>`;
                html += "</div>";
            }
            console.log(html);
            document.getElementById("logspace").innerHTML = html;
            document.getElementById("logspace").className = "gamelog";
        }
    }
    sendAjaxRequest("GET", `/storage/database.db?table=gamelog`, null, callback);
}
