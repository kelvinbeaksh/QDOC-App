/* eslint-disable import/no-cycle */
import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import Clinic from "./clinic";
import Patient from "./patient";
import Doctor from "./doctor";
import Ticket from "./ticket";

export interface RecordAttributes {
  patientId: number,
  clinicId: number,
  doctorId: number,
  ticketId: number,
  bill: string,
  prescription: string,
  medcert: string
}

export interface RecordAttributesWithId extends RecordAttributes {
  id: number
}

@Table({ tableName: "Records" })

export default class Record extends Model {
  @Column({ allowNull: false, primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
  public id!: number;

  @ForeignKey(() => Patient)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public patientId!: number;

  @BelongsTo(() => Patient)
  public patient!: Patient;

  @ForeignKey(() => Clinic)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public clinicId!: number;

  @BelongsTo(() => Clinic)
  public clinic!: Clinic;

  @ForeignKey(() => Doctor)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public doctorId!: number;

  @BelongsTo(() => Doctor)
  public doctor!: Doctor;

  @ForeignKey(() => Ticket)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public ticketId!: number;

  @BelongsTo(() => Ticket)
  public ticket!: Ticket;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public bill!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public prescription!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public medcert!: string;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;
}
