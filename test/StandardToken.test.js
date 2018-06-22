const assertRevert = require('./helpers/assertRevert');
const StandardTokenMock = artifacts.require('StandardTokenMock');

contract('StandardToken', function ([_, owner, recipient, anotherAccount]) {

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const TOTAL_SUPPLY = 100;

    beforeEach(async () => {
        this.token = await StandardTokenMock.new(owner, TOTAL_SUPPLY);
    });

    describe('total supply', () => {

        it('returns the total amount of tokens', async () => {
            const totalSupply = await this.token.totalSupply();

            assert.equal(totalSupply, TOTAL_SUPPLY);
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

    describe('approve', () => {

        describe('when the spender is not the zero address', () => {
            const spender = recipient;

            describe('when the sender has enough balance', () => {
                const amount = 100;

                it('emits an approval event', async () => {
                    const {logs} = await this.token.approve(spender, amount, {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Approval');
                    assert.equal(logs[0].args.owner, owner);
                    assert.equal(logs[0].args.spender, spender);
                    assert(logs[0].args.value.eq(amount));
                });

                describe('when there was no approved amount before', () => {
                    it('approves the requested amount', async () => {
                        await this.token.approve(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });
                });

                describe('when the spender had an approved amount', () => {
                    beforeEach(async () => {
                        await this.token.approve(spender, 1, {from: owner});
                    });

                    it('approves the requested amount and replaces the previous one', async () => {
                        await this.token.approve(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });
                });
            });

            describe('when the sender does not have enough balance', () => {
                const amount = 101;

                it('emits an approval event', async () => {
                    const {logs} = await this.token.approve(spender, amount, {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Approval');
                    assert.equal(logs[0].args.owner, owner);
                    assert.equal(logs[0].args.spender, spender);
                    assert(logs[0].args.value.eq(amount));
                });

                describe('when there was no approved amount before', () => {

                    it('approves the requested amount', async () => {
                        await this.token.approve(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });

                });

                describe('when the spender had an approved amount', () => {

                    beforeEach(async () => {
                        await this.token.approve(spender, 1, {from: owner});
                    });

                    it('approves the requested amount and replaces the previous one', async () => {
                        await this.token.approve(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });

                });
            });
        });

        describe('when the spender is the zero address', () => {
            const amount = 100;
            const spender = ZERO_ADDRESS;

            it('approves the requested amount', async () => {
                await this.token.approve(spender, amount, {from: owner});

                const allowance = await this.token.allowance(owner, spender);
                assert.equal(allowance, amount);
            });

            it('emits an approval event', async () => {
                const {logs} = await this.token.approve(spender, amount, {from: owner});

                assert.equal(logs.length, 1);
                assert.equal(logs[0].event, 'Approval');
                assert.equal(logs[0].args.owner, owner);
                assert.equal(logs[0].args.spender, spender);
                assert(logs[0].args.value.eq(amount));
            });
        });
    });

    describe('transfer from', () => {
        const spender = recipient;

        describe('when the recipient is not the zero address', () => {
            const to = anotherAccount;

            describe('when the spender has enough approved balance', () => {
                beforeEach(async () => {
                    await this.token.approve(spender, 100, {from: owner});
                });

                describe('when the owner has enough balance', () => {
                    const amount = 100;

                    it('transfers the requested amount', async () => {
                        await this.token.transferFrom(owner, to, amount, {from: spender});

                        const senderBalance = await this.token.balanceOf(owner);
                        assert.equal(senderBalance, 0);

                        const recipientBalance = await this.token.balanceOf(to);
                        assert.equal(recipientBalance, amount);
                    });

                    it('decreases the spender allowance', async () => {
                        await this.token.transferFrom(owner, to, amount, {from: spender});

                        const allowance = await this.token.allowance(owner, spender);
                        assert(allowance.eq(0));
                    });

                    it('emits a transfer event', async () => {
                        const {logs} = await this.token.transferFrom(owner, to, amount, {from: spender});

                        assert.equal(logs.length, 1);
                        assert.equal(logs[0].event, 'Transfer');
                        assert.equal(logs[0].args.from, owner);
                        assert.equal(logs[0].args.to, to);
                        assert(logs[0].args.value.eq(amount));
                    });
                });

                describe('when the owner does not have enough balance', () => {
                    const amount = 101;

                    it('reverts', async () => {
                        await assertRevert(this.token.transferFrom(owner, to, amount, {from: spender}));
                    });
                });
            });

            describe('when the spender does not have enough approved balance', () => {
                beforeEach(async () => {
                    await this.token.approve(spender, 99, {from: owner});
                });

                describe('when the owner has enough balance', () => {
                    const amount = 100;

                    it('reverts', async () => {
                        await assertRevert(this.token.transferFrom(owner, to, amount, {from: spender}));
                    });
                });

                describe('when the owner does not have enough balance', () => {
                    const amount = 101;

                    it('reverts', async () => {
                        await assertRevert(this.token.transferFrom(owner, to, amount, {from: spender}));
                    });
                });
            });
        });

        describe('when the recipient is the zero address', () => {
            const amount = 100;
            const to = ZERO_ADDRESS;

            beforeEach(async () => {
                await this.token.approve(spender, amount, {from: owner});
            });

            it('reverts', async () => {
                await assertRevert(this.token.transferFrom(owner, to, amount, {from: spender}));
            });
        });
    });

    describe('decrease approval', () => {
        describe('when the spender is not the zero address', () => {
            const spender = recipient;

            describe('when the sender has enough balance', () => {
                const amount = 100;

                it('emits an approval event', async () => {
                    const {logs} = await this.token.decreaseApproval(spender, amount, {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Approval');
                    assert.equal(logs[0].args.owner, owner);
                    assert.equal(logs[0].args.spender, spender);
                    assert(logs[0].args.value.eq(0));
                });

                describe('when there was no approved amount before', () => {
                    it('keeps the allowance to zero', async () => {
                        await this.token.decreaseApproval(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, 0);
                    });
                });

                describe('when the spender had an approved amount', () => {
                    beforeEach(async () => {
                        await this.token.approve(spender, amount + 1, {from: owner});
                    });

                    it('decreases the spender allowance subtracting the requested amount', async () => {
                        await this.token.decreaseApproval(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, 1);
                    });
                });
            });

            describe('when the sender does not have enough balance', () => {
                const amount = 101;

                it('emits an approval event', async () => {
                    const {logs} = await this.token.decreaseApproval(spender, amount, {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Approval');
                    assert.equal(logs[0].args.owner, owner);
                    assert.equal(logs[0].args.spender, spender);
                    assert(logs[0].args.value.eq(0));
                });

                describe('when there was no approved amount before', () => {
                    it('keeps the allowance to zero', async () => {
                        await this.token.decreaseApproval(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, 0);
                    });
                });

                describe('when the spender had an approved amount', () => {
                    beforeEach(async () => {
                        await this.token.approve(spender, amount + 1, {from: owner});
                    });

                    it('decreases the spender allowance subtracting the requested amount', async () => {
                        await this.token.decreaseApproval(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, 1);
                    });
                });
            });
        });

        describe('when the spender is the zero address', () => {
            const amount = 100;
            const spender = ZERO_ADDRESS;

            it('decreases the requested amount', async () => {
                await this.token.decreaseApproval(spender, amount, {from: owner});

                const allowance = await this.token.allowance(owner, spender);
                assert.equal(allowance, 0);
            });

            it('emits an approval event', async () => {
                const {logs} = await this.token.decreaseApproval(spender, amount, {from: owner});

                assert.equal(logs.length, 1);
                assert.equal(logs[0].event, 'Approval');
                assert.equal(logs[0].args.owner, owner);
                assert.equal(logs[0].args.spender, spender);
                assert(logs[0].args.value.eq(0));
            });
        });
    });

    describe('increase approval', () => {
        const amount = 100;

        describe('when the spender is not the zero address', () => {
            const spender = recipient;

            describe('when the sender has enough balance', () => {
                it('emits an approval event', async () => {
                    const {logs} = await this.token.increaseApproval(spender, amount, {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Approval');
                    assert.equal(logs[0].args.owner, owner);
                    assert.equal(logs[0].args.spender, spender);
                    assert(logs[0].args.value.eq(amount));
                });

                describe('when there was no approved amount before', () => {
                    it('approves the requested amount', async () => {
                        await this.token.increaseApproval(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });
                });

                describe('when the spender had an approved amount', () => {
                    beforeEach(async () => {
                        await this.token.approve(spender, 1, {from: owner});
                    });

                    it('increases the spender allowance adding the requested amount', async () => {
                        await this.token.increaseApproval(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, amount + 1);
                    });
                });
            });

            describe('when the sender does not have enough balance', () => {
                const amount = 101;

                it('emits an approval event', async () => {
                    const {logs} = await this.token.increaseApproval(spender, amount, {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Approval');
                    assert.equal(logs[0].args.owner, owner);
                    assert.equal(logs[0].args.spender, spender);
                    assert(logs[0].args.value.eq(amount));
                });

                describe('when there was no approved amount before', () => {
                    it('approves the requested amount', async () => {
                        await this.token.increaseApproval(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });
                });

                describe('when the spender had an approved amount', () => {
                    beforeEach(async () => {
                        await this.token.approve(spender, 1, {from: owner});
                    });

                    it('increases the spender allowance adding the requested amount', async () => {
                        await this.token.increaseApproval(spender, amount, {from: owner});

                        const allowance = await this.token.allowance(owner, spender);
                        assert.equal(allowance, amount + 1);
                    });
                });
            });
        });

        describe('when the spender is the zero address', () => {
            const spender = ZERO_ADDRESS;

            it('approves the requested amount', async () => {
                await this.token.increaseApproval(spender, amount, {from: owner});

                const allowance = await this.token.allowance(owner, spender);
                assert.equal(allowance, amount);
            });

            it('emits an approval event', async () => {
                const {logs} = await this.token.increaseApproval(spender, amount, {from: owner});

                assert.equal(logs.length, 1);
                assert.equal(logs[0].event, 'Approval');
                assert.equal(logs[0].args.owner, owner);
                assert.equal(logs[0].args.spender, spender);
                assert(logs[0].args.value.eq(amount));
            });
        });
    });
});
