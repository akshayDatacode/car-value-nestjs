import { Transform } from "class-transformer";
import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";

export class GetEstimateDto {

  @IsString()
  make: string

  @IsString()
  model: string

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @Min(2)
  @Max(10000)
  @IsNumber()
  mileage: number;

  @Transform(({ value }) => parseInt(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseInt(value))
  @IsLatitude()
  lat: number;
}