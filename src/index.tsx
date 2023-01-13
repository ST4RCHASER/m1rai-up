import 'windi.css';
import './css/global.css';
import './css/animate.css';
import { render } from 'solid-js/web';

import { Upload } from './components/upload.component';
render(() => <Upload />, document.getElementById('root') as HTMLElement);
