import { ValidationPipe } from "./validation.pipe";
import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { IsString } from "class-validator";

class TestDto {
  @IsString()
  name: string;
}

describe("ValidationPipe", () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = new ValidationPipe();
  });

  it("should pass through when no metatype is provided", async () => {
    const value = { name: "test" };

    expect(await validationPipe.transform(value, { metatype: null, type: "body" })).toBe(value);
  });

  it("should pass through when metatype does not require validation", async () => {
    const value = "test";

    expect(await validationPipe.transform(value, { metatype: String, type: "body" })).toBe(value);
  });

  it("should validate and throw an error if validation fails", async () => {
    const value = { name: 123 };
    const metadata: ArgumentMetadata = { metatype: TestDto, type: "body" };

    await expect(validationPipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
  });

  it("should validate and return the value if validation succeeds", async () => {
    const value = { name: "test" };
    const metadata: ArgumentMetadata = { metatype: TestDto, type: "body" };

    await expect(validationPipe.transform(value, metadata)).resolves.toBe(value);
  });
});
