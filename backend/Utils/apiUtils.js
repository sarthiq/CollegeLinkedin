const jwt = require("jsonwebtoken");
const { DATABASE_SERVER_JWT_SECRET_KEY } = require("../importantInfo");


exports.signDatabaseServerJWT = (data = {}, expiresIn = '10m') => {
    const token = jwt.sign(data, DATABASE_SERVER_JWT_SECRET_KEY, { expiresIn });
    return token;
}



