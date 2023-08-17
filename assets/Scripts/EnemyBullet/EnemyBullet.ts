import GlobalTime from "../OtherScript/GlobalDTime";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyBullet extends cc.Component {

    @property(cc.Float)
    dmg = 1;

    @property(cc.Float)
    DistanceTravel = 0;

    @property(cc.Float)
    Speed = 5;

    @property(cc.Float)
    Accelerate = 2.5;

    @property(cc.Vec2)
    startPos: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Float)
    ExistTime = 10;

    @property(cc.Float)
    initialAngle = 0;

    @property(cc.Boolean)
    isNormalBehav: Boolean = true;

    @property(cc.Vec2)
    ShootDirection: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Boolean)
    isDestructible = false;

    deltaAngle = 0;
    maxAngle = 0;
    countAngle = 0;

    public SetShootDirection(direct: cc.Vec2)
    {
        this.ShootDirection = direct;
    }

    public SetDeltaAngle(value: number, maxValue: number)
    {
        this.deltaAngle = value;
        this.maxAngle = maxValue;
        // cc.warn("Spin deltaAngle " + this.deltaAngle);
        // cc.warn("Spin maxAngle " + this.maxAngle);
    }

    public onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider)
    {
        if(selfCollider.tag == 0)
        {    
            if(otherCollider.name == "Player<CircleCollider>")
            {
                //this.ReceiveDmg(this.MaxHealth*1000);
                this.DestroyBullet();
            }
            if(otherCollider.name == "PlayerBullet<BoxCollider>" && this.isDestructible)
            {
                //this.ReceiveDmg(5);
                this.DestroyBullet();
            }
            if(otherCollider.name == "BoundaryLeft<BoxCollider>" ||
                otherCollider.name == "BoundaryRight<BoxCollider>" ||
                otherCollider.name == "BoundaryLow<BoxCollider>" ||
                otherCollider.name == "BoundaryUp<BoxCollider>")
            {
                this.DestroyBullet();
            }
            
        }
    }

    DestroyBullet()
    {
        this.node.emit("BulletDestroy");
        this.node.active =false;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected onDisable(): void 
    {
        cc.Tween.stopAllByTarget(this);
        this.node.destroy();
    }

    start () 
    {
        this.startPos = this.node.getPosition();
        this.initialAngle = this.node.angle;
        setTimeout(function() 
        {
            if(this.node != null)
                this.node.destroy();    
        }.bind(this), (this.ExistTime*1000)/GlobalTime.TimeScale);
    }

    update(dt) 
    {
        if(cc.isValid(this.node) && cc.Vec2.distance(this.node.getPosition(), this.startPos) > this.DistanceTravel && this.DistanceTravel > 0)
        {
            this.node.destroy();
        }
        if(cc.isValid(this.node) && this.isNormalBehav)
        {
            let Pos = new cc.Vec2();

            cc.Vec2.multiplyScalar(Pos, this.ShootDirection, this.Speed*dt*GlobalTime.TimeScale);
            this.node.getPosition().add(Pos, Pos);
            this.node.setPosition(Pos);

            this.Speed += this.Accelerate * dt;
        }

        if(cc.isValid(this.node))
        {
            this.countAngle += this.deltaAngle * dt * GlobalTime.TimeScale;
            this.node.angle += this.deltaAngle * dt * GlobalTime.TimeScale;
            if(this.maxAngle > 0 && (this.countAngle >= this.maxAngle || this.countAngle <= -this.maxAngle))
            {
                this.deltaAngle = -this.deltaAngle;
            }
            this.SetShootDirection(cc.v2(this.node.up.x, this.node.up.y));
        }
    }
}
