import EnemyBullet from "../../EnemyBullet/EnemyBullet";
import GlobalTime from "../../OtherScript/GlobalDTime";
import BossHealth from "../BossHealth";
import BossStats from "../BossStats";

const {ccclass, property} = cc._decorator;

const Rad2Deg = 180/Math.PI;

@ccclass
export default class SpecificBoss extends cc.Component 
{
    //[Header("Bullets")]
    @property([cc.Node])
    WeaponsList: cc.Node[] = [];

    @property([cc.Prefab])
    BossBulletPrefabs: cc.Prefab[] = [];

    @property(cc.Float)
    ForceMultiplier = 1;
    @property(cc.Float)
    ShotRate = 25;
    @property(cc.Float)
    MoveRate = 25;

    //[Header("Skills")]
    @property(cc.Float)
    TimeBetweenBehaviors = 1;
    @property(cc.Float)
    MinTimeBetweenBehaviors = 0.25;
    @property(cc.Float)
    MovingTime = 2;
    @property(cc.Float)
    MinMovingTime = 0.25;
    @property(cc.Boolean)
    startPhrase: boolean = false;
    @property(cc.Integer)
    PhraseNo = 1;

    @property(cc.Boolean)
    isFollow: boolean = false;

    curTimerMove = 0;
    curTimerShot = 0;

    GameManager: cc.Node = null;
    isGameOver: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {
        this.GameManager = cc.find("GameManager");
        if(this.WeaponsList.length < this.node.childrenCount)
        {
            for(let i = 0; i < this.node.childrenCount; i++)
            {
                this.WeaponsList.push(this.node.children[i]);
            }
        }
    }

    protected onEnable(): void 
    {
        this.node?.on("NewPhase", this.NewPhrase, this);
        this.node?.on("SetDifficulty", this.SetDifficulty, this);
        this.GameManager?.on("GameOver", this.SetGameOver, this);
    }

    protected onDestroy(): void 
    {
        this.node?.off("NewPhase", this.NewPhrase, this);
        this.node?.off("SetDifficulty", this.SetDifficulty, this);
        this.GameManager?.off("GameOver", this.SetGameOver, this);
    }

    private NewPhrase()
    {
        this.PhraseNo++;
        if(this.PhraseNo > 1)
        {
            this.isFollow = true;
        }
    }

    private SetGameOver(value)
    {
        this.isGameOver = true;
    }

    private SetDifficulty(statMultipler: number)
    {
        this.TimeBetweenBehaviors = this.TimeBetweenBehaviors/statMultipler < this.MinTimeBetweenBehaviors? 
                                        this.MinTimeBetweenBehaviors : 
                                        this.TimeBetweenBehaviors/statMultipler;

        this.MovingTime = this.MovingTime/statMultipler < this.MinMovingTime? 
                            this.MinMovingTime : 
                            this.MovingTime/statMultipler;

        this.ShotRate = this.ShotRate*statMultipler > 100? 100 : this.ShotRate*statMultipler;
        this.MoveRate = this.MoveRate*statMultipler > 100? 100 : this.MoveRate*statMultipler;

        this.curTimerShot = this.TimeBetweenBehaviors;
        this.curTimerMove = this.MovingTime;
    }

    update (dt) 
    {
        if(this.node.getComponent(BossStats).MainTarget != null && this.node.getComponent(BossStats).finishSpawn && !this.startPhrase)
        {
            //this.schedule(this.BossShooting, this.TimeBetweenBehaviors, cc.macro.REPEAT_FOREVER);
            //this.schedule(this.BossMoving, this.MovingTime, cc.macro.REPEAT_FOREVER);
            this.startPhrase = true;
        }
        if(this.startPhrase && !this.isGameOver)
        {
            if(cc.isValid(this.node) && this.curTimerShot > 0)
            {
                this.curTimerShot -= dt * GlobalTime.TimeScale;
            }
            else if(cc.isValid(this.node) && this.curTimerShot <= 0)
            {
                this.BossShooting();
                this.curTimerShot = this.TimeBetweenBehaviors;
            }

            if(cc.isValid(this.node) && this.curTimerMove > 0)
            {
                this.curTimerMove -= dt * GlobalTime.TimeScale;
            }
            else if(cc.isValid(this.node) && this.curTimerMove <= 0)
            {
                this.BossMoving();
                this.curTimerMove = this.MovingTime;
            }
        }
    }

    private BossShooting()
    {
        if(!this.node.getComponent(BossHealth).isDead)
        {  
            if(Math.random()*100 <= this.ShotRate && 
                (this.node.getComponent(BossStats).MainTarget != null || 
                    this.node.getComponent(BossStats).SecondaryTargets.length > 0))
            {
                if(Math.random()*100 <= 100/this.PhraseNo)
                {    
                    for(let i = 0; i < this.WeaponsList.length; i++)
                    {
                        let target = this.node.getComponent(BossStats).MainTarget? 
                                        this.node.getComponent(BossStats).MainTarget : null;
                        let TargetPos = cc.Vec2.ZERO;
                        try
                        {
                            TargetPos = target? target.getPosition() : cc.Vec2.ZERO;
                        }
                        catch(e)
                        {
                            TargetPos = cc.Vec2.ZERO;
                        }
                        
                        let BossPos = this.node.getPosition();
                        let track = cc.Vec2.ZERO;
                        cc.Vec2.add(track, TargetPos, BossPos.multiplyScalar(-1));
                        track.normalizeSelf();

                        let upAngle = Math.atan2(this.node.up.y, this.node.up.x) * Rad2Deg;
                        let trackAngle = Math.atan2(track.y, track.x) * Rad2Deg; 

                        let Angle = this.isFollow? trackAngle - upAngle : -180;

                        let j = Math.floor(Math.random() * this.BossBulletPrefabs.length);
                        let bulletInstance = cc.instantiate(this.BossBulletPrefabs[j]);
                        
                        bulletInstance.parent = cc.director.getScene();
                        bulletInstance.setPosition(this.node.convertToWorldSpaceAR(this.WeaponsList[i].getPosition()));
                        bulletInstance.angle = Angle + 180;

                        //bulletInstance.GetComponent<EnemyBullet>().DistanceTravel = 20;
                        bulletInstance.getComponent(EnemyBullet).SetShootDirection(cc.v2(       
                                                                                    bulletInstance.up.x, 
                                                                                    bulletInstance.up.y));
                        //bulletInstance.AddForce(bulletInstance.transform.up * bulletInstance.GetComponent<EnemyBullet>().Speed * ForceMultiplier);
                    }
                }
                else
                {
                    let j = Math.floor(Math.random() * 26);
                    for(let i = 0; i < 16; i++)
                    {
                        var Angle = j+i*22.5;
                        
                        let bulletInstance = cc.instantiate(this.BossBulletPrefabs[0])
                        //bulletInstance.GetComponent<EnemyBullet>().DistanceTravel = 20;
                        
                        bulletInstance.parent = cc.director.getScene();
                        bulletInstance.setPosition(this.node.getPosition());
                        bulletInstance.angle = Angle;

                        bulletInstance.getComponent(EnemyBullet).SetShootDirection(cc.v2(       
                                                                                    bulletInstance.up.x, 
                                                                                    bulletInstance.up.y));
                        //bulletInstance.AddForce(bulletInstance.transform.up * bulletInstance.GetComponent<EnemyBullet>().Speed * ForceMultiplier);
                    }
                }
            }
        }
    }

    private BossMoving()
    {
        if(!this.node.getComponent(BossHealth).isDead)
        {  
            if(Math.random()*100 <= this.MoveRate && 
                (this.node.getComponent(BossStats).MainTarget != null || 
                    this.node.getComponent(BossStats).SecondaryTargets.length > 0))
            {
                let i = 0;
                i = Math.floor(Math.random() * (this.node.getComponent(BossStats).MovePoints.length/4) * this.PhraseNo);
                //transform.DOMove(GetComponent<Boss_SpawnAttr>().MovePoints[i], MovingTime).SetEase(Ease.Linear).SetLink(gameObject);
                cc.tween(this.node).to(this.MovingTime/GlobalTime.TimeScale,
                {
                    position: cc.v3(this.node.getComponent(BossStats).MovePoints[i].x,
                                    this.node.getComponent(BossStats).MovePoints[i].y,
                                    0
                    )
                }).start();
            }
        }
    }
}
