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
        <div class="flex flex-row justify-start items-center bg-[#2b2b2b] text-white max-w-full w-full px-8 py-5 rounded-lg">
            <span class="material-symbols-outlined text-yellow-400 text-6xl!">account_circle</span>
            <div class="px-5 flex flex-col">
                <h1 class="font-bold text-2xl pb-2">${this.firstName} ${this.lastName}</h1>
                <div class="flex flex-row">
                <span class="material-symbols-outlined text-yellow-400">mail</span>
                <h1 class="px-2"><span class="font-bold">Email:</span> ${this.email}</h1>
                </div>
                <div class="flex flex-row">
                <span class="material-symbols-outlined text-yellow-400">phone_in_talk</span>
                <h1 class="px-2"><span class="font-bold">Phone:</span> ${this.phone}</h1>
                </div>
            </div>
            <div class="ml-auto flex flex-col gap-2">
                <button type="button" class="inline-flex items-center justify-center w-12 h-12 rounded-md hover:bg-white hover:text-yellow-400" aria-label="Edit">
                    <span class="material-symbols-outlined font-4xl">person_edit</span>
                </button>
                <button type="button" class="inline-flex items-center justify-center w-12 h-12 rounded-md hover:bg-white hover:text-yellow-400" aria-label="Close">
                    <span class="material-symbols-outlined font-4xl">close</span>
                </button>
            </div>
        </div>
        `;
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