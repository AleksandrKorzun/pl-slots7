import { SPIN_ITEMS } from "./constants/Constants";
import Machine from "./Machine";

export default class Hall extends Phaser.GameObjects.Container {
  constructor(scene, options) {
    super(scene, 0, 0);
    this.addMachine();
    this.addStyles();
  }
  addStyles() {
    this.addProperties(["pos", "scale"])
      .setCustomPosition(0, 0, 0, 0)
      .setCustomScale(1, 1, 1, 1)
      .setCustomAlign("Bottom")
      .setDepth(7)
      .setAlpha(1);
  }
  addMachine() {
    this.machine1 = new Machine(this.scene, { x: 1080, y: 0, img: "machine2" });
    this.machine2 = new Machine(this.scene, { x: 720, y: 0, img: "machine1" });
    this.machine3 = new Machine(this.scene, {
      x: 360,
      y: 0,
      img: "machine3",
    });
    this.machine3.addSpin();
    this.machine4 = new Machine(this.scene, { x: 0, y: 0, img: "machine4" });
    this.machine5 = new Machine(this.scene, { x: -360, y: 0, img: "machine5" });
    this.machine6 = new Machine(this.scene, { x: -720, y: 0, img: "machine6" });
    this.machine7 = new Machine(this.scene, {
      x: -1080,
      y: 0,
      img: "machine7",
    });
    this.add([
      this.machine1,
      this.machine2,
      this.machine3,
      this.machine4,
      this.machine5,
      this.machine6,
      this.machine7,
    ]);
    this._sort();
  }
}
