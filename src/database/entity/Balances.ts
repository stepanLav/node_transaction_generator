import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, Index } from "typeorm";
import { PolkaswapUser } from "./PolkaswapUser";
import { AssetList } from "./AssetList";

@Entity()
export class Balances {

    @Index()
    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    @Column({type: "text"})
    balance: string;

    @CreateDateColumn()
    created_date: Date;

    @Index()
    @ManyToOne(() => PolkaswapUser, user => user.balances)
    user: PolkaswapUser;

    @Index()
    @ManyToOne(() => AssetList, token => token.asset_id)
    asset: AssetList;

}