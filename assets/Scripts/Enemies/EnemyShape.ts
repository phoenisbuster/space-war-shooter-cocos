const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyShape extends cc.Component 
{
    @property([cc.Integer])
    ID_of_Pos: number[] = [];
    
}
