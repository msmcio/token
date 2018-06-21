const BigNumber = web3.BigNumber;
const assertJump = require('./helpers/assertJump');
const SafeMath = artifacts.require("SafeMathMock");

contract('SafeMath', () => {

    const MAX_UINT = new BigNumber('115792089237316195423570985008687907853269984665640564039457584007913129639935');

    before(async () => {
        this.safeMath = await SafeMath.new();
    });

    describe('add', () => {

        it('adds correctly', async () => {

            const a = new BigNumber(5678);
            const b = new BigNumber(1234);

            const result = await this.safeMath.add(a, b);

            assert.equal(result.toNumber(), a.plus(b));
        });

        it('throws an error on addition overflow', async () => {
            const a = MAX_UINT;
            const b = new BigNumber(1);

            await assertJump(this.safeMath.add(a, b));
        });

    });

    describe('sub', () => {
        it('subtracts correctly', async () => {
            const a = new BigNumber(5678);
            const b = new BigNumber(1234);

            const result = await this.safeMath.sub(a, b);
            assert.equal(result.toNumber(), a.minus(b));
        });

        it('throws an error if subtraction result would be negative', async () => {
            const a = new BigNumber(1234);
            const b = new BigNumber(5678);

            await assertJump(this.safeMath.sub(a, b));
        });
    });

    describe('mul', () => {
        it('multiplies correctly', async () => {
            const a = new BigNumber(1234);
            const b = new BigNumber(5678);

            const result = await this.safeMath.mul(a, b);
            assert.equal(result.toNumber(), a.times(b));
        });

        it('handles a zero product correctly', async () => {
            const a = new BigNumber(0);
            const b = new BigNumber(5678);

            const result = await this.safeMath.mul(a, b);
            assert.equal(result.toNumber(), a.times(b));
        });

        it('throws an error on multiplication overflow', async () => {
            const a = MAX_UINT;
            const b = new BigNumber(2);

            await assertJump(this.safeMath.mul(a, b));
        });
    });

    describe('div', () => {
        it('divides correctly', async () => {
            const a = new BigNumber(5678);
            const b = new BigNumber(5678);

            const result = await this.safeMath.div(a, b);
            assert.equal(result.toNumber(), a.div(b));
        });

        it('throws an error on zero division', async () => {
            const a = new BigNumber(5678);
            const b = new BigNumber(0);

            await assertJump(this.safeMath.div(a, b));
        });
    });

});