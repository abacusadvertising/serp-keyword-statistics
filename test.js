/**
 * Copyright (c) 2016 "Dandy SEO"
 * https://github.com/dandy-seo
 * Released under the GNU GPL 3.0
 */

const mod = require('./'),
    keywords = ['dandy', 'seo', 'dandy seo']

mod.keywordStats(keywords)
    .then(function (data) {
        console.log(data)
    })
    .catch(function (err) {
        console.log(err)
    })