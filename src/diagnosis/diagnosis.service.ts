// diagnosis.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DiagnosisService {
  private pythonServiceUrl = 'http://localhost:8000';

  public async analyzeSymptoms(symptoms: string): Promise<any> {
    try {
      const response = await axios.post(`${this.pythonServiceUrl}/predict`, {
        symptoms: symptoms,
      });
      return response.data; // Тут прийде { message: "...", ... }
    } catch (error) {
      console.error('Помилка виклику python-сервісу:', error.message);
      throw new HttpException(
        'Сервер недоступний (python-service).',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
