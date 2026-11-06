import { Injectable } from '@nestjs/common';
import { DISCIPLINE_CATEGORIES, type DisciplineCategoryCount } from '@joj/shared';
import { DisciplineRepository } from '../discipline.repository';

@Injectable()
export class CountDisciplinesByCategory {
  constructor(private readonly disciplines: DisciplineRepository) {}

  /** Une entrée par catégorie, dans l'ordre de la liste fermée, y compris celles à 0. */
  async execute(): Promise<DisciplineCategoryCount[]> {
    const disciplines = await this.disciplines.list();
    return DISCIPLINE_CATEGORIES.map((category) => ({
      category,
      count: disciplines.filter((discipline) => discipline.category === category).length,
    }));
  }
}
