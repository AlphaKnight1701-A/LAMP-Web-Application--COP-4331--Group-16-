class ContactCard extends HTMLElement {
    static get observedAttributes() {
        return ['contact-id', 'first-name', 'last-name', 'email', 'phone'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <div class="flex flex-col md:flex-row justify-start items-center md:items-start bg-[#2b2b2b] text-white max-w-full w-full px-6 py-5 rounded-lg gap-4">
            <span class="material-symbols-outlined text-yellow-400 text-6xl! shrink-0">account_circle</span>
            <div class="flex flex-col flex-1 min-w-0 w-full text-center md:text-left">
                <h1 class="font-bold text-2xl pb-2 wrap-break-word">${this.firstName} ${this.lastName}</h1>
                <div class="flex flex-row justify-center md:justify-start items-center gap-2">
                    <span class="material-symbols-outlined text-yellow-400 text-sm">mail</span>
                    <p class="truncate hover:text-clip hover:whitespace-normal break-all text-sm md:text-base">${this.email}</p>
                </div>
                <div class="flex flex-row justify-center md:justify-start items-center gap-2">
                    <span class="material-symbols-outlined text-yellow-400 text-sm">phone_in_talk</span>
                    <p class="wrap-break-word text-sm md:text-base">${this.phone}</p>
                </div>
            </div>
            <div class="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:ml-auto">
                <button type="button" class="inline-flex items-center justify-center w-12 h-12 rounded-md hover:bg-white hover:text-yellow-400 transition-colors" aria-label="Edit">
                    <span class="material-symbols-outlined">person_edit</span>
                </button>
                <button type="button" class="bg-red-600 inline-flex items-center justify-center w-12 h-12 rounded-md hover:bg-white hover:text-red-600 transition-colors" id="deleteButton" aria-label="Delete">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        </div>

        <!-- Delete dialog -->
        <dialog id="deleteDialog" class="m-auto rounded-md p-0 border-none bg-transparent backdrop:bg-black/80">
            <div class="flex flex-col p-10 justify-center items-center bg-[#2b2b2b] rounded-lg text-center">
                <h1 class="text-xl font-bold text-white pb-3">Are you sure you want to delete this contact?</h1>
                <p class="text-gray-400">${this.firstName} ${this.lastName}</p>
                <p class="text-gray-400">${this.email}</p>
                <p class="text-gray-400 pb-5">${this.phone}</p>
                <div class="flex flex-col gap-3 px-5">
                    <button id="confirmDelete" class="max-w-md w-full sm:w-md py-1 px-5 rounded-md bg-red-600 text-white hover:bg-white hover:text-red-600">Delete Contact</button>
                    <button id="cancel" class="max-w-md w-full sm:w-md py-1 px-5 rounded-md bg-yellow-400 text-white hover:bg-white hover:text-yellow-400">Cancel</button>
                </div>
            </div>
        </dialog>
        `;

        // Delete dialog
        const dialog = this.querySelector("#deleteDialog");

        // Delete contact behavior
        this.querySelector("#deleteButton").addEventListener("click", () => {
            dialog.showModal();
        });

        this.querySelector("#cancel").addEventListener("click", () => {
            dialog.close();
        });

        this.querySelector("#confirmDelete").addEventListener("click", () => {
            // Close dialog when deleting
            dialog.close();
            // deleteContact();
        });
    }

    // Getters and setters
    // Used for deleting/updating contacts
    set contactId(value) {
        this.setAttribute('contact-id', value);
    }

    get contactId() {
        return this.getAttribute('contact-id') || '';
    }

    set firstName(value) {
        this.setAttribute('first-name', value);
    }
    get firstName() {
        return this.getAttribute('first-name') || 'John';
    }

    set lastName(value) {
        this.setAttribute('last-name', value);
    }
    get lastName() {
        return this.getAttribute('last-name') || 'Doe';
    }

    set email(value) {
        this.setAttribute('email', value);
    }
    get email() {
        return this.getAttribute('email') || 'email@example.com';
    }

    set phone(value) {
        this.setAttribute('phone', value);
    }
    get phone() {
        return this.getAttribute('phone') || '123-456-7890';
    }
}

customElements.define('contact-card', ContactCard);