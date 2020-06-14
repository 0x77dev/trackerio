import { EventEmitter } from "events";
import arp from "@network-utils/arp-lookup";
import Device from "../Device";

export interface LocalNetDevice {
  ip: string;
  mac: string;
}

export default class LocalNetTracker extends EventEmitter {
  public id: Readonly<string> = "localNetwork";
  public alias: Readonly<string> = "Local Network";
  private devices: Readonly<Device[]>;

  constructor(devices: Device[]) {
    super();
    this.devices = devices;
  }

  private searchDeviceByLanMac(lanMAC: string): Device | undefined {
    return this.devices.find((device) => device.lanMAC === lanMAC);
  }

  private async discoverDevices(): Promise<LocalNetDevice[]> {
    const arpTable = await arp.getTable();
    return arpTable.map((arpTableRow) => ({
      ip: arpTableRow.ip,
      mac: arpTableRow.mac,
    }));
  }

  public async tick(): Promise<void> {
    const lanDevices: LocalNetDevice[] = await this.discoverDevices();
    for (let i = 0; i < lanDevices.length; i++) {
      const lanDevice = lanDevices[i];
      const device = this.searchDeviceByLanMac(lanDevice.mac);
      if (device !== undefined) {
        this.emit("deviceFound", device, this.id, this.alias);
      }
    }
  }
}
