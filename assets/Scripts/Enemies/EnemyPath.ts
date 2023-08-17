const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyPath extends cc.Component {

    /*
        Left: 0-9
        Right: 10-19
        Low: 20-25
        Up: 26-31
        Mid: 32-81
    */
    @property([cc.Integer])
    firstPoint: number[] = [];

    @property([cc.Integer])
    middlePointIndex: number[] = [];

    @property(cc.Float)
    time = 0.5;
}
