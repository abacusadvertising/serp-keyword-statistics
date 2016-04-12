/**
 * Audit for a keyword on google
 * by Tom Canac
 */

'use strict'

const rp = require('request-promise'),
    cheerio = require('cheerio'),
    validUrl = require('valid-url'),
    mod = {},

    helper = {
        /**
         * Gives you the url of the google search associated with the keyword
         */
        getGoogleUrl(keyword, domain) {
            let base

            switch(domain) {
            case ".fr":
                base = "https://www.google.fr/"
                break
            case ".it":
                base = "https://www.google.it/"
                break
            case ".de":
                base = "https://www.google.de/"
                break
            case ".co.uk":
                base = "https://www.google.co.uk/"
                break
            default:
                base = "https://www.google.com/"
                break
            }
            return base +'search?q=' + encodeURIComponent(keyword)
        },
        /**
         * Return the proper website url from the href attribute of a google SERP
         */
        cleanGoogleUrl(url) {
            let res = url.substring(7)
            res = res.substring(0, res.indexOf('&sa='))
            return res
        },
        /**
         * Get all the url of the SERP based on a keyword list.
         * Allow to save some time if you have to do stuff manually
         */
        easyLinks(keys) {
            return Promise.all(keys.map(function (keyword) {
                return helper.getGoogleUrl(keyword)
            }))
        },
    }

/**
 * Return the number of result of each keyword in google
 */
mod.keywordStats = function (keys, domain) {
    return Promise.all(keys.map(function (keyword) {
        return new Promise(function (resolve, reject) {
            const options = {
                uri: helper.getGoogleUrl(keyword, domain),
                headers: {
                    'User-Agent': 'request',
                },
                transform(body) {
                    return cheerio.load(body)
                },
            }

            rp(options)
                .then(function ($) {
                    // If this DOM element exists, this is a captcha !
                    if ($('body > div:nth-child(1) > img:nth-child(5)').length) {
                        reject('captcha :(')
                    }
                    if ($('#resultStats').length) {
                        const res = {
                            keyword,
                        }

                        let stat = $('#resultStats').html(),
                            resultItem,
                            i = 2
                        stat = stat.replace(/&#xA0/g, ' ')
                        stat = stat.replace(/;/g, '')
                        stat = stat.substring(0, stat.indexOf('&#xFFFD'))
                        stat = stat.substring(8, stat.length)
                        res.stat = stat

                        // Get first result
                        resultItem = $('#ires .g a').attr('href')
                        resultItem = helper.cleanGoogleUrl(resultItem)

                        // While the first result is an google's internal link
                        while (!validUrl.isUri(resultItem)) {
                            resultItem = $('#ires .g:nth-child(' + i + ') a').attr('href')
                            resultItem = helper.cleanGoogleUrl(resultItem)
                            i++
                        }

                        // TODO : Get the position of the website

                        res.firstLink = resultItem
                        resolve(res)
                    }
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }))
}

module.exports = mod
