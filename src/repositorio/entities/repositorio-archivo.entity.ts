import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Repositorio } from ".";


@Entity({ name: 'archivos' })
export class RepositorioArchivo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    urlArchivoComprimido: string;

    @ManyToOne(
        () => Repositorio,
        (repositorio) => repositorio.archivoComprimido,
        { onDelete: 'CASCADE' } // esta opcion permite borrar archivos que se le indiquen borrar y los asociados aunque estén en otras tablas
    )
    repositorio: Repositorio;
}