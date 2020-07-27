'use strict';

const {
  verifyPasswordLength, verifyPasswordStrength
} = require('./constraints');

module.exports.password = async (event, context) => {
  try {
    const {password} = event.pathParameters;
    await verifyPasswordLength(password);
    const {score} = await verifyPasswordStrength(password);
    return{
      statusCode: 200,
      body: JSON.stringify({
        message: 'Todo ok. El Password es Bueno',
        score: score
      })
    }
  } catch (error) {
    return{
      statusCode: 400,
      body: JSON.stringify({
        message: `Error: ${error.message}`,
        score: error.score
      })
    }
  }

};
