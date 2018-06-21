const assertRevert = require('./helpers/assertRevert');
const BasicToken = artifacts.require('BasicTokenMock');

contract('StandardToken', ([_, owner, recipient, anotherAccount]) => {

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    beforeEach(async () => {
        this.token = await BasicToken.new(owner, 100);
    });

    describe('total supply', () => {

        it('returns the total amount of tokens', async () => {
            const totalSupply = await this.token.totalSupply();

            assert.equal(totalSupply, 100);
        });

    });

    describe('balanceOf', () => {

        describe('when the requested account has no tokens', () => {

            it('returns zero', async () => {
                const balance = await this.token.balanceOf(anotherAccount);

                assert.equal(balance, 0);
            });

        });

        describe('when the requested account has some tokens', () => {

            it('returns the total amount of tokens', async () => {
                const balance = await this.token.balanceOf(owner);

                assert.equal(balance, 100);
            });

        });
    });

    describe('transfer', () => {

        describe('when the recipient is not the zero address', () => {
            const to = recipient;

            describe('when the sender does not have enough balance', () => {
                const amount = 101;

                it('reverts', async () => {
                    await assertRevert(this.token.transfer(to, amount, {from: owner}));
                });
            });

            describe('when the sender has enough balance', () => {
                const amount = 100;

                it('transfers the requested amount', async () => {
                    await this.token.transfer(to, amount, {from: owner});

                    const senderBalance = await this.token.balanceOf(owner);
                    assert.equal(senderBalance, 0);

                    const recipientBalance = await this.token.balanceOf(to);
                    assert.equal(recipientBalance, amount);
                });

                it('emits a transfer event', async () => {
                    const {logs} = await this.token.transfer(to, amount, {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Transfer');
                    assert.equal(logs[0].args.from, owner);
                    assert.equal(logs[0].args.to, to);
                    assert(logs[0].args.value.eq(amount));
                });

            });

        });

        describe('when the recipient is the zero address', () => {
            const to = ZERO_ADDRESS;

            it('reverts', async () => {
                await assertRevert(this.token.transfer(to, 100, {from: owner}));
            });
        });

    });
});
