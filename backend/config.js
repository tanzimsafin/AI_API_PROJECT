const saltRounds=process.env.saltRounds;
const MONGO_URL=process.env.MONGO_URL;
const JWT_SECRET_User=process.env.JWT_SECRET_User;
module.exports={
    saltRounds,
    MONGO_URL,
    JWT_SECRET_User
}