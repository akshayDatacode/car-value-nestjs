import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDtop } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) { }

  @Post()
  createReport(@Body() body: CreateReportDtop) {
    return this.reportService.create(body)
  }
}
