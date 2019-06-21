/*
|-----------------------------------------------------------------------------
| Shadows                                https://tailwindcss.com/docs/shadows
|-----------------------------------------------------------------------------
|
| Here is where you define your shadow utilities. As you can see from
| the defaults we provide, it's possible to apply multiple shadows
| per utility using comma separation.
|
| If a `default` shadow is provided, it will be made available as the non-
| suffixed `.shadow` utility.
|
| Class name: .shadow-{size?}
| CSS property: box-shadow
|
*/

export default {
  default: '0 2px 4px 0 rgba(0,0,0,0.10)',
  'md': '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
  'lg': '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
  'inner': 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
  'outline': '0 0 0 3px rgba(52,144,220,0.5)',
  'none': 'none',
};
