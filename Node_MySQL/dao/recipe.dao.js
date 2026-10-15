const db = require('../services/mysql.service');
const { isText, assertValidId, sendNotFound, sendError } = require('../utils/http.utils');

const REMOVE_ERRORS = {
  ER_ROW_IS_REFERENCED_2: { status: 409, message: 'No se puede eliminar: la receta tiene reseñas o está guardada por usuarios' },
};

const validateRecipe = (body) => {
  const { name, difficulty_level: difficultyLevel, cuisine_type: cuisineType, description, preparation_date: preparationDate } = body;
  if (!isText(name, 45)) {
    throw new Error('name es obligatorio (máx. 45 caracteres)');
  }
  if (!/^\d+$/.test(String(difficultyLevel)) || Number(difficultyLevel) < 1 || Number(difficultyLevel) > 5) {
    throw new Error('difficulty_level es obligatorio y debe ser un entero entre 1 y 5');
  }
  if (!isText(cuisineType, 45)) {
    throw new Error('cuisine_type es obligatorio (máx. 45 caracteres)');
  }
  if (!isText(description, 255)) {
    throw new Error('description es obligatorio (máx. 255 caracteres)');
  }
  if (preparationDate !== undefined && preparationDate !== null && preparationDate !== '') {
    if (isNaN(Date.parse(preparationDate))) {
      throw new Error('preparation_date debe ser una fecha válida');
    }
  }
};

const buildRecipe = (body) => ({
  name: body.name.trim(),
  difficulty_level: Number(body.difficulty_level),
  cuisine_type: body.cuisine_type.trim(),
  description: body.description.trim(),
  preparation_date: body.preparation_date ? new Date(body.preparation_date) : new Date(),
});

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recipe');
    res.json(rows);
  } catch (err) {
    sendError(res, err);
  }
};

const getById = async (req, res) => {
  try {
    assertValidId(req.params.id);

    const [rows] = await db.query(
      'SELECT * FROM recipe WHERE id_recipe = ?',
      [req.params.id]
    );
    if (!rows[0]) return sendNotFound(res);
    res.json(rows[0]);
  } catch (err) {
    sendError(res, err);
  }
};

const create = async (req, res) => {
  try {
    const body = req.body || {};
    validateRecipe(body);
    const recipe = buildRecipe(body);

    const [result] = await db.query(
      `INSERT INTO recipe (name, difficulty_level, cuisine_type, description, preparation_date)
       VALUES (?, ?, ?, ?, ?)`,
      [recipe.name, recipe.difficulty_level, recipe.cuisine_type, recipe.description, recipe.preparation_date]
    );
    res.status(201).json({ id_recipe: result.insertId, ...recipe });
  } catch (err) {
    sendError(res, err);
  }
};

const update = async (req, res) => {
  try {
    assertValidId(req.params.id);
    const body = req.body || {};
    validateRecipe(body);
    const recipe = buildRecipe(body);

    const [result] = await db.query(
      `UPDATE recipe
       SET name = ?, difficulty_level = ?, cuisine_type = ?, description = ?, preparation_date = ?
       WHERE id_recipe = ?`,
      [recipe.name, recipe.difficulty_level, recipe.cuisine_type, recipe.description, recipe.preparation_date, req.params.id]
    );
    if (result.affectedRows === 0) return sendNotFound(res);
    res.json({ id_recipe: Number(req.params.id), ...recipe });
  } catch (err) {
    sendError(res, err);
  }
};

const remove = async (req, res) => {
  try {
    assertValidId(req.params.id);

    const [result] = await db.query('DELETE FROM recipe WHERE id_recipe = ?', [req.params.id]);
    if (result.affectedRows === 0) return sendNotFound(res);
    res.status(204).send();
  } catch (err) {
    sendError(res, err, REMOVE_ERRORS);
  }
};

module.exports = { getAll, getById, create, update, remove };