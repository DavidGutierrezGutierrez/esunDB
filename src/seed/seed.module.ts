import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { RepositorioModule } from 'src/repositorio/repositorio.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [RepositorioModule]
})
export class SeedModule {}
