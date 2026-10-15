const express = require('express');
const subscriptionRoutes = require('./routes/subscription.routes');
const userRoutes = require('./routes/user.routes');
const recipeRoutes = require('./routes/recipe.routes');
const reviewRoutes = require('./routes/review.routes');
const saveRecipeRoutes = require('./routes/saverecipe.routes');

/////
   const swaggerUi = require('swagger-ui-express');
   const YAML = require('yamljs');
   const path = require('path');
   const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

const PORT = 5000;
const api = express();

api.use(express.json());
   api.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

api.use('/subscriptions', subscriptionRoutes);
api.use('/users', userRoutes);
api.use('/recipes', recipeRoutes);
api.use('/reviews', reviewRoutes);
api.use('/saved-recipes', saveRecipeRoutes);

api.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});