/*
|-----------------------------------------------------------------------------
| Border radius                    https://tailwindcss.com/docs/border-radius
|-----------------------------------------------------------------------------
|
| Here is where you define your border radius values. If a `default` radius
| is provided, it will be made available as the non-suffixed `.rounded`
| utility.
|
| If your scale includes a `0` value to reset already rounded corners, it's
| a good idea to put it first so other values are able to override it.
|
| Class name: .rounded{-side?}{-size?}
| CSS property: border-radius
|
*/

export default {
  'none': '0',
  'sm': '.125rem',
  default: '.25rem',
  'lg': '.5rem',
  'full': '9999px',
};
