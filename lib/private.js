'use strict';

const querystring = require('querystring');
const methods = require('./methods');
const config = require('./config');

/**
 * Gets a cookie from the Banner server
 * @private
 * @param {number | string} term A valid term code
 * @returns {Promise<string[]>} A Promise containing the cookie returned by the server
 */
async function getCookie(school, term) {
    const res = await bannerRequest(school, 'getCookie', { term });
    return res.headers.get('set-cookie');
}

async function bannerRequest(school, method, params = {}, needsCookie = false) {
    const cookie = needsCookie ? await getCookie(school, params.term) : null;
    const url = `https://${config.schools[school].host}${config.global.basePath}${methods[method].path}?${querystring.stringify(params)}`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
            'DNT': '1',
            'Host': 'bannservices.seu.edu.sa',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            "Content-Type": "application/json",
            ...(cookie ? { Cookie: cookie } : {}),
        }
    });
    return response;
}

async function batchRequest(batchSize, pageSize, batch, requestParams = {}, method, school) {
    if (batchSize <= pageSize) {
        throw new Error('Batch size must be greater than page size');
    }

    const idxs = [...Array(batchSize / pageSize).keys()].map(idx => idx + 1 + (batchSize / pageSize) * batch);
    const requests = idxs.map(async idx => {
        const params = { offset: idx, max: pageSize, ...requestParams };
        return bannerRequest(school, method, params);
    });

    const results = await Promise.all(requests);
    return results.map(res => res.Body).flat();
}

/**
 * @exports
 */
module.exports = { bannerRequest, getCookie, batchRequest };
