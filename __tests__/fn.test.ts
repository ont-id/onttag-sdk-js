import { initTest } from "../src";

describe("test dessertFactoty feature", () => {
  test("produce all dessert", () => {
    console.log(initTest);
    expect(initTest).toBe('hi, boy!');
  })
})
