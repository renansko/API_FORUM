import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface instructorProps {
  nome: string
}

export class Instructor extends Entity<instructorProps> {
  get nome() {
    return this.props.nome
  }

  // constructor(props: instructorProps, id?: string){
  //     super(props, id) // class Entity
  // }

  static create(props: instructorProps, id?: UniqueEntityID) {
    const instructor = new Instructor(
      {
        ...props,
      },
      id,
    )

    return instructor
  }
}
