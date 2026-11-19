
const cards = document.querySelector("#cards");

if (cards) {

    // Create a story card
    function cardHTML(story) {
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
                            <button type="button" class="${saved.includes(story.id) ? 'btn-solid theme-primary' : 'btn-subtle'}" data-save="${story.id}" aria-pressed="${saved.includes(story.id)}">${saved.includes(story.id) ? 'Saved' : 'Save'}</button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    let category = "All";
    let saved = [];
    const search = document.querySelector("#search");
    const noResults = document.querySelector("#noResults");

    // Filter and display stories
    function showCards() {
        let results = stories;

        if (category !== "All") {
            results = results.filter(story => story.category === category);
        }

        let keyword = search.value.toLowerCase();

        results = results.filter(story =>
            story.title.toLowerCase().includes(keyword) ||
            story.description.toLowerCase().includes(keyword)
        );

        cards.innerHTML = results.map(cardHTML).join("");
        document.querySelector("#count").textContent = `Showing ${results.length} of ${stories.length} stories`;

        if (results.length === 0) {
            noResults.hidden = false;
        } else {
            noResults.hidden = true;
        }
    }

    // Save or unsave a story
    function saveStory(id) {
        if (saved.includes(id)) {
            saved = saved.filter(item => item !== id);
        } else {
            saved.push(id);
        }

        document.querySelector("#saved").textContent = `Saved: ${saved.length}`;
        showCards();
    }

    const buttons = document.querySelectorAll("[data-category]");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            category = button.dataset.category;

            buttons.forEach(btn => {
                btn.classList.remove("btn-solid", "theme-primary");
                btn.classList.add("btn-subtle");
            });

            button.classList.remove("btn-subtle");
            button.classList.add("btn-solid", "theme-primary");

            showCards();
        });
    });

    search.addEventListener("input", showCards);

    cards.addEventListener("click", (event) => {
        const button = event.target.closest("[data-save]");

        if (button) {
            saveStory(Number(button.dataset.save));
        }
    });

    showCards();
}

const theme = document.querySelector("#theme");

// Switch between light and dark mode
function changeTheme() {
    const html = document.documentElement;

    if (html.getAttribute("data-bs-theme") === "light") {
        html.setAttribute("data-bs-theme", "dark");
        theme.textContent = "Light mode";
        theme.setAttribute("aria-pressed", "true");
    } else {
        html.setAttribute("data-bs-theme", "light");
        theme.textContent = "Dark mode";
        theme.setAttribute("aria-pressed", "false");
    }
}

theme.addEventListener("click", changeTheme);

const read = document.querySelector("#read");
const more = document.querySelector("#more");

// Show or hide more article content
function readMore() {
    if (more.hidden) {
        more.hidden = false;
        read.textContent = "Show less";
        read.setAttribute("aria-expanded", "true");
    } else {
        more.hidden = true;
        read.textContent = "Read more";
        read.setAttribute("aria-expanded", "false");
    }
}

if (read) {
    read.addEventListener("click", readMore);
}

const form = document.querySelector("#contactForm");

if (form) {
    const message = document.querySelector("#message");
    const charCount = document.querySelector("#charCount");
    const confirmation = document.querySelector("#confirmation");

    // Update the message character count
    function countCharacters() {
        charCount.textContent = `${message.value.length} characters`;
    }

    message.addEventListener("input", countCharacters);

    // Check the form and show messages
    function checkForm(event) {
        event.preventDefault();

        const fields = ["firstName", "lastName", "email", "topic", "message", "consent"];
        let valid = true;

        confirmation.hidden = true;

        fields.forEach(id => {
            const field = document.querySelector("#" + id);
            const error = document.querySelector("#" + (id === "firstName" ? "firstError" : id === "lastName" ? "lastError" : id + "Error"));

            if (!field.checkValidity()) {
                valid = false;
                error.textContent = "Please complete this field correctly.";
                field.classList.add("is-invalid");
            } else {
                error.textContent = "";
                field.classList.remove("is-invalid");
            }
        });

        if (valid) {
            const name = document.querySelector("#firstName").value;
            confirmation.textContent = `Thank you, ${name}! Your message has been received.`;
            confirmation.hidden = false;
            form.reset();
            countCharacters();
        }
    }

    form.addEventListener("submit", checkForm);
}

