import { Computer } from "../types";
import { createComputerEntities } from "./ComputerEntityConverter";

test("convert computer entity", () => {
  const computers: Computer[] = [
    {
      id: 1,
      name: "PlayerOne’s MacBook",
      managed: true,
      username: "player.one",
      model: "MacBookPro13,3",
      department: "",
      building: "",
      mac_address: "AA:BB:CC:11:22:33",
      udid: "8195CA16-7FFE-5855-A3DD-53FD768FA558",
      serial_number: "SERIAL123",
      report_date_utc: "2019-05-06T13:33:08.196+0000",
      report_date_epoch: 1557149588196,
    },
  ];

  const entities = createComputerEntities(computers);

  expect(entities).toEqual([
    {
      _class: ["Host", "Device"],
      _key: "user_endpoint_1",
      _type: "user_endpoint",
      building: "",
      department: "",
      displayName: "PlayerOne’s MacBook",
      id: 1,
      macAddress: "AA:BB:CC:11:22:33",
      managed: true,
      model: "MacBookPro13,3",
      name: "PlayerOne’s MacBook",
      reportDateEpoch: 1557149588196,
      reportDateUtc: "2019-05-06T13:33:08.196+0000",
      serialNumber: "SERIAL123",
      udid: "8195CA16-7FFE-5855-A3DD-53FD768FA558",
      username: "player.one",
    },
  ]);
});
