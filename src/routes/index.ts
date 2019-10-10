import app from '../app';

import './api/auth';

app.get('*', (req, res) => {
  res.send('What are you looking for? ( ͡° ͜ʖ ͡°)<br/>There is nothing to see here...<br/>Yet.');
});
