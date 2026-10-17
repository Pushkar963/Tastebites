(function () {
    const meta = document.querySelector('meta[name="csrf-token"]');
    const token = meta ? meta.content : "";

    window.csrfToken = token;          // for fetch() calls
    if (!token) return;

    document.querySelectorAll("form").forEach((form) => {
        if (form.method !== "post") return;                       // GET forms don't need it
        if (form.querySelector('input[name="_csrf"]')) return;    // already added

        if (form.enctype === "multipart/form-data") {
            // multipart body isn't parsed yet when we check: use the URL
            const url = new URL(form.getAttribute("action") || location.href, location.href);
            url.searchParams.set("_csrf", token);
            form.setAttribute("action", url.pathname + url.search);
        } else {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "_csrf";
            input.value = token;
            form.appendChild(input);
        }
    });
})();