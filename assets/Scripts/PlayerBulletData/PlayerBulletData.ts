const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerBulletData extends cc.Component
{
    @property([cc.Prefab])
    bullets: cc.Node[] = [];

    @property([cc.Integer])
    bulletOrder: number[] = [];    
}
