import hello from "../src/hello"

describe("hello func", () => {
  test("should be 'Hello, world!'", () => {
    const name = "world"
    expect(hello(name)).toBe("Hello, world!")
  })
})
