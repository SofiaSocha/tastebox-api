const router = require('express').Router();
const dao = require('../dao/subscription.dao');

router.get('/', dao.getAll);
router.get('/:id', dao.getById);
router.post('/', dao.create);
router.put('/:id', dao.update);
router.delete('/:id', dao.remove);

module.exports = router;