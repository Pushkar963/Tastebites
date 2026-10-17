// ===== Custom confirm dialog =====
const overlay = document.getElementById("confirmOverlay");
const messageEl = document.getElementById("confirmMessage");
const wordRow = document.getElementById("confirmWordRow");
const wordEl = document.getElementById("confirmWord");
const wordInput = document.getElementById("confirmWordInput");
const okBtn = document.getElementById("confirmOk");
const cancelBtn = document.getElementById("confirmCancel");

let pendingForm = null;
let lastFocused = null;

function openConfirm(form) {
    pendingForm = form;
    lastFocused = document.activeElement;

    const word = form.dataset.confirmWord;
    messageEl.textContent = form.dataset.confirm;
    okBtn.className = "adminBtn " + (form.dataset.confirmTone === "danger" ? "danger" : "primary");

    wordRow.hidden = !word;
    wordInput.value = "";
    okBtn.disabled = Boolean(word);
    if (word) wordEl.textContent = word;

    overlay.classList.add("open");
    (word ? wordInput : okBtn).focus();
}

function closeConfirm() {
    overlay.classList.remove("open");
    pendingForm = null;
    if (lastFocused) lastFocused.focus();
}

if (overlay) {
    wordInput.addEventListener("input", () => {
        if (!pendingForm) return;
        okBtn.disabled = wordInput.value !== pendingForm.dataset.confirmWord;
    });

    okBtn.addEventListener("click", () => {
        const form = pendingForm;
        overlay.classList.remove("open");
        pendingForm = null;

        form.dataset.confirmed = "true";
        form.requestSubmit();
    });

    cancelBtn.addEventListener("click", closeConfirm);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeConfirm();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("open")) closeConfirm();
    });
}

// ===== Every action form =====
document.querySelectorAll(".adminTable form").forEach((form) => {
    form.addEventListener("submit", (e) => {
        const needsConfirm = form.dataset.confirm && form.dataset.confirmed !== "true";

        if (needsConfirm) {
            e.preventDefault();

            if (overlay) {
                openConfirm(form);
            } else if (window.confirm(form.dataset.confirm)) {   // fail closed: never skip the question
                form.dataset.confirmed = "true";
                form.requestSubmit();
            }
            return;
        }

        // Really submitting: block double clicks
        const btn = form.querySelector("button[type='submit']");
        if (btn) btn.disabled = true;
    });
});

// Back button can restore the page from cache: reset the state
window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;

    document.querySelectorAll(".adminTable form").forEach((form) => {
        form.dataset.confirmed = "false";
    });
    document.querySelectorAll(".adminTable button").forEach((b) => {
        b.disabled = false;
    });
});