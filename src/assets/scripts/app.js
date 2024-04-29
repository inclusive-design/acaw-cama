/*
Copyright the ACAW-CAMA copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/inclusive-design/acaw-cama/raw/master/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/inclusive-design/acaw-cama/raw/master/LICENSE.md.
*/

import "@zachleat/filter-container";
import "lite-youtube-embed";

import VideoOverlay from "./_overlay.module.js";

const linkedVideos = [...document.querySelectorAll(".linked-video, .video-card-link")];

if (linkedVideos.length > 0) {
    linkedVideos.forEach.call(linkedVideos, link => {
        let overlay = new VideoOverlay(link);
        overlay.init();
    });
}

const disclosureBtn = document.querySelector("[aria-expanded]");

if (disclosureBtn) {
    document.addEventListener("click", (event) => {
        if (!event.target.closest("[aria-expanded]")) {
            return false;
        }

        const btn = event.target.closest("[aria-expanded]");

        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", !expanded);
    });
}
