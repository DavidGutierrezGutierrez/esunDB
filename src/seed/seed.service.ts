import { Injectable } from '@nestjs/common';
import { RepositorioService } from '../repositorio/repositorio.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor (
    private readonly repositorioService: RepositorioService
  ){}  
 
  async runSeed(){

    await this.insertNewRepositories();

    return 'SEED EXECUTED';
  }

  private async insertNewRepositories(){
    await this.repositorioService.deleteAllRepositorios();

    const repositorios = initialData.repositorios;

    const insertPromises = [];

    repositorios.forEach( repositorio => {
      insertPromises.push( this.repositorioService.create( repositorio) );
    });

    await Promise.all( insertPromises );

    return true;
  }

}
