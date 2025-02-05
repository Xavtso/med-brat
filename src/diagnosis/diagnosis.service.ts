import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DiagnosisService {
  // URL вашого python-service
  private pythonServiceUrl = 'http://0.0.0.0:8000';

  public async analyzeSymptoms(symptoms: string): Promise<string> {
    try {
      // Надсилаємо запит до Python-сервісу
      const response = await axios.post(`${this.pythonServiceUrl}/predict`, {
        symptoms: symptoms,
      });

      // Припустимо, Python повертає { diagnosis: "..." }
      const { en_diagnosis: diagnosis } = response.data;
      return diagnosis;
    } catch (error) {
      console.error('Помилка при виклику python-сервісу:', error.message);
      throw new HttpException(
        'Помилка на стороні сервера (python-service недоступний)',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Можемо на додачу сформувати рекомендацію залежно від згенерованого діагнозу.
   */
  public getRecommendation(diagnosis: string): string {
    // Проста демонстрація
    if (diagnosis.toLowerCase().includes('застуда')) {
      return 'Пийте більше води, відпочивайте, полоскання горла';
    }
    if (diagnosis.toLowerCase().includes('грип')) {
      return 'Рекомендую обов’язково звернутися до лікаря, приймати ліки за призначенням';
    }
    // За замовчуванням
    return 'Слідкуйте за симптомами та зверніться до лікаря за потреби.';
  }
}
