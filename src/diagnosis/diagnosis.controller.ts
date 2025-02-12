// diagnosis.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';

@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post()
  async getDiagnosis(@Body('symptoms') symptoms: string) {
    if (!symptoms) {
      throw new HttpException('Симптоми не передано', HttpStatus.BAD_REQUEST);
    }

    const responseData = await this.diagnosisService.analyzeSymptoms(symptoms);
    return responseData;
  }
}
