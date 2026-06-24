const express           = require('express');
const path              = require('path');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema }   = require('graphql');
const { ruruHTML }      = require('ruru/server');

const typeDefs  = require('./graphql/schema/index');
const rootValue = require('./graphql/resolvers/index');

const app    = express();
const schema = buildSchema(typeDefs);

app.use(express.static(path.join(__dirname)));

app.get('/playground', (req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

app.all('/graphql', createHandler({ schema, rootValue }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend:    http://localhost:${PORT}/`);
  console.log(`💻 Playground:  http://localhost:${PORT}/playground`);
  console.log(`📡 GraphQL API: http://localhost:${PORT}/graphql`);
});