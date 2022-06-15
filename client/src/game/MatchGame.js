//import { GlowFilter } from '@pixi/filter-glow';

import * as PIXI from "pixi.js";
import { OutlineFilter, GlowFilter } from 'pixi-filters';

let app;
let loader = PIXI.Loader.shared
let Application = PIXI.Application
let Container = PIXI.Container
let Graphics = PIXI.Graphics
let TextureCache = PIXI.utils.TextureCache
let Sprite = PIXI.Sprite
let Text = PIXI.Text
let TextStyle = PIXI.TextStyle

let result = {}
result.text = "Вы не закончили игру"
result.attempt = 0


export const Init = (loadedState) =>  {

  //Create a Pixi Application
  result.text = "Вы не закончили игру"
  result.attempt = 0
  app = new Application({
    width: 719,
    height: 512,
    antialiasing: true,
    transparent: false,
    resolution: 1.5
  });
  app.renderer.backgroundColor = 0x061639;

  document.body.append(app.view);

 // const outlineFilter2  = new OutlineFilter(2, 0xffff00, 0.2);
  const outlineFilter  = new GlowFilter({color: 0xcfd88f, outerStrength: 3, distance: 5});

  loader
    .add("../images/matchProblem.json")
    .load(setup)


  //Переменные
  let state,
      area,
      message,
      gameScene,
      id,
      reload,
      step,
      task,
      countMessage,
      box

  //Ключи
  let countClick = 0,
      attempt = 0,
      click = false,
      emptySlot = [],
      win = false,
      addWin = false

  let matches = []
  let slots = []
  function setup() {

    attempt++
    gameScene = new Container();
    //gameScene.filters = [new GlowFilter()]
    app.stage.addChild(gameScene);
    id = loader.resources['../images/matchProblem.json'].textures;
    result.text = "Вы не закончили игру"
    result.attempt = 0
    countClick = 0

    //area
    area = new Sprite(id["area.png"]);
    gameScene.addChild(area);


    reload = new Sprite(id["reload.png"]);
    reload.x = 650
    reload.y = 40
    gameScene.addChild(reload)




    if (loadedState === 1) {
      firstState()
    } else if (loadedState === 2) {
      secondState()
    } else if (loadedState === 3) {
      thirdState()
  }

    step = new Text("Попытка: " + attempt, {
      fontFamily: "Press Start 2P",
      fontSize: 14,
      fill: "black"
    });
    step.x = 490;
    step.y = 38;
    gameScene.addChild(step);

    message = new Text("Вы проиграли, попробуйте еще раз", {
      fontFamily: "Press Start 2P",
      fontSize: 23,
      leading: 10,
      fill: "black"
    });
    message.x = 60;
    message.y = gameScene.height / 2 - 30;
    //Set the game state
    state = play;

    //Start the game loop
    app.ticker.add((delta) => gameLoop(delta));
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play() {

    result.text = "Вы не закончили игру"
    result.attempt = 0
    if (loadedState === 1) {
      if ((checkTouch(matches[5], slots[5]) || checkTouch(matches[13], slots[13])) && countClick === 2) {
        message.x = 40
        message.text = "Вы проиграли, попробуйте ещё"
        gameScene.addChild(message)
        result.text = "Вы не закончили игру"
        result.attempt = 0
      }

      if (!checkTouch(matches[5], slots[5]) && !checkTouch(matches[13], slots[13]) && countClick === 2) {
        message.x = 70
        if (attempt === 1) {
          message.text = `Вы выиграли за ${attempt} попытку`
          result.text = `Вы выиграли за ${attempt} попытку`
          result.attempt = attempt
        }
        if (attempt > 1 && attempt < 5) {
          message.text = `Вы выиграли за ${attempt} попытки`
          result.text = `Вы выиграли за ${attempt} попытки`
          result.attempt = attempt
        }
        if (attempt >= 5) {
          message.text = `Вы выиграли за ${attempt} попыток`
          result.text = `Вы выиграли за ${attempt} попыток`
          result.attempt = attempt
        }
        gameScene.addChild(message)
      }
    } else if (loadedState === 2) {
      for (let i = 0; i < slots.length; i++)
        if (checkTouch(box, slots[i]) && click && emptySlot[i])
          slots[i].filters = [outlineFilter]

        else if (!checkTouch(box, slots[i]) || !click || !emptySlot[i])
          slots[i].filters = false

      countMessage.text = countClick + " / 3"
      if (!win && countClick === 3) {
        message.x = 40
        message.text = "Вы проиграли, попробуйте ещё"
        gameScene.addChild(message)
        result.text = "Вы не закончили игру"
        result.attempt = 0
      }

      if (win && countClick === 3) {
        message.x = 70
        if (attempt === 1) {
          message.text = `Вы выиграли за ${attempt} попытку`
          result.text = `Вы выиграли за ${attempt} попытку`
          result.attempt = attempt
        }
        if (attempt > 1 && attempt < 5) {
          message.text = `Вы выиграли за ${attempt} попытки`
          result.text = `Вы выиграли за ${attempt} попытки`
          result.attempt = attempt
        }
        if (attempt >= 5) {
          message.text = `Вы выиграли за ${attempt} попыток`
          result.text = `Вы выиграли за ${attempt} попыток`
          result.attempt = attempt
        }
        gameScene.addChild(message)
      }
    } else if (loadedState === 3) {
      for (let i = 0; i < slots.length; i++)
        if (checkTouch(box, slots[i]) && click && emptySlot[i])
          slots[i].filters = [outlineFilter]

        else if (!checkTouch(box, slots[i]) || !click || !emptySlot[i])
          slots[i].filters = false

      countMessage.text = countClick + " / 6"
      if (((!win && !addWin) || (!win && addWin) || (win && !addWin)) && countClick === 6 ) {
        message.x = 40
        message.y = 256
        message.text = "Вы проиграли, попробуйте ещё"
        gameScene.addChild(message)
        result.text = "Вы не закончили игру"
        result.attempt = 0
      }

      if (win && addWin) {
        message.x = 70
        message.y = 256
        if (attempt === 1) {
          message.text = `Вы выиграли за ${attempt} попытку`
          result.text = `Вы выиграли за ${attempt} попытку`
          result.attempt = attempt
        }
        if (attempt > 1 && attempt < 5) {
          message.text = `Вы выиграли за ${attempt} попытки`
          result.text = `Вы выиграли за ${attempt} попытки`
          result.attempt = attempt
        }
        if (attempt >= 5) {
          message.text = `Вы выиграли за ${attempt} попыток`
          result.text = `Вы выиграли за ${attempt} попыток`
          result.attempt = attempt
        }
        gameScene.addChild(message)
      }
    }
  }

  function firstState () {

    reload.buttonMode = true;
    reload.interactive = true;
    reload.on('pointerdown', (event) => onClick(reload));
    reload.on('pointerup', (event) => onPointerUpReload());
    reload.on('pointerover', (event) => onPointerOver(reload));
    reload.on('pointerout', (event) => onPointerOut(reload));

    //Спички
    matches[0] = new Sprite(id["match.png"]);
    matches[0].x = 135;
    matches[0].y = gameScene.height / 2;
    matches[0].scale.set(0.9)
    matches[0].rotation = 0

    matches[1] = new Sprite(id["match.png"]);
    matches[1].x = matches[0].x + matches[1].height + 3;
    matches[1].y = gameScene.height / 2 - 5;
    matches[1].scale.set(0.9)
    matches[1].rotation = 1.58

    matches[2] = new Sprite(id["match.png"]);
    matches[2].x = matches[0].x + matches[2].height + 3;
    matches[2].y = matches[0].y + matches[0].height - 3;
    matches[2].scale.set(0.9)
    matches[2].rotation = 1.58

    matches[3] = new Sprite(id["match.png"]);
    matches[3].x = matches[0].x + matches[1].height + 16;
    matches[3].y = matches[0].y;
    matches[3].scale.set(0.9)
    matches[3].rotation = 0

    matches[4] = new Sprite(id["match.png"]);
    matches[4].x = matches[2].x + matches[2].height + 16;
    matches[4].y = matches[1].y;
    matches[4].scale.set(0.9)
    matches[4].rotation = 1.58

    matches[5] = new Sprite(id["match.png"]);
    matches[5].x = matches[2].x + matches[2].height + 16;
    matches[5].y = matches[2].y
    matches[5].scale.set(0.9)
    matches[5].rotation = 1.58

    matches[6] = new Sprite(id["match.png"]);
    matches[6].x = matches[3].x + matches[3].height + 16;
    matches[6].y = matches[0].y;
    matches[6].scale.set(0.9)
    matches[6].rotation = 0

    matches[7] = new Sprite(id["match.png"]);
    matches[7].x = matches[4].x + matches[4].height + 16;
    matches[7].y = matches[1].y;
    matches[7].scale.set(0.9)
    matches[7].rotation = 1.58

    matches[8] = new Sprite(id["match.png"]);
    matches[8].x = matches[5].x + matches[5].height + 16;
    matches[8].y = matches[2].y;
    matches[8].scale.set(0.9)
    matches[8].rotation = 1.58

    matches[9] = new Sprite(id["match.png"]);
    matches[9].x = matches[6].x + matches[6].height + 16;
    matches[9].y = matches[0].y
    matches[9].scale.set(0.9)
    matches[9].rotation = 0

    matches[10] = new Sprite(id["match.png"]);
    matches[10].x = matches[3].x;
    matches[10].y = gameScene.height / 2 - matches[10].height + 7;
    matches[10].scale.set(0.9)
    matches[10].rotation = 0

    matches[11] = new Sprite(id["match.png"]);
    matches[11].x = matches[4].x;
    matches[11].y = matches[1].y - matches[1].height - 6
    matches[11].scale.set(0.9)
    matches[11].rotation = 1.58

    matches[12] = new Sprite(id["match.png"]);
    matches[12].x = matches[6].x;
    matches[12].y = matches[10].y
    matches[12].scale.set(0.9)
    matches[12].rotation = 0

    matches[13] = new Sprite(id["match.png"]);
    matches[13].x = matches[7].x;
    matches[13].y = matches[1].y - matches[1].height - 6
    matches[13].scale.set(0.9)
    matches[13].rotation = 1.58

    matches[14] = new Sprite(id["match.png"]);
    matches[14].x = matches[9].x;
    matches[14].y = matches[12].y
    matches[14].scale.set(0.9)
    matches[14].rotation = 0

    matches[15] = new Sprite(id["match.png"]);
    matches[15].x = matches[14].x + matches[14].height + 16;
    matches[15].y = matches[1].y - matches[1].height - 6
    matches[15].scale.set(0.9)
    matches[15].rotation = 1.58

    matches[16] = new Sprite(id["match.png"]);
    matches[16].x = matches[14].x + matches[14].height + 16;
    matches[16].y = matches[1].y
    matches[16].scale.set(0.9)
    matches[16].rotation = 1.58

    matches[17] = new Sprite(id["match.png"]);
    matches[17].x = matches[9].x + matches[9].height + 16;
    matches[17].y = matches[14].y;
    matches[17].scale.set(0.9)
    matches[17].rotation = 0

    //Пазы
    for (let i = 0; i < matches.length; i++) {
      slots[i] = new Graphics()
      slots[i].beginFill(0x010101)
      slots[i].drawRoundedRect(0, 0, matches[0].width - 2, matches[0].height - 2, 5)
      slots[i].endFill()
      if (matches[i].rotation === 0) {
        slots[i].x = matches[i].x + 1;
        slots[i].y = matches[i].y + 1;
      } else if (matches[i].rotation === 1.58) {
        slots[i].x = matches[i].x - 1
        slots[i].y = matches[i].y + 1
      }
      slots[i].rotation = matches[i].rotation
      slots[i].alpha = 0.2;
      gameScene.addChild(slots[i]);
      gameScene.addChild(matches[i]);

      matches[i].buttonMode = true;
      matches[i].interactive = true;

      matches[i].on('pointerdown', (event) => onClick(matches[i]));
      matches[i].on('pointerup', (event) => onPointerUp(matches[i]));
      matches[i].on('pointerover', (event) => onPointerOver(matches[i]));
      matches[i].on('pointerout', (event) => onPointerOut(matches[i]));

    }

    function onClick(object) {
      object.tint = 0x000000;
    }

    function onPointerUp(object) {
      if (countClick !== 2) {
        countClick++
        object.x = -100
        object.y = -100
      }
    }

    function onPointerOver(object) {
      object.tint = 0x666666;
    }

    function onPointerOut(object) {
      object.tint = 0xFFFFFF;
    }

    function onPointerUpReload() {
      if (checkTouch(matches[5], slots[5]) || checkTouch(matches[13], slots[13])) {
        state = setup;
      }
    }


    let task = new Text("Уберите 2 спички" +
        " так, чтобы \nосталось 4 равных квадрата\n", {
      fontFamily: "Press Start 2P",
      fontSize: 15,
      fontVariant: 'small-caps',
      leading: 10,
      fill: "black"
    });
    task.x = 50;
    task.y = 35;
    gameScene.addChild(task);

  }

  function secondState () {


    reload.buttonMode = true;
    reload.interactive = true;
    reload.on('pointerdown', (event) => onClickReload(reload));
    reload.on('pointerup', (event) => onPointerUpReload());
    reload.on('pointerover', (event) => onPointerOverReload(reload));
    reload.on('pointerout', (event) => onPointerOutReload(reload));

    //Спички
    let x = 225
    let y = gameScene.height / 4 - 130;
    let countS = 0
    let countM = 0

    for (let i = 0; i < 5; i++) {
      x = 151
      y += 91;
      for (let j = 0; j < 4; j++) {
        let indexS = countS
        let indexM = countM
        slots[indexS] = new Graphics()
        slots[indexS].beginFill(0x757575)
        slots[indexS].drawRoundedRect(0, 0, 84.8, 9.6, 5)
        slots[indexS].endFill()
        slots[indexS].rotation = 0
        slots[indexS].x = x - 1
        slots[indexS].y = y + 1

        slots[indexS].alpha = 0.3;
        gameScene.addChild(slots[indexS]);

        if (indexS === 5 || indexS === 6 || indexS === 9 || indexS === 10 || indexS === 13 || indexS === 14) {
          matches[indexM] = new Sprite(id["match.png"]);
          matches[indexM].scale.set(0.8)
          matches[indexM].x = slots[indexS].x + slots[indexS].width + 1
          matches[indexM].y = slots[indexS].y - 1
          matches[indexM].rotation = 1.58
          gameScene.addChild(matches[indexM]);

          matches[indexM].buttonMode = true;
          matches[indexM].interactive = true;

          matches[indexM].on('pointerdown', onClick)
                         .on('pointerup', onEnd)
                         .on('pointerupoutside', onEnd)
                         .on('pointermove', onMove);
          countM++
          emptySlot[indexS] = false
        } else emptySlot[indexS] = true
        x = slots[indexS].x + 102;
        countS++
      }
    }


    y = gameScene.height / 4 - 124;
    for (let i = 0; i < 4; i++) {
      x = 138
      y += 91;
      for (let j = 0; j < 5; j++) {
        let indexS = countS
        let indexM = countM
        slots[indexS] = new Graphics()
        slots[indexS].beginFill(0x757575)
        slots[indexS].drawRoundedRect(0, 0, 9.6, 84.8, 5)
        slots[indexS].endFill()

        slots[indexS].x = x - 1
        slots[indexS].y = y + 1
        slots[indexS].rotation = 0
        slots[indexS].alpha = 0.3;
        gameScene.addChild(slots[indexS]);

        if (indexS === 26 || indexS === 27 || indexS === 28 || indexS === 31 || indexS === 32 || indexS === 33) {
          matches[indexM] = new Sprite(id["match.png"]);

          matches[indexM].x = slots[indexS].x - 1
          matches[indexM].y = slots[indexS].y + 1
          matches[indexM].rotation = 0
          matches[indexM].scale.set(0.8)
          gameScene.addChild(matches[indexM]);

          matches[indexM].buttonMode = true;
          matches[indexM].interactive = true;

          matches[indexM].on('pointerdown', onClick)
                         .on('pointerup', onEnd)
                         .on('pointerupoutside', onEnd)
                         .on('pointermove', onMove);
          countM++
          emptySlot[indexS] = false
        } else emptySlot[indexS] = true

        x = slots[indexS].x + 102;
        countS++
      }
    }

    let xMatch
    let yMatch
    let xSlot
    let ySlot

    box = new Graphics()
    box.beginFill(0x757575)
    box.drawRoundedRect(0, 0, 9.6, 9.6, 5)
    box.endFill()
    box.interactive = true;
    gameScene.addChild(box)
    box.on('pointermove', boxMove)
    function boxMove(event) {
      this.data = event.data;
      this.alpha = 0;
      this.dragging = true;
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x + 1;
        this.y = newPosition.y + 1;
      }
    }

    function onClick ( event )  {
      if (countClick < 3) {
        this.data = event.data;
        this.alpha = 0.5;
        xMatch = this.x
        yMatch = this.y
        if (this.rotation === 0) {
          xSlot = this.x + 1
          ySlot = this.y - 1
        }
        if (this.rotation === 1.58) {
          xSlot = Math.ceil(this.x - slots[0].width - 1)
          ySlot = this.y + 1
        }
        click = true
        this.dragging = true;
        gameScene.addChild(this)
      }
    }

    function onMove() {

      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        if(this.rotation === 1.58) {
          this.x = newPosition.x + 45;
          this.y = newPosition.y - 7;
        } else if(this.rotation === 0) {
          this.x = newPosition.x - 7;
          this.y = newPosition.y - 45;
        }
      }
    }

    function onEnd() {
      if (countClick < 3) {
        this.alpha = 1;
        this.dragging = false;
        let key = false
        click = false
        for (let i = 0; i < slots.length; i++) {
          if (checkTouch(box, slots[i]) && emptySlot[i]) {
            if (slots[i].width > slots[i].height) {
              this.rotation = 1.58
              this.x = slots[i].x + slots[i].width + 1
              this.y = slots[i].y - 1
              emptySlot[i] = false
              countClick++
            } else if (slots[i].width < slots[i].height) {
              this.rotation = 0
              this.x = slots[i].x - 1
              this.y = slots[i].y + 1
              emptySlot[i] = false
              countClick++
            }
            key = true
          }
        }
        if (!key) {
          this.x = xMatch
          this.y = yMatch
        }

        for (let i = 0; i < slots.length; i++) {
          if (slots[i].x === xSlot && slots[i].y === ySlot && key)
            emptySlot[i] = true
        }
        win = (!emptySlot[1] && !emptySlot[21] && !emptySlot[22] && emptySlot[26] && emptySlot[14] && emptySlot[33]) ||
            (!emptySlot[2] && !emptySlot[22] && !emptySlot[23] && emptySlot[28] && emptySlot[31] && emptySlot[13]) ||
            (!emptySlot[36] && !emptySlot[37] && !emptySlot[17] && emptySlot[31] && emptySlot[6] && emptySlot[28]) ||
            (!emptySlot[37] && !emptySlot[38] && !emptySlot[18] && emptySlot[33] && emptySlot[5] && emptySlot[26]) ||
            (!emptySlot[30] && !emptySlot[8] && !emptySlot[12] && emptySlot[13] && emptySlot[6] && emptySlot[28]) ||
            (!emptySlot[4] && !emptySlot[25] && !emptySlot[8] && emptySlot[5] && emptySlot[14] && emptySlot[33]) ||
            (!emptySlot[11] && !emptySlot[34] && !emptySlot[15] && emptySlot[14] && emptySlot[26] && emptySlot[5]) ||
            (!emptySlot[7] && !emptySlot[29] && !emptySlot[11] && emptySlot[6] && emptySlot[31] && emptySlot[13])
        this.data = null;
      }
    }


    function onClickReload(object) {
      if (countClick <= 3 && !win) {
        object.tint = 0x000000;
      }
    }

    function onPointerOverReload(object) {
      if (countClick <= 3 && !win) {
        object.tint = 0x666666;
      }
    }

    function onPointerOutReload(object) {
      if (countClick <= 3 && !win) {
        object.tint = 0xFFFFFF;
      }
    }
    function onPointerUpReload() {
      if (countClick <= 3 && !win) {
        state = setup;
      }
    }


    task = new Text("Переложите 3 спички" +
        " так, чтобы \nполучилось 3 равных квадрата\n", {
      fontFamily: "Press Start 2P",
      fontSize: 15,
      fontVariant: 'small-caps',
      leading: 10,
      fill: "black"
    });
    task.x = 50;
    task.y = 35;
    gameScene.addChild(task);

    countMessage = new Text(countClick + " / 3", {
      fontFamily: "Press Start 2P",
      fontSize: 17,
      fill: "black"
    });
    countMessage.x = 580;
    countMessage.y = 450;
    gameScene.addChild(countMessage);
  }


  function thirdState () {


    reload.buttonMode = true;
    reload.interactive = true;
    reload.on('pointerdown', (event) => onClickReload(reload));
    reload.on('pointerup', (event) => onPointerUpReload());
    reload.on('pointerover', (event) => onPointerOverReload(reload));
    reload.on('pointerout', (event) => onPointerOutReload(reload));

    //Спички
    let x
    let y = gameScene.height / 4 - 130;
    let countS = 0
    let countM = 0

    for (let i = 0; i < 6; i++) {
      x = 72
      y += 78;
      for (let j = 0; j < 6; j++) {
        let indexS = countS
        let indexM = countM
        slots[indexS] = new Graphics()
        slots[indexS].beginFill(0x757575)
        slots[indexS].drawRoundedRect(0, 0, 74.2, 8.4, 5)
        slots[indexS].endFill()
        slots[indexS].rotation = 0
        slots[indexS].x = x - 1
        slots[indexS].y = y + 1

        slots[indexS].alpha = 0.3;
        gameScene.addChild(slots[indexS]);

        if (indexS === 7 || indexS === 8 || indexS === 9 || indexS === 10 || indexS === 13 || indexS === 14 ||
            indexS === 15 || indexS === 16 || indexS === 19 || indexS === 20 || indexS === 21 || indexS === 22
            || indexS === 25 || indexS === 26 || indexS === 27 || indexS === 28) {
          matches[indexM] = new Sprite(id["match.png"]);
          matches[indexM].scale.set(0.7)
          matches[indexM].x = slots[indexS].x + slots[indexS].width
          matches[indexM].y = slots[indexS].y
          matches[indexM].rotation = 1.58
          gameScene.addChild(matches[indexM]);

          matches[indexM].buttonMode = true;
          matches[indexM].interactive = true;

          matches[indexM].on('pointerdown', onClick)
              .on('pointerup', onEnd)
              .on('pointerupoutside', onEnd)
              .on('pointermove', onMove);
          countM++
          emptySlot[indexS] = false
        } else emptySlot[indexS] = true
        x = slots[indexS].x + 92;
        countS++
      }
    }


    y = gameScene.height / 4 - 123;
    for (let i = 0; i < 5; i++) {
      x = 59
      y += 78;
      for (let j = 0; j < 7; j++) {
        let indexS = countS
        let indexM = countM
        slots[indexS] = new Graphics()
        slots[indexS].beginFill(0x757575)
        slots[indexS].drawRoundedRect(0, 0, 8.4, 74.2, 5)
        slots[indexS].endFill()

        slots[indexS].x = x - 1
        slots[indexS].y = y + 1
        slots[indexS].rotation = 0
        slots[indexS].alpha = 0.3;
        gameScene.addChild(slots[indexS]);

        if (indexS === 45 || indexS === 46 || indexS === 47 || indexS === 52 || indexS === 53 ||
            indexS === 54 || indexS === 59 || indexS === 60 || indexS === 61) {
          matches[indexM] = new Sprite(id["match.png"]);

          matches[indexM].x = slots[indexS].x - 1
          matches[indexM].y = slots[indexS].y
          matches[indexM].rotation = 0
          matches[indexM].scale.set(0.7)
          gameScene.addChild(matches[indexM]);

          matches[indexM].buttonMode = true;
          matches[indexM].interactive = true;

          matches[indexM].on('pointerdown', onClick)
              .on('pointerup', onEnd)
              .on('pointerupoutside', onEnd)
              .on('pointermove', onMove);
          countM++
          emptySlot[indexS] = false
        } else emptySlot[indexS] = true

        x = slots[indexS].x + 92;
        countS++
      }
    }

    let xMatch
    let yMatch
    let xSlot
    let ySlot

    box = new Graphics()
    box.beginFill(0x757575)
    box.drawRoundedRect(0, 0, 8.4, 8.4, 5)
    box.endFill()
    box.interactive = true;
    gameScene.addChild(box)
    box.on('pointermove', boxMove)
    function boxMove(event) {
      this.data = event.data;
      this.alpha = 0;
      this.dragging = true;
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x + 1;
        this.y = newPosition.y + 1;
      }
    }

    function onClick ( event )  {
      if (countClick < 6) {
        this.data = event.data;
        this.alpha = 0.5;
        xMatch = this.x
        yMatch = this.y
        if (this.rotation === 0) {
          xSlot = this.x + 1
          ySlot = this.y
        }
        if (this.rotation === 1.58) {
          xSlot = Math.ceil(this.x - slots[0].width)
          ySlot = this.y
        }
        click = true
        this.dragging = true;
        gameScene.addChild(this)
      }
    }

    function onMove() {

      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        if(this.rotation === 1.58) {
          this.x = newPosition.x + 40;
          this.y = newPosition.y - 5;
        } else if(this.rotation === 0) {
          this.x = newPosition.x - 5;
          this.y = newPosition.y - 40;
        }
      }
    }

    function onEnd() {
      if (countClick < 6) {
        this.alpha = 1;
        this.dragging = false;
        let key = false
        click = false
        for (let i = 0; i < slots.length; i++) {
          if (checkTouch(box, slots[i]) && emptySlot[i]) {
            if (slots[i].width > slots[i].height) {
              this.rotation = 1.58
              this.x = slots[i].x + slots[i].width
              this.y = slots[i].y
              emptySlot[i] = false
              countClick++
            } else if (slots[i].width < slots[i].height) {
              this.rotation = 0
              this.x = slots[i].x - 1
              this.y = slots[i].y
              emptySlot[i] = false
              countClick++
            }
            key = true
          }
        }
        if (!key) {
          this.x = xMatch
          this.y = yMatch
        }

        for (let i = 0; i < slots.length; i++) {
          if (slots[i].x === xSlot && slots[i].y === ySlot && key)
            emptySlot[i] = true
        }
        addWin = (!emptySlot[44] && !emptySlot[51] && !emptySlot[58] && !emptySlot[48] && !emptySlot[55] && !emptySlot[62])

        win = (emptySlot[45] && emptySlot[46] && emptySlot[13] && emptySlot[53] && emptySlot[19] && emptySlot[20]) ||
            (emptySlot[45] && emptySlot[46] && emptySlot[15] && emptySlot[52] && emptySlot[20] && emptySlot[21]) ||
            (emptySlot[13] && emptySlot[19] && emptySlot[59] && emptySlot[60] && emptySlot[14] && emptySlot[53]) ||
            (emptySlot[14] && emptySlot[52] && emptySlot[15] && emptySlot[21] && emptySlot[59] && emptySlot[60]) ||
            (emptySlot[13] && emptySlot[19] && emptySlot[52] && emptySlot[53] && emptySlot[15] && emptySlot[21]) ||
            (emptySlot[45] && emptySlot[46] && emptySlot[20] && emptySlot[14] && emptySlot[59] && emptySlot[60]) ||
            (emptySlot[45] && emptySlot[46] && emptySlot[13] && emptySlot[15] && emptySlot[19] && emptySlot[59]) ||
            (emptySlot[13] && emptySlot[19] && emptySlot[45] && emptySlot[59] && emptySlot[60] && emptySlot[21]) ||
            (emptySlot[46] && emptySlot[15] && emptySlot[21] && emptySlot[60] && emptySlot[19] && emptySlot[59]) ||
            (emptySlot[13] && emptySlot[45] && emptySlot[46] && emptySlot[15] && emptySlot[21] && emptySlot[60]) ||
            (emptySlot[19] && emptySlot[13] && emptySlot[45] && emptySlot[46] && emptySlot[15] && emptySlot[21]) ||
            (emptySlot[46] && emptySlot[45] && emptySlot[13] && emptySlot[19] && emptySlot[59] && emptySlot[60]) ||
            (emptySlot[13] && emptySlot[19] && emptySlot[59] && emptySlot[60] && emptySlot[21] && emptySlot[15]) ||
            (emptySlot[46] && emptySlot[45] && emptySlot[15] && emptySlot[21] && emptySlot[59] && emptySlot[60]) ||



            (emptySlot[46] && emptySlot[47] && emptySlot[14] && emptySlot[54] && emptySlot[20] && emptySlot[21]) ||
            (emptySlot[46] && emptySlot[47] && emptySlot[16] && emptySlot[53] && emptySlot[21] && emptySlot[22]) ||
            (emptySlot[14] && emptySlot[20] && emptySlot[60] && emptySlot[61] && emptySlot[15] && emptySlot[54]) ||
            (emptySlot[15] && emptySlot[53] && emptySlot[16] && emptySlot[22] && emptySlot[60] && emptySlot[61]) ||
            (emptySlot[14] && emptySlot[20] && emptySlot[53] && emptySlot[54] && emptySlot[16] && emptySlot[22]) ||
            (emptySlot[46] && emptySlot[47] && emptySlot[21] && emptySlot[15] && emptySlot[60] && emptySlot[61]) ||
            (emptySlot[46] && emptySlot[47] && emptySlot[14] && emptySlot[16] && emptySlot[20] && emptySlot[60]) ||
            (emptySlot[14] && emptySlot[20] && emptySlot[46] && emptySlot[60] && emptySlot[61] && emptySlot[22]) ||
            (emptySlot[47] && emptySlot[16] && emptySlot[22] && emptySlot[61] && emptySlot[20] && emptySlot[60]) ||
            (emptySlot[14] && emptySlot[46] && emptySlot[47] && emptySlot[16] && emptySlot[22] && emptySlot[61]) ||
            (emptySlot[20] && emptySlot[14] && emptySlot[46] && emptySlot[47] && emptySlot[16] && emptySlot[22]) ||
            (emptySlot[47] && emptySlot[46] && emptySlot[14] && emptySlot[20] && emptySlot[60] && emptySlot[61]) ||
            (emptySlot[14] && emptySlot[20] && emptySlot[60] && emptySlot[61] && emptySlot[22] && emptySlot[16]) ||
            (emptySlot[47] && emptySlot[46] && emptySlot[16] && emptySlot[22] && emptySlot[60] && emptySlot[61])
        this.data = null;
      }
    }


    function onClickReload(object) {
      if (countClick <= 6 && !win && !addWin) {
        object.tint = 0x000000;
      }
    }

    function onPointerOverReload(object) {
      if (countClick <= 6 && !win && !addWin) {
        object.tint = 0x666666;
      }
    }

    function onPointerOutReload(object) {
      if (countClick <= 6 && !win && !addWin) {
        object.tint = 0xFFFFFF;
      }
    }
    function onPointerUpReload() {
      if (countClick <= 6 && !win && !addWin) {
        state = setup;
      }
    }


    task = new Text("Переложите 6 спичек" +
        " так, чтобы \nполучилось 6 квадратов\n", {
      fontFamily: "Press Start 2P",
      fontSize: 15,
      fontVariant: 'small-caps',
      leading: 10,
      fill: "black"
    });
    task.x = 50;
    task.y = 35;
    gameScene.addChild(task);

    countMessage = new Text(countClick + " / 6", {
      fontFamily: "Press Start 2P",
      fontSize: 14,
      fill: "black"
    });
    countMessage.x = 616;
    countMessage.y = 450;
    gameScene.addChild(countMessage);
  }

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
}

export const destroy = () => {

  PIXI.utils.clearTextureCache();

  document.body.removeChild(app.view);
  loader.reset()

  return result
}
