let forms = document.querySelectorAll("form");

for (let form of forms) {
    form.addEventListener("submit", (e) => {    
        if (!form.checkValidity()) {
            e.preventDefault();
            form.classList.add('form-validated');
        } 
    })
}