import { UserPermissions } from '../../../core/base';
import User from '../../../core/User';
import hasPermissions from '../../../middlewares/hasPermissions';

import app from '../../../app';

app.post('/api/users', hasPermissions(UserPermissions.MANAGE_USERS), async (req, res) => {
  const { id } = req.query;
  const users = id ? [await User.get(id) || User.default(id)] : await User.getAll();

  res.status(200).send({ users: users.map(u => u.data()) });
});
