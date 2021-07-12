import { Entity, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Balances } from "./Balances";

@Entity()
export class AssetList {

    @PrimaryColumn({type: "text"})
    token_address: string;

    @Column({type: "text"})
    symbol: string;

    @Column({type: "text"})
    name: string;

    @Column({type: "text"})
    token_owner: string;

    @Column({type: "bool"})
    is_pool_token: boolean;

    @CreateDateColumn()
    created_date: Date;

    @OneToMany(() => Balances, balances => balances.user)
    asset_id: Balances[];

}
