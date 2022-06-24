const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize("nodejs_demo", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

// 定义数据模型
const Counter = sequelize.define("Counter", {
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});
// 用户信息模型
const userInfo = sequelize.define("userInfo", {
  user_name: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  gender: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  avatarUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  phone_number: {
    type: DataTypes.INTEGER,
    defaultValue: '',
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  province: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
});
// 通知信息模型
const Message = sequelize.define("Message", {
  title: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  message: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
});

// 数据库初始化方法
async function init() {
  await Counter.sync({ alter: true });
  await userInfo.sync({ alter: true });
  await Message.sync({ alter: true });
}

// 导出初始化方法和模型
module.exports = {
  init,
  Counter, userInfo, Message
};
