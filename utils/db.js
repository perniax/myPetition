const spicedPg = require("spiced-pg");

//to run Heroku
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbuser, dbpass } = require("../secrets.json");
    db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/petition`);
}

exports.addSupporter = function(signature) {
    return db.query(
        `INSERT INTO petition (signature)
            VALUES($1)
            RETURNING id`,
        [signature]
    );
};

//now we require the signature, and pass signature as arg to check that is the correct cookie
//id=$1 cause we only have one argument on the [], so for securtiry has to go like that...
exports.getSignature = function(id) {
    return db.query(`SELECT signature FROM petition WHERE id = $1`, [id]);
    // .then(rows => {
    //     return rows;
    // });
};
//CHECK, was added , user_id on the SELECT and as a parameter of the function, and [];
// **signature and id where the user id=$1, the goes instead of the IF in login, instead of the cookieId....

exports.addSignature = function(signature, user_id) {
    return db.query(
        `INSERT INTO petition (signature, user_id)
        VALUES($1, $2)
        RETURNING id`,
        [signature, user_id]
    );
    // .then(({ rows }) => {
    //     return rows;
    // });
};

exports.getSupporter = function() {
    return db.query(`SELECT first,last FROM petition`).then(({ rows }) => {
        return rows;
    });
};

exports.addUser = function(first, last, email, password) {
    return db
        .query(
            `INSERT INTO users (first, last, email, password)
        VALUES($1, $2, $3, $4)
        RETURNING id`,
            [first, last, email, password]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addProfile = function(age, city, url, user_id) {
    return db
        .query(
            `INSERT INTO user_profiles (age, city, url, user_id)
VALUES($1, $2, $3, $4)
RETURNING id`,
            [age, city, url, user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getUser = function() {
    return db
        .query(
            `SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url FROM petition JOIN users ON petition.user_id = users.id JOIN user_profiles ON users.id = user_profiles.user_id`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getHashedPassword = function(email) {
    return db
        .query(`SELECT password, id FROM users WHERE email=$1`, [email])
        .then(({ rows }) => {
            return rows;
        });
};

exports.getProfile = function(user) {
    return db
        .query(
            `SELECT users.first, users.last, users.email, user_profiles.age, user_profiles.city, user_profiles.url FROM users JOIN user_profiles ON users.id = user_profiles.user_id WHERE users.id = $1`,
            [user]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getLocalSupporters = function(city) {
    return db
        .query(
            `SELECT users.first, users.last, user_profiles.age, user_profiles.url FROM petition JOIN users ON petition.user_id = users.id JOIN user_profiles ON users.id = user_profiles.user_id WHERE LOWER(user_profiles.city)=LOWER($1)`,
            [city]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.deleteSignature = function(user) {
    return db.query(`DELETE FROM petition WHERE user_id=$1`, [user]);
};
//*****

exports.addEditedProfile = function(age, city, url, user_id) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
VALUES($1, $2, $3, $4)
ON CONFLICT (user_id)
DO UPDATE SET age = $1, city = $2, url = $3`,
        [age, city, url, user_id]
    );
    // .then(({ rows }) => {
    //     return rows;
    // });
};

exports.editProfile = function(first, last, email, user_id) {
    return db.query(
        `UPDATE users SET first=$1, last=$2, email=$3
        WHERE users.id = $4`,
        [first || null, last || null, email || null, user_id || null]
    );
};

exports.editPassword = function(password, user_id) {
    return db.query(
        `UPDATE users SET password=$1
        WHERE users.id = $2`,
        [password || null, user_id || null]
    );
};
