/** Fixed decimals, or an en dash when the value is not a finite number. */
export const fixed = (x: number, digits = 2) => (Number.isFinite(x) ? x.toFixed(digits) : "–");

/** Up to five significant figures without trailing zeros. */
export const sig = (x: number) => (Number.isFinite(x) ? String(Number(x.toPrecision(5))) : "–");
