import { EventEmitter } from "events";
import LocalNetTracker from "./trackers/LocalNet";
import Device from "./Device";

export default class TrackingPool extends EventEmitter {
  public devices: Device[];
  private tickMS: number;
  constructor(devices: Device[], tickMS = 1000) {
    super();
    this.devices = devices;
    this.tickMS = tickMS;
    this.startTickcking();
  }
  startTickcking() {
    const localNetTracker = new LocalNetTracker(this.devices);
    this.relayFoundEvents(localNetTracker);
    setInterval(() => localNetTracker.tick(), this.tickMS);
  }
  relayFoundEvents(tracker: EventEmitter) {
    tracker.on(
      "deviceFound",
      (...args: any[]) => this.emit("deviceFound", ...args),
    );
  }
}
