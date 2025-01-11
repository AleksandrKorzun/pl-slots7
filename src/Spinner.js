import { POSITIONS } from "./constants/Constants";

export default class Spinner extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);
    this.addSpinner();
    this.addStyles();
    // this.light();
    // this.moveArrow();
    this.spin();
    setInterval(() => {
      this.spin();
    }, 8000);
  }

  addStyles() {
    this.addProperties(["pos", "scale", "align"])
      .setCustomPosition(...POSITIONS.spinner)
      .setCustomScale(1, 1, 0.8, 0.8)
      .setCustomAlign("Right", "Top")
      .setDepth(7)
      .setAlpha(1);
  }

  addSpinner() {
    this.spinnerBase = this.scene.add
      .image(0, 0, "atlas", "spiner_base")
      .setScale(1.8)
      .setDepth(1);
    this.spinnerA = this.scene.add
      .image(0, 0, "atlas", "spiner_arrow")
      .setScale(1)
      .setDepth(3);
    this.spinnerC = this.scene.add
      .image(0, -220, "atlas", "arrow")
      .setScale(1)
      .setOrigin(0.5, 0)
      .setDepth(15);
    this.spinner = this.scene.add.image(0, 0, "atlas", "spiner").setDepth(2);
    this.spinnerL = this.scene.add
      .image(3, -120, "atlas", "spinner_light")
      .setScale(0.81)
      .setAlpha(0)
      .setDepth(10);
    this.add([
      this.spinnerBase,
      this.spinner,
      this.spinnerL,
      this.spinnerA,
      this.spinnerC,
    ]);
    this._sort();
  }
  light() {
    this.lightAnim = this.scene.tweens.add({
      targets: this.spinnerL,
      alpha: 1,
      duration: 100,
      yoyo: true,
      repeat: -1,
    });
  }
  moveArrow() {
    this.moveAnim = this.scene.tweens.add({
      targets: this.spinnerC,
      //   onStart: () => this.spinnerC.setAngle(-25),
      //   onStart: () => this.spinnerC.setAngle(0),
      angle: -35,
      duration: 100,
      yoyo: true,
      repeat: -1,
    });
  }
  spin() {
    this.scene.tweens.add({
      targets: this.spinner,
      onStart: () => {
        this.moveArrow();
        this.lightAnim?.remove();
        this.spinnerL.setAlpha(0);
      },
      onComplete: () => {
        this.light();
        this.moveAnim?.remove();
        this.spinnerC.setAngle(0);
      },
      angle: 360,
      duration: 1000,
      //   yoyo: true,
      repeat: 3,
    });
  }
}
