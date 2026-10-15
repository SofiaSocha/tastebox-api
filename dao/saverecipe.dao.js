const db = require('../services/mysql.service');
const { isValidId, assertValidId, sendNotFound, sendError } = require('../utils/http.utils');

const SAVE_ERRORS = {
  ER_DUP_ENTRY: { status: 409, message: 'El usuario ya guardó esta receta' },
  ER_NO_REFERENCED_ROW_2: { status: 400, message: 'El usuario o la receta indicados no existen' },
};

// Tabla intermedia: no tiene id propio, la llave es (recipe_id_recipe, user_id_user).

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.recipe_id_recipe, s.user_id_user, r.name AS recipe_name, u.email AS user_email
       FROM save_recipes s
       JOIN recipe r ON r.id_recipe = s.recipe_id_recipe
       JOIN user u ON u.id_user = s.user_id_user`
    );
    res.json(rows);
  } catch (err) {
    sendError(res, err);
  }
};

const getByUser = async (req, res) => {
  try {
    assertValidId(req.params.userId, 'userId');

    const [rows] = await db.query(
      `SELECT r.*
       FROM save_recipes s
       JOIN recipe r ON r.id_recipe = s.recipe_id_recipe
       WHERE s.user_id_user = ?`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    sendError(res, err);
  }
};

const create = async (req, res) => {
  try {
    const { recipe_id_recipe: recipeIdRecipe, user_id_user: userIdUser } = req.body || {};
    if (!isValidId(recipeIdRecipe) || !isValidId(userIdUser)) {
      throw new Error('recipe_id_recipe y user_id_user son obligatorios y deben ser enteros');
    }

    await db.query(
      'INSERT INTO save_recipes (recipe_id_recipe, user_id_user) VALUES (?, ?)',
      [Number(recipeIdRecipe), Number(userIdUser)]
    );
    res.status(201).json({
      recipe_id_recipe: Number(recipeIdRecipe),
      user_id_user: Number(userIdUser),
    });
  } catch (err) {
    sendError(res, err, SAVE_ERRORS);
  }
};

const remove = async (req, res) => {
  try {
    const { recipeId, userId } = req.params;
    if (!isValidId(recipeId) || !isValidId(userId)) {
      throw new Error('recipeId y userId inválidos');
    }

    const [result] = await db.query(
      'DELETE FROM save_recipes WHERE recipe_id_recipe = ? AND user_id_user = ?',
      [recipeId, userId]
    );
    if (result.affectedRows === 0) return sendNotFound(res);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
};

module.exports = { getAll, getByUser, create, remove };