import React from 'react';
import { render } from 'react-dom';

import Editor from './Editor';
import './index.css';

render(<Editor />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();