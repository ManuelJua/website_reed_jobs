// tabNavigation.js - Handles tab switching
export class TabNavigation {
    constructor(mapComponent) {
        this.mapComponent = mapComponent;
    }

    openTab(evt, tabName) {
        // Get all elements with class="tab-content" and hide them
        const tabcontent = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tab-button" and remove the class "active"
        const tablinks = document.getElementsByClassName("tab-button");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";

        // Invalidate map size when switching to map tab
        if (tabName === 'mapTab' && this.mapComponent) {
            this.mapComponent.invalidateSize();
        }
    }

    init() {
        // Add event listeners to tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (evt) => {
                const tabName = button.getAttribute('data-tab');
                this.openTab(evt, tabName);
            });
        });
    }
}
