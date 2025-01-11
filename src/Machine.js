import Utils from "@holywater-tech/ads-builder/framework/Utils";
import CoinBox from "./CoinBox2";
import Spin from "./Spin";
import {
  POSITIONS,
  POSITIONS_SPIN1,
  POSITIONS_SPIN2,
  POSITIONS_SPIN3,
  SCALES,
  SPIN_ITEMS,
} from "./constants/Constants";

export default class Machine extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);
    this.tweens = scene.tweens;
    this.addProperties(["pos", "scale"])
      .setCustomPosition(...POSITIONS.board)
      .setCustomScale(...SCALES.board)
      .setCustomAlign("Bottom")
      .setDepth(25)
      .setAlpha(1);
    this.isPortrait = this.scene.game.size.isPortrait;
    this.stopSpins = false;
    this.addMachine();
    // this.addCoinBox();
    this.btnPress();
    this.addSpin({ name: "left", x: -165, y: 0 });
    this.addSpin({ name: "center", x: -25, y: 0 });
    this.addSpin({ name: "right", x: 115, y: 0 });
    setTimeout(() => {
      if (this.status === "start") return;
      this.addHand();
    }, 2000);
  }

  addInteractive() {
    this.handle.setInteractive().once("pointerdown", this.onHandleClick, this);
  }

  addSpin(options) {
    this[options.name] = new Spin(this.scene)
      .setPosition(options.x, options.y)
      .setScale(0.7)
      .setDepth(3);
    this.add([this[options.name]]);
    this._sort();
  }

  // addCoinBox() {
  //   this.coinBox = new CoinBox(this.scene)
  //     .setPosition(-20, -150)
  //     .setScale(0.7)
  //     .setAlpha(0)
  //     .setDepth(6);
  //   this.add([this.coinBox]);
  //   this._sort();
  // }

  addMachine() {
    this.machine = this.scene.add
      .image(0, 0, "slot_machine")
      .setScale(0.74)
      .setDepth(4);
    this.table = this.scene.add
      .image(-27, -42, "slot_table")
      .setScale(0.74)
      .setDepth(2);
    this.btn = this.scene.add
      .image(-20, 140, "atlas", "spin")
      .setScale(0.74)
      .setDepth(7)
      .setSize(300, 300);
    this.btn_press = this.scene.add
      .image(-20, 140, "atlas", "spin_press")
      .setScale(0.74)
      .setAlpha(0)
      .setDepth(8);
    // this.hands = this.scene.add
    //   .image(120, 210, "atlas", "hand")
    //   .setAngle(0)
    //   .setDepth(30)
    //   .setScale(1);
    //   .setAngle(35);
    this.add([this.machine, this.table, this.btn, this.btn_press]);
    this._sort();
  }

  btnPress() {
    this.btn.setInteractive().on("pointerdown", () => this.start());
    // this.btn_press.setAlpha(1);
    // this.btn.setAlpha(0);
  }

  addHand() {
    if (this.left.status === "start") return;
    this.hands = this.scene.add
      .image(40, 20, "atlas", "tutorial_hand")
      .setAngle(-20)
      .setDepth(30)
      .setScale(0.9);
    this.add([this.hands]);
    this._sort();
    this.handleAnim = this.scene.tweens.add({
      targets: this.hands,
      angle: "+=5",
      y: "+=30",
      scale: "/=1.1",
      duration: 400,
      yoyo: true,
      repeat: -1,
    });
  }

  start() {
    this.reel = Utils.addAudio(this.scene, "reel", 0.5, false);
    this.btn.disableInteractive();
    this.handleAnim?.remove();
    this.hands?.destroy();
    this.btnAnim = this.scene.tweens.add({
      targets: this.btn_press,
      alpha: 1,
      duration: 200,
      yoyo: true,
    });
    this.scene.step += 1;
    this.left.status = "start";
    this.center.status = "start";
    this.right.status = "start";
    this.left.spinDuration = 50;
    this.left.move();
    setTimeout(() => {
      this.center.spinDuration = 50;
      this.center.move();
    }, 50);
    setTimeout(() => {
      this.right.spinDuration = 50;
      this.right.move();
    }, 100);
    setTimeout(() => {
      this.stop();
    }, 2000);
    this.removeAnimationFire();
  }

  stop() {
    // this.btn.disableInteractive();
    this.left.stop();
    setTimeout(() => {
      this.center.stop();
    }, 500);
    setTimeout(() => {
      this.right.stop();
    }, 800);
    setTimeout(() => {
      this.reel.stop();
      this.addAnimationFire();
    }, 2000);
    setTimeout(() => {
      if (this.scene.step === 1) {
        this.scene.add3x("three", 1800, 1700);
      }
      if (this.scene.step === 2) {
        this.scene.add3x("four", 1800, 1700);
      }
      if (this.scene.step === 3) {
        this.scene.add3x("five", 700, 2000);
        setTimeout(() => this.scene.add3x("six", 700), 700);
        setTimeout(() => this.scene.add3x("seven", 700), 1400);
        // setTimeout(() => this.scene.add3x("eight", 2000), 2100);
      }
    }, 3000);

    setTimeout(() => {
      if (this.scene.step === 1) {
        this.scene.coinBox2.changeCount(3);
        this.animationCoinBox();
        this.scene.winAnimation();
        this.scene.win.addBigWin();
      }
      if (this.scene.step === 2) {
        this.scene.coinBox2.changeCount(4);
        this.animationCoinBox();
        this.scene.winAnimation();
        this.scene.win.addMegaWin();
      }
      if (this.scene.step === 3) {
        this.scene.coinBox2.changeCount(0, 8000, 10000000);
        this.animationCoinBox();
        setTimeout(() => {
          //   this.scene.coinBox2.changeCount(81, 700);
          this.scene.winAnimation();
          this.scene.win.addJackpot();
          this.animationCoinBox();
        }, 2050);
        setTimeout(() => {
          //   this.scene.coinBox2.changeCount(729, 700);
          this.animationCoinBox();
        }, 4100);
        setTimeout(() => {
          //   this.scene.coinBox2.changeCount(9872);
          this.scene.winAnimation();
          this.animationCoinBox();
        }, 6150);
        setTimeout(() => {
          this.removeAnimationFire();
          //   this.scene.coinBox2.changeCount(9872);
          this.scene.finalScene();
        }, 10000);
      }
    }, 5500);
    setTimeout(() => this.btn.setInteractive(), 8000);
    setTimeout(() => {
      if (this.scene.step === 1) {
        this.addHand();
      }
      if (this.scene.step === 2) {
        this.addHand();
      }
    }, 10000);
  }

  animationCoinBox() {
    this.scene.tweens.add({
      targets: this.scene.coinBox2,
      scale: "*=1.05",
      duration: 100,
      yoyo: true,
      ease: "easeInOutBounce",
      repeat: 10,
      onStart: () => this.scene.coinBox2.setScale(0.8),
      onComplete: () => this.scene.coinBox2.setScale(0.7),
    });
  }

  addAnimationFire() {
    if (this.scene.step < 3) {
      this.left.emitter1.start().setAlpha(1);
      this.center.emitter1.start().setAlpha(1);
      this.right.emitter1.start().setAlpha(1);
    }
    if (this.scene.step > 2) {
      this.left.emitter0.start().setAlpha(1);
      this.center.emitter0.start().setAlpha(1);
      this.right.emitter0.start().setAlpha(1);
      this.left.emitter1.start().setAlpha(1);
      this.center.emitter1.start().setAlpha(1);
      this.right.emitter1.start().setAlpha(1);
      this.left.emitter2.start().setAlpha(1);
      this.center.emitter2.start().setAlpha(1);
      this.right.emitter2.start().setAlpha(1);
    }
  }
  removeAnimationFire() {
    this.left.emitter0.stop().setAlpha(0);
    this.center.emitter0.stop().setAlpha(0);
    this.right.emitter0.stop().setAlpha(0);
    this.left.emitter1.stop().setAlpha(0);
    this.center.emitter1.stop().setAlpha(0);
    this.right.emitter1.stop().setAlpha(0);
    this.left.emitter2.stop().setAlpha(0);
    this.center.emitter2.stop().setAlpha(0);
    this.right.emitter2.stop().setAlpha(0);
  }
}
