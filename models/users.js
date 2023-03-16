module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    facebook_id: {
      type: Sequelize.STRING,
    },
    google_id: {
      type: Sequelize.STRING,
    },
    apple_id: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: "user",
    },
    lastname: {
      type: Sequelize.STRING,
    },
    firstname: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    avatar_url: {
      type: Sequelize.TEXT('long'),
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    zip: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    security_question: {
      type: Sequelize.STRING,
    },
    security_answer: {
      type: Sequelize.STRING,
    },
    lat: {
      type: Sequelize.DECIMAL(10, 5),
      defaultValue: null
    },
    lng: {
      type: Sequelize.DECIMAL(10, 5),
      defaultValue: null
    },
    last_login: {
      type: Sequelize.DATE,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  });

  return User;
};
