const express = require("express");
const app = express();
const port = 3000;

//redis import
const redis = require("redis");
const redisClient = redis.createClient(6379, "127.0.0.1");

redisClient.connect();
redisClient.on("connect", function (err) {
  console.log("error in redis connection", err);
  if (err) throw new Error(err);
  console.log("Redis Connected");
});

app.get("/home", async (req, res) => {
  let keyName = "normalKey";
  let getCacheData = await redisClient.get(keyName);
  let result = {
    id: 12,
    name: "lucky",
  };

  let responseArray = "";

  if (getCacheData) {
    responseArray = JSON.parse(getCacheData);
    console.log("GET CACHE DATA");
  } else {
    console.log("SET CACHE DATA");
    redisClient.set(keyName, JSON.stringify(result), { EX: 30 });
    responseArray = result;
  }

  //##########Hash#######################
  //   let parentKey = "myFirst";
  //   let keyName = "normalKey";
  //   let getCacheData = await redisClient.hGet(parentKey, keyName);
  //##GEt all key of one parent
  //   let testData = await redisClient.hGetAll(parentKey);
  //   let result = {
  //     id: 12,
  //     name: "lucky",
  //   };

  //   let responseArray = "";

  //   if (getCacheData) {
  //     responseArray = JSON.parse(getCacheData);
  //     console.log("GET CACHE DATA");
  //   } else {
  //     console.log("SET CACHE DATA");
  //     redisClient.hSet(parentKey, keyName, JSON.stringify(result));
  //     responseArray = result;
  //   }


  //##DELETE KEy
  // redisClient.DEL(parentKey)

  res.status(200).json(responseArray);
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
