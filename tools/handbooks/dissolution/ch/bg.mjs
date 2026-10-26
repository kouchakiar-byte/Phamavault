import { C } from "../lib.mjs";
// Page stationery under every body page: edge band, corner hexagons and a faint emblem.
export default () => `<div style="position:relative;width:210mm;height:296.5mm;overflow:hidden">
<div style="position:absolute;top:0;bottom:0;right:0;width:2.6mm;background:linear-gradient(${C.teal},${C.navy2} 55%,${C.gold})"></div>
<div style="position:absolute;top:0;bottom:0;right:2.6mm;width:.7mm;background:${C.gold};opacity:.55"></div>
<svg style="position:absolute;left:50%;top:50%;transform:translate(-50%,-46%);opacity:.04" width="120mm" height="120mm" viewBox="0 0 40 40">
<path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="none" stroke="${C.navy}" stroke-width="1.1"/>
<circle cx="20" cy="20" r="9" fill="none" stroke="${C.navy}" stroke-width=".8"/><circle cx="20" cy="18" r="2.6" fill="${C.navy}"/><path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="${C.navy}"/></svg>
<svg style="position:absolute;left:6mm;bottom:5mm;opacity:.16" width="26mm" height="26mm" viewBox="0 0 60 60">
${[[10, 10], [27, 10], [18.5, 25], [35.5, 25], [10, 40]].map(([x, y]) => `<path d="M${x} ${y - 8} ${x + 7} ${y - 4}v8L${x} ${y + 8} ${x - 7} ${y + 4}v-8Z" fill="none" stroke="${C.teal}" stroke-width="1.1"/>`).join("")}</svg>
</div>`;
