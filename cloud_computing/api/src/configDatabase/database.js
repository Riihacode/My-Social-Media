import  { Sequelize } from "sequelize";

const db = new Sequelize(
    "sosial_media",
    "root",
    "", {
        host: "localhost",
        password: "",
        dialect: "mysql",
    }
);

const connectDB = async () => {
    try {
        await db.authenticate();
        console.log("Database connected successfully");
    } catch(error) {
        console.log("Database connection failed: ", error);
    }
}

export {
    db, 
    connectDB
};