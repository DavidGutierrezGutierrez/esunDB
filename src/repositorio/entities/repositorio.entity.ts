import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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

    //imgs
    //archv.
    //compresos

}
