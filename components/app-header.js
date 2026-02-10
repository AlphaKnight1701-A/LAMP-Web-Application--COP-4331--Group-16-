class AppHeader extends HTMLElement {
    connectedCallback() {
        this.render();
    }
  
    render() {
        let loggedIn = isLoggedIn();
        this.innerHTML =
        `
            <header class="bg-[#1c1c1c] text-yellow-400 shadow-md sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-6">
                <div class="flex h-16 items-center justify-between">
                    <!-- Logo -->
                    <div class="text-xl font-semibold">
                        LAMP Project
                    </div>
                    <!-- Navigation -->
                    <nav class="flex items-center space-x-6">
                        <a href="index.html" class="text-slate-300 hover:text-white transition">Home</a>
                        <a href="about.html" class="text-slate-300 hover:text-white transition">About</a>
                        <a href="${loggedIn ? "javascript:void(0);" : "login.html"}" class="rounded-md px-4 py-2 bg-yellow-400 text-sm text-white font-bold hover:bg-white hover:text-yellow-400 transition" id="loginButton">
                            ${loggedIn ? "Logout" : "Login"}
                        </a>
                    </nav>
                </div>
                </div>
            </header>
            `
        ;

        // Click handler if logged in
        if (loggedIn) {
            // querySelector with #loginButton to get loginButton id
            this.querySelector("#loginButton").addEventListener("click", () => {
                logout();
                this.render(); // re-render to update header to Login
            });
        }
    }
}

customElements.define("app-header", AppHeader);
