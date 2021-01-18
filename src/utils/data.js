/*
 * src/utils/data.js
 */

// expand integer (n) to array: [0, 1, 2, ..., n-1]
export function range(integer) {
    return [...Array(integer).keys()]
}
