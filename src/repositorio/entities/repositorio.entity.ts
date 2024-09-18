import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RepositorioArchivo } from "./";

@Entity({ name: 'repositorios'})
export class Repositorio {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    title: string;

    @Column('text')
    docente: string;
    
    @Column('text')
    materia: string;
    
    @Column('numeric', {
        default: 0
    })
    seccion: number;

    @Column('text', {
        nullable: true
    })
    anotacion: string;

    @Column('text', {
        nullable: true
    })
    comentario: string;

    @Column('text', {
        unique: true
    })
    cu: string; //cu -> clave única

    @Column('text')
    tt: string; //tt -> tipo trabajo

    @OneToMany(
        () => RepositorioArchivo,
        (repositorioArchivo) => repositorioArchivo.repositorio,
        {cascade: true, eager: true}
    )
    archivoComprimido?: RepositorioArchivo[];

    @BeforeInsert()
    checkCUinsert(){ //Before insert funciona para saber como queremos guardar algo antes de que sea insertado en la base de datos
        if ( !this.cu ){
            this.cu = this.docente + this.materia;        
        }

        this.cu = this.cu.toLocaleLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
            .replaceAll('á','a')
            .replaceAll('é','e')
            .replaceAll('í','i')
            .replaceAll('ó','o')
            .replaceAll('ú','u')
            .replaceAll('ñ','n')
    }

    @BeforeUpdate()
    checkCUupdate(){
        if( !this.cu ){
            this.cu = this.docente + this.materia;
        }

        this.cu = this.cu.toLocaleLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
            .replaceAll('á','a')
            .replaceAll('é','e')
            .replaceAll('í','i')
            .replaceAll('ó','o')
            .replaceAll('ú','u')
            .replaceAll('ñ','n')
    }

}
