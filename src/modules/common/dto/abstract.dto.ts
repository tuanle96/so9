import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DYNAMIC_TRANSLATION_DECORATOR_KEY } from '../../app/decorators';
import { ContextProvider } from '../../app/providers';
import type { AbstractEntity } from '../entity/abstract.entity';

export class AbstractDto {
  @ApiProperty()
  id: Uuid;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // eslint-disable-next-line @moneteam/nestjs/api-property-returning-array-should-set-array, @typescript-eslint/no-use-before-define
  @ApiPropertyOptional({ type: () => AbstractTranslationDto })
  translations?: AbstractTranslationDto[];

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }

    const languageCode = ContextProvider.getLanguage();

    if (languageCode && entity.translations) {
      const translationEntity = entity.translations.find(
        (titleTranslation) => titleTranslation.languageCode === languageCode,
      )!;

      const fields: Record<string, string> = {};

      for (const key of Object.keys(translationEntity)) {
        const metadata = Reflect.getMetadata(
          DYNAMIC_TRANSLATION_DECORATOR_KEY,
          this,
          key,
        );

        if (metadata) {
          fields[key] = translationEntity[key];
        }
      }

      Object.assign(this, fields);
    } else {
      this.translations = entity.translations?.toDtos();
    }
  }
}

export class AbstractTranslationDto extends AbstractDto {
  constructor(entity: AbstractEntity) {
    super(entity, { excludeFields: true });
  }
}
