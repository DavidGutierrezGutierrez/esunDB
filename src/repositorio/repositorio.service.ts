import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID} from 'uuid';

import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { PaginacionDto } from '.././common/dtos/paginacion.dto';
import { Repositorio, RepositorioArchivo } from './entities';

@Injectable()
export class RepositorioService {

  //propiedad privada para ser llamado en los loggers de consola cuando ocurra un error
  private readonly logger = new Logger('RepositorioService');

  constructor(

    @InjectRepository(Repositorio)
    private readonly repositorioRepository: Repository<Repositorio>,
    
    @InjectRepository(RepositorioArchivo)
    private readonly repositorioarchivoRepository: Repository<RepositorioArchivo>,

    private readonly datasource: DataSource,

  ){}
  
  
  async create(createRepositorioDto: CreateRepositorioDto) {
    
    try {
      const { archivoComprimido = [], ...repositorioDetails } = createRepositorioDto;
      const repositorio = this.repositorioRepository.create( {
        ...repositorioDetails,
        archivoComprimido: archivoComprimido.map( repositorioArchivo => this.repositorioarchivoRepository.create({ urlArchivoComprimido: repositorioArchivo }))
      } ); //preparamos el archivo que se va a subir
      await this.repositorioRepository.save(repositorio); //guardamos la información del repositorio en la BD

      return { ...repositorio, archivoComprimido: archivoComprimido };

    } catch (error) {
      this.manejarBDExcepciones(error);
    }

  }

  async findAll( paginacionDto: PaginacionDto) {

    const { limite_entidades = 10, pagina = 0 } = paginacionDto;

    // return this.repositorioRepository.find({
    //   take: limite_entidades,
    //   skip: pagina,
    //   relations: {
    //     archivoComprimido: true,
    //   }
    // });
    //para aplanar las imagenes es necesario hacer las siguientes lineas: 58 - 
    const repositorios = await this.repositorioRepository.find({
      take: limite_entidades,
      skip: pagina,
      relations: {
        archivoComprimido: true,
      }
    })

    return repositorios.map( repositorio => ({
      ...repositorio,
      archivoComprimido: repositorio.archivoComprimido.map( archcomp => archcomp.urlArchivoComprimido )
    }))
  }

  async findOne(term: string) {

    let repo: Repositorio;

    if ( isUUID(term) ){
      repo = await this.repositorioRepository.findOneBy({ id: term });
    } else {
      repo = await this.repositorioRepository.findOneBy({ cu:  term });
      //las sentencias abajo escritas funcionan para hacer una busqueda por título o cu ademas de que solo retornan una sola entidad
      // const queryBuilder = this.repositorioRepository.createQueryBuilder();
      // repo = await queryBuilder
      //   .where('UPPER(title) =:title or cu =:cu', {
      //     title: term.toUpperCase(),
      //     cu: term.toLowerCase(),
      //   }).getOne();
    }
      // const repo = await this.repositorioRepository.findOneBy({ term });
      
      if( !repo ) throw new NotFoundException(`La solicitud con el id: ${term} proporcionado no existe en la BD`);
      
      return repo;
  }

  async findOnePlain( term: string ){
    const { archivoComprimido = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      archivoComprimido: archivoComprimido.map( archrepo => archrepo.urlArchivoComprimido )
    }
  }

  // async findOne(id: string) {

  //     const repo = await this.repositorioRepository.findOneBy({ id });
      
  //     if( !repo ) throw new NotFoundException(`La solicitud con el id: ${id} proporcionado no existe en la BD`);
      
  //     return repo;
  // }



  async update(id: string, updateRepositorioDto: UpdateRepositorioDto) {

    const { archivoComprimido, ...toUpdate } = updateRepositorioDto;

    const repo = await this.repositorioRepository.preload({ id, ...toUpdate });

    if( !repo ) throw new NotFoundException(`Producto con el id: ${id} no encontrado`);

    //borrar los archivos de manera controlada Create Query Runner
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect(); //realiza transaccion porque puede que siga ejecutando las siguientes instrucciones y aun no esté conectado
    await queryRunner.startTransaction(); //inicia un stack de cambios

    try {

      if( archivoComprimido ){
        //borrar archivos anteriores mediante query runner
        await queryRunner.manager.delete( RepositorioArchivo, { repositorio: { id } } );
        repo.archivoComprimido = archivoComprimido.map( 
          archrepo => this.repositorioarchivoRepository.create({ urlArchivoComprimido: archrepo }) 
        )
      }

      // la linea de abajo intenta guardar el archivo del repositorio pero puede fallar 8:55
      await queryRunner.manager.save( repo );

      // para impactar o grabar los cambios en la BD se usa la siguiente linea
      await queryRunner.commitTransaction();

      // despues de usar la linea de abajo ya no pueden revertirse los cambios
      await queryRunner.release();

      // await this.repositorioRepository.save(repo);
      // return repo;
      return this.findOnePlain( id );
    } catch (error) {
      // en caso de que las lineas de borrado y guardado fallen, la linea de abajo impide que se graben cambios en la BD
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.manejarBDExcepciones(error);
    }
  }

  async remove(id: string) {

    const repositorio = await this.findOne(id); //primero encontramos el producto que queremos eliminar
    await this.repositorioRepository.remove(repositorio); //luego lo eliminamos de la BD

    return `El repositorio con el id: [${id}] fue eliminado con éxito`;
  }

  private manejarBDExcepciones( error: any ){ //este método captura los posibles errores previstos y no previstos en un try-catch
    if( error.code === '23505' ) throw new BadRequestException(error.detail);
    if( error.code === '9832' ) throw new BadRequestException(error.detail);

      this.logger.error(error);
      throw new InternalServerErrorException('Error inesperado, revisar logs');
  }

  async deleteAllRepositorios(){
    const query = this.repositorioRepository.createQueryBuilder('repositorio');

    try {
      return await query
      .delete()
      .where({})
      .execute();
    } catch (error){
      this.manejarBDExcepciones(error);
    }
  }
}
