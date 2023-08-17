const {ccclass, property} = cc._decorator;

@ccclass
export default class BossStats extends cc.Component {

    //[Header("Targets")]
    @property(cc.Node)
    MainTarget: cc.Node = null;

    @property([cc.Node])
    SecondaryTargets: cc.Node[] = [];

    //[Header("Move Points")]
    @property([cc.Vec2])
    MovePoints: cc.Vec2[] = [];
    @property(cc.Float)
    MovingTime = 1;
    @property(cc.Boolean)
    finishSpawn: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public SetPath(pos: cc.Vec2)
    {
        // transform.DOMove(pos, MovingTime).SetEase(Ease.Linear).SetLink(gameObject).OnComplete(()=>
        // {
        //     finishSpawn = true;
        // });
        cc.tween(this.node).to(this.MovingTime, 
        {
            position: cc.v3(pos.x, pos.y, 0)
        }).call(()=>
        {
            this.finishSpawn = true;
        }).start();
    }

    start () 
    {
        if(this.MainTarget == null)
        {
            this.MainTarget = cc.find("Player");
        }
    }

    // update (dt) {}
}
