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
                <button type="button" id="editButton" class="inline-flex items-center justify-center w-12 h-12 rounded-md hover:bg-white hover:text-yellow-400 transition-colors" aria-label="Edit">
                    <span class="material-symbols-outlined">person_edit</span>
                </button>
                <button type="button" class="bg-red-600 inline-flex items-center justify-center w-12 h-12 rounded-md hover:bg-white hover:text-red-600 transition-colors" id="deleteButton" aria-label="Delete">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        </div>

        <!-- Edit dialog form -->
        <dialog id="editDialog" class="m-auto rounded-md px-3 border-none opacity-0 scale-80 transition-all duration-300 bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm">
            <div class="flex flex-col py-5 px-5 sm:px-10 justify-center items-center bg-[#2b2b2b] rounded-lg max-w-full w-lg">
                <h1 class="text-xl font-bold text-white pb-5">Edit contact</h1>
                <input id="editFirstName" class="w-full mb-3 px-4 py-2 rounded-md" type="text" placeholder="First Name" value="${this.firstName}"/>
                <input id="editLastName" class="w-full mb-3 px-4 py-2 rounded-md" type="text" placeholder="Last Name" value="${this.lastName}"/>
                <input id="editEmail" class="w-full mb-3 px-4 py-2 rounded-md" type="text" placeholder="Email" value="${this.email}"/>
                <input id="editPhone" class="w-full mb-3 px-4 py-2 rounded-md" type="text" placeholder="Phone" value="${this.phone}"/>
                <div class="flex flex-col gap-3 pt-3 w-full">
                    <button id="confirmEdit" class="w-full rounded-md px-4 py-2 bg-green-600 text-white font-bold hover:bg-white hover:text-green-600 transition-all">
                        Save Changes
                    </button>
                    <button id="cancelEdit" class="w-full rounded-md px-4 py-2 bg-red-600 text-white font-bold hover:bg-white hover:text-red-600 transition">
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>

        <!-- Delete dialog -->
        <dialog id="deleteDialog" class="m-auto rounded-md px-3 border-none opacity-0 scale-80 transition-all duration-300 bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm">
            <div class="flex flex-col py-10 px-5 sm:px-10 justify-center items-center bg-[#2b2b2b] rounded-lg text-center">
            <span class="material-symbols-outlined text-6xl! text-yellow-400 pb-3">warning</span>
                <h1 class="text-xl font-bold text-white pb-3">Are you sure you want to delete this contact?</h1>
                <div class="flex flex-row gap-2 items-center text-gray-400 max-w-full">
                    <span class="material-symbols-outlined">person</span>
                    <p class="truncate min-w-0 flex-1">${this.firstName} ${this.lastName}</p>
                </div>
                <div class="flex flex-row gap-2 items-center text-gray-400 max-w-full">
                    <span class="material-symbols-outlined">mail</span>
                    <p class="truncate min-w-0 flex-1">${this.email}</p>
                </div>
                <div class="flex flex-row gap-2 items-center text-gray-400 max-w-full pb-5">
                    <span class="material-symbols-outlined">phone_in_talk</span>
                    <p class="truncate min-w-0 flex-1">${this.phone}</p>
                </div>
                <div class="flex flex-col gap-3 px-5">
                    <button id="confirmDelete" class="max-w-md w-full sm:w-md py-2 px-5 rounded-md font-bold bg-red-600 text-white hover:bg-white hover:text-red-600">Delete Contact</button>
                    <button id="cancel" class="max-w-md w-full sm:w-md py-2 px-5 rounded-md font-bold bg-yellow-400 text-white hover:bg-white hover:text-yellow-400">Cancel</button>
                </div>
            </div>
        </dialog>
        `;

        // Delete dialog
        const deleteDialog = this.querySelector("#deleteDialog");

        // Delete contact behavior
        this.querySelector("#deleteButton").addEventListener("click", () => {
            deleteDialog.showModal();
            // animate transition
            requestAnimationFrame(() => {
                deleteDialog.classList.remove("opacity-0", "scale-80");
            });
        });

        this.querySelector("#cancel").addEventListener("click", () => {
            deleteDialog.classList.add("opacity-0", "scale-80");
            // wait for animation before actually closing
            setTimeout(() => {
                deleteDialog.close();
            }, 300);
        });

        this.querySelector("#confirmDelete").addEventListener("click", () => {
            deleteDialog.classList.add("opacity-0", "scale-80");
            // wait for animation before actually closing
            setTimeout(() => {
                deleteDialog.close();
            }, 300);
            // Delete contact AFTER closing dialog, since deleteContact() opens another dialog
            deleteContact(this.contactId);
        });

        // Edit dialog
        const editDialog = this.querySelector("#editDialog");

        // Edit dialog behavior
        this.querySelector("#editButton").addEventListener("click", () => {
            editDialog.showModal();
            // animate transition
            requestAnimationFrame(() => {
                editDialog.classList.remove("opacity-0", "scale-80");
            });
        });

        this.querySelector("#confirmEdit").addEventListener("click", () => {
            editDialog.classList.add("opacity-0", "scale-80");
            // wait for animation before actually closing
            setTimeout(() => {
                editDialog.close();
            }, 300);

            // Collect fields for edit
            const editFirstName = this.querySelector("#editFirstName").value;
            const editLasttName = this.querySelector("#editLastName").value;
            const editEmail = this.querySelector("#editEmail").value;
            const editPhone = this.querySelector("#editPhone").value;

            editContact(editFirstName, editLasttName, editEmail, editPhone, this.contactId);
        });

        this.querySelector("#cancelEdit").addEventListener("click", () => {
            editDialog.classList.add("opacity-0", "scale-80");
            // wait for animation before actually closing
            setTimeout(() => {
                editDialog.close();
            }, 300);
        });

        // Form validation
        const inputs = this.querySelectorAll("#editFirstName, #editLastName, #editEmail, #editPhone");
        inputs.forEach(input => {
            input.addEventListener("input", () => this.validateForm());
        });

    }

    // Edit form validator
    validateForm() {
        const firstName = this.querySelector("#editFirstName").value.trim();
        const lastName = this.querySelector("#editLastName").value.trim();
        const email = this.querySelector("#editEmail").value.trim();
        const phone = this.querySelector("#editPhone").value.trim();

        const confirmButton = this.querySelector("#confirmEdit");

        if (firstName && lastName && email && phone) {
            confirmButton.disabled = false;
            confirmButton.classList.remove("bg-gray-400", "cursor-not-allowed");
            confirmButton.classList.add("bg-green-600", "hover:bg-white", "hover:text-green-600");
        } else {
            confirmButton.disabled = true;
            confirmButton.classList.remove("bg-green-600", "hover:bg-white", "hover:text-green-600");
            confirmButton.classList.add("bg-gray-400", "cursor-not-allowed");
        }
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