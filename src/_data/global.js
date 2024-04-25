"use strict";

module.exports = {
    context: process.env.CF_PAGES === 1 ? "production" : "development"
};
