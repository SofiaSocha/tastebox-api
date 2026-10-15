const db = require('../services/mysql.service');
const { isValidId, assertValidId, sendNotFound, sendError } = require('../utils/http.utils');

const COLUMNS = 'id_user, email, role, subscription_id_subscription';

const validateUser = (body, { passwordOptional = false } = {}) => {
  const { email, password, role, subscription_id_subscription: subscriptionIdSubscription } = body;

  if (typeof email !== 'string' || email.length > 45 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('email inválido (obligatorio, formato válido, máx. 45 caracteres)');
  }
  const isPasswordRequired = !passwordOptional || password !== undefined;
  if (isPasswordRequired && (typeof password !== 'string' || password.length < 6 || password.length > 72)) {
    throw new Error('password es obligatorio (entre 6 y 72 caracteres)');
  }
  if (role !== undefined && ![0, 1, '0', '1'].includes(role)) {
    throw new Error('role debe ser 0 o 1');
  }
  if (!isValidId(subscriptionIdSubscription)) {
    throw new Error('subscription_id_subscription es obligatorio y debe ser un entero');
  }
};

const EMAIL_TAKEN_MESSAGE = 'El email ya está registrado';

const USER_ERRORS = {
  ER_DUP_ENTRY: { status: 409, message: EMAIL_TAKEN_MESSAGE },
  ER_NO_REFERENCED_ROW_2: { status: 400, message: 'La suscripción indicada no existe' },
};

const REMOVE_ERRORS = {
  ER_ROW_IS_REFERENCED_2: { status: 409, message: 'No se puede eliminar: el usuario tiene reseñas o recetas guardadas' },
};

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT ${COLUMNS} FROM user`);
    res.json(rows);
  } catch (err) {
    sendError(res, err);
  }
};

const getById = async (req, res) => {
  try {
    assertValidId(req.params.id);

    const [rows] = await db.query(
      `SELECT ${COLUMNS} FROM user WHERE id_user = ?`,
      [req.params.id]
    );
    if (!rows[0]) return sendNotFound(res);
    res.json(rows[0]);
  } catch (err) {
    sendError(res, err);
  }
};

// Estas dos devuelven la fila completa, incluida la contraseña
const getByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM user WHERE id_user = ?', [id]);
  return rows[0];
};

const isEmailUsedByAnother = async (email, id) => {
  const [rows] = await db.query(
    'SELECT id_user FROM user WHERE email = ? AND id_user <> ?',
    [email, id]
  );
  return rows.length > 0;
};

const buildUpdatedUser = (id, current, body) => ({
  id_user: Number(id),
  email: body.email,
  password: body.password !== undefined ? body.password : current.password,
  role: body.role !== undefined ? Number(body.role) : current.role,
  subscription_id_subscription: Number(body.subscription_id_subscription),
});

const saveUser = (user) => db.query(
  'UPDATE user SET email = ?, password = ?, role = ?, subscription_id_subscription = ? WHERE id_user = ?',
  [user.email, user.password, user.role, user.subscription_id_subscription, user.id_user]
);

const toPublicUser = (user) => ({
  id_user: user.id_user,
  email: user.email,
  role: user.role,
  subscription_id_subscription: user.subscription_id_subscription,
});

const validateCredentials = ({ email, password }) => {
  if (typeof email !== 'string' || email.trim() === '' || typeof password !== 'string' || password === '') {
    throw new Error('email y password son obligatorios');
  }
};

const authenticate = async (email, password) => {
  const user = await getByEmail(email);
  if (!user) return null;
  const isPasswordValid = user.password === password;
  return isPasswordValid ? user : null;
};

const create = async (req, res) => {
  try {
    const body = req.body || {};
    validateUser(body);

    const { email, password, role = 0, subscription_id_subscription: subscriptionIdSubscription } = body;

    if (await getByEmail(email)) {
      return res.status(409).json({ error: EMAIL_TAKEN_MESSAGE });
    }

    const [result] = await db.query(
      'INSERT INTO user (email, password, role, subscription_id_subscription) VALUES (?, ?, ?, ?)',
      [email, password, Number(role), Number(subscriptionIdSubscription)]
    );
    res.status(201).json({
      id_user: result.insertId,
      email,
      role: Number(role),
      subscription_id_subscription: Number(subscriptionIdSubscription),
    });
  } catch (err) {
    sendError(res, err, USER_ERRORS);
  }
};

const update = async (req, res) => {
  try {
    assertValidId(req.params.id);
    const body = req.body || {};
    validateUser(body, { passwordOptional: true });

    const current = await findById(req.params.id);
    if (!current) return sendNotFound(res);

    if (await isEmailUsedByAnother(body.email, req.params.id)) {
      return res.status(409).json({ error: EMAIL_TAKEN_MESSAGE });
    }

    const updatedUser = buildUpdatedUser(req.params.id, current, body);
    await saveUser(updatedUser);
    res.json(toPublicUser(updatedUser));
  } catch (err) {
    sendError(res, err, USER_ERRORS);
  }
};

const remove = async (req, res) => {
  try {
    assertValidId(req.params.id);

    const [result] = await db.query('DELETE FROM user WHERE id_user = ?', [req.params.id]);
    if (result.affectedRows === 0) return sendNotFound(res);
    res.status(204).send();
  } catch (err) {
    sendError(res, err, REMOVE_ERRORS);
  }
};

const login = async (req, res) => {
  try {
    const body = req.body || {};
    validateCredentials(body);

    const user = await authenticate(body.email, body.password);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json({ message: 'Inicio de sesión exitoso', user: toPublicUser(user) });
  } catch (err) {
    sendError(res, err);
  }
};

module.exports = { getAll, getById, create, update, remove, login };