import { Entity, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Balances } from "./Balances";

@Entity()
export class AssetList {

    @PrimaryColumn()
    tokenAddress: string;

    @Column()
    symbol: string;

    @Column()
    name: string;

    @Column()
    tokenOwner: string;

    @Column()
    isPoolToken: boolean;

    @CreateDateColumn()
    createdDate: Date;

    @OneToMany(() => Balances, balances => balances.user)
    assetId: Balances[];

}
