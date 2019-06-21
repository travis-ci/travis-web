import colors from './colors';

/*
|-----------------------------------------------------------------------------
| Border colors                     https://tailwindcss.com/docs/border-color
|-----------------------------------------------------------------------------
|
| Here is where you define your border colors. By default these use the
| color palette we defined above, however you're welcome to set these
| independently if that makes sense for your project.
|
| Take note that border colors require a special "default" value set
| as well. This is the color that will be used when you do not
| specify a border color.
|
| Class name: .border-{color}
| CSS property: border-color
|
*/

export default Object.assign({ default: colors['grey-light'] }, colors);
