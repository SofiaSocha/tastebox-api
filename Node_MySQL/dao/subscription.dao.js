const db = require('../services/mysql.service');
const { isText, assertValidId, sendNotFound, sendError } = require('../utils/http.utils');

const REMOVE_ERRORS = {
  ER_ROW_IS_REFERENCED_2: { status: 409, message: 'No se puede eliminar: hay usuarios con esta suscripción' },
};

const validateSubscription = (body) => {
  const { name } = body;
  if (!isText(name, 45)) {
    throw new Error('name es obligatorio (máx. 45 caracteres)');
  }
};

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subscription');
    res.json(rows);
  } catch (err) {
    sendError(res, err);
  }
};

const getById = async (req, res) => {
  try {
    assertValidId(req.params.id);

    const [rows] = await db.query(
      'SELECT * FROM subscription WHERE id_subscription = ?',
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
    validateSubscription(body);
    const name = body.name.trim();

    const [result] = await db.query(
      'INSERT INTO subscription (name) VALUES (?)',
      [name]
    );
    res.status(201).json({ id_subscription: result.insertId, name });
  } catch (err) {
    sendError(res, err);
  }
};

const update = async (req, res) => {
  try {
    assertValidId(req.params.id);
    const body = req.body || {};
    validateSubscription(body);
    const name = body.name.trim();

    const [result] = await db.query(
      'UPDATE subscription SET name = ? WHERE id_subscription = ?',
      [name, req.params.id]
    );
    if (result.affectedRows === 0) return sendNotFound(res);
    res.json({ id_subscription: Number(req.params.id), name });
  } catch (err) {
    sendError(res, err);
  }
};

const remove = async (req, res) => {
  try {
    assertValidId(req.params.id);

    const [result] = await db.query(
      'DELETE FROM subscription WHERE id_subscription = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) return sendNotFound(res);
    res.status(204).send();
  } catch (err) {
    sendError(res, err, REMOVE_ERRORS);
  }
};

module.exports = { getAll, getById, create, update, remove };