import { UserPermissions } from '../../../core/base';
import User from '../../../core/User';
import hasPermissions from '../../../middlewares/hasPermissions';
import logger from '../../../core/Logger';

import app from '../../../app';

app.post('/api/users/permissions', hasPermissions(UserPermissions.MANAGE_USERS), async (req, res) => {
  const admin = req.user;
  const { id, permissions } = req.body;

  const target = await User.get(id) || User.default(id);
  const oldPermissions = target.permissions;
  target.permissions = permissions;
  await target.save();

  logger.info('Updated permissions for the user', { admin: admin.id, user: target.id, permissions: target.permissions, oldPermissions });

  res.status(200).send();
});
