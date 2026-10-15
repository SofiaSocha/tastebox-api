const db = require('../services/mysql.service');
const { isValidId, assertValidId, sendNotFound, sendError } = require('../utils/http.utils');

const validateReview = (body) => {
  const { date, tags, comments, cook_it_again: cookItAgain, user_id_user: userIdUser, recipe_id_recipe: recipeIdRecipe } = body;

  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))) {
    throw new Error('date es obligatorio y debe tener formato YYYY-MM-DD');
  }
  if (tags !== undefined && tags !== null && (typeof tags !== 'string' || tags.length > 45)) {
    throw new Error('tags debe ser texto de máx. 45 caracteres');
  }
  if (comments !== undefined && comments !== null && (typeof comments !== 'string' || comments.length > 255)) {
    throw new Error('comments debe ser texto de máx. 255 caracteres');
  }
  if (![0, 1, '0', '1', true, false].includes(cookItAgain)) {
    throw new Error('cook_it_again es obligatorio y debe ser 0 o 1');
  }
  if (!isValidId(userIdUser)) {
    throw new Error('user_id_user es obligatorio y debe ser un entero');
  }
  if (!isValidId(recipeIdRecipe)) {
    throw new Error('recipe_id_recipe es obligatorio y debe ser un entero');
  }
};

const buildReview = (body) => ({
  date: body.date,
  tags: body.tags ?? null,
  comments: body.comments ?? null,
  cook_it_again: Number(body.cook_it_again),
  user_id_user: Number(body.user_id_user),
  recipe_id_recipe: Number(body.recipe_id_recipe),
});

const REVIEW_ERRORS = {
  ER_NO_REFERENCED_ROW_2: { status: 400, message: 'El usuario o la receta indicados no existen' },
};

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.email AS user_email, rc.name AS recipe_name
       FROM review r
       JOIN user u ON u.id_user = r.user_id_user
       JOIN recipe rc ON rc.id_recipe = r.recipe_id_recipe`
    );
    res.json(rows);
  } catch (err) {
    sendError(res, err);
  }
};

const getById = async (req, res) => {
  try {
    assertValidId(req.params.id);

    const [rows] = await db.query(
      'SELECT * FROM review WHERE id_review = ?',
      [req.params.id]
    );
    if (!rows[0]) return sendNotFound(res);
    res.json(rows[0]);
  } catch (err) {
    sendError(res, err);
  }
};

const getByRecipe = async (req, res) => {
  try {
    assertValidId(req.params.recipeId, 'recipeId');

    const [rows] = await db.query(
      'SELECT * FROM review WHERE recipe_id_recipe = ?',
      [req.params.recipeId]
    );
    res.json(rows);
  } catch (err) {
    sendError(res, err);
  }
};

const create = async (req, res) => {
  try {
    const body = req.body || {};
    validateReview(body);
    const review = buildReview(body);

    const [result] = await db.query(
      `INSERT INTO review (date, tags, comments, cook_it_again, user_id_user, recipe_id_recipe)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [review.date, review.tags, review.comments, review.cook_it_again, review.user_id_user, review.recipe_id_recipe]
    );
    res.status(201).json({ id_review: result.insertId, ...review });
  } catch (err) {
    sendError(res, err, REVIEW_ERRORS);
  }
};

const update = async (req, res) => {
  try {
    assertValidId(req.params.id);
    const body = req.body || {};
    validateReview(body);
    const review = buildReview(body);

    const [result] = await db.query(
      `UPDATE review
       SET date = ?, tags = ?, comments = ?, cook_it_again = ?, user_id_user = ?, recipe_id_recipe = ?
       WHERE id_review = ?`,
      [review.date, review.tags, review.comments, review.cook_it_again, review.user_id_user, review.recipe_id_recipe, req.params.id]
    );
    if (result.affectedRows === 0) return sendNotFound(res);
    res.json({ id_review: Number(req.params.id), ...review });
  } catch (err) {
    sendError(res, err, REVIEW_ERRORS);
  }
};

const remove = async (req, res) => {
  try {
    assertValidId(req.params.id);

    const [result] = await db.query('DELETE FROM review WHERE id_review = ?', [req.params.id]);
    if (result.affectedRows === 0) return sendNotFound(res);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
};

module.exports = { getAll, getById, getByRecipe, create, update, remove };