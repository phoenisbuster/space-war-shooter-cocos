import SingleEnemy from "../../Enemies/SingleEnemy";
import PlayerBullet from "../PlayerBullet";

const {ccclass, property} = cc._decorator;

const Rad2Deg = 180/Math.PI;
@ccclass
export default class HommingBullet extends cc.Component {

    @property([cc.Node])
    TargetList: cc.Node[] = [];

    @property(cc.Node)
    Shooter: cc.Node = null;
    @property(cc.Node)
    Target: cc.Node = null;

    EnemiesGroup: cc.Node = null;

    @property(cc.Float)
    peed = 5;
    @property(cc.Float)
    TurnSpeed = 50;
    @property(cc.Float)
    TimeToAim = 1;

    @property(cc.Boolean)
    HommingOnSpawn: boolean = false;
    @property(cc.Boolean)
    HommingEnemies: boolean = true;
    @property(cc.Boolean)
    HommingMeteo: boolean = true;
    @property(cc.Boolean)
    HommingBoss: boolean = true;

    isHomming: boolean = false;
    
    GlobalTimeScale: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        this.GlobalTimeScale = cc.find("GlobalTimeScale");
        if(this.HommingOnSpawn == true)
        {
            let Enemies: cc.Node[] = [];
            let Meteorite: cc.Node[] = [];
            let Boss: cc.Node = null;

            cc.director.getScene().children.forEach(ele =>
            {
                if(ele.name == "Player")
                {
                    this.Shooter = ele;//.getPosition();
                }
                if(ele.name == "Meteorites" && this.HommingMeteo)
                {
                    ele.children.forEach(e=>
                    {
                        if(e.name == "Meteo")
                        {
                            Meteorite.push(e);//.getPosition());
                        }    
                    });
                }
                if(ele.name == "Bosses" && this.HommingBoss)
                {
                    Boss = ele.children[0];//.getPosition();
                }
                if(ele.name == "Enemy" && this.HommingEnemies)
                {
                    Enemies.push(ele);//.getPosition());
                }
                if(ele.name == "Enemies" && this.HommingEnemies)
                {
                    if(!this.EnemiesGroup)
                    {
                        this.EnemiesGroup = ele;
                    }
                    ele.children.forEach(e=>
                    {
                        if(e.childrenCount > 0 && e.children[0].name == "Enemy")
                        {
                            Enemies.push(e.children[0]);//.convertToWorldSpaceAR(e.getPosition()));
                        }
                    });
                }
            });

            if(Enemies.length > 0)
            {
                this.TargetList = this.TargetList.concat(Enemies);
            }
            if(Meteorite.length > 0)
            {
                this.TargetList = this.TargetList.concat(Meteorite);
            }
            if(Boss != null)
            {
                this.TargetList.push(Boss);
            }
            //cc.warn("TarGetList is " + this.TargetList.length);
        }
    }

    start () 
    {
        if(this.TargetList.length > 0)
        {
            this.isHomming = true;
            this.Target = this.MostCloseEnemy();
        }
    }

    public MostCloseEnemy(): cc.Node
    {
        let index = 0;
        if(this.TargetList.length == 1)
        {
            index = 0;
            //cc.warn("TARGET LEN is " + this.TargetList.length);
        }
        else
        {
            index = 0;
            let distance = 999999;
            let TargetPos = cc.Vec2.ZERO;
            if(this.TargetList[0] != null && this.Shooter != null)
            {    
                //cc.warn("Enemy Name is " + this.TargetList[0].getComponent(SingleEnemy).isGenerating);
                if(this.TargetList[0].name == "Enemy" && !this.TargetList[0].getComponent(SingleEnemy).isGenerating)
                {
                    TargetPos = this.EnemiesGroup.convertToWorldSpaceAR(this.TargetList[0].parent.getPosition());
                    //cc.warn("TRUE Enemy Pos is " + TargetPos);
                }
                else
                {
                    TargetPos = this.TargetList[0].getPosition();
                    //cc.warn("FALSE Enemy Pos is " + TargetPos);
                }    
            } 
            distance = cc.Vec2.add(cc.v2(), TargetPos, this.Shooter.getPosition()).len();
            for(let i = 1; i < this.TargetList.length; i++)
            {
                let TargetPos = cc.Vec2.ZERO;
                if(this.TargetList[i].name == "Enemy" && !this.TargetList[i].getComponent(SingleEnemy).isGenerating)
                {
                    TargetPos = this.EnemiesGroup.convertToWorldSpaceAR(this.TargetList[i].parent.getPosition());
                }
                else
                {
                    TargetPos = this.TargetList[i].getPosition();
                }

                if(this.TargetList[i] != null && 
                    this.Shooter != null && 
                    distance > (cc.Vec2.add(cc.v2(), TargetPos, this.Shooter.getPosition()).len()))
                {
                    distance = cc.Vec2.add(cc.v2(), TargetPos, this.Shooter.getPosition()).len();
                    index = i;
                }
            }
        }
        return this.TargetList[index]!=null? this.TargetList[index] : null;
    }

    update (dt) 
    {
        if(this.Target != null)
        {    
            let TargetPos = cc.Vec2.ZERO;
            if(this.Target.name == "Enemy" && !this.Target.getComponent(SingleEnemy).isGenerating)
            {
                TargetPos = this.EnemiesGroup.convertToWorldSpaceAR(this.Target.parent.getPosition());
            }
            else
            {
                TargetPos = this.Target.getPosition();
            }
            let BulletPos = this.node.getPosition();
            let track = cc.Vec2.ZERO;
            cc.Vec2.add(track, TargetPos, BulletPos.multiplyScalar(-1));
            track.normalizeSelf();

            let upAngle = Math.atan2(this.node.up.y, this.node.up.x) * Rad2Deg;
            let trackAngle = Math.atan2(track.y, track.x) * Rad2Deg;
            if(this.isHomming)
            {
                // let Direction = cc.Vec2.ZERO;
                // cc.Vec2.add(Direction, TargetPos, this.node.getPosition().multiplyScalar(-1));
                // Direction.normalizeSelf();
                // let rotateAmmount = cc.Vec3.cross(cc.v3(), cc.v3(Direction), this.node.up).z;
                //let angle = Math.atan2(0, rotateAmmount) * Rad2Deg;
                //cc.warn("ANGLE " + rotateAmmount);
                this.node.angle = (trackAngle - upAngle) * this.TurnSpeed * dt;
                this.node.getComponent(PlayerBullet).SetShootDirection(cc.v2(this.node.up.x, this.node.up.y));
            }
        }
        else
        {
            this.isHomming = false;
        }
    }
}
