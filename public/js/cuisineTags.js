(function () {
    const box = document.getElementById("cuisineTagInput");
    const field = document.getElementById("cuisineTagField");
    if (!box || !field) return;               // page without this input (Lesson 3)

    const MAX_TAGS = 8;
    const error = document.getElementById("cuisineError");
    const suggestions = document.getElementById("cuisineSuggestions");
    let timer;

    const chips = () => box.querySelectorAll(".cuisineTagChip");
    const valueOf = (chip) => chip.querySelector("input").value;
    const has = (name) => [...chips()].some((c) => valueOf(c).toLowerCase() === name.toLowerCase());

    // "  north   indian " -> "North Indian"
    function clean(raw) {
        return raw.trim().replace(/\s+/g, " ")
            .replace(/(^|\s)(\S)/g, (m, space, ch) => space + ch.toUpperCase());
    }

    function showMsg(text, sticky) {
        error.textContent = text;
        error.hidden = false;
        box.classList.add("hasError");
        clearTimeout(timer);
        if (!sticky) timer = setTimeout(hideMsg, 2500);
    }

    function hideMsg() {
        error.hidden = true;
        box.classList.remove("hasError");
    }

    function syncSuggestions() {
        suggestions.querySelectorAll(".cuisineSuggest").forEach((b) => {
            b.hidden = has(b.dataset.cuisine);
        });
    }

    function addTag(raw) {
        const name = clean(raw);
        if (!name) return;
        if (has(name)) return showMsg(`"${name}" is already added.`);
        if (chips().length >= MAX_TAGS) return showMsg(`You can add up to ${MAX_TAGS} cuisines.`);

        const chip = document.createElement("span");
        chip.className = "cuisineTagChip";

        const text = document.createElement("span");
        text.className = "chipText";
        text.textContent = name;                       // textContent, never innerHTML

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "chipRemove";
        remove.setAttribute("aria-label", `Remove ${name}`);
        remove.textContent = "\u00d7";

        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "restaurant[cuisines][]";
        hidden.value = name;

        chip.append(text, remove, hidden);
        box.insertBefore(chip, field);

        hideMsg();
        syncSuggestions();
    }

    // Enter adds (and must NOT submit the form); Backspace on empty removes the last chip
    field.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(field.value);
            field.value = "";
        } else if (e.key === "Backspace" && field.value === "") {
            const all = chips();
            if (all.length) {
                all[all.length - 1].remove();
                syncSuggestions();
            }
        }
    });

    // comma while typing OR pasting "Thai, Chinese, Pizza"
    field.addEventListener("input", () => {
        if (!field.value.includes(",")) return;
        const parts = field.value.split(",");
        field.value = parts.pop();                      // text after the last comma stays in the box
        parts.forEach(addTag);
    });

    // clicking away keeps what was typed
    field.addEventListener("blur", () => {
        addTag(field.value);
        field.value = "";
    });

    box.addEventListener("click", (e) => {
        const remove = e.target.closest(".chipRemove");
        if (remove) {
            remove.closest(".cuisineTagChip").remove();
            syncSuggestions();
            field.focus();
        } else if (e.target === box) {
            field.focus();
        }
    });

    suggestions.addEventListener("click", (e) => {
        const btn = e.target.closest(".cuisineSuggest");
        if (btn) addTag(btn.dataset.cuisine);
    });

    // last check before sending
    const form = box.closest("form");
    if (form) {
        form.addEventListener("submit", (e) => {
            addTag(field.value);
            field.value = "";
            if (chips().length === 0) {
                e.preventDefault();
                showMsg("Add at least one cuisine.", true);
                field.focus();
            }
        });
    }

    syncSuggestions();
})();