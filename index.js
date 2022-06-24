const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");
const { init: initDB, Counter, userInfo, Message } = require("./db");

const router = new Router();

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

// 首页
router.get("/", async (ctx) => {
  ctx.body = homePage;
});


// 新增用户信息
router.post("/api/updatauserInfo", async (ctx) => {
  const { request } = ctx;
  let { user_info } = request.body;
  console.log("request======>", userInfo)

  const { user_name, gender, avatarUrl, phone_number, country, province, city } = user_info;


  await userInfo.updateOne({
    user_name, gender, avatarUrl, phone_number, country, province, city
  }).then(rel => {
    if (rel) {
      if (rel.modifiedCount > 0) {
        ctx.body = {
          code: 200,
          msg: '用户信息修改成功',

        }
      } else {
        userInfo.create();
        ctx.body = {
          code: 300,
          msg: '用户信息新增成功',
          rel
        }
      }
    }
  }).catch(err => {
    ctx.body = {
      code: 500,
      msg: '用户信息修改/新增时出现异常',
      err
    }
  });

  // // await userInfo.create();

  // ctx.body = {
  //   code: 200,
  //   data: await Counter.count(),
  // };
});

// 更新通知信息
router.post("/api/updataMessage", async (ctx) => {
  const { request } = ctx;
  const { title, message } = request.body;

  await userInfo.updateOne({
    title, message
  }).then(rel => {
    if (rel) {
      if (rel.modifiedCount > 0) {
        ctx.body = {
          code: 200,
          msg: '通知信息修改成功',

        }
      } else {
        userInfo.create();
        ctx.body = {
          code: 300,
          msg: '通知信息新增成功',
          rel
        }
      }
    }
  }).catch(err => {
    ctx.body = {
      code: 500,
      msg: '通知信息修改/新增时出现异常',
      err
    }
  });
});

// 获取通知信息
router.get("/api/getMessage", async (ctx) => {
  const result = {
    title: await Message.title(),
    message: await Message.message(),
  };

  ctx.body = {
    code: 200,
    data: result,
  };
});



// 更新计数
router.post("/api/count", async (ctx) => {
  const { request } = ctx;
  const { action } = request.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }

  ctx.body = {
    code: 0,
    data: await Counter.count(),
  };
});

// 获取计数
router.get("/api/count", async (ctx) => {
  const result = await Counter.count();

  ctx.body = {
    code: 0,
    data: result,
  };
});




//==============================================================
// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = ctx.request.headers["x-wx-openid"];
  }
});

const app = new Koa();
app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 80;
async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();
