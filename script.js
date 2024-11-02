const form = document.getElementById("form");
const shortenedForm = document.getElementById("shortened");
const short = document.getElementById("shorturl");
const qr = document.getElementById("qr");
const copyButton = document.getElementById("copyButton");
const saveButton = document.getElementById("downloadQR");

const ENDPOINT = "http://localhost:5842";

form.onsubmit = (e) => {
    e.preventDefault();

    shortenedForm.classList.add("hidden");
    const url = e.target.long.value;
    
    fetch(`${ENDPOINT}/-/createLink`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
    })
        .then(d => d.json())
        .then(d => {
            if (d.short) {
                shortenedForm.classList.remove("hidden");
                const url = `${window.location.protocol}//${window.location.hostname}/${d.short}`;
                short.innerText = url;
                qr.src = `${ENDPOINT}/-/qr?url=${encodeURIComponent(url)}`;
            } else {
                alert(d.error.description);
            }
        });
};

copyButton.onclick = () => {
    copyTextToClipboard(short.innerText);
};
saveButton.onclick = () => {
    fetch(qr.src)
    .then(resp => resp.status === 200 ? resp.blob() : Promise.reject('something went wrong'))
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'qr.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(() => alert('oh no!'));
 };

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}
