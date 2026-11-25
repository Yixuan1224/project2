
const cards = document.querySelector("#cards");

// Home page
if (cards) {

    // Create a story card
    function cardHTML(story) {
        const isSaved = saved.includes(`${story.id}`);
        return `
            <div class="col-12 md:col-6 lg:col-4">
                <article class="card h-100">
                    <img src="${story.image}" alt="${story.title}" class="card-img">

                    <div class="card-body">
                        <p>${story.category}</p>
                        <h2 class="card-title">${story.title}</h2>
                        <p>${story.description}</p>

                        <div class="card-buttons">
                            <a href="detail.html" class="btn-solid theme-primary">Details</a>
                            <button type="button" class="${isSaved ? 'btn-solid theme-primary' : 'btn-subtle'}" data-save="${story.id}" aria-pressed="${isSaved}">${isSaved ? 'Saved' : 'Save'}</button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    let activeCategory = "All";
    let query = "";
    let saved = [];
    const search = document.querySelector("#search");
    const noResults = document.querySelector("#noResults");
    const count = document.querySelector("#count");

    // Filter and display stories
    function update() {
        const shown = stories.filter(story =>
            (activeCategory === "All" || story.category === activeCategory)
            && (story.title.toLowerCase().includes(query)
            || story.description.toLowerCase().includes(query)));

        cards.innerHTML = shown.map(cardHTML).join("");
        count.textContent = `Showing ${shown.length} of ${stories.length} stories`;

        if (shown.length === 0) {
            noResults.classList.remove("d-none");
        } else {
            noResults.classList.add("d-none");
        }
    }

    const buttons = document.querySelectorAll("[data-category]");

    // Update the active category
    for (const button of buttons) {
        button.addEventListener("click", () => {
            activeCategory = button.getAttribute("data-category");

            for (const btn of buttons) {
                btn.classList.remove("btn-solid", "theme-primary");
                btn.classList.add("btn-subtle");
                btn.setAttribute("aria-pressed", false);
            }
            button.classList.remove("btn-subtle");
            button.classList.add("btn-solid", "theme-primary");
            button.setAttribute("aria-pressed", true);

            update();
        });
    }
    
    // Update search results
    search.addEventListener("input", () => {
        query = search.value.toLowerCase();
        update();
    });

    // Save or unsave a story
    cards.addEventListener("click", event => {
        const button = event.target.closest("[data-save]");
        if (!button) return;

        const id = button.getAttribute("data-save");

        if (saved.includes(id)) {
            saved = saved.filter(item => item !== id);
        } else {
            saved.push(id);
        }

        const isSaved = saved.includes(id);

        button.classList.toggle("btn-solid");
        button.classList.toggle("theme-primary");
        button.classList.toggle("btn-subtle");
        button.textContent = isSaved ? "Saved" : "Save";
        button.setAttribute("aria-pressed", isSaved);

        document.querySelector("#saved").textContent = `Saved: ${saved.length}`;
    });

    update();
}

const theme = document.querySelector("#theme");

// Switch between light and dark mode.
theme.addEventListener("click", () => {
    const root = document.documentElement;
    const goDark = root.getAttribute("data-bs-theme") !== "dark";

    root.setAttribute("data-bs-theme", goDark ? "dark" : "light");
    theme.textContent = goDark ? "Light mode" : "Dark mode";
    theme.setAttribute("aria-pressed", goDark);
});

// Detail page
const read = document.querySelector("#read");
const more = document.querySelector("#more");

if (read) {
    // Show or hide more article content
    read.addEventListener("click", () => {
        const isHidden = more.classList.toggle("d-none");
        read.textContent = isHidden ? "Read more" : "Show less";
        read.setAttribute("aria-expanded", !isHidden);
    });
}

// Contact page
const form = document.querySelector("#contactForm");

if (form) {
    const message = document.querySelector("#message");
    const charCount = document.querySelector("#charCount");
    const confirmation = document.querySelector("#confirmation");
    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const email = document.querySelector("#email");
    const topic = document.querySelector("#topic");
    const consent = document.querySelector("#consent");
    const fields = [firstName, lastName, email, topic, message, consent];

    // Show an error message
    function showError(input, message) {
        input.classList.add("is-invalid");
        document.querySelector(`#${input.id}Feedback`).textContent = message;
    }
    // Clear errors when a field becomes valid
    for (const field of fields) {
        field.addEventListener("input", () => {
            if (field.validity.valid) {
                clearError(field);
            }
        });
    }
    
    // Clear an error message
    function clearError(input) {
        input.classList.remove("is-invalid");
        document.querySelector(`#${input.id}Feedback`).textContent = "";
    }

    // Update the message character count
    function countCharacters() {
        charCount.textContent = `${message.value.length} characters`;
    }
    message.addEventListener("input", countCharacters);

    // Check the form and show messages
    function checkForm(event) {
        event.preventDefault();
        confirmation.classList.add("d-none");

        if (firstName.validity.valueMissing) {
            showError(firstName, "Please enter your first name");
        }

        if (lastName.validity.valueMissing) {
            showError(lastName, "Please enter your last name");
        }

        if (email.validity.valueMissing) {
            showError(email, "Please enter your email");
        } else if (email.validity.typeMismatch) {
            showError(email, "Enter a valid email address");
        }

        if (topic.validity.valueMissing) {
            showError(topic, "Please select a topic");
        }

        if (message.validity.valueMissing) {
            showError(message, "Please enter your message");
        }

        if (consent.validity.valueMissing) {
            showError(consent, "Please agree to be contacted");
        }

        // Stop submission if there are errors
        if (form.querySelector(".is-invalid")) {
            return;
        }

        // Show confirmation and reset the form
        confirmation.textContent = `Thank you, ${firstName.value}! Your message has been received.`;
        confirmation.classList.remove("d-none");
        form.reset();
        countCharacters();

        for (const field of fields) {
            clearError(field);
        }
    }

    form.addEventListener("submit", checkForm);
}
