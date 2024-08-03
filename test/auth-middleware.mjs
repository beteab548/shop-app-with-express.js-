import { expect } from "chai";
import { describe } from "mocha";
const authMiddleware = require("./middleware/isAuth");
describe("authetication validation check", () => {
  it("should throw error if header is not present", () => {
    req: {
      get: () => {
        return null;
      };
    }
    const num2 = 5;
    expect
      .bind(
        this,
        authMiddleware(req, {}, () => {})
      )
      .to.throw('');
  });
});
