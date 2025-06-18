/*
Copyright the Trivet copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/inclusive-design/acaw-cama/raw/main/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/inclusive-design/acaw-cama/raw/main/LICENSE.md.
*/

const fluidPlugin = require("eleventy-plugin-fluid");
const navigationPlugin = require("@11ty/eleventy-navigation");
const { EleventyI18nPlugin } = require("@11ty/eleventy");
const pluginPWA = require("eleventy-plugin-pwa-v2");
const brokenLinksPlugin = require("eleventy-plugin-broken-links");
const getYouTubeID = require("get-youtube-id");
const title = require("title");
const slugify = require("@sindresorhus/slugify");
const rosetta = require("rosetta");
const i18n = rosetta();
i18n.locale("en");
for (let lang of ["en", "fr"]) {
    i18n.set(lang, require(`./src/_includes/i18n/${lang}.js`));
}

// Import transforms
const parseTransform = require("./src/_transforms/parse-transform.js");

module.exports = (eleventyConfig) => {
    eleventyConfig.setUseGitIgnore(false);

    // Collections
    for (let lang of ["en", "fr"]) {
        eleventyConfig.addCollection(`submissions_${lang}`, function (collectionApi) {
            return collectionApi.getFilteredByGlob(`src/collections/submissions/${lang}/*.md`).sort(function (a, b) {
                return a.data.title.localeCompare(b.data.title);
            });
        });

        eleventyConfig.addCollection(`themes_${lang}`, function (collectionApi) {
            return collectionApi.getFilteredByGlob(`src/collections/themes/${lang}/*.md`).sort(function (a, b) {
                return a.data.title.localeCompare(b.data.title);
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
    eleventyConfig.addFilter("youtubeId", function (value) {
        return getYouTubeID(value);
    });
    eleventyConfig.addFilter("englishTitle", function (id) {
        const collections = this.ctx?.collections || {};
        const submissions = collections.submissions_en || [];
        const submission = submissions.find((item) => item.data.id === id);
        if (submission) {
            return submission.data.title;
        }
        throw new Error(`Unknown submission ID: "${id}"`);
    });

    // Shortcodes
    eleventyConfig.addShortcode("localizedFormat", function (format, formatLocale, langOverride) {
        let lang = langOverride || this.page?.lang || this.ctx?.page?.lang || this.context?.environments?.page?.lang;

        return i18n.t(`submission-formats.${format}`, { formatLocale: i18n.t(`languages.${formatLocale}`, {}, lang) }, lang);
    });

    eleventyConfig.addShortcode("formatUrl", function (submissionId, format, formatLocale) {
        const collections = this.ctx?.collections || {};
        const submissions = collections.submissions_en || [];
        const submission = submissions.find((item) => item.data.id === submissionId);
        if (submission) {
            let extension;
            const slug = slugify(submission.data.title);
            switch (format) {
                case "slides":
                    extension = "pptx";
                    break;
                default:
                    extension = "docx";
            }

            if (format === "pdf") {
                return `https://idrc.cachefly.net/acaw-cama/${submissionId}/${slug}-text-${formatLocale}.pdf`;
            }

            return `https://idrc.cachefly.net/acaw-cama/${submissionId}/${slug}-${format}-${formatLocale}.${extension}`;
        }
        throw new Error(`Unknown submission ID: "${submissionId}"`);
    });

    // Transforms
    eleventyConfig.addTransform("parse", parseTransform);

    // Passthrough copy
    eleventyConfig.addPassthroughCopy({
        "src/admin/config.yml": "admin/config.yml"
    });
    eleventyConfig.addPassthroughCopy({ "src/assets/icons": "/" });
    eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
    eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
    eleventyConfig.addPassthroughCopy({
        "src/assets/uploads": "assets/uploads"
    });

    // Plugins
    eleventyConfig.addPlugin(brokenLinksPlugin, {
        forbidden: "warn",
        broken: "warn",
        cacheDuration: "60s",
        loggingLevel: 1
    });
    eleventyConfig.addPlugin(navigationPlugin);
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        defaultLanguage: "en"
    });
    eleventyConfig.addPlugin(fluidPlugin, {
        i18n: false
    });
    eleventyConfig.addPlugin(pluginPWA, {
        swDest: "./_site/sw.js",
        globDirectory: "./_site",
        cacheId: "acaw-cama",
        globIgnores: [],
        runtimeCaching: [
            {
                urlPattern: /\/$/,
                handler: "NetworkFirst"
            },
            {
                urlPattern: /\.html$/,
                handler: "NetworkFirst"
            },
            {
                urlPattern: /^.*\.(jpg|png|mp4|gif|webp|ico|svg|woff2|woff|eot|ttf|otf|ttc|json)$/,
                handler: "StaleWhileRevalidate"
            }
        ]
    });

    return {
        dir: {
            input: "src"
        },
        passthroughFileCopy: true,
        markdownTemplateEngine: "njk"
    };
};
