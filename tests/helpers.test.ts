import { search } from "../src/helpers/search";
import { normalizeInput } from "../src/helpers/text";

describe("search", () => {
  it("returns 0 when not found", () => {
    expect(search("hello world", " north ")).toBe(0);
  });

  it("returns 1-based index when found", () => {
    expect(search("abc north def", " north ")).toBe(4);
  });
});

describe("normalizeInput", () => {
  it("pads input with spaces", () => {
    expect(normalizeInput("test")).toBe(" test ");
  });

  it("converts only A-Z to lowercase", () => {
    expect(normalizeInput("HeLLo!")).toBe(" hello! ");
    expect(normalizeInput("123")).toBe(" 123 ");
  });
});
