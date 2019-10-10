import app from '../../app';

app.get('/api/auth', (req, res) => {
  console.log(req.query);
  res.json(req.query);
});