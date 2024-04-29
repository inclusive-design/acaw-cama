class VideoOverlay {
    constructor( link, options ) {
        this.link = link;
        this.closeButton = false;
        this.overlay = false;

        this.config = {
            ...{
                autoplay: false
            },
            ...options
        };

        this.init = this.init.bind( this );
    }

    init() {
        this.elems = document.querySelectorAll("body > *");
        this.displayOverlay = this.displayOverlay.bind( this );
        this.dismissOverlay = this.dismissOverlay.bind( this );
        this.handleClick = this.handleClick.bind( this );
        this.handleKeydown = this.handleKeydown.bind( this );
        this.addEventListeners();
    }

    handleClick(event) {
        event.preventDefault();
        this.displayOverlay();
    }

    handleKeydown(event) {
        if (this.overlay && event.keyCode === 27) {
            this.dismissOverlay();
        }
    }

    displayOverlay() {
        const id = this.link.dataset.id;
        const closeMsg = this.link.dataset.close ?? "Close";
        const scrollY = window.scrollY;
        this.overlay = document.createElement("div");
        this.overlay.className = "overlay flow";
        this.overlay.setAttribute("role", "dialog");
        this.overlay.innerHTML = `<div class="iframe-container"><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        this.closeButton = document.createElement("button");
        this.closeButton.className = "close";
        this.closeButton.innerHTML = `<span class='visually-hidden'>${closeMsg}</span><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' aria-hidden='true' focusable='false'><path d='M0 0h24v24H0V0z' fill='none' /><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z' fill='currentColor' /></svg>`;
        Array.prototype.forEach.call(this.elems, elem => {
            elem.setAttribute("inert", "inert");
        });
        this.overlay.insertBefore(this.closeButton, this.overlay.firstChild);
        document.body.appendChild(this.overlay);
        document.body.classList.add("has-overlay");
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        this.closeButton.focus();

        this.closeButton.onclick = () => {
            this.dismissOverlay();
        };

        document.onclick = (event) => {
            if (!this.overlay.contains(event.target) && !this.link.contains(event.target)) {
                this.dismissOverlay();
            }
        };
    }

    dismissOverlay() {
        const scrollY = document.body.style.top;
        this.overlay.remove();
        Array.prototype.forEach.call(this.elems, elem => {
            elem.removeAttribute("inert");
        });
        document.body.classList.remove("has-overlay");
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    addEventListeners() {
        this.link.addEventListener( "click", this.handleClick, false );
        document.addEventListener( "keydown", this.handleKeydown, false );
    }
}

export default VideoOverlay;
