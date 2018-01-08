// @flow

import { annotate, indent } from 'debrief';
import { Err, Ok } from 'lemons';

import type { Decoder } from './types';

function indentForEither(s: string = ''): string {
    s = indent(s);
    return '-' + s.substring(1);
}

export function either<T1, T2>(d1: Decoder<T1>, d2: Decoder<T2>): Decoder<T1 | T2> {
    return (blob: any) =>
        d1(blob).dispatch(
            value1 => Ok(value1),
            err1 =>
                d2(blob).dispatch(
                    value2 => Ok(value2),
                    err2 =>
                        Err(
                            annotate(
                                blob,
                                ['Either:', indentForEither(err1.annotation), indentForEither(err2.annotation)].join(
                                    '\n'
                                )
                            )
                        )
                )
        );
}

export function either3<T1, T2, T3>(d1: Decoder<T1>, d2: Decoder<T2>, d3: Decoder<T3>): Decoder<T1 | T2 | T3> {
    return either(d1, either(d2, d3));
}

export function either4<T1, T2, T3, T4>(
    d1: Decoder<T1>,
    d2: Decoder<T2>,
    d3: Decoder<T3>,
    d4: Decoder<T4>
): Decoder<T1 | T2 | T3 | T4> {
    return either(d1, either3(d2, d3, d4));
}

export function either5<T1, T2, T3, T4, T5>(
    d1: Decoder<T1>,
    d2: Decoder<T2>,
    d3: Decoder<T3>,
    d4: Decoder<T4>,
    d5: Decoder<T5>
): Decoder<T1 | T2 | T3 | T4 | T5> {
    return either(d1, either4(d2, d3, d4, d5));
}

export function either6<T1, T2, T3, T4, T5, T6>(
    d1: Decoder<T1>,
    d2: Decoder<T2>,
    d3: Decoder<T3>,
    d4: Decoder<T4>,
    d5: Decoder<T5>,
    d6: Decoder<T6>
): Decoder<T1 | T2 | T3 | T4 | T5 | T6> {
    return either(d1, either5(d2, d3, d4, d5, d6));
}

export function either7<T1, T2, T3, T4, T5, T6, T7>(
    d1: Decoder<T1>,
    d2: Decoder<T2>,
    d3: Decoder<T3>,
    d4: Decoder<T4>,
    d5: Decoder<T5>,
    d6: Decoder<T6>,
    d7: Decoder<T7>
): Decoder<T1 | T2 | T3 | T4 | T5 | T6 | T7> {
    return either(d1, either6(d2, d3, d4, d5, d6, d7));
}

export function either8<T1, T2, T3, T4, T5, T6, T7, T8>(
    d1: Decoder<T1>,
    d2: Decoder<T2>,
    d3: Decoder<T3>,
    d4: Decoder<T4>,
    d5: Decoder<T5>,
    d6: Decoder<T6>,
    d7: Decoder<T7>,
    d8: Decoder<T8>
): Decoder<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8> {
    return either(d1, either7(d2, d3, d4, d5, d6, d7, d8));
}

export function either9<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    d1: Decoder<T1>,
    d2: Decoder<T2>,
    d3: Decoder<T3>,
    d4: Decoder<T4>,
    d5: Decoder<T5>,
    d6: Decoder<T6>,
    d7: Decoder<T7>,
    d8: Decoder<T8>,
    d9: Decoder<T9>
): Decoder<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9> {
    return either(d1, either8(d2, d3, d4, d5, d6, d7, d8, d9));
}
