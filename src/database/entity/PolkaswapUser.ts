import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, BeforeInsert, UpdateDateColumn, OneToMany } from "typeorm";
import { Balances } from "./Balances";

@Entity()
export class PolkaswapUser {

    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    address: string;

    @Column()
    mnemonic: string;

    @Column()
    hasMoney: boolean;

    @Column()
    hasLiquidity: boolean;

    @Column()
    hasCustomToken: boolean;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @OneToMany(() => Balances, balances => balances.user)
    balances: Balances[];

    @BeforeInsert()
    beforeInsertActions() {
        this.hasMoney = false
        this.hasLiquidity = false
        this.hasCustomToken = false
    }
}