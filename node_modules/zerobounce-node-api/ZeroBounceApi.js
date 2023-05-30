const rp = require('request-promise');

const baseUrl = 'https://api.zerobounce.net/v2';

/**
 * @param {string} api_key - your private API key
 * @return {{
 *     getCredits: function(): (PromiseLike<number> | Promise<number>),
 *     validate: function(string, string): (PromiseLike<*> | Promise<*>)
 * }}
 * @constructor object
 */
function
// eslint-disable-next-line camelcase
ZeroBounceApi(api_key) {
    return {
        /**
         * @return {Promise<number>} the number of credits
         * remaining on your account
         * */
        getCredits: () => rp({
            uri: baseUrl + '/getcredits',
            qs: {
                api_key,
            },
            json: true,
        }).then((resp) => resp.Credits),
        /**
         *
         * @param {string} email the email you want to validate
         * @param {string} ip_address - the ip to be used
         * for this validation (optional)
         * @return {string} - a JSONObject with all of the information
         * for the specified email
         */
        // eslint-disable-next-line camelcase
        validate: (email, ip_address) => rp({
            uri: baseUrl + '/validate',
            qs: {
                api_key,
                email,
                ip_address,
            },
            json: true,
        }),
    };
}


module.exports = ZeroBounceApi;
