const bcrypt = require("bcrypt");

const bcryptPassword = async (password) => {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error in bcryptPassword:", error);
    throw error; 
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error in comparePassword:", error);
    throw error;
  }
};

module.exports = { bcryptPassword, comparePassword };
