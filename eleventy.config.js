/*
Copyright the Trivet copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/inclusive-design/acaw-cama/raw/main/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/inclusive-design/acaw-cama/raw/main/LICENSE.md.
*/

"use strict";

const fluidPlugin = require("eleventy-plugin-fluid");
const navigationPlugin = require("@11ty/eleventy-navigation");
const { EleventyI18nPlugin } = require("@11ty/eleventy");
const title = require("title");
const rosetta = require("rosetta");
const i18n = rosetta();
i18n.locale("en");
for (let lang of ["en", "fr"]) {
    i18n.set(lang, require(`./src/_includes/i18n/${lang}.js`));
}

// Import transforms
const parseTransform = require("./src/_transforms/parse-transform.js");

module.exports = function (eleventyConfig) {
    eleventyConfig.setUseGitIgnore(false);

    // Collections
    for (let lang of ["en", "fr"]) {
        eleventyConfig.addCollection(`submissions_${lang}`, function (collectionApi) {
            return collectionApi.getFilteredByGlob(`src/collections/submissions/${lang}/*.md`).sort(function (a, b) {
                return b.data.title.localeCompare(a.data.title);
            });
        });
    }

    // Filters
    eleventyConfig.addFilter("i18n", function (key, langOverride) {
        let lang = langOverride || this.page?.lang || this.ctx?.page?.lang || this.context?.environments?.page?.lang;
        return i18n.t(key, {}, lang);
    });
    eleventyConfig.addFilter("titlecase", function (value) {
        return title(value, {
            special: ["ASL", "LSQ"]
        });
    });

    // Shortcodes
    eleventyConfig.addShortcode("localizedFormat", function (format, formatLocale, langOverride) {
        let lang = langOverride || this.page?.lang || this.ctx?.page?.lang || this.context?.environments?.page?.lang;

        return i18n.t(`submission-formats.${format}`, {formatLocale: i18n.t(`languages.${formatLocale}`, {}, lang)}, lang);
    });

    // Transforms
    eleventyConfig.addTransform("parse", parseTransform);

    // Passthrough copy
    eleventyConfig.addPassthroughCopy({"src/admin/config.yml": "admin/config.yml"});
    eleventyConfig.addPassthroughCopy({"src/assets/icons": "/"});
    eleventyConfig.addPassthroughCopy({"src/assets/fonts": "assets/fonts"});
    eleventyConfig.addPassthroughCopy({"src/assets/images": "assets/images"});

    // Plugins
    eleventyConfig.addPlugin(navigationPlugin);
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        defaultLanguage: "en"
    });
    eleventyConfig.addPlugin(fluidPlugin, {
        i18n: false
    });

    return {
        dir: {
            input: "src"
        },
        passthroughFileCopy: true,
        markdownTemplateEngine: "njk"
    };
};
