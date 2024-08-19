import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repositorio } from './entities/repositorio.entity';

@Injectable()
export class RepositorioService {

  constructor(

    @InjectRepository(Repositorio)
    private readonly repositorioRepository: Repository<Repositorio>

  ){}
  
  
  async create(createRepositorioDto: CreateRepositorioDto) {
    
    try {
      
      const repositorio = this.repositorioRepository.create( createRepositorioDto );
      await this.repositorioRepository.save(repositorio);

      return repositorio;

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda!');
    }

  }

  findAll() {
    return `This action returns all repositorio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repositorio`;
  }

  update(id: number, updateRepositorioDto: UpdateRepositorioDto) {
    return `This action updates a #${id} repositorio`;
  }

  remove(id: number) {
    return `This action removes a #${id} repositorio`;
  }
}
