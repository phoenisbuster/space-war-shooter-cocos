import SingleEnemy from "../Enemies/SingleEnemy";
import EnemyBullet from "../EnemyBullet/EnemyBullet";
import GlobalTime from "../OtherScript/GlobalDTime";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletPattern extends cc.Component {

    @property(cc.Boolean)
    useArray: boolean = true;

    SpawnList: cc.Node[] = []

    @property(cc.Float)
    BulletArray = 1;
    @property(cc.Float)
    StartAngle = 0;
    @property(cc.Float)
    SpreadAngle = 0;

    @property(cc.Float)
    BulletPerArray = 1;
    @property(cc.Float)
    AngleBetweenBullet = 0;

    @property(cc.Float)
    CurSpinSpeed = 0;
    @property(cc.Float)
    SpinAccelerate = 0;
    @property({
        type: cc.Float,
        max: 360,
        min: 0
    })
    MaxSpinSpeed = 0;
    @property(cc.Boolean)
    invertSpin: boolean = false;

    @property(cc.Float)
    FireRate = 0.25;
    curTimer = 0;

    @property(cc.Float)
    MaxBullets = 500;
    curBullet = 0; 

    @property(cc.Prefab)
    BulletPrefab: cc.Prefab = null;
    @property([cc.Float])
    deltaAngle: number[] = [];
    @property([cc.Float])
    MaxdeltaAngle: number[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        if(!this.useArray)
        {
            this.node.children.forEach(ele=>
            {
                this.SpawnList.push(ele);
            });
        }
    }

    start () 
    {
        this.curTimer = this.FireRate;
    }

    GenerateBullet(dt)
    {
        if(this.curBullet <= this.MaxBullets)
        {    
            let numOfArray = this.useArray? this.BulletArray : this.SpawnList.length;

            for(let i = 0; i < numOfArray; i++)
            {
                for(let j = 0; j < this.BulletPerArray; j++)
                {    
                    let spawnPos = this.useArray? 
                                    this.node.getPosition() : 
                                    this.node.convertToWorldSpaceAR(this.SpawnList[i].getPosition());
                    if(this.node.getComponent(SingleEnemy))
                    {
                        if(!this.node.getComponent(SingleEnemy).isGenerating)
                        {
                            spawnPos = this.node.parent.parent.convertToWorldSpaceAR(
                                this.node.parent.getPosition());
                        }
                    }

                    let offsetAngle = this.AngleBetweenBullet*j;
                    let Angle = this.StartAngle + i*this.SpreadAngle + offsetAngle + this.CurSpinSpeed;
                    let bulletInstance = cc.instantiate(this.BulletPrefab)
                    //bulletInstance.GetComponent<EnemyBullet>().DistanceTravel = 20;
                    
                    bulletInstance.parent = cc.director.getScene();
                    bulletInstance.setPosition(spawnPos);
                    bulletInstance.angle = Angle;

                    bulletInstance.getComponent(EnemyBullet).SetShootDirection(cc.v2(       
                                                                                bulletInstance.up.x, 
                                                                                bulletInstance.up.y));
                    if(j < this.deltaAngle.length && j < this.MaxdeltaAngle.length)
                    {
                        bulletInstance.getComponent(EnemyBullet).SetDeltaAngle(this.deltaAngle[j], 
                                                                                this.MaxdeltaAngle[j]);
                    }
                    //cc.warn("Spin Speed " + this.deltaAngle);
                    bulletInstance?.on("BulletDestroy", this.ReduceNoBullets, this);
                    this.curBullet += 1;
                }
            }
        }
    }

    ReduceNoBullets()
    {
        this.curBullet -= this.curBullet > 0? 1 : 0;
    }

    update (dt) 
    {
        if(this.curTimer <= 0)
        {
            this.GenerateBullet(dt);
            this.curTimer = this.FireRate;
        }
        else
        {
            this.curTimer -= dt*GlobalTime.TimeScale;
        }

        if(!this.invertSpin)
        {
            this.CurSpinSpeed += this.SpinAccelerate * dt*GlobalTime.TimeScale;
        }
        else
        {
            this.CurSpinSpeed -= this.SpinAccelerate * dt*GlobalTime.TimeScale;
        }
        if(this.MaxSpinSpeed > 0 && this.CurSpinSpeed >= this.MaxSpinSpeed)
        {
            this.invertSpin = !this.invertSpin;
        }
        if(this.MaxSpinSpeed > 0 && this.CurSpinSpeed <= -this.MaxSpinSpeed)
        {
            this.invertSpin = !this.invertSpin
        }

        if(this.CurSpinSpeed > 360 || this.CurSpinSpeed < -360)
        {
            this.CurSpinSpeed = 0;
        }
    }
}
