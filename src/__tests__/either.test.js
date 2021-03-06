// @flow strict

import { partition } from 'itertools';

import { boolean } from '../boolean';
import { constant, undefined_ } from '../constants';
import { either, either4, either9, oneOf } from '../either';
import { guard } from '../guard';
import { number } from '../number';
import { object } from '../object';
import { regex, string } from '../string';
import { INPUTS } from './fixtures';

describe('either', () => {
    const stringOrBooleanDecoder = guard(either(string, boolean));
    const [okay, not_okay] = partition(
        INPUTS,
        (x) => typeof x === 'string' || typeof x === 'boolean'
    );

    it('valid', () => {
        expect(okay.length).not.toBe(0);
        for (const value of okay) {
            expect(stringOrBooleanDecoder(value)).toBe(value);
        }
    });

    it('invalid', () => {
        expect(not_okay.length).not.toBe(0);
        for (const value of not_okay) {
            expect(() => stringOrBooleanDecoder(value)).toThrow();
        }
    });

    it('errors nicely in trivial eithers', () => {
        expect(() => stringOrBooleanDecoder(42)).toThrow('Either:');
    });

    it('errors nicely in common, simple eithers (ie optional)', () => {
        // Either undefined or string
        const g1 = guard(either(undefined_, string));
        expect(() => g1(42)).toThrow('Either:');
        expect(() => g1({})).toThrow('Either:');

        // Either undefined or object
        const g2 = guard(either(undefined_, object({ name: string })));
        expect(() => g2(42)).toThrow('Either:');
        expect(() => g2({ name: 42 })).toThrow('Either');

        const g3 = guard(
            either(regex(/1/, 'Must contain 1'), regex(/2/, 'Must contain 2'))
        );
        expect(() => g3(42)).toThrow('Either');
        expect(() => g3('foobar')).toThrow('Either');
    });

    it.skip('errors nicely in complex eithers (with two wildly different branches)', () => {
        const g = guard(either(object({ foo: string }), object({ bar: number })));
        expect(() =>
            g({
                foo: 123,
                bar: 'not a number',
            })
        ).toThrow('XXX FIXME - this Either: error looks horrendous');
    });
});

describe('either3', () => {
    const decoder = guard(either4(string, boolean, number, undefined_));
    const [okay, not_okay] = partition(
        INPUTS,
        (x) =>
            x === undefined ||
            typeof x === 'string' ||
            typeof x === 'boolean' ||
            Number.isFinite(x)
    );

    it('valid', () => {
        expect(okay.length).not.toBe(0);
        for (const value of okay) {
            expect(decoder(value)).toBe(value);
        }
    });

    it('invalid', () => {
        expect(not_okay.length).not.toBe(0);
        for (const value of not_okay) {
            expect(() => decoder(value)).toThrow();
        }
    });
});

describe('either9', () => {
    // By testing either9 we'll cover either8, either7, ...
    const decoder = either9(
        constant('one'),
        constant('two'),
        constant('three'),
        constant('four'),
        constant('five'),
        constant('six'),
        constant('seven'),
        constant('eight'),
        constant('nine')
    );
    const okay = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const not_okay = INPUTS;

    it('valid', () => {
        expect(okay.length).not.toBe(0);
        for (const value of okay) {
            expect(decoder(value).unwrap()).toBe(value);
        }
    });

    it('invalid', () => {
        expect(not_okay.length).not.toBe(0);
        for (const value of not_okay) {
            expect(decoder(value).isErr()).toBe(true);
        }
    });
});

describe('oneOf', () => {
    const decoder = oneOf([3, true, null, '1', 'foo']);
    const okay = [3, true, null, '1', 'foo'];
    const not_okay = INPUTS.filter((x) => !okay.includes(x));

    it('valid', () => {
        expect(okay.length).not.toBe(0);
        for (const value of okay) {
            expect(decoder(value).unwrap()).toBe(value);
        }
    });

    it('invalid', () => {
        expect(not_okay.length).not.toBe(0);
        for (const value of not_okay) {
            expect(decoder(value).isErr()).toBe(true);
        }
    });
});
