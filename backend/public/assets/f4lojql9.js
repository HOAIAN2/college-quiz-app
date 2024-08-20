import{b as o,$ as n}from"./B7DAq_4k.js";function a(e,t=n){const[s,r]=o.useState(e);return o.useEffect(()=>{const c=setTimeout(()=>{r(e)},t);return()=>{clearTimeout(c)}},[t,e]),s}export{a as u};
