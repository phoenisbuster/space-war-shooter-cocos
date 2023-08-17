import GlobalTime from "../OtherScript/GlobalDTime";
import { HealthManager } from "../Player/HealthManager";
import PlayerControler from "../Player/PlayerController";
import PlayerBulletData from "../PlayerBulletData/PlayerBulletData";
import GunManager from "./GunManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShootingManager extends cc.Component {

    @property(cc.Prefab)
    BulletData: cc.Prefab = null;

    @property([cc.Node])
    BulletPrefabList: cc.Node[] = []

    @property([cc.Node])
    GunList: cc.Node[] = [];

    @property(cc.Integer)
    UpgradeLv = 0;

    @property({
        displayName: "Level 2",
        tooltip: "This is setting for level 2",
        readonly: true,
    })
    lv2: string = "This is setting for level 2";
    @property(cc.Boolean)
    isIncreaseNoBullet_2: boolean = false;
    @property(cc.Boolean)
    isIncreaseAttrBullet_2: boolean = false;
    @property(cc.Boolean)
    isIncreaseAtkSpeed_2: boolean = false;
    @property([cc.Integer])
    GunID_2: number[] = [];

    @property({
        displayName: "Level 3",
        tooltip: "This is setting for level 3",
        readonly: true,
    })
    lv3: string = "This is setting for level 3";
    @property(cc.Boolean)
    isIncreaseNoBullet_3: boolean = false;
    @property(cc.Boolean)
    isIncreaseAttrBullet_3: boolean = false;
    @property(cc.Boolean)
    isIncreaseAtkSpeed_3: boolean = false;
    @property([cc.Integer])
    GunID_3: number[] = [];

    @property({
        displayName: "Level 4",
        tooltip: "This is setting for level 4",
        readonly: true,
    })
    lv4: string = "This is setting for level 4";
    @property(cc.Boolean)
    isIncreaseNoBullet_4: boolean = false;
    @property(cc.Boolean)
    isIncreaseAttrBullet_4: boolean = false;
    @property(cc.Boolean)
    isIncreaseAtkSpeed_4: boolean = false;
    @property([cc.Integer])
    GunID_4: number[] = [];

    @property({
        displayName: "Level 5",
        tooltip: "This is setting for level 5",
        readonly: true,
    })
    lv5: string = "This is setting for level 5";
    @property(cc.Boolean)
    isIncreaseNoBullet_5: boolean = false;
    @property(cc.Boolean)
    isIncreaseAttrBullet_5: boolean = false;
    @property(cc.Boolean)
    isIncreaseAtkSpeed_5: boolean = false;
    @property([cc.Integer])
    GunID_5: number[] = [];

    @property({
        displayName: "Level 6",
        tooltip: "This is setting for level 6",
        readonly: true,
    })
    lv6: string = "This is setting for level 6";
    @property(cc.Boolean)
    isIncreaseNoBullet_6: boolean = false;
    @property(cc.Boolean)
    isIncreaseAttrBullet_6: boolean = false;
    @property(cc.Boolean)
    isIncreaseAtkSpeed_6: boolean = false;
    @property([cc.Integer])
    GunID_6: number[] = [];

    @property({
        displayName: "Level 7",
        tooltip: "This is setting for level 7",
        readonly: true,
    })
    lv7: string = "This is setting for level 7";
    @property(cc.Boolean)
    isIncreaseNoBullet_7: boolean = false;
    @property(cc.Boolean)
    isIncreaseAttrBullet_7: boolean = false;
    @property(cc.Boolean)
    isIncreaseAtkSpeed_7: boolean = false;
    @property([cc.Integer])
    GunID_7: number[] = [];

    @property({
        displayName: "Level 8",
        tooltip: "This is setting for level 8",
        readonly: true,
    })
    lv8: string = "This is setting for level 8";
    @property(cc.Boolean)
    isIncreaseNoBullet_8: boolean = false;
    @property(cc.Boolean)
    isIncreaseAttrBullet_8: boolean = false;
    @property(cc.Boolean)
    isIncreaseAtkSpeed_8: boolean = false;
    @property([cc.Integer])
    GunID_8: number[] = [];

    @property({
        displayName: "Level 9",
        tooltip: "This is setting for level 9",
        readonly: true,
    })
    lv9: string = "This is setting for level 9";
    @property(cc.Boolean)
    isIncreaseNoBullet_9: boolean = false;
    @property(cc.Boolean)
    isIncreaseAttrBullet_9: boolean = false;
    @property(cc.Boolean)
    isIncreaseAtkSpeed_9: boolean = false;
    @property([cc.Integer])
    GunID_9: number[] = [];

    @property({
        displayName: "Level 10",
        tooltip: "This is setting for level 10",
        readonly: true,
    })
    lv10: string = "This is setting for level 10";
    @property(cc.Boolean)
    isIncreaseNoBullet_10: boolean = false;
    @property(cc.Boolean)
    isIncreaseAttrBullet_10: boolean = false;
    @property(cc.Boolean)
    isIncreaseAtkSpeed_10: boolean = false;
    @property([cc.Integer])
    GunID_10: number[] = [];

    callbackSound: Function;
    oldTimeScale = 0.05;

    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        cc.log("This Bullet Data: "  + this.BulletData.name);
        if(this.BulletData != null)
        {
            if(this.BulletData.data.getComponent(PlayerBulletData))
            {
                this.BulletPrefabList = this.BulletData.data.getComponent(PlayerBulletData).bullets;
            }    
        }
        this.callbackSound = () => {this.GetShootingSound();}
    }

    start () 
    {
        for(let i = 0; i < this.node.childrenCount; i++)
        {
            if(!this.GunList.includes(this.node.children[i]))
            {
                this.GunList.push(this.node.children[i]);
            }         
        }
    }

    public GetShootingSound()
    {
        if(this.node.parent.getComponent(PlayerControler).fisrtTouch && !this.node.parent.getComponent(HealthManager).isDead)
        {
            if(this.BulletData != null && this.node.getComponent(cc.AudioSource).clip != null)
            {
                cc.audioEngine.play(this.node.getComponent(cc.AudioSource).clip, false, 1);
            }
        }
    }

    public SetShootingSound(level: number, isOn: boolean = true)
    {   
        this.unschedule(this.callbackSound);
        
        let curAtk = 1*(1 + this.GunList[0].getComponent(GunManager).AtkSpeedPerLv*level);
        let timer = this.GunList[0].getComponent(GunManager).FireRate/curAtk;
        this.oldTimeScale = GlobalTime.TimeScale;
        if(isOn)
            this.schedule(this.callbackSound, timer/GlobalTime.TimeScale);        
    }

    public SetLevel(level: number)
    {
        this.UpgradeLv = level;
        this.checkLevelUpgrade();
        this.SetShootingSound(level == 10? 20 : level-1);
        cc.log("Set Level: " + this.UpgradeLv);
    }

    public checkLevelUpgrade()
    {
        switch(this.UpgradeLv)
        {
            case 2:
                this.Setlevel2();
                break;
            case 3:
                this.Setlevel3();
                break;
            case 4:
                this.Setlevel4();
                break;
            case 5:
                this.Setlevel5();
                break;
            case 6:
                this.Setlevel6();
                break;
            case 7:
                this.Setlevel7();
                break;
            case 8:
                this.Setlevel8();
                break;
            case 9:
                this.Setlevel9();
                break;
            case 10:
                this.Setlevel10();
                break;
            default:
                this.Setlevel1();
                break;
        }
    }

    private Setlevel1()
    {
        cc.log("Set Level 1 With No Gun: " + this.GunList.length);
        for(let i = 0; i < this.GunList.length; i++)
        {
            cc.log("Gun Index: " + i);
            if(i == 0)
            {
                this.GunList[i].getComponent(GunManager).SetCanShoot(true);
            }
            else
            {
                this.GunList[i].getComponent(GunManager).SetCanShoot(false);
            }
            // GunList[i].GetComponent<GunManager>().MaxAttributeUpgrade = 1;
            // GunList[i].GetComponent<GunManager>().SetAttckSpeed(0);
            // GunList[i].GetComponent<GunManager>().SetBullet(playerBullet.bullets[playerBullet.bulletOrder[i]]);
            // GunList[i].GetComponent<GunManager>().StartCoroutine(GunList[i].GetComponent<GunManager>().Shooting());
            this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade = 1;
            this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }
    }
    private Setlevel2()
    {
        //cc.warn("Set Level 2 With No Gun: " + this.GunList.length);
        for(let i = 0; i < this.GunList.length; i++)
        {
            if(this.isIncreaseAtkSpeed_2)
            {
                //GunList[i].GetComponent<GunManager>().SetAttckSpeed(1);
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(1);
            }
            else
            {
                //GunList[i].GetComponent<GunManager>().SetAttckSpeed(0);
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            }
            if(this.isIncreaseAttrBullet_2)
            {
                //GunList[i].GetComponent<GunManager>().MaxAttributeUpgrade++;
                this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade++;
            }
            if(this.isIncreaseNoBullet_2)
            {
                if(this.GunID_2.includes(i))
                {
                    //GunList[i].GetComponent<GunManager>().SetCanShoot(true);
                    this.GunList[i].getComponent(GunManager).SetCanShoot(true);
                    //cc.warn("Gun Can Shot Index: " + i);
                }
                else
                {
                    //GunList[i].GetComponent<GunManager>().SetCanShoot(false);
                    this.GunList[i].getComponent(GunManager).SetCanShoot(false);
                    //cc.warn("Gun Can NOT Shot Index: " + i);
                }
            }
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }        
    }

    private Setlevel3()
    {
        for(let i = 0; i < this.GunList.length; i++)
        {
            if(this.isIncreaseAtkSpeed_3)
            {
                //GunList[i].GetComponent<GunManager>().SetAttckSpeed(2);
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(2);
            }
            else
            {
                //GunList[i].GetComponent<GunManager>().SetAttckSpeed(0);
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            }
            if(this.isIncreaseAttrBullet_3)
            {
                //GunList[i].GetComponent<GunManager>().MaxAttributeUpgrade++;
                this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade++;
            }
            if(this.isIncreaseNoBullet_3)
            {
                if(this.GunID_3.includes(i))
                {
                    //GunList[i].GetComponent<GunManager>().SetCanShoot(true);
                    this.GunList[i].getComponent(GunManager).SetCanShoot(true);
                }
                else
                {
                    //GunList[i].GetComponent<GunManager>().SetCanShoot(false);
                    this.GunList[i].getComponent(GunManager).SetCanShoot(false);
                }
            }
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }
    }

    private Setlevel4()
    {
        for(let i = 0; i < this.GunList.length; i++)
        {
            if(this.isIncreaseAtkSpeed_4)
            {
                //GunList[i].GetComponent<GunManager>().SetAttckSpeed(3);
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(3);
            }
            else
            {
                //GunList[i].GetComponent<GunManager>().SetAttckSpeed(0);
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            }
            if(this.isIncreaseAttrBullet_4)
            {
                //GunList[i].GetComponent<GunManager>().MaxAttributeUpgrade++;
                this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade++;
            }
            if(this.isIncreaseNoBullet_4)
            {
                if(this.GunID_4.includes(i))
                {
                    //GunList[i].GetComponent<GunManager>().SetCanShoot(true);
                    this.GunList[i].getComponent(GunManager).SetCanShoot(true);
                }
                else
                {
                    //GunList[i].GetComponent<GunManager>().SetCanShoot(false);
                    this.GunList[i].getComponent(GunManager).SetCanShoot(false);
                }
            }
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }
    }

    private Setlevel5()
    {
        for(let i = 0; i < this.GunList.length; i++)
        {
            if(this.isIncreaseAtkSpeed_5)
            {
                //GunList[i].GetComponent<GunManager>().SetAttckSpeed(4);
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(4);
            }
            else
            {
                //GunList[i].GetComponent<GunManager>().SetAttckSpeed(0);
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            }
            if(this.isIncreaseAttrBullet_5)
            {
                //GunList[i].GetComponent<GunManager>().MaxAttributeUpgrade++;
                this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade++;
            }
            if(this.isIncreaseNoBullet_5)
            {
                if(this.GunID_5.includes(i))
                {
                    //GunList[i].GetComponent<GunManager>().SetCanShoot(true);
                    this.GunList[i].getComponent(GunManager).SetCanShoot(true);
                }
                else
                {
                    //GunList[i].GetComponent<GunManager>().SetCanShoot(false);
                    this.GunList[i].getComponent(GunManager).SetCanShoot(false);
                }
            }
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }
    }

    private Setlevel6()
    {
        for(let i = 0; i < this.GunList.length; i++)
        {
            if(this.isIncreaseAtkSpeed_6)
            {
                //GunList[i].GetComponent<GunManager>().SetAttckSpeed(5);
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(5);
            }
            else
            {
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            }
            if(this.isIncreaseAttrBullet_6)
            {
                this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade++;
            }
            if(this.isIncreaseNoBullet_6)
            {
                if(this.GunID_6.includes(i))
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(true);
                }
                else
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(false);
                }
            }
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }
    }

    private Setlevel7()
    {
        for(let i = 0; i < this.GunList.length; i++)
        {
            if(this.isIncreaseAtkSpeed_7)
            {
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(6);
            }
            else
            {
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            }
            if(this.isIncreaseAttrBullet_7)
            {
                this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade++;
            }
            if(this.isIncreaseNoBullet_7)
            {
                if(this.GunID_7.includes(i))
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(true);
                }
                else
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(false);
                }
            }
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }
    }

    private Setlevel8()
    {
        for(let i = 0; i < this.GunList.length; i++)
        {
            if(this.isIncreaseAtkSpeed_8)
            {
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(7);
            }
            else
            {
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            }
            if(this.isIncreaseAttrBullet_8)
            {
                this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade++;
            }
            if(this.isIncreaseNoBullet_8)
            {
                if(this.GunID_8.includes(i))
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(true);
                }
                else
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(false);
                }
            }
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }
    }

    private Setlevel9()
    {
        for(let i = 0; i < this.GunList.length; i++)
        {
            if(this.isIncreaseAtkSpeed_9)
            {
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(8);
            }
            else
            {
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            }
            if(this.isIncreaseAttrBullet_9)
            {
                this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade++;
            }
            if(this.isIncreaseNoBullet_9)
            {
                if(this.GunID_9.includes(i))
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(true);
                }
                else
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(false);
                }
            }
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }
    }

    private Setlevel10()
    {
        for(let i = 0; i < this.GunList.length; i++)
        {
            if(this.isIncreaseAtkSpeed_10)
            {
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(20);
            }
            else
            {
                this.GunList[i].getComponent(GunManager).SetAttckSpeed(0);
            }
            if(this.isIncreaseAttrBullet_10)
            {
                this.GunList[i].getComponent(GunManager).MaxAttributeUpgrade++;
            }
            if(this.isIncreaseNoBullet_10)
            {
                if(this.GunID_10.includes(i))
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(true);
                }
                else
                {
                    this.GunList[i].getComponent(GunManager).SetCanShoot(false);
                }
            }
            let idx = this.BulletData.data.getComponent(PlayerBulletData).bulletOrder[i];
            let bulletPrefab = this.BulletPrefabList[idx];
            this.GunList[i].getComponent(GunManager).SetBullet(bulletPrefab);
        }
    }

    update(dt) 
    {
        if(GlobalTime.TimeScale != this.oldTimeScale)
        {
            let value: boolean = GlobalTime.TimeScale<1? false : true;
            this.SetShootingSound(this.UpgradeLv == 10? 20 : this.UpgradeLv-1, value);
        }
        //cc.warn(this.UpgradeLv)
    }
}
