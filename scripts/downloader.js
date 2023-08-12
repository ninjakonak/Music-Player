
export function sendUrl(URL) {
    window.location.href = `http://localhost:4000/download?URL=${URL}`;
}