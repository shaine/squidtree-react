import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
    hashPassword,
    verifyPassword
} from './password';

describe('password', () => {
    let hash;
    let password;

    it('returns a hashed password', () => {
        // Set up
        password = Math.random().toString();

        // Run unit
        hash = hashPassword(password);

        // Verify expectations
        expect(hash)
            .to.be.a('string');
    });

    it('returns true for a matching password', () => {
        expect(verifyPassword(password, hash))
            .to.be.true;
    });

    it('returns false for a non-matching password', () => {
        expect(verifyPassword(Math.random().toString(), hash))
            .to.be.false;
    });
});
