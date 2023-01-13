import { render } from 'solid-js/web';

import { Upload } from './components/upload.component';
import "./css/global.css";
import "./css/animate.css";
render(() => <Upload />, document.getElementById('root') as HTMLElement);
