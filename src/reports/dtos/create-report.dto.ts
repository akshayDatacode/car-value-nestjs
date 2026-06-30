import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReportDtop {

  @IsString()
  make: string

  @IsString()
  model: string

  @IsNumber()
  @Min(1930)
  year: number;

  @Min(2)
  @Max(10000)
  @IsNumber()
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(3000)
  price: number;
}