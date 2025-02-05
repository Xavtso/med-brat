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
      throw new HttpException('Не передано симптоми', HttpStatus.BAD_REQUEST);
    }

    // 1. Отримуємо діагноз від python-service
    const diagnosis = await this.diagnosisService.analyzeSymptoms(symptoms);

    // 2. Генеруємо рекомендацію
    const recommendation = this.diagnosisService.getRecommendation(diagnosis);

    // 3. Повертаємо відповідь
    return {
      message: `При даних симптомах найімовірніше у вас: "${diagnosis}".`,
      recommendation,
    };
  }
}
