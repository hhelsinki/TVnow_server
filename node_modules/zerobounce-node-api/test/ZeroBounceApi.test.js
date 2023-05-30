const rewire = require('rewire');
const {expect} = require('chai');
const sinon = require('sinon');
const zeroBounceApi = rewire('../ZeroBounceApi');

// eslint-disable-next-line camelcase
const api_key = 'apiKey';
const baseUrl = 'https://listflow.io';

zeroBounceApi.__set__('baseUrl', baseUrl);

/**
 * @param {*} json - response on first call
 * @return {*}  sinon stub for request promise (one call)
 */
function fakeRequestPromise(json) {
    const fakeRp = sinon.stub();
    const fakeResponse = new Promise((resolve) => resolve(json));
    fakeRp.onFirstCall().returns(fakeResponse);
    zeroBounceApi.__set__('rp', fakeRp);
    return fakeRp;
}

describe('company-to-contacts', () => {
    it('getCredits', async () => {
        const fakeRp = fakeRequestPromise({Credits: 42});
        const zb = zeroBounceApi(api_key);
        const credits = await zb.getCredits();
        expect(credits).to.deep.equal(42);
        expect(fakeRp.calledOnce).to.be.true;
        expect(fakeRp.firstCall.args).to.deep.equal([{
            'json': true,
            'qs': {
                api_key,
            },
            'uri': baseUrl + '/getcredits',
        }]);
    });
    it('validate', async () => {
        const fakeJson = {'something': 'random'};
        const email = 'random@somedomain.com';
        // eslint-disable-next-line camelcase
        const ip_address = '127.0.0.1';
        const fakeRp = fakeRequestPromise(fakeJson);
        const zb = zeroBounceApi(api_key);
        const credits = await zb.validate(email, ip_address);
        expect(credits).to.deep.equal(fakeJson);
        expect(fakeRp.calledOnce).to.be.true;
        expect(fakeRp.firstCall.args).to.deep.equal([
            {
                'json': true,
                'qs': {
                    api_key,
                    email,
                    ip_address,
                },
                'uri': baseUrl + '/validate',
            },
        ]);
    });
});
