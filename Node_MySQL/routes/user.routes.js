const router = require('express').Router();
const dao = require('../dao/user.dao');

router.post('/login', dao.login);
router.get('/', dao.getAll);
router.get('/:id', dao.getById);
router.post('/', dao.create);
router.put('/:id', dao.update);
router.delete('/:id', dao.remove);

module.exports = router;