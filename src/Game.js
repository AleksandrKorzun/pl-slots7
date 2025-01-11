import ParentScene from "@holywater-tech/ads-builder/framework/components/Scene";
import Background from "@holywater-tech/ads-builder/framework/components/ui/Background";
import { EVENTS, SLOT1 } from "./constants/Constants";
import Machine from "./Machine";
// import { Header } from "./Header";
// import { Footer } from "./Footer";
import Win from "./Win";
import Hall from "./Hall";
import Spinner from "./Spinner";
import CoinBox from "./CoinBox";
import CoinBox2 from "./CoinBox2";
import Buttons from "./Buttons";
import Utils from "@holywater-tech/ads-builder/framework/Utils";

export default class Game extends ParentScene {
  create() {
    this.totalCoins = 100000000;
    this.addBackground("bg1");
    this.addSpinner();
    this.addCoinBoxes();
    this.addMachine();
    this.addCta();
    this.addCoinBox2();
    Utils.addAudio(this, "music_trivia", 0.5, false);
    // this.finalScene();
    this.step = 0;
  }

  initListeners() {
    this.emitter.on("final", () => this.final(), this);
    this.emitter.on("moveLeftCamera", () => this.moveLeftCamera(), this);
    this.emitter.on("moveRightCamera", () => this.moveRightCamera(), this);
  }

  final() {
    this.addWin();
  }

  addBackground(bg, options = {}) {
    this[bg] = new Background(this, bg, true, [1.5, 1.5, 1.1, 1.1])
      .setDepth(options.depth || 4)
      .setAlpha(1);

    this.mainContainer.add([this[bg]]);
    this.sort();
  }
  addSpinner(options) {
    this.spinner = new Spinner(this, options);
    this.mainContainer.add([this.spinner]);
    this.sort();
  }
  addCoinBoxes(coins, box, name, pos) {
    this.coinBoxes = new CoinBox(this, { coins, box, name, pos });
    this.mainContainer.add([this.coinBoxes]);
    this.sort();
  }
  addMachine(options) {
    this.machine = new Machine(this, options);
    this.mainContainer.add([this.machine]);
    this.sort();
  }

  addCoins() {
    this.partc = this.add
      .particles("atlas", "coin1")
      .addProperties(["pos"])
      .setCustomPosition(0, 0, 0, 0)
      .setDepth(49);

    const emitter = this.partc.createEmitter({
      frame: ["coins1", "coins2", "coins3", "coins4"],
      x: 0,
      y: 0,
      angle: { start: 0, end: 360 },
      speedY: { min: -400, max: 500 },
      speedX: { min: -400, max: 500 },
      lifespan: 2400,
      scale: { start: 0.4, end: 0.5 },
      frequency: 100,
      quantity: 2,
      // blendMode: "ADD",
      // on: false,
    });
    this.mainContainer.add([this.partc]);
    this.sort();
    // this.addBigWin();

    const stopEmitter = () => {
      emitter.stop();
      this.time.delayedCall(1400, () => this.partc.destroy());
    };
    // this.time.delayedCall(2000, stopEmitter, [], this);
  }

  addBigWin() {
    this.big_win = this.add
      .image(0, 0, "atlas", "big_win")
      .addProperties(["pos"])
      .setCustomPosition(0, 0, 0, 0)
      .setCustomAlign("Center")
      .setDepth(300)
      .setAlpha(0);

    this.tweens.add({
      targets: this.big_win,
      alpha: 1,
      duration: 200,
      hold: 2300,
      yoyo: true,
    });
    setTimeout(() => this.emitter.emit(EVENTS.NEXT_SCENE), 4000);
  }

  addWin(options) {
    this.addBackground("bg2", { depth: 450, disable: true });
    this.game.network.addClickToStore(this.bg2);
    this.win = new Win(this).setDepth(500);
    this.mainContainer.add([this.win]);
    this.sort();
  }
  addHeader() {
    this.header = new Header(this);
    this.mainContainer.add([this.header]);
    this.sort();
  }

  addFooter() {
    this.footer = new Footer(this);
    this.mainContainer.add([this.footer]);
    this.sort();
  }

  addCta() {
    this.cta = new Buttons(
      this,
      "btn_download",
      { lx: -200, ly: 0, px: 100, py: 100 },
      () => this.openStore()
    )
      .setCustomScale(0.4, 0.4, 0.4, 0.4)
      .setDepth(99);
    this.tweens.add({
      targets: this.cta,
      scale: "*=0.95",
      duration: 500,
      repeat: -1,
      yoyo: true,
    });
    this.mainContainer.add([this.cta]);
    this.sort();
  }
  addCoinBox2() {
    this.coinBox2 = new CoinBox2(this)
      .addProperties(["pos"])
      .setCustomPosition(0, 150, 0, 150)
      .setCustomAlign("Center")
      .setScale(0.7)
      .setAlpha(0)
      .setDepth(69);
    this.mainContainer.add([this.coinBox2]);
    this.sort();
  }
  add3x(img, delay = 1800, hightliteDuration) {
    Utils.addAudio(this, "win2", 0.5, false);
    this.treeX = this.add
      .image(0, 0, img)
      .setCustomPosition(0, 0, 0, 0)
      .setCustomAlign("Center")
      .setDepth(100)
      .setScale(0);
    this.tweens.add({
      targets: [this.treeX],
      scale: 0.7,
      duration: 200,
    });
    this.tweens.add({
      targets: [this.treeX],
      scale: 0,
      y: "+=300",
      alpha: 0,
      duration: 200,
      delay,
    });
    this.addHighlight(hightliteDuration);
    this.mainContainer.add([this.treeX]);
    this.sort();
  }
  finalScene() {
    this.addCoins();
    this.game.network.addClickToStore(this.bg1);
    this.won = this.add
      .image(0, 0, "won")
      .addProperties(["pos", "scale"])
      .setCustomPosition(0, 0, 0, 0)
      .setCustomAlign("Center")
      .setDepth(50)
      .setAlpha(0)
      .setCustomScale(1, 1, 0.7, 0.7);
    this.won_text = this.add
      .text(0, 0, "10 000 000", {
        font: `bold 55px BerlinSansFBDemiBold`,
        fill: "#F9E90F",
        shadow: {
          offsetX: 5,
          offsetY: 5,
          color: "#000",
          blur: 10,
          stroke: true,
          fill: true,
        },
        letterSpacing: 10,
        stroke: "#000",
        strokeThickness: 10,
      })
      .addProperties(["pos", "scale"])
      .setCustomPosition(0, 30, 0, 30)
      .setCustomAlign("Center")
      .setDepth(120)
      .setAlpha(0)
      .setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: [this.won, this.won_text],
      alpha: 1,
      duration: 700,
    });
    this.mainContainer.add([this.won, this.won_text]);
    this.sort();
  }
  addHighlight(duration) {
    if (!duration) return;
    this.blue = this.add
      .image(0, 0, "popup_blue")
      .setCustomPosition(0, 0, 0, 0)
      .setCustomAlign("Center")
      .setDepth(50)
      .setAlpha(0)
      .setScale(0.7);
    this.pink = this.add
      .image(0, 0, "popup_pink")
      .setCustomPosition(0, 0, 0, 0)
      .setCustomAlign("Center")
      .setDepth(50)
      .setAlpha(0)
      .setScale(0.7);
    this.tweens.add({
      targets: [this.pink],
      angle: "+=360",
      duration,
      delay: 200,
      onStart: () => {
        this.pink.setAlpha(1);
      },
      onComplete: () => {
        this.pink.setAlpha(0);
      },
    });
    this.tweens.add({
      targets: [this.blue],
      angle: "+=360",
      duration,
      delay: 200,
      onStart: () => {
        this.blue.setAlpha(1);
      },
      onComplete: () => {
        this.blue.setAlpha(0);
      },
    });
    this.mainContainer.add([this.blue, this.pink]);
    this.sort();
  }

  winAnimation() {
    this.win = new Win(this).setScale(0).setDepth(100);
    this.mainContainer.add([this.win]);
    this.sort();
  }

  openStore() {
    this.game.network.openStore();
  }
}
