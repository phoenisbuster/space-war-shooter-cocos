import EnemyBullet from "../EnemyBullet";

const {ccclass, property} = cc._decorator;

const Rad2Deg = 180/Math.PI;
@ccclass
export default class Homming extends cc.Component {

    @property(cc.Node)
    Target: cc.Node = null;

    @property(cc.Float)
    Speed = 5;
    @property(cc.Float)
    TurnSpeed = 100;
    @property(cc.Float)
    TimeToAim = 1;
    @property(cc.Boolean)
    HommingOnSpawn: boolean = false;

    isHomming: boolean = false;

    GameManager: cc.Node = null;
    

    // LIFE-CYCLE CALLBACKS:
    public onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider)
    {
        if(otherCollider.name == "Player<CircleCollider>" && selfCollider.tag == 1)
        {
            if(!this.isHomming && !this.HommingOnSpawn)
            {
                this.Target = otherCollider.node;
                this.isHomming = true;
                this.scheduleOnce(this.CountDownHomming, this.TimeToAim);
            }
        }
    }

    private CountDownHomming()
    {    
        this.isHomming = false;
    }

    // onLoad () {}

    start () 
    {
        this.GameManager = cc.find("GameManager");
        if(this.HommingOnSpawn == true)
        {
            this.Target = cc.find("Player");
            if(this.Target != null)
            {
                this.isHomming = true;
                this.scheduleOnce(this.CountDownHomming, this.TimeToAim);
            }
        }
    }

    protected onEnable(): void 
    {
        this.GameManager?.on("GameOver", this.SetGameOver, this);
    }

    protected onDestroy(): void 
    {
        this.GameManager?.off("GameOver", this.SetGameOver, this);
    }

    private SetGameOver()
    {
        this.isHomming = false;
        this.node.destroy();
    }

    update (dt) 
    {
        if(this.isHomming)
        {    
            if(this.Target != null)
            {
                let target = this.Target? this.Target : null;
                let TargetPos = cc.Vec2.ZERO;
                try
                {
                    TargetPos = target? target.getPosition() : cc.Vec2.ZERO;
                }
                catch(e)
                {
                    TargetPos = cc.Vec2.ZERO;
                }
                
                let BulletPos = this.node.getPosition();
                let track = cc.Vec2.ZERO;
                cc.Vec2.add(track, TargetPos, BulletPos.multiplyScalar(-1));
                track.normalizeSelf();

                let upAngle = Math.atan2(this.node.up.y, this.node.up.x) * Rad2Deg;
                let trackAngle = Math.atan2(track.y, track.x) * Rad2Deg;
                // let Direction = cc.Vec2.ZERO;
                // cc.Vec2.add(Direction, this.Target.getPosition(), this.node.getPosition().multiplyScalar(-1));
                // Direction.normalizeSelf();
                // let rotateAmmount = cc.Vec3.cross(cc.v3(), cc.v3(Direction), this.node.up).z;
                this.node.angle = (trackAngle - upAngle + 180) * this.TurnSpeed  * dt;
                this.node.getComponent(EnemyBullet).SetShootDirection(cc.v2(this.node.up.x, this.node.up.y));
            }
            else
            {
                this.isHomming = false;
            }
        }    
    }
}
