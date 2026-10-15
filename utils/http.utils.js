const isValidId = (value) => /^\d+$/.test(String(value));

const isText = (value, max) => typeof value === 'string' && value.trim() !== '' && value.length <= max;

const assertValidId = (value, name = 'id') => {
  if (!isValidId(value)) throw new Error(`${name} inválido`);
};

const sendNotFound = (res) => res.status(404).json({ error: 'No encontrado' });

const sendError = (res, err, knownErrors = {}) => {
  const known = knownErrors[err.code];
  if (known) return res.status(known.status).json({ error: known.message });
  res.status(err.code ? 500 : 400).json({ error: err.message });
};

module.exports = { isValidId, isText, assertValidId, sendNotFound, sendError };