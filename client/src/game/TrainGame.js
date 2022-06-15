import * as PIXI from "pixi.js";

let app;
let loader = PIXI.Loader.shared
let Application = PIXI.Application
let Container = PIXI.Container
let Graphics = PIXI.Graphics
let Sprite = PIXI.Sprite
let Text = PIXI.Text
let TextStyle = PIXI.TextStyle
let result = {}
result.text = "Вы не закончили игру"
result.attempt = 0

export const Init = () => {

  //Create a Pixi Application
  result.text = "Вы не закончили игру"
  result.attempt = 0
  app = new Application({
    width: 1233,
    height: 583,
    antialiasing: true,
    transparent: false,
    resolution: 1.2
  });
  app.renderer.backgroundColor = 0x8595a1;

  document.body.append(app.view);

  loader
      .add("../images/trainProblem.json")
      .load(setup)

  let state,
      redTrain,
      blueTrain,
      blueVan,
      redVan,
      redVan2,
      press1,
      press2,
      pressF,
      pressEnter,
      gameOver,
      lever,
      station,
      back,
      hedgehogL,
      hedgehogR,
      smoke1,
      smoke2,
      area,
      message,
      numStep,
      step,
      gameScene,
      answer,
      id;

  //Keys
  let empty = true
  let touch
  let train// T синий, F - красный
  let countBlue = 0
  let countRed = 0

  let positionBlueVan = 0
  let positionRedVan = 0
  let positionRedVan2 = 0

  let key = {}
  let key1 = true,
      key2 = true,
      key3 = true

  let FKey = {}
  let SKey = {}

  function setup() {
    gameScene = new Container();
    app.stage.addChild(gameScene);
    id = loader.resources['../images/trainProblem.json'].textures;

    //Area
    area = new Sprite(id["area.png"]);
    gameScene.addChild(area);
    //Lever
    lever = new Graphics()
    lever.drawRect(0, 0, 15, 55)
    lever.x = 380;
    lever.y = 271;
    gameScene.addChild(lever);
    //Back side
    back = new Graphics()
    back.drawRect(0, 0, 98, 35)
    back.x = 349
    back.y = 263
    gameScene.addChild(back);
    //Station
    station =  new Graphics()
    station.drawRect(0, 0, 85, 1)
    station.x = 607;
    station.y = 210;
    gameScene.addChild(station);

    //BlueVan
    blueVan = new Sprite(id["blueVan.png"]);
    blueVan.x = 170;
    blueVan.y = 263;
    gameScene.addChild(blueVan);

    //RedVan2
    redVan2 = new Sprite(id["redVan.png"]);
    redVan2.x = 712;
    redVan2.y = 263;
    gameScene.addChild(redVan2);

    //RedVan
    redVan = new Sprite(id["redVan.png"]);
    redVan.x = 626;
    redVan.y = 263;
    gameScene.addChild(redVan);


    //BlueTrain
    blueTrain = new Sprite(id["blueTrain.png"]);
    blueTrain.x = 64;
    blueTrain.y = 263;
    blueTrain.vx = 0;
    blueTrain.vy = 0;
    gameScene.addChild(blueTrain);

    //RedTrain
    redTrain = new Sprite(id["redTrain.png"]);
    redTrain.x = 524;
    redTrain.y = 263;
    redTrain.vx = 0;
    redTrain.vy = 0;
    gameScene.addChild(redTrain);

    smoke1 = new Sprite(id["smoke1.png"]);
    smoke2 = new Sprite(id["smoke2.png"]);
    smoke2.vy = 0.2;

    //КНОПКИ
    press1 = new Sprite(id["1.png"]);
    press1.x = blueTrain.x + 6;
    press1.y = blueTrain.y + 30;
    gameScene.addChild(press1);

    press2 = new Sprite(id["2.png"]);
    press2.x = redTrain.x + 6;
    press2.y = redTrain.y + 30;
    gameScene.addChild(press2);

    pressF = new Sprite(id["F.png"]);

    pressEnter = new Sprite(id["Enter.png"]);
    pressEnter.x = 380;
    pressEnter.y = 323;

    //Ежик
    hedgehogL = new Sprite(id["hedgehogL.png"]);
    hedgehogL.x = 60
    hedgehogL.y = 520
    hedgehogL.vx = 0.4
    hedgehogR = new Sprite(id["hedgehogR.png"]);
    hedgehogR.x = 873
    hedgehogR.y = 520
    hedgehogR.vx = -0.4

    let task = new Text("за наименьшее\n" +
    "количество шагов\nпоменяйте местами\n" +
        "красный и синий\n" +
        "поезда\n", {
      fontFamily: "Press Start 2P",
      fontSize: 25,
      fontVariant: 'small-caps',
      leading: 10,
      fill: "black"
    });
    task.x = 915;
    task.y = 80;
    gameScene.addChild(task);

    numStep = 0

    step = new Text("Шаги: " + numStep, {
      fontFamily: "Press Start 2P",
      fontSize: 27,
      //fontVariant: 'small-caps',
      leading: 10,
      fill: "black"
    });
    step.x = 935;
    step.y = 400;
    gameScene.addChild(step);

    message = new Text("Вы завершили", {
      fontFamily: "Press Start 2P",
      fontSize: 23,
      leading: 10,
      fill: "black"
    });
    message.x = 210;
    message.y = app.stage.height / 2 - 32;

    gameOver = new Sprite(id["gameOver.png"]);
    gameOver.x = 169;
    gameOver.y = 238;

    //Настройка нажатий на клавиатуру
    let left = keyboard(37),
        right = keyboard(39),
        blue = keyboard(49),
        red = keyboard(50),
        enter = keyboard(13),
        F = keyboard(70),
        space = keyboard(32);

    blue.release = function () {
      gameScene.addChild(smoke1)
      gameScene.addChild(smoke2)
      gameScene.addChild(blueTrain);
      gameScene.removeChild(press1);
      press2.x = redTrain.x + 6;
      press2.y = redTrain.y + 30;
      gameScene.addChild(press2);
      train = true
      //Left
      left.press = function () {
        if (train && !answer) {
          blueTrain.vx = -5
          blueTrain.vy = 0;
        }
        if (answer){
          blueTrain.vx = 0;
        }
      }
      left.release = function () {
        if (!right.isDown && blueTrain.vy === 0 && train) {
          blueTrain.vx = 0;
        }
      }


      //Right
      right.press = function () {
        if (train && !answer) {
          blueTrain.vx = 5
          blueTrain.vy = 0;
        }
        if (answer){
          blueTrain.vx = 0;
        }
      }
      right.release = function () {
        if (!left.isDown && blueTrain.vy === 0 && train) {
          blueTrain.vx = 0;
        }
      }
    }

    red.release = function () {
      gameScene.addChild(smoke1)
      gameScene.addChild(smoke2)
      gameScene.addChild(redTrain);
      gameScene.removeChild(press2);
      press1.x = blueTrain.x + 6;
      press1.y = blueTrain.y + 30;
      gameScene.addChild(press1);
      train = false

      //Left
      left.press = function () {
        if (!train && !answer) {
          redTrain.vx = -5;
          redTrain.vy = 0;
        }
        if (answer){
          redTrain.vx = 0;
        }
      }
      left.release = function () {
        if (!right.isDown && redTrain.vy === 0 && !train) {
          redTrain.vx = 0;
        }
      }


      //Right
      right.press = function () {
        if (!train && !answer) {
          redTrain.vx = 5;
          redTrain.vy = 0;
        }
        if (answer){
          redTrain.vx = 0;
        }
      }
      right.release = function () {
        if (!left.isDown && redTrain.vy === 0 && !train) {
          redTrain.vx = 0;
        }
      }
    }

    F.release = function () {
      if (train) {
        if (checkTouch(blueVan, blueTrain)) {
          //C
          FKey = fSetup(blueTrain, countBlue, blueVan, redVan, redVan2, positionBlueVan, positionRedVan, positionRedVan2)
          positionBlueVan = FKey.pos1
          positionRedVan = FKey.pos2
          positionRedVan2 = FKey.pos3
          countBlue = FKey.count
        } else if (checkTouch(redVan, blueTrain)) {
          //K
          FKey = fSetup(blueTrain, countBlue, redVan, blueVan, redVan2, positionRedVan, positionBlueVan, positionRedVan2)
          positionRedVan = FKey.pos1
          positionBlueVan = FKey.pos2
          positionRedVan2 = FKey.pos3
          countBlue = FKey.count
        } else if (checkTouch(redVan2, blueTrain)) {
          //K2
          FKey = fSetup(blueTrain, countBlue, redVan2, blueVan, redVan, positionRedVan2, positionBlueVan, positionRedVan)
          positionRedVan2 = FKey.pos1
          positionBlueVan = FKey.pos2
          positionRedVan = FKey.pos3
          countBlue = FKey.count
        }
      } else if (!train) {
        if (checkTouch(blueVan, redTrain)) {
          //C
          FKey = fSetup(redTrain, countRed, blueVan, redVan, redVan2, positionBlueVan, positionRedVan, positionRedVan2)
          positionBlueVan = FKey.pos1
          positionRedVan = FKey.pos2
          positionRedVan2 = FKey.pos3
          countRed = FKey.count
        } else if (checkTouch(redVan, redTrain)) {
          //K
          FKey = fSetup(redTrain, countRed, redVan, blueVan, redVan2, positionRedVan, positionBlueVan, positionRedVan2)
          positionRedVan = FKey.pos1
          positionBlueVan = FKey.pos2
          positionRedVan2 = FKey.pos3
          countRed = FKey.count
        } else if (checkTouch(redVan2, redTrain)) {
          //K2
          FKey = fSetup(redTrain, countRed, redVan2, blueVan, redVan, positionRedVan2, positionBlueVan, positionRedVan)
          positionRedVan2 = FKey.pos1
          positionBlueVan = FKey.pos2
          positionRedVan = FKey.pos3
          countRed = FKey.count
        }
      }
    }

    space.release = function () {
      if (train) {
        if (checkTouch(blueVan, blueTrain)) {
          SKey = spaceSetup(blueTrain, countBlue, blueVan, redVan, redVan2, positionBlueVan, positionRedVan, positionRedVan2)
          positionBlueVan = SKey.pos1
          positionRedVan = SKey.pos2
          positionRedVan2 = SKey.pos3
          countBlue = SKey.count

        } else
            //K
        if (checkTouch(redVan, blueTrain)) {
          SKey = spaceSetup(blueTrain, countBlue, redVan, blueVan, redVan2, positionRedVan, positionBlueVan, positionRedVan2)
          positionRedVan = SKey.pos1
          positionBlueVan = SKey.pos2
          positionRedVan2 = SKey.pos3
          countBlue = SKey.count
        } else
            //K2
        if (checkTouch(redVan2, blueTrain)) {
          SKey = spaceSetup(blueTrain, countBlue, redVan2, blueVan, redVan, positionRedVan2, positionBlueVan, positionRedVan)
          positionRedVan2 = SKey.pos1
          positionBlueVan = SKey.pos2
          positionRedVan = SKey.pos3
          countBlue = SKey.count
        }
      } else if (!train) {
        if (checkTouch(blueVan, redTrain)) {
          SKey = spaceSetup(redTrain, countRed, blueVan, redVan, redVan2, positionBlueVan, positionRedVan, positionRedVan2)
          positionBlueVan = SKey.pos1
          positionRedVan = SKey.pos2
          positionRedVan2 = SKey.pos3
          countRed = SKey.count
        } else
            //K
        if (checkTouch(redVan, redTrain)) {
          SKey = spaceSetup(redTrain, countRed, redVan, blueVan, redVan2, positionRedVan, positionBlueVan, positionRedVan2)
          positionRedVan = SKey.pos1
          positionBlueVan = SKey.pos2
          positionRedVan2 = SKey.pos3
          countRed = SKey.count
        } else
            //K2
        if (checkTouch(redVan2, redTrain)) {
          SKey = spaceSetup(redTrain, countRed, redVan2, blueVan, redVan, positionRedVan2, positionBlueVan, positionRedVan)
          positionRedVan2 = SKey.pos1
          positionBlueVan = SKey.pos2
          positionRedVan = SKey.pos3
          countRed = SKey.count
        }
      }
    }


    enter.release = function () {
      if (train) {
        if (checkTouch(blueTrain, lever) && empty && !checkTouch(blueVan, blueTrain) && !checkTouch(redVan, blueTrain) && !checkTouch(redVan2, blueTrain) && countBlue === 0) {
          if (!checkTouch(redTrain, back) && !checkTouch(redVan, back) && !checkTouch(redVan2, back)  && !checkTouch(blueVan, back)) {
            blueTrain.x = station.x - 29
            blueTrain.y = station.y - 18
            empty = false
            numStep++
          }
        } else if (touch && checkTouch(blueTrain, station) && countBlue === 0) {

          blueTrain.x = 349
          blueTrain.y = lever.y - 8
          empty = true
          numStep++
        } else if (key1 || key2 || key3) {
          if (key1) {
            key = enterSetup(blueTrain, countBlue, blueVan, redVan, redVan2, positionBlueVan)
            positionBlueVan = key.pos
            key1 = key.k
            countBlue = key.count
            numStep++
          } else if (key2) {
            key = enterSetup(blueTrain, countBlue, redVan, blueVan, redVan2, positionRedVan)
            positionRedVan = key.pos
            key2 = key.k
            countBlue = key.count
            numStep++
          } else if (key3) {
            key = enterSetup(blueTrain, countBlue, redVan2, blueVan, redVan, positionRedVan2)
            positionRedVan2 = key.pos
            key3 = key.k
            countBlue = key.count
            numStep++
          }
        }
      } else if (!train) {
        if (checkTouch(redTrain, lever) && empty && !checkTouch(blueVan, redTrain) && !checkTouch(redVan, redTrain) && !checkTouch(redVan2, redTrain) && countRed === 0) {
          if (!checkTouch(blueTrain, back) && !checkTouch(redVan, back) && !checkTouch(redVan2, back)  && !checkTouch(blueVan, back)) {
            redTrain.x = station.x - 29
            redTrain.y = station.y - 18
            empty = false
            numStep++
          }
        } else if (touch && checkTouch(redTrain, station) && countRed === 0) {

          redTrain.x = 349
          redTrain.y = lever.y - 8
          empty = true
          numStep++
        } else if (key1 || key2 || key3) {
          if (key1) {
            key = enterSetup(redTrain, countRed, blueVan, redVan, redVan2, positionBlueVan)
            positionBlueVan = key.pos
            key1 = key.k
            countRed = key.count
            numStep++
          } else if (key2) {
            key = enterSetup(redTrain, countRed, redVan, blueVan, redVan2, positionRedVan)
            positionRedVan = key.pos
            key2 = key.k
            countRed = key.count
            numStep++
          } else if (key3) {
            key = enterSetup(redTrain, countRed, redVan2, blueVan, redVan, positionRedVan2)
            positionRedVan2 = key.pos
            key3 = key.k
            countRed = key.count
            numStep++
          }
        }
      }
    }


    //Set the game state
    state = play;

    //Start the game loop
    app.ticker.add((delta) => gameLoop(delta));
  }

  function gameLoop(delta) {
    //Update the current game state:
    state(delta);
  }

  function play() {
    result.text = "Вы не закончили игру"
    result.attempt = 0
    answer = empty && redTrain.x < redVan.x && redTrain.x < redVan2.x && redVan.x < blueTrain.x && redVan.x < 355 && redVan2.x < 355 && 650 < blueTrain.x && blueTrain.x < blueVan.x
    blueTrain.x += blueTrain.vx;
    blueTrain.y += blueTrain.vy;

    redTrain.x += redTrain.vx;
    redTrain.y += redTrain.vy;


    smoke2.y += smoke2.vy;

    let contSmoke2 = contain(smoke2, { x: smoke1.x - 1, y: smoke1.y - 6, width: smoke1.x + smoke1.width+1, height: smoke1.y + 40});

    if (contSmoke2 === "top" || contSmoke2 === "bottom") {
      smoke2.vy *= -1;
    }

    //Ежик
    if (hedgehogL.x < hedgehogR.x) {
        gameScene.addChild(hedgehogL)
        hedgehogL.x += hedgehogL.vx;
      if (hedgehogL.x >= 873) {
        gameScene.removeChild(hedgehogL)
      }
      } else if (hedgehogR.x < hedgehogL.x) {
      gameScene.addChild(hedgehogR)
      hedgehogR.x += hedgehogR.vx;
      if (hedgehogR.x <= 55) {
        gameScene.removeChild(hedgehogR)
        hedgehogL.x = 60
        hedgehogR.x = 873
      }
    }

    //если есть место для возвращения вагона/поезда со станции
    touch = !checkTouch(blueTrain, back) && !checkTouch(redTrain, back) && !checkTouch(blueVan, back) && !checkTouch(redVan, back) && !checkTouch(redVan2, back);

    if (train) {
      //Раставление границ
      limit(blueTrain, redTrain, countBlue, blueVan, redVan, redVan2, positionBlueVan, positionRedVan, positionRedVan2)

      //Дым
      contain(smoke1, { x: blueTrain.x + 16, y: blueTrain.y - 43, width: blueTrain.x + blueTrain.width - 6, height: blueTrain.y + 2});
      smoke2.x = smoke1.x - 1

      // //Удаление F
      deleteF(blueTrain, countBlue)

      //СКК2
      join(blueTrain, countBlue, blueVan, redVan, redVan2, positionBlueVan, positionRedVan, positionRedVan2)
      //СК2К
      join(blueTrain, countBlue, blueVan, redVan2, redVan, positionBlueVan, positionRedVan2, positionRedVan)
      //КСК2
      join(blueTrain, countBlue, redVan, blueVan, redVan2, positionRedVan, positionBlueVan, positionRedVan2)
      //КК2С
      join(blueTrain, countBlue, redVan, redVan2, blueVan, positionRedVan, positionRedVan2, positionBlueVan)
      //К2СК
      join(blueTrain, countBlue, redVan2, blueVan, redVan, positionRedVan2, positionBlueVan, positionRedVan)
      //К2КС
      join(blueTrain, countBlue, redVan2, redVan, blueVan, positionRedVan2, positionRedVan, positionBlueVan)

      //enter

      // отправить поезд
      if (checkTouch(blueTrain, lever) && empty && !checkTouch(blueVan, blueTrain) && !checkTouch(redVan, blueTrain) && !checkTouch(redVan2, blueTrain) && countBlue === 0) {
        if (!checkTouch(redTrain, back) && !checkTouch(redVan, back) && !checkTouch(redVan2, back)  && !checkTouch(blueVan, back))
          gameScene.addChild(pressEnter)

        //забрать поезд
      } else if (checkTouch(blueTrain, station) && countBlue === 0) {
        contain(blueTrain, {x: station.x - 29, y: 163, width: station.x + blueTrain.width - 30, height: 250})
        contain(smoke1, { x: 593, y: blueTrain.y - 43, width: 615, height: blueTrain.y + 2});
        smoke2.x = smoke1.x - 1
        if (touch)
          gameScene.addChild(pressEnter)


      } else if (key1 || key2 || key3) {
        if (key1) {
          key1 = enterPlay(blueTrain, countBlue, blueVan, redVan, redVan2, positionBlueVan)
        } else if (key2) {
          key2 = enterPlay(blueTrain, countBlue, redVan, blueVan, redVan2, positionRedVan)

        } else if (key3) {
          key3 = enterPlay(blueTrain, countBlue, redVan2, blueVan, redVan, positionRedVan2)
        }

      } else {//if (!key1 && !key2 && !key3) {
        //gameScene.removeChild(pressEnter);
        if (!key1 && !key2 && !key3) {
          key1 = true
          key2 = true
          key3 = true
        }
      }

    } else if (!train) {


      //Раставление границ
      limit(redTrain, blueTrain, countRed, blueVan, redVan, redVan2, positionBlueVan, positionRedVan, positionRedVan2)

      //Дым
      contain(smoke1, { x: redTrain.x + 16, y: redTrain.y - 43, width: redTrain.x + redTrain.width - 6, height: redTrain.y + 2});
      smoke2.x = smoke1.x - 1

      // //Удаление F
      deleteF(redTrain, countRed)

      //СКК2
      join(redTrain, countRed, blueVan, redVan, redVan2, positionBlueVan, positionRedVan, positionRedVan2)
      //СК2К
      join(redTrain, countRed, blueVan, redVan2, redVan, positionBlueVan, positionRedVan2, positionRedVan)
      //КСК2
      join(redTrain, countRed, redVan, blueVan, redVan2, positionRedVan, positionBlueVan, positionRedVan2)
      //КК2С
      join(redTrain, countRed, redVan, redVan2, blueVan, positionRedVan, positionRedVan2, positionBlueVan)
      //К2СК
      join(redTrain, countRed, redVan2, blueVan, redVan, positionRedVan2, positionBlueVan, positionRedVan)
      //К2КС
      join(redTrain, countRed, redVan2, redVan, blueVan, positionRedVan2, positionRedVan, positionBlueVan)

      //enter

      // отправить поезд
      if (checkTouch(redTrain, lever) && empty && !checkTouch(blueVan, redTrain) && !checkTouch(redVan, redTrain) && !checkTouch(redVan2, redTrain) && countRed === 0) {
        if (!checkTouch(blueTrain, back) && !checkTouch(redVan, back) && !checkTouch(redVan2, back)  && !checkTouch(blueVan, back))
          gameScene.addChild(pressEnter)

        //забрать поезд
      } else if (checkTouch(redTrain, station) && countRed === 0) {
          contain(redTrain, {x: station.x - 29, y: 163, width: station.x + redTrain.width - 30, height: 250})
          contain(smoke1, { x: 593, y: redTrain.y - 43, width: 615, height: redTrain.y + 2});
          smoke2.x = smoke1.x - 1
          if (touch)
            gameScene.addChild(pressEnter)

      } else if (key1 || key2 || key3) {
        if (key1) {
          key1 = enterPlay(redTrain, countRed, blueVan, redVan, redVan2, positionBlueVan)
        } else if (key2) {
          key2 = enterPlay(redTrain, countRed, redVan, blueVan, redVan2, positionRedVan)
        } else if (key3) {
          key3 = enterPlay(redTrain, countRed, redVan2, blueVan, redVan, positionRedVan2)
        }
      } else {//if (!key1 && !key2 && !key3) {
        //gameScene.removeChild(pressEnter);
        if (!key1 && !key2 && !key3) {
          key1 = true
          key2 = true
          key3 = true
        }
      }

    }
    step.text = "Шаги: " + numStep

    if (answer) {

      if (numStep <= 4) {
        message.text = "Вы завершили за " + numStep + " шага"
        result.text = "Вы завершили за " + numStep + " шага"
        result.attempt = numStep
      } else if (numStep >= 5) {
        message.text = "Вы завершили за " + numStep + " шагов"
        result.text = "Вы завершили за " + numStep + " шагов"
        result.attempt = numStep
      }
      gameScene.addChild(gameOver)
      gameScene.addChild(message)
    }
  }

  /* Helper functions */

  function enterSetup(Train, countTrain, Van1, Van2, Van3, positionVan) {
    //добавить if train
    let key = {pos: positionVan, k: true, count: countTrain}

    //Синий
    if (checkTouch(Van1, lever) && empty && key.count === 1 && key.pos === 1) {
      gameScene.removeChild(pressEnter)
      Van1.x = station.x - 17
      Van1.y = station.y - 18
      key.count--
      key.pos = 0
      empty = false
    } else if (checkTouch(Van1, lever) && empty && key.count === 2 && key.pos === 2) {
      gameScene.removeChild(pressEnter)
      Van1.x = station.x - 17
      Van1.y = station.y - 18
      key.pos = 0
      key.count--

      empty = false
    } else if (checkTouch(Van1, lever) && empty && key.count === 3 && key.pos === 3) {
      gameScene.removeChild(pressEnter)
      Van1.x = station.x - 17
      Van1.y = station.y - 18
      key.count--
      key.pos = 0
      empty = false

      //забирание когда 0 прицеплено
    } else if (checkTouch(Train, lever) && checkTouch(Van1, station) && key.count === 0 && key.pos === 0 && touch) {
      gameScene.removeChild(pressEnter)
      Van1.x = Train.x + 101
      Van1.y = Train.y
      empty = true

      //забирание когда 1 прицеплен
      //если 1 красный
    } else if (checkTouch(Van2, lever) && checkTouch(Van1, station) && key.count === 1 && key.pos === 0 && touch) {
      gameScene.removeChild(pressEnter)
      Van1.x = Train.x + Train.width + Van2.width - 20
      Van1.y = Train.y
      empty = true
      //если 1 красный2
    } else if (checkTouch(Van3, lever) && checkTouch(Van1, station) && key.count === 1 && key.pos === 0 && touch) {
      gameScene.removeChild(pressEnter)
      Van1.x = Train.x + Train.width + Van3.width - 20
      Van1.y = Train.y
      empty = true

      //забирание когда 2 прицеплено
      //КК2
    } else if (checkTouch(Van2, Train) && checkTouch(Van3, lever) && checkTouch(Van1, station) && key.count === 2 && key.pos === 0 && touch) {
      gameScene.removeChild(pressEnter)
      Van1.x = Train.x + Train.width + Van2.width + Van3.width - 30
      Van1.y = Train.y
      empty = true
      //K2K
    } else if (checkTouch(Van3, Train) && checkTouch(Van2, lever) && checkTouch(Van1, station) && key.count === 2 && key.pos === 0 && touch) {
      gameScene.removeChild(pressEnter)
      Van1.x = Train.x + Train.width + Van3.width + Van2.width - 30
      Van1.y = Train.y
      empty = true
    } else key.k = false
    return key
  }


  function enterPlay(Train, countTrain, Van1, Van2, Van3, positionVan) {
    //добавить if train
    let key = true
    //Синий
    if (checkTouch(Van1, lever) && empty && countTrain === 1 && positionVan === 1) {
      gameScene.addChild(pressEnter)
    } else if (checkTouch(Van1, lever) && empty && countTrain === 2 && positionVan === 2) {
      gameScene.addChild(pressEnter)

    } else if (checkTouch(Van1, lever) && empty && countTrain === 3 && positionVan === 3) {
      gameScene.addChild(pressEnter)

      //забирание когда 0 прицеплено
    } else if (checkTouch(Train, lever) && checkTouch(Van1, station) && countTrain === 0 && positionVan === 0) {
      back.x = Train.x + Train.width + 1
      if (touch)
        gameScene.addChild(pressEnter)
      else gameScene.removeChild(pressEnter);

      //забирание когда 1 прицеплен
      //если 1 красный
    } else if (checkTouch(Van2, lever) && checkTouch(Van1, station) && countTrain === 1 && positionVan === 0) {
      back.x = Van2.x + Van2.width + 1
      if (touch)
        gameScene.addChild(pressEnter)
      else gameScene.removeChild(pressEnter);
      //если 1 красный2
    } else if (checkTouch(Van3, lever) && checkTouch(Van1, station) && countTrain === 1 && positionVan === 0) {
      back.x = Van3.x + Van3.width + 1
      if (touch)
        gameScene.addChild(pressEnter)
      else gameScene.removeChild(pressEnter);

      //забирание когда 2 прицеплено
      //КК2
    } else if (checkTouch(Van2, Train) && checkTouch(Van3, lever) && checkTouch(Van1, station) && countTrain === 2 && positionVan === 0) {
      back.x = Van3.x + Van3.width + 1
      if (touch)
        gameScene.addChild(pressEnter)
      else gameScene.removeChild(pressEnter);
      //K2K
    } else if (checkTouch(Van3, Train) && checkTouch(Van2, lever) && checkTouch(Van1, station) && countTrain === 2 && positionVan === 0) {
      back.x = Van2.x + Van2.width + 1
      if (touch)
        gameScene.addChild(pressEnter)
      else gameScene.removeChild(pressEnter);
    } else {
      back.x = 349
      gameScene.removeChild(pressEnter);
      key = false
    }

    return key
  }

///ПЕРЕМЕЩЕНИЯ ПОЕЗДОВ
  function limit(train1, train2, count, van1, van2, van3, pos1, pos2, pos3) {
    if (empty) {
      if (train1.x < train2.x) {
        // 1П 2П ....
        if (count === 0 && van1.x > train2.x && van2.x > train2.x && van3.x > train2.x) {
          contain(train1, {x: 60, y: 263, width: train2.x - 2, height: 296});
        } else {
          // 1П _ 2П ...
          t1_t2__(count, train1, van1, train2, van2, van3, pos1)
          t1_t2__(count, train1, van2, train2, van1, van3, pos1)
          t1_t2__(count, train1, van3, train2, van2, van1, pos1)

          // 1П _ _ 2П _
          t1__t2_(count, train1, van1, van2, train2, van3, pos1, pos2)
          t1__t2_(count, train1, van2, van1, train2, van3, pos2, pos1)
          t1__t2_(count, train1, van3, van2, train2, van1, pos3, pos2)
          t1__t2_(count, train1, van1, van3, train2, van2, pos1, pos3)
          t1__t2_(count, train1, van2, van3, train2, van1, pos2, pos3)
          t1__t2_(count, train1, van3, van1, train2, van2, pos3, pos1)

          // 1П _ _ _ 2П
          t1___t2(count, train1, van1, van2, van3, train2, pos1, pos2, pos3)
          t1___t2(count, train1, van2, van1, van3, train2, pos2, pos1, pos3)
          t1___t2(count, train1, van3, van2, van1, train2, pos3, pos2, pos1)
          t1___t2(count, train1, van1, van3, van2, train2, pos1, pos3, pos2)
          t1___t2(count, train1, van2, van3, van1, train2, pos2, pos3, pos1)
          t1___t2(count, train1, van3, van1, van2, train2, pos3, pos1, pos2)
        }


      } else if (train1.x > train2.x) {


        // 2П 1П _ _ _
        t2t1___(count, train2, train1, van1, van2, van3, pos1, pos2, pos3)
        t2t1___(count, train2, train1, van1, van3, van2, pos1, pos3, pos2)
        t2t1___(count, train2, train1, van2, van1, van3, pos2, pos1, pos3)
        t2t1___(count, train2, train1, van2, van3, van1, pos2, pos3, pos1)
        t2t1___(count, train2, train1, van3, van1, van2, pos3, pos1, pos2)
        t2t1___(count, train2, train1, van3, van2, van1, pos3, pos2, pos1)

        // 2П _ 1П _ _
        t2_t1__(count, train2, van1, train1, van2, van3, pos2, pos3)
        t2_t1__(count, train2, van1, train1, van3, van2, pos3, pos2)
        t2_t1__(count, train2, van2, train1, van1, van3, pos1, pos3)
        t2_t1__(count, train2, van2, train1, van3, van1, pos3, pos1)
        t2_t1__(count, train2, van3, train1, van1, van2, pos1, pos2)
        t2_t1__(count, train2, van3, train1, van2, van1, pos2, pos1)

        // 2П _ _ 1П _
        t2__t1_(count, train2, van1, van2, train1, van3, pos3)
        t2__t1_(count, train2, van1, van3, train1, van2, pos2)
        t2__t1_(count, train2, van2, van1, train1, van3, pos3)
        t2__t1_(count, train2, van2, van3, train1, van1, pos1)
        t2__t1_(count, train2, van3, van1, train1, van2, pos2)
        t2__t1_(count, train2, van3, van2, train1, van1, pos1)

        // 2П _ _ _ 1П
        t2___t1(count, train2, van1, van2, van3, train1)
        t2___t1(count, train2, van1, van3, van2, train1)
        t2___t1(count, train2, van3, van2, van1, train1)

      }
    } else if (!empty) {

      //если C вагон на станции
      limitVanStation(van1, train1, count, train2, van2, van3, pos2, pos3)
      //если К вагон на станции
      limitVanStation(van2, train1, count, train2, van1, van3, pos1, pos3)
      //если К2 вагон на станции
      limitVanStation(van3, train1, count, train2, van2, van1, pos2, pos1)

      //если 2П на станции
      if (checkTouch(station, train2)) {
        //1П _ _ _
        t1___(count, train1, van1, van2, van3, pos1, pos2, pos3)
        t1___(count, train1, van1, van3, van2, pos1, pos3, pos2)
        t1___(count, train1, van2, van1, van3, pos2, pos1, pos3)
        t1___(count, train1, van2, van3, van1, pos2, pos3, pos1)
        t1___(count, train1, van3, van1, van2, pos3, pos1, pos2)
        t1___(count, train1, van3, van2, van1, pos3, pos2, pos1)
        //_ 1П _ _
        _t1__(count, van1, train1, van2, van3, pos2, pos3)
        _t1__(count, van1, train1, van3, van2, pos3, pos2)
        _t1__(count, van2, train1, van1, van3, pos1, pos3)
        _t1__(count, van2, train1, van3, van1, pos3, pos1)
        _t1__(count, van3, train1, van1, van2, pos1, pos2)
        _t1__(count, van3, train1, van2, van1, pos2, pos1)
        //_ _ 1П _
        __t1_(count, van1, van2, train1, van3, pos3)
        __t1_(count, van1, van3, train1, van2, pos2)
        __t1_(count, van2, van1, train1, van3, pos3)
        __t1_(count, van2, van3, train1, van1, pos1)
        __t1_(count, van3, van1, train1, van2, pos2)
        __t1_(count, van3, van2, train1, van1, pos1)
        //_ _ _ 1П
        ___t1(van1, van2, van3, train1)
        ___t1(van1, van3, van2, train1)
        ___t1(van3, van2, van1, train1)
      }
    }
    smoke1.x = train1.x + 16
    smoke1.y = train1.y - 43
  }
  function t1_t2__(count, train1, van1, train2, van2, van3, pos1) {
    if (train1.x < van1.x && van1.x < train2.x && train2.x < van2.x && train2.x < van3.x)
        //1П С 2П ...
      if (count === 0)
        contain(train1, {x: 60, y: 263, width: van1.x + 10, height: 296});

      //1П_С 2П ...
      else if (count === 1 && pos1 === 1)
        contain(train1, {x: 60, y: 263, width: train2.x - van1.width + 10, height: 296});
  }

  function t1__t2_(count, train1, van1, van2, train2, van3, pos1, pos2) {
    if (train1.x < van1.x && van1.x < van2.x && van2.x < train2.x && train2.x < van3.x)
        // 1П С ...
      if (count === 0)
        contain(train1, {x: 60, y: 263, width: van1.x + 10, height: 296});
      // 1П_С K ...
      else if (count === 1 && pos1 === 1)
        contain(train1, {x: 60, y: 263, width: van2.x - van1.width + 20, height: 296});
      // 1П_С_K 2П К2
      else if (count === 2 && pos1 === 1 && pos2 === 2)
        contain(train1, {x: 60, y: 263, width: train2.x - van1.width - van2.width + 20, height: 296});
  }

  function t1___t2(count, train1, van1, van2, van3, train2, pos1, pos2, pos3) {
    // 1П С К К2 2П
    if (train1.x < van1.x && van1.x < van2.x && van2.x < van3.x && van3.x < train2.x)
      // 1П С К К2 2П
    //{console.log(count)
      if (count === 0)
        contain(train1, {x: 60, y: 263, width: van1.x + 10, height: 296});
      // 1П_С К К2 2П
      else if (count === 1 && pos1 === 1)
        contain(train1, {x: 60, y: 263, width: van2.x - van1.width + 20, height: 296});
      // 1П_С_К К2 2П
      else if (count === 2 && pos1 === 1 && pos2 === 2)
        contain(train1, {x: 60, y: 263, width: van3.x - van1.width - van2.width + 30, height: 296});
      // 1П_С_К_К2 2П
      else if (count === 3 && pos1 === 1 && pos2 === 2 && pos3 === 3)
        contain(train1, {x: 60, y: 263, width: train2.x - van1.width - van2.width - van3.width + 30, height: 296});
  }

  function t2t1___ (count, train2, train1, van1, van2, van3, pos1, pos2, pos3) {
    // 2П 1П С К К2
    if (train1.x < van1.x && van1.x < van2.x && van2.x < van3.x) {
      // 2П 1П С К К2
      if (count === 0)
        contain(train1, {x: train2.x + train2.width + 2, y: 263, width: van1.x + 10, height: 296});
      // 2П 1П_С К К2
      else if (count === 1 && pos1 === 1)
        contain(train1, {x: train2.x + train2.width + 2, y: 263, width: van2.x - van1.width + 20, height: 296});
      // 2П 1П_С_К К2
      else if (count === 2 && pos1 === 1 && pos2 === 2)
        contain(train1, {x: train2.x + train2.width + 2, y: 263, width: van3.x - van1.width - van2.width + 30, height: 296});
      // 2П 1П_С_К_К2
      else if (count === 3 && pos1 === 1 && pos2 === 2 && pos3 === 3)
        contain(train1, {x: train2.x + train2.width + 2, y: 263, width: 617, height: 296});
    }
  }

  function t2_t1__(count, train2, van1, train1, van2, van3, pos2, pos3) {
    if (train2.x < van1.x && van1.x < train1.x && train1.x < van2.x && van2.x < van3.x)
        // 2П C 1П K K2
      if (count === 0)
        contain(train1, {x: van1.x + van1.width + 1, y: 263, width: van2.x + 10, height: 296});
      // 2П C 1П_K K2
      else if (count === 1 && pos2 === 1)
        contain(train1, {x: van1.x + van1.width + 1, y: 263, width: van3.x - van2.width + 20, height: 296});
      // 2П C 1П_K K2
      else if (count === 2 && pos2 === 1 && pos3 === 2)
        contain(train1, {x: van1.x + van1.width + 1, y: 263, width: 704, height: 296});
  }

  function t2__t1_(count, train2, van1, van2, train1, van3, pos3) {
    if (train2.x < van1.x && van1.x < van2.x && van2.x < train1.x && train1.x < van3.x)
        // 2П С К 1П К2
      if (count === 0)
        contain(train1, {x: van2.x + van2.width + 1, y: 263, width: van3.x + 10, height: 296});
      // 2П С К 1П К2
      else if (count === 1 && pos3 === 1)
        contain(train1, {x: van2.x + van2.width + 1, y: 263, width: 793, height: 296});
  }

  function t2___t1(count, train2, van3, van2, van1, train1) {
    // 2П ... C 1П
    if (train2.x < van1.x && van2.x < van1.x && van3.x < van1.x && van1.x < train1.x)
      contain(train1, {x: van1.x + van1.width + 1, y: 263, width: 876, height: 296});
  }

  //если вагон на станции
  function limitVanStation(van1, train1, count, train2, van2, van3, pos2, pos3) {
    if (checkTouch(station, van1)) {
      //1П 2П К К2
      if (train1.x < train2.x && van2.x > train2.x && van3.x > train2.x)
        contain(train1, {x: 60, y: 263, width: train2.x - 2, height: 296});
      else {
        //1П К 2П К2
        t1_t2_(count, train1, van2, train2, van3, pos2)
        t1_t2_(count, train1, van3, train2, van2, pos3)

        //1П К К2 2П
        t1__t2(count, train1, van2, van3, train2, pos2, pos3)
        t1__t2(count, train1, van3, van2, train2, pos3, pos2)

        //2П 1П К К2
        t2t1__(count, train2, train1, van2, van3, pos2, pos3)
        t2t1__(count, train2, train1, van3, van2, pos3, pos2)

        //2П К 1П К2
        t2_t1_(count, train2, van2, train1, van3, pos3)
        t2_t1_(count, train2, van3, train1, van2, pos2)

        //2П К К2 1П
        if (train2.x < van2.x && van2.x < van3.x && van3.x < train1.x)
          contain(train1, {x: van3.x + van3.width + 1, y: 263, width: 876, height: 296});
        //2П К2 К 1П
        if (train2.x < van3.x && van3.x < van2.x && van2.x < train1.x)
          contain(train1, {x: van2.x + van2.width + 1, y: 263, width: 876, height: 296});
      }
    }
  }

  function t1_t2_(count, train1, van2, train2, van3, pos2) {
    if (train1.x < van2.x && van2.x < train2.x && train2.x < van3.x)
        //1П К 2П К2
      if (count === 0)
        contain(train1, {x: 60, y: 263, width: van2.x + 10, height: 296});

      //1П_К 2П К2
      else if (count === 1 && pos2 === 1)
        contain(train1, {x: 60, y: 263, width: train2.x - van2.width + 10, height: 296});
  }

  function t1__t2(count, train1, van2, van3, train2, pos2, pos3) {
    if (train1.x < van2.x && van2.x < van3.x && van3.x < train2.x)
        //1П К К2 2П
      if (count === 0)
        contain(train1, {x: 60, y: 263, width: van2.x + 10, height: 296});
      //1П_К К2 2П
      else if (count === 1 && pos2 === 1)
        contain(train1, {x: 60, y: 263, width: van3.x - van2.width + 20, height: 296});
      //1П_К_К2 2П
      else if (count === 2 && pos2 === 1 && pos3 === 2)
        contain(train1, {x: 60, y: 263, width: train2.x - van2.width - van3.width + 20, height: 296});
  }

  function t2t1__(count, train2, train1, van2, van3, pos2, pos3) {
    if (train2.x < train1.x && train1.x < van2.x && van2.x < van3.x )
      // 2П 1П С К К2
      if (count === 0)
        contain(train1, {x: train2.x + train2.width + 2, y: 263, width: van2.x + 10, height: 296});
      // 2П 1П_К К2
      else if (count === 1 && pos2 === 1)
        contain(train1, {x: train2.x + train2.width + 2, y: 263, width: van3.x - van2.width + 20, height: 296});
      // 2П 1П_К_К2
      else if (count === 2 && pos2 === 1 && pos3 === 2)
        contain(train1, {x: train2.x + train2.width + 2, y: 263, width: 704, height: 296});
    }

function t2_t1_(count, train2, van2, train1, van3, pos3) {
  if (train2.x < van2.x && van2.x < train1.x && train1.x < van3.x)
      // 2П К 1П К2
    if (count === 0)
      contain(train1, {x: van2.x + van2.width + 1, y: 263, width: van3.x + 10, height: 296});
    // 2П К 1П_К2
    else if (count === 1 && pos3 === 1)
      contain(train1, {x: van2.x + van2.width + 1, y: 263, width: 793, height: 296});
}

  function t1___(count, train1, van1, van2, van3, pos1, pos2, pos3) {
    if (train1.x < van1.x && van1.x < van2.x && van2.x < van3.x)
      // 1П С К К2
      if (count === 0)
        contain(train1, {x: 60, y: 263, width: van1.x + 10, height: 296});
      // 1П_С К К2
      else if (count === 1 && pos1 === 1)
        contain(train1, {x: 60, y: 263, width: van2.x - van1.width + 20, height: 296});
      // 1П_С_К К2
      else if (count === 2 && pos1 === 1 && pos2 === 2)
        contain(train1, {x: 60, y: 263, width: van3.x - van1.width - van2.width + 30, height: 296});
      // 1П_С_К_К2
      else if (count === 3 && pos1 === 1 && pos2 === 2 && pos3 === 3)
        contain(train1, {x: 60, y: 263, width: 617, height: 296});
  }

  function _t1__(count, van1, train1, van2, van3, pos2, pos3) {
    if (van1.x < train1.x && train1.x < van2.x && van2.x < van3.x)
        // C 1П K K2
      if (count === 0)
        contain(train1, {x: van1.x + van1.width + 1, y: 263, width: van2.x + 10, height: 296});
      // C 1П_K K2
      else if (count === 1 && pos2 === 1)
        contain(train1, {x: van1.x + van1.width + 1, y: 263, width: van3.x - van2.width + 20, height: 296});
      // C 1П_K K2
      else if (count === 2 && pos2 === 1 && pos3 === 2)
        contain(train1, {x: van1.x + van1.width + 1, y: 263, width: 704, height: 296});
  }

  function __t1_(count, van1, van2, train1, van3, pos3) {
    if (van1.x < van2.x && van2.x < train1.x && train1.x < van3.x)
        // С К 1П К2
      if (count === 0)
        contain(train1, {x: van2.x + van2.width + 1, y: 263, width: van3.x + 10, height: 296});
      // С К 1П К2
      else if (count === 1 && pos3 === 1)
        contain(train1, {x: van2.x + van2.width + 1, y: 263, width: 793, height: 296});
  }

  function ___t1(van3, van2, van1, train1) {
    // ... C 1П
    if (van2.x < van1.x && van3.x < van1.x && van1.x < train1.x)
      contain(train1, {x: van1.x + van1.width + 1, y: 263, width: 876, height: 296});
  }
///////////////////////////////////////////////////////////

  function join(train, KeyTrain, Van1, Van2, Van3, KeyVan1, KeyVan2, KeyVan3) {
    // касается с 1 вагоном +F
    if (checkTouch(Van1, train) && KeyVan1 === 0 && KeyTrain === 0) {
      pressF.x = Van1.x + 6;
      pressF.y = Van1.y + 30;
      gameScene.addChild(pressF);
    }
    //катание поездов с вагонами
    else if (checkTouch(Van1, train) && KeyVan1 === 1) {
      //contain(train, {x: 60, y: 263, width: 790, height: 296})
      Van1.x = train.x + 101
      Van1.y = train.y
      //присоединяем 2 вагон

      //касается 1 вагон с 2 +F
      if (checkTouch(Van1, Van2) && KeyVan2 === 0) {
        pressF.x = Van2.x + 6;
        pressF.y = Van2.y + 30;
        gameScene.addChild(pressF);

      } else if (checkTouch(Van1, Van2) && KeyVan2 === 2) {
        //contain(train, {x: 60, y: 263, width: 790, height: 296})
        Van2.x = train.x + Van1.width + train.width - 20
        Van2.y = train.y

        //касается 3 вагон с 2 +F
        if (checkTouch(Van3, Van2) && KeyVan3 === 0) {
          pressF.x = Van3.x + 6;
          pressF.y = Van3.y + 30;
          gameScene.addChild(pressF);

          //присоединяем 3 вагон
        } else if (checkTouch(Van3, Van2) && KeyVan3 === 3) {
          //contain(train, {x: 60, y: 263, width: 790, height: 296})
          Van3.x = train.x + Van1.width + train.width + Van2.width - 30
          Van3.y = train.y
        }
      }

    }
  }

  function deleteF(train, countTrain) {
    //Удаление F
    //
    if (!checkTouch(blueVan, train) && !checkTouch(redVan, train) && !checkTouch(redVan2, train) && positionBlueVan === 0 && positionRedVan === 0 && positionRedVan2 === 0 && countTrain === 0) {
      gameScene.removeChild(pressF)
      //C
    } else if (!checkTouch(blueVan, redVan) && !checkTouch(blueVan, redVan2) && positionRedVan2 === 0 && positionRedVan === 0 && positionBlueVan === 1) {
      gameScene.removeChild(pressF)
      //К
    } else if (!checkTouch(blueVan, redVan) && !checkTouch(redVan, redVan2) && positionRedVan2 === 0 && positionRedVan === 1 && positionBlueVan === 0) {
      gameScene.removeChild(pressF)
      //К2
    } else if (!checkTouch(blueVan, redVan2) && !checkTouch(blueVan, redVan2) && positionRedVan2 === 1 && positionRedVan === 0 && positionBlueVan === 0) {
      gameScene.removeChild(pressF)
      //CK
    } else if (!checkTouch(redVan, redVan2) && positionRedVan2 === 0 && positionRedVan === 2 && positionBlueVan === 1) {
      gameScene.removeChild(pressF)
      //CK2
    } else if (!checkTouch(redVan, redVan2) && positionRedVan2 === 2 && positionRedVan === 0 && positionBlueVan === 1) {
      gameScene.removeChild(pressF)
      //КС
    } else if (!checkTouch(blueVan, redVan2) && positionRedVan2 === 0 && positionRedVan === 1 && positionBlueVan === 2) {
      gameScene.removeChild(pressF)
      //КК2
    } else if (!checkTouch(blueVan, redVan2) && positionRedVan2 === 2 && positionRedVan === 1 && positionBlueVan === 0) {
      gameScene.removeChild(pressF)
      //К2С
    } else if (!checkTouch(blueVan, redVan) && positionRedVan2 === 1 && positionRedVan === 0 && positionBlueVan === 2) {
      gameScene.removeChild(pressF)
      //К2К
    } else if (!checkTouch(blueVan, redVan) && positionRedVan2 === 1 && positionRedVan === 2 && positionBlueVan === 0) {
      gameScene.removeChild(pressF)
    }
  }


  function fSetup (Train, KeyTrain, Van1, Van2, Van3, KeyVan1, KeyVan2, KeyVan3) {

    let key = {pos1: KeyVan1, pos2: KeyVan2, pos3: KeyVan3, count: KeyTrain}
    //Прицеп 1го вагона к поезду
    if (key.count === 0) {// && key.pos1 === 0) {
      gameScene.removeChild(pressF)
      key.count++
      key.pos1 = 1
    }
        //Прицеп 2го вагона к 1му вагону
    //12
    else if (checkTouch(Van2, Van1) && key.count === 1) {
      gameScene.addChild(Van2);
      gameScene.addChild(Van1);
      gameScene.addChild(Train);
      gameScene.removeChild(pressF)
      key.count++
      key.pos2 = 2

    }  //13
    else if (checkTouch(Van3, Van1) && key.count === 1) {
      gameScene.addChild(Van3);
      gameScene.addChild(Van1);
      gameScene.addChild(Train);
      gameScene.removeChild(pressF)
      key.count++
      key.pos3 = 2
    }


        //Прицеп 3го вагона к 2му вагону
    //123
    else if (checkTouch(Van2, Van1) && checkTouch(Van2, Van3) && key.count === 2) {
      gameScene.addChild(Van3);
      gameScene.addChild(Van2);
      gameScene.addChild(Van1);
      gameScene.addChild(Train);
      gameScene.removeChild(pressF)
      key.count++
      key.pos3 = 3

    }  //132
    else if (checkTouch(Van3, Van1) && checkTouch(Van2, Van3) && key.count === 2) {
      gameScene.addChild(Van2);
      gameScene.addChild(Van3);
      gameScene.addChild(Van1);
      gameScene.addChild(Train);
      gameScene.removeChild(pressF)
      key.count++
      key.pos2 = 3

    }
    return key
  }


  function spaceSetup (Train, KeyTrain, Van1, Van2, Van3, KeyVan1, KeyVan2, KeyVan3) {

    let key = {pos1: KeyVan1, pos2: KeyVan2, pos3: KeyVan3, count: KeyTrain}

    function helper (van) {
      gameScene.addChild(pressF);
      van.x = van.x;
      van.y = van.y;
      pressF.x = van.x + 6;
      pressF.y = van.y + 30;

    }
    //1
    if (key.count === 1 && key.pos1 === 1) {
        helper(Van1)
        key.count--
        key.pos1 = 0
    }

    // 12
    else if (checkTouch(Van2, Van1) && key.count === 2 && key.pos2 === 2) {
      helper(Van2)
      key.count--
      key.pos2 = 0


    } //13
    else if (checkTouch(Van3, Van1) && key.count === 2 && key.pos3 === 2) {
      helper(Van3)
      key.count--
      key.pos3 = 0
    }

    // 123
    else if (checkTouch(Van2, Van1) && checkTouch(Van3, Van2) && key.count === 3 && key.pos3 === 3) {
      helper(Van3)
      key.count--
      key.pos3 = 0

    } //132
    else if (checkTouch(Van3, Van1) && checkTouch(Van3, Van2) && key.count === 3 && key.pos2 === 3) {
      helper(Van2)
      key.count--
      key.pos2 = 0
    }

    return key
  }

  function contain(sprite, container) {
    let collision = undefined;
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }
    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }
    return collision;
  }

  //Проверка касания
  function checkTouch(r1, r2) {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    hit = false;
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {
      if (Math.abs(vy) < combinedHalfHeights) {
        hit = true;
      } else {
        hit = false;
      }
    } else {
      hit = false;
    }
    return hit;
  }

  //Настройка клавиш
  function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.downHandler = function (event) {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };
    key.upHandler = function (event) {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    return key;
  }
}

export const destroy = () => {
  PIXI.utils.clearTextureCache();
  document.body.removeChild(app.view);
  loader.reset()
  return result
}