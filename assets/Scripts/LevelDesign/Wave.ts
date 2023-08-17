import EnemyPath from "../Enemies/EnemyPath";
import EnemyShape from "../Enemies/EnemyShape";

const {ccclass, property} = cc._decorator;

@ccclass("Wave")
export default class Wave
{
    @property(cc.Prefab)
    ObjectsThisWave: cc.Prefab[] = [];

    @property([cc.Prefab])
    EnemyShape: cc.Prefab[] = []

    @property([cc.Prefab])
    EnemyPath: cc.Prefab[] = []    
}
