let cards = document.querySelectorAll(".foodCard");
let resDetailsPop = document.querySelector("#foodDetailModal");
let popUpCloseBtn = document.querySelector("#foodDetailCloseBtn");
const modalOverlay = document.getElementById("reviewModalOverlay");

// Food details modal logic
cards.forEach((card) => {
    card.addEventListener("click", (event) => {
        if (!resDetailsPop) return;
        resDetailsPop.classList.add("open");

        let menuId = card.dataset.id;
        const menuItem = typeof menuItems !== "undefined" ? menuItems.find(item => item._id === menuId) : null;

        if (menuItem) {
            document.querySelector("#foodDetailName").textContent = menuItem.name;
            document.querySelector("#foodDetailRestaurant").textContent = menuItem.restaurantId?.name || "";
            document.querySelector("#foodDetailDesc").textContent = menuItem.description;

            if (menuItem.discountedPrice === null) {
                document.querySelector("#foodDetailOriginalPrice").textContent = menuItem.price;
                document.querySelector("#foodDetailPrice").textContent = "";
                document.querySelector("#foodDetailOriginalPrice").style.cssText = `
                    font-size: 18px;
                    font-weight: 800;
                    color: var(--stone-800);
                `;
            } else {
                document.querySelector("#foodDetailOriginalPrice").textContent = menuItem.price;
                document.querySelector("#foodDetailPrice").textContent = menuItem.discountedPrice;
                document.querySelector("#foodDetailOriginalPrice").style.cssText = `
                    font-size: 14px;
                    color: var(--stone-400);
                    text-decoration: line-through;
                `; 
            }
        }
    });
});

if (popUpCloseBtn && resDetailsPop) {
    popUpCloseBtn.addEventListener("click", () => {
        resDetailsPop.classList.remove("open");
    });
}

// Review Modal Logic (Wrapped safely for logged-out state)
function openReviewModal() { 
    if (modalOverlay) modalOverlay.classList.add("open"); 
}

const writeReviewBtn = document.getElementById("writeReviewBtn");
const floatingBtn = document.getElementById("floatingReviewBtn");
const closeReviewModalBtn = document.getElementById("closeReviewModal");

if (writeReviewBtn) writeReviewBtn.addEventListener("click", openReviewModal);
if (floatingBtn) floatingBtn.addEventListener("click", openReviewModal);
if (closeReviewModalBtn) {
    closeReviewModalBtn.addEventListener("click", () => modalOverlay?.classList.remove("open"));
}

if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => { 
        if (e.target === modalOverlay) modalOverlay.classList.remove("open"); 
    });
}

// Scroll observer for floating button
const observedHeader = document.getElementById("reviewSummary");
if (observedHeader && floatingBtn) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        floatingBtn.classList.toggle("show", !entry.isIntersecting);
      });
    }, { 
        threshold: 0,
        rootMargin: "-80px 0px 0px 0px",
    });
    observer.observe(observedHeader);
}

// Review Form Validation (Only runs if form exists)
const reviewForm = document.getElementById("reviewForm");
if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      const nameInput = document.getElementById("nameInput");
      const ratingChecked = document.querySelector('input[name="review[rating]"]:checked');
      const nameError = document.getElementById("nameError");
      const ratingError = document.getElementById("ratingError");

      let valid = true;
      if (nameInput && !nameInput.value.trim()) { 
          if (nameError) nameError.classList.add("show"); 
          valid = false; 
      } else if (nameError) { 
          nameError.classList.remove("show"); 
      }

      if (!ratingChecked) { 
          if (ratingError) ratingError.classList.add("show"); 
          valid = false; 
      } else if (ratingError) { 
          ratingError.classList.remove("show"); 
      }

      if (!valid) e.preventDefault();
    });
}

// Review Pagination (See More / See Few)
const allCards = document.querySelectorAll(".reviewCard");
allCards.forEach((card, index) => {
  if (index >= 5) card.classList.add("hiddenReview");
});

const seeLessBtn = document.getElementById('seeLessBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
let shownCount = 5;

if (seeLessBtn) {
    seeLessBtn.style.display = Number(shownCount) <= 5 ? "none" : "block";
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      const hiddenCards = document.querySelectorAll(".reviewCard.hiddenReview"); 
      hiddenCards.forEach((card, i) => {
        if (i < 5) card.classList.remove("hiddenReview");
      });
      shownCount = Math.min(shownCount + 5, allCards.length);
      if (shownCount >= allCards.length) {
        loadMoreBtn.style.display = "none";
      }
      if (seeLessBtn) {
        seeLessBtn.style.display = Number(shownCount) <= 5 ? "none" : "block";
      }
    });
}

if (seeLessBtn) {
    seeLessBtn.addEventListener("click", () => {
        shownCount = 5;
        allCards.forEach((card, index) => {
            if (index >= 5) card.classList.add("hiddenReview");
        });
        if (loadMoreBtn) loadMoreBtn.style.display = "block";
        seeLessBtn.style.display = "none";
    });
}



/*
Image Upload
*/
const fileInput = document.getElementById("restaurantImageInput");
const uploadBox = document.getElementById("imageUploadBox");
const preview = document.getElementById("imagePreview");
const changeBtn = document.getElementById("changeImageBtn");
const successMsg = document.getElementById("imageSuccessMsg");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = "block";

    const isEditMode = Boolean(document.getElementById("currentImagePreview"));

    if (isEditMode) {
      // Edit Mode: Keep uploadBox visible, only update elements inside it
      if (changeBtn) changeBtn.style.display = "inline-block";
    } else {
      // New Mode: Hide uploadBox completely
      if (uploadBox) uploadBox.style.display = "none";
      if (changeBtn) changeBtn.style.display = "inline-block";
    }

    if (successMsg) successMsg.style.display = "block";
  };
  reader.readAsDataURL(file);
});

changeBtn.addEventListener("click", () => {
  fileInput.click();
});

