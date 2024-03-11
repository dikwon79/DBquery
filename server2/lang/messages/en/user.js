const messages = {
  connectError : 'Error connecting to MySQL: ',
  connected : 'Connected to MySQL as id ',
  createError : 'Error creating patients table:',
  tableSuccess : 'Patients table exists or created successfully.',
  insertSuccess : 'Data inserted successfully.',
  notAllowed : 'Update and delete queries are not allowed.',
  fobidden : 'Forbidden',
  errorMysql : 'Error querying MySQL: ',
  severEcdrror : 'Internal Server Error',
  resultQuery : 'Query results: ',
  closingError : 'Error closing MySQL connection: ',
  closed : 'MySQL connection closed.',
  endpoint : '/lab5/api/v1/sql/',
  endpoint2 : '/lab5/api/v1/sql',
  sqlExcute : "Executing SQL query:",
  errorParsing : 'Error parsing JSON:',
  badRequest : 'Bad Request: Error parsing JSON',
  notFound : 'Not Found',
  serverRun : "Server is running on port",

};

module.exports = messages;
