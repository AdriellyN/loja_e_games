import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({name:"tb_usuarios"})
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 255, nullable: false})
    nome: string

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @IsEmail()
    @Column({length: 255, nullable: false})
    usuario: string

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @MinLength(8)
    @Column({length: 255, nullable: false})
    senha: string

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 10, nullable: false})
    dataNascimento: string

    @Column({length: 5000})
    foto: string

}