const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'typeDefs.graphql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');

module.exports = typeDefs;
