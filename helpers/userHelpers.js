// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('../lib/db');
const db = new Pool(dbParams);


//CHECKS IF THE USER IS IN OUR DATABASE
const userExists = function(email) {

  return db.query(`
    SELECT *
    FROM users
    WHERE email = $1
    `, [email]
  )
    .then((output) => {
        console.log(output.rows[0])
        return output.rows[0];
    })
    .catch(err => console.error('query error', err.stack));
};

// CHECKS PASSWORD AGAINST EMAIL
const authenticateUser = function(incomingEmail, incomingPassword) {
  return db.query(
    `
    SELECT password
    FROM users
    WHERE email = $1
    `, [incomingEmail]
    ).then(output => {
      console.log(output.row[0])
      console.log(output.row[0] === incomingPassword)
      if(output.row[0] === incomingPassword) {
        return true
      }
    })
    .catch(err => console.error('query error', err.stack));

}

// FETCHES USER INFO SO WE CAN MAKE A COOKIE
const fetchUser = function(incomingEmail){
  // query database for user info
  db.query(
    `
    SELECT id, name, email
    FROM users
    WHERE email = $1
    `
  , [incomingEmail]
  ).then(output => {
      const fetchedUser = {
        id: output.rows[0].id,
        name: output.rows[0].name,
        email: output.rows[0].email,
      }
    }

  )

  // make an object that has user_id, name, and email in it

  return fetchedUser
}

const checkObjectKeyLength = function (obj) {
    for (const key in obj) {
      if(key.length < 1) {
        return true
      }
    }

    return false
}

// REGISTRATION ERROR FINDER FUNCTION
const registerTripmine = function(details) {
  let message = null;

  if (userExists(details.incomingEmail)) {
    message = `User with the email ${details.incomingEmail} already exists. Please enter a different one.`;
  } else if (
    checkObjectKeyLength(details)
  ) {
    message = `One or more fields are empty`;
  } else if (!details.incomingEmail.includes("@")) {
    message = "Improperly formatted email address.";
  }

  return message;

}

const addNewUser = function (details) {

  const newUser = {
    name: incomingName || null,
    email: details.incomingEmail,
    password: bcrypt.hashSync(details.incomingPassword, saltRounds),
  };

  return newUser;
};

module.exports = {
  authenticateUser,
  userExists,
  registerTripmine,
  addNewUser,
}


