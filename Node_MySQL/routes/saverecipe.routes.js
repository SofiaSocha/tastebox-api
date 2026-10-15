const router = require('express').Router();
const dao = require('../dao/saverecipe.dao');

router.get('/', dao.getAll);
router.get('/user/:userId', dao.getByUser);
router.post('/', dao.create);
router.delete('/:recipeId/:userId', dao.remove);

module.exports = router;