import MoveBG from "../BackGroundImage/MovingBackGround";
import BossHealth from "../Boss/BossHealth";
import BossStats from "../Boss/BossStats";
import BoundaryParent from "../Boundaries/BoundaryParent";
import Combo from "../Combo System/ComboSystem";
import EnemyPath from "../Enemies/EnemyPath";
import EnemyShape from "../Enemies/EnemyShape";
import GroupEnemies from "../Enemies/GroupEnemy";
import Gacha from "../GachaInGame/GachaSystem";
import LevelSetting from "../LevelDesign/Level";
import Meteorite from "../Meteorites/Meteotite";
import GlobalTime from "../OtherScript/GlobalDTime";
import { HealthManager } from "../Player/HealthManager";
import PlayerControler from "../Player/PlayerController";
import PlayerStats from "../Player/PlayerStats";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component 
{    
    //[Header("Player Object")]
    @property(cc.Node)
    Player: cc.Node = null;
    beginMatch: boolean = false;

    //[Header("Back Ground")]
    @property(cc.SpriteFrame)
    BG_Image: cc.SpriteFrame = null;
    @property(cc.Node)
    BackGroundObj: cc.Node = null;

    //[Header("Group Enemies Attribute")]
    @property(cc.Node)
    GroupEnemies: cc.Node = null;
    @property(cc.Float)
    EnemyWaveRate = 75;

    //Enemy Shape Loader Attr
    @property([cc.Prefab])
    enemyShapes: cc.Prefab[] = [];
    @property(cc.Boolean)
    randomShape: boolean = true;
    @property(cc.Integer)
    fixShapeIndex = 0;

    //Enemy Path Loader Attr
    @property([cc.Prefab])
    enemyPaths: cc.Prefab[] = [];
    @property(cc.Boolean)
    randomPath: boolean = true;
    @property(cc.Integer)
    fixPathIndex = 0;

    //[Header("Meteorite Attribute")]
    @property(cc.Node)
    Obstacles: cc.Node = null;
    @property(cc.Prefab)
    MeteoritePrefab: cc.Prefab = null;
    @property(cc.Float)
    MeteoriteGenSpeed = 0.1;
    @property(cc.Float)
    maxInterval = 10;
    @property(cc.Float)
    minInterval = 20;
    @property(cc.Float)
    maxSize = 1;
    @property(cc.Float)
    minSize = 0.25;
    @property(cc.Integer)
    CurMeteo = 0;

    //[Header("Bosses Attribute")]
    @property([cc.Prefab])
    Bosses: cc.Prefab[] = [];
    @property(cc.Node)
    BossHealthBar: cc.Node = null;
    @property(cc.Boolean)
    isBossExist = false;
    @property(cc.Boolean)
    isBossDead = false;
    
    //[Header("Buffs Attribute")]
    @property(cc.Float)
    PowerUpRate = 15;
    @property(cc.Float)
    ChangeSpaceShipRate = 15;
    @property(cc.Float)
    HealthRate = 10;
    @property(cc.Float)
    MoneyRate = 50;
    @property([cc.Prefab])
    ItemsPickUp: cc.Prefab[] = [];
    @property(cc.SpriteFrame)
    SpaceShipList: cc.SpriteFrame[] = [];

    //Buff System
    Combo: cc.Node = null;
    Gacha: cc.Node = null;

    //[Header("Game Audio")]
    @property(cc.Node)
    GameMusic: cc.Node = null;

    //[Header("UI Canvas")]
    @property(cc.Node)
    UI_Canvas: cc.Node = null;
    @property(cc.Node)
    UI_Panel: cc.Node = null;
    @property(cc.Node)
    FPSDisplay: cc.Node = null;
    @property(cc.Node)
    WaveDisplay: cc.Node = null;

    ///////Boundary
    @property(cc.Node)
    Boudaries: cc.Node = null;

    //[Header("Wave Manager")]
    @property(cc.Boolean)
    usingCustomLevel: boolean = false;
    @property(cc.Prefab)
    Level: cc.Prefab = null;
    LevelScript: LevelSetting = null;

    @property(cc.Integer)
    waveNumber = 0;
    @property(cc.Boolean)
    isSurvivalMode: boolean = true;
    @property(cc.Integer)
    MaxwaveNumber = 0;

    //[Tooltip("For Debug or Survival Mode Only")]
    @property(cc.Integer)
    BossEveryWave = 10;
    @property(cc.Boolean)
    startNewWave: boolean = false;
    //[Tooltip("Set Base Stat For Enemies")]
    @property(cc.Float)
    statMultipler = 1;
    //[Tooltip("Enemies Stronger Each Wave")]
    @property(cc.Boolean)
    isStrongerEachWave: boolean = false;

    @property(cc.Integer)
    targetFramRate = 60;
    deltaTime: number = 0.0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        if(!this.usingCustomLevel)
        {
            cc.resources.loadDir("EnemyShapes", cc.Prefab, (e: Error, items: cc.Prefab[])=>
            {
                if(e)
                {
                    cc.log("Error when loading Enemy Shapes: " + e.message);
                }
                else
                {
                    this.enemyShapes = items;
                    cc.log("Enemy Shapes Assets Length: " + items.length);
                }    
            })
            cc.resources.loadDir("EnemyPaths", cc.Prefab, (e: Error, items: cc.Prefab[])=>
            {
                if(e)
                {
                    cc.log("Error when loading Enemy Paths: " + e.message);
                }
                else
                {
                    this.enemyPaths = items;
                    cc.log("Enemy Paths Assets Length: " + items.length);
                }    
            })
        }
        else if(this.usingCustomLevel && this.Level != null)
        {
            let LvSetting = this.Level.data.getComponent(LevelSetting);
            if(LvSetting)
            {
                this.MaxwaveNumber = LvSetting.WaveList.length;
                this.LevelScript = LvSetting;
                this.SetLevelParameter();
            }
            else
            {
                cc.error("Type Missmatch for Level Setting");
            }   
        }
        else
        {
            cc.error("Format Wave Manager Error");
        }
        this.Combo = cc.find("InGameMenu/Combo");
        this.Gacha = cc.find("InGameMenu/Gacha");
    }

    start () 
    {
        cc.log("Finish Shapes Assets Length: " + this.enemyShapes.length);
        cc.log("Finish Paths Assets Length: " + this.enemyPaths.length);
    }

    public SetLevelParameter()
    {
        this.BG_Image = this.LevelScript.BG_Image;

        this.ChangeSpaceShipRate = this.LevelScript.ChangeSpaceShipRate;
        this.HealthRate = this.LevelScript.HealthRate;
        this.PowerUpRate = this.LevelScript.PowerUpRate;
        this.MoneyRate = this.LevelScript.MoneyRate;

        this.MeteoriteGenSpeed = this.LevelScript.MeteoriteGenSpeed;
        this.maxInterval = this.LevelScript.maxInterval;
        this.minInterval = this.LevelScript.minInterval;
        this.maxSize = this.LevelScript.maxSize;
        this.minSize = this.LevelScript.minSize;

        this.isStrongerEachWave = this.LevelScript.isStrongerEachWave;
        this.statMultipler = this.LevelScript.statMultipler;

        this.BackGroundObj.getComponent(MoveBG).setBG(this.BG_Image);
    }

    public SetMultipiler(statMultipler: number, isStrongerEachWave: boolean) : number
    {
        //cc.warn("statMultiplier IS: " + Math.pow(statMultipler, isStrongerEachWave? this.waveNumber : 1));
        return Math.pow(statMultipler, isStrongerEachWave? this.waveNumber : 1);
    }

    protected onEnable(): void 
    {
        this.Player?.on("PlayerDead", this.GameOver, this);
        this.Player?.on("BeginMatch", this.BeginMatch, this);
        this.GroupEnemies?.on("AllEnemiesDied", this.DisplayGacha, this);
        this.Gacha?.on("ChooseDone", this.SetNewWave, this);
    }

    protected onDestroy(): void 
    {
        this.Player?.off("PlayerDead", this.GameOver, this);
        this.Player?.off("BeginMatch", this.BeginMatch, this);
        this.GroupEnemies?.off("AllEnemiesDied", this.DisplayGacha, this);
        this.Gacha?.off("ChooseDone", this.SetNewWave, this);
    }

    public BeginMatch()
    {
        this.beginMatch = true;
        this.GetNewWave();
    }

    public SetNewWave()
    {
        this.Gacha.setScale(0,0);
        this.Player?.getComponent(PlayerControler).UnlockInputProcessing();
        if(this.beginMatch)
        {
            this.GetNewWave();
        }
    }

    public DisplayGacha()
    {
        this.Player?.getComponent(PlayerControler).LockInputProcessing(
            this.UI_Canvas.getContentSize().width/2,
            100,
            false
        );
        this.BackGroundObj.getComponent(MoveBG).speed = -250;
        this.Combo.getComponent(Combo).resetCombo();
        this.Gacha.getComponent(Gacha).FetchChoices();
        cc.tween(this.Gacha).to(0.5, {
            scale: 1
        }).start();
    }

    public WhenBossDead(spawnPosition: cc.Vec2)
    {
        if(this.isBossExist)
        {
            this.isBossDead = true;
            this.isBossExist = false;
            this.SetItemsPickUp(-2, true, spawnPosition);
            if(this.node.getComponent(cc.AudioSource) && this.node.getComponent(cc.AudioSource).clip)
            {
                //this.node.getComponent(cc.AudioSource).play();
                cc.audioEngine.playEffect(this.node.getComponent(cc.AudioSource).clip, false);
            }    
            //this.SetNewWave();
            this.DisplayGacha();
        }
    }

    public SetItemsPickUp(ID: number, isDestroyedbyPlayer: boolean, spawnPosition: cc.Vec2)
    {
        let scene = cc.director.getScene();
        if(this.ItemsPickUp.length > 0)
        {    
            if(isDestroyedbyPlayer && ID >= 0)
            {    
                let i = Math.random()*100;
                if(i < this.PowerUpRate)
                {
                    let item = cc.instantiate(this.ItemsPickUp[0]);
                    item.parent = scene;
                }
                else if(i >= this.PowerUpRate && i < this.PowerUpRate + this.ChangeSpaceShipRate)
                {
                    //Debug.Log("ChangeSpaceShip");
                    let j = Math.floor(Math.random() * this.SpaceShipList.length);
                    let item = cc.instantiate(this.ItemsPickUp[1]);
                    item.parent = scene;
                    item.getComponent(cc.Sprite).spriteFrame = this.SpaceShipList[j];
                    //item.getComponent(ItemChangeShip).ShipIndex = j;
                    if(j == 0)
                    {
                        item.setScale(cc.v2(0.5, 0.5));
                    }
                    else
                    {
                        item.setScale(cc.v2(0.3, 0.3));
                    }
                }
                else if(i >= this.PowerUpRate+this.ChangeSpaceShipRate && 
                    i < this.PowerUpRate+this.ChangeSpaceShipRate+this.HealthRate)
                {
                    let item = cc.instantiate(this.ItemsPickUp[2]);
                    item.parent = scene;
                }
                else
                {
                    cc.log("Coin Drop");
                }
            }
            else if(isDestroyedbyPlayer && ID < 0)
            {
                let i = Math.random()*100;
                if(ID == -2)
                {
                    let item = cc.instantiate(this.ItemsPickUp[2]);
                    item.parent = scene;
                }
                else if(ID == -1 && i < this.HealthRate)
                {
                    let item = cc.instantiate(this.ItemsPickUp[2]);
                    item.parent = scene;
                }
            }
        }
        else
        {
            //cc.warn("There is no items pick up!!!");
        }
    }

    public CountMeteo(spawnPosition: cc.Vec2, isDestroyedbyPlayer: boolean)
    {
        this.SetItemsPickUp(-1, isDestroyedbyPlayer, spawnPosition);
        if(this.Obstacles.getComponent(cc.AudioSource) && isDestroyedbyPlayer)
        {
            if(this.Obstacles.getComponent(cc.AudioSource).clip)
            {
                //this.Obstacles.getComponent(cc.AudioSource).play();
                cc.audioEngine.playEffect(this.Obstacles.getComponent(cc.AudioSource).clip, false);
            }        
        }
        this.CurMeteo--;
        if(this.CurMeteo <= 0)
        {
            //this.SetNewWave();
            this.DisplayGacha();
        }
    }

    public SpawnObstacles()
    {
        let interval = Math.random() * (this.maxInterval - this.minInterval + 1) + this.minInterval;
        let num = this.MeteoriteGenSpeed > 0? interval/this.MeteoriteGenSpeed : interval/0.25;
        //cc.error("The NUMBER is " + num);
        
        this.schedule(this.GenerateMeteorites, this.MeteoriteGenSpeed, num);
    }

    public GenerateMeteorites()
    {
        let min = 0;//this.Boudaries.getComponent(BoundaryParent).ScreenWidth;
        let max = this.Boudaries.getComponent(BoundaryParent).ScreenWidth;
        let x = Math.random() * (max - min + 1) + min;
        let y = this.Boudaries.getComponent(BoundaryParent).ScreenHeight + 25;
        let scale = Math.random() * this.maxSize;
        scale = scale > this.minSize? scale : this.minSize;
        //cc.error("METEORITE SPAWN " + scale);

        let meteorite = cc.instantiate(this.MeteoritePrefab);
        meteorite.parent = this.Obstacles? this.Obstacles : cc.director.getScene();
        meteorite.setPosition(cc.v2(x, y));
        meteorite.setScale(cc.v2(scale, scale));
        //meteorite.transform.SetParent(Obstacles.transform);
        if(!this.usingCustomLevel)
        {
            meteorite.getComponent(Meteorite).SetMaxHealth(scale, this.SetMultipiler(this.statMultipler, this.isStrongerEachWave));
        }
        else
        {
            meteorite.getComponent(Meteorite).SetMaxHealth(scale, this.SetMultipiler(this.statMultipler, this.isStrongerEachWave));
        } 
        meteorite.getComponent(Meteorite).SetMoveDirect(cc.v2(0,1));
        meteorite?.on("MeteoDestroy", this.CountMeteo, this);        
        this.CurMeteo += 1;
        //yield return new WaitForSeconds(!usingCustomLevel? MeteoriteGenSpeed : Level.MeteoriteGenSpeed);
    }

    public SpawnBoss()
    {
        if(this.Bosses.length == 0)
        {
            return;
        }
        this.isBossExist = true;
        this.isBossDead = false;
        let i = Math.floor(Math.random() * this.Bosses.length);
        //cc.warn("BOSS IDX " + i);
        let x: number[] = [];
        x.push(28);
        let ThisBoss: cc.Node = null;
        if(!this.usingCustomLevel)
        {
            ThisBoss = cc.instantiate(this.Bosses[i]);
            ThisBoss.parent = cc.find("Bosses");//cc.director.getScene();
            ThisBoss.setPosition(this.GenerateVec2FromIdx(x)[0]);
            ThisBoss.getComponent(BossHealth).SetHealthBar(this.BossHealthBar, this.SetMultipiler(this.statMultipler, this.isStrongerEachWave));
        }
        else
        {
            ThisBoss = cc.instantiate(this.LevelScript.WaveList[this.waveNumber-1].ObjectsThisWave[0]);
            ThisBoss.parent = cc.find("Bosses");//cc.director.getScene();
            ThisBoss.setPosition(this.GenerateVec2FromIdx(x)[0]);
            ThisBoss.getComponent(BossHealth).SetHealthBar(this.BossHealthBar, this.SetMultipiler(this.statMultipler, this.isStrongerEachWave));
        } 

        ThisBoss.getComponent(BossStats).SetPath(this.GroupEnemies.convertToWorldSpaceAR
                                                (
                                                    this.GroupEnemies.children[12].getPosition()
                                                ));    
        ThisBoss.getComponent(BossStats).MainTarget = this.Player;
        ThisBoss?.on("BossDead", this.WhenBossDead, this);

        for(let j = 0; j < this.GroupEnemies.childrenCount; j++)
        {
            ThisBoss.getComponent(BossStats).MovePoints.push(this.GroupEnemies.convertToWorldSpaceAR
                                                (
                                                    this.GroupEnemies.children[j].getPosition()
                                                ));
        }
    }

    public GenerateEnemyShape(shapes: cc.Prefab[] = []): number
    {
        let i = 0;
        if(!this.usingCustomLevel)
        {
            if(this.randomShape)
                i = Math.floor(Math.random() * this.enemyShapes.length);
            else
                i = this.fixShapeIndex < this.enemyShapes.length? this.fixShapeIndex : 0;
        }
        else
        {
            i = Math.floor(Math.random() * shapes.length);
        }
        cc.log("SHAPE NUMBER: " + i); 
        return i;
    }

    public GenerateEnemyPath(paths: cc.Prefab[] = []): number
    {
        let i = 0;
        if(!this.usingCustomLevel)
        {
            if(this.randomPath)
                i = Math.floor(Math.random() * this.enemyPaths.length);
            else
                i = this.fixPathIndex < this.enemyPaths.length? this.fixPathIndex : 0;;
        }
        else
        {
            i = Math.floor(Math.random() * paths.length);
        }
        cc.log("PATH NUMBER: " + i); 
        return i;
    }

    public GenerateVec2FromIdx(IdxList: number[]): cc.Vec2[]
    {
        let returnValue: cc.Vec2[] = [];
        /*
            Order: Left -> Right -> Low -> Up -> Mid
        */
        IdxList.forEach(i =>
        {
            if(i >= 0 && i <= 9)
            {
                let pos = this.Boudaries.children[0].convertToWorldSpaceAR(
                    this.Boudaries.children[0].children[i].getPosition()
                )
                returnValue.push(pos);
                cc.log("TEST CONVERT POSITION" + pos);
            }
            else if(i >= 10 && i <= 19)
            {
                //returnValue.Add(Boudaries.transform.GetChild(1).GetChild(i-10).position);
                let pos = this.Boudaries.children[1].convertToWorldSpaceAR(
                    this.Boudaries.children[1].children[i-10].getPosition()
                )
                returnValue.push(pos);
            }
            else if(i >= 20 && i <= 25)
            {
                //returnValue.Add(Boudaries.transform.GetChild(2).GetChild(i-20).position);
                let pos = this.Boudaries.children[2].convertToWorldSpaceAR(
                    this.Boudaries.children[2].children[i-20].getPosition()
                )
                returnValue.push(pos);
            }
            else if(i >= 26 && i <= 31)
            {
                //returnValue.Add(Boudaries.transform.GetChild(3).GetChild(i-26).position);
                let pos = this.Boudaries.children[3].convertToWorldSpaceAR(
                    this.Boudaries.children[3].children[i-26].getPosition()
                )
                returnValue.push(pos);
            }
            else
            {
                //returnValue.Add(GroupEnemies.transform.GetChild(i-32).position);
                let pos = this.GroupEnemies.convertToWorldSpaceAR(
                    this.GroupEnemies.children[i-32].getPosition()
                )
                returnValue.push(pos);
            }
        });    
        return returnValue;
    }

    public SpawnEnemies()
    {
        if(!this.usingCustomLevel)
        {    
            let i = this.GenerateEnemyShape();
            let j = this.GenerateEnemyPath();

            let spawnPos = this.GenerateVec2FromIdx(
                this.enemyPaths[j].data.getComponent(EnemyPath).firstPoint
            );
            let midPoints = this.GenerateVec2FromIdx(
                this.enemyPaths[j].data.getComponent(EnemyPath).middlePointIndex
            );

            this.GroupEnemies.getComponent(GroupEnemies).ResetPos(
                this.SetMultipiler(this.statMultipler, this.isStrongerEachWave)
            );

            this.GroupEnemies.getComponent(GroupEnemies).SetTravelPath(
                this.enemyShapes[i].data.getComponent(EnemyShape).ID_of_Pos,
                spawnPos,
                midPoints,
                this.enemyPaths[j].data.getComponent(EnemyPath).time,
            );

            this.GroupEnemies.getComponent(GroupEnemies).SpawnEnemies(
                this.enemyShapes[i].data.getComponent(EnemyShape).ID_of_Pos
            );
        }
        else
        {
            this.GroupEnemies.getComponent(GroupEnemies).SetEnemyPrefabs(
                this.LevelScript.WaveList[this.waveNumber-1].ObjectsThisWave
            );
            let i = this.GenerateEnemyShape(this.LevelScript.WaveList[this.waveNumber-1].EnemyShape);
            let j = this.GenerateEnemyPath(this.LevelScript.WaveList[this.waveNumber-1].EnemyPath);
            
            let ShapeDataPrefab = this.LevelScript.WaveList[this.waveNumber-1].EnemyShape[i];
            let PathDataPrefab = this.LevelScript.WaveList[this.waveNumber-1].EnemyPath[j];

            let spawnPos = this.GenerateVec2FromIdx(
                PathDataPrefab.data.getComponent(EnemyPath).firstPoint
            );
            let midPoints = this.GenerateVec2FromIdx(
                PathDataPrefab.data.getComponent(EnemyPath).middlePointIndex
            );

            this.GroupEnemies.getComponent(GroupEnemies).ResetPos(
                this.SetMultipiler(this.statMultipler, this.isStrongerEachWave)
            );

            this.GroupEnemies.getComponent(GroupEnemies).SetTravelPath(
                ShapeDataPrefab.data.getComponent(EnemyShape).ID_of_Pos,
                spawnPos,
                midPoints,
                PathDataPrefab.data.getComponent(EnemyPath).time,
            );

            this.GroupEnemies.getComponent(GroupEnemies).SpawnEnemies(
                ShapeDataPrefab.data.getComponent(EnemyShape).ID_of_Pos
            );
        }
    }

    public WaveManager(WaveType: number)
    {
        switch(WaveType)
        {
            case 0:
                //cc.warn("Boss Time !!!");
                this.GroupEnemies.getComponent(GroupEnemies).canMove = false;
                this.GroupEnemies.getComponent(GroupEnemies).ResetPos();
                this.SpawnBoss();
                break;
            case 1:
                //cc.warn("Enemy Time !!!");
                this.GroupEnemies.getComponent(GroupEnemies).canMove = false;
                this.SpawnEnemies();
                break;
            case 2:
                //cc.warn("Obstacle Confirmed");
                this.GroupEnemies.getComponent(GroupEnemies).canMove = false;
                this.GroupEnemies.getComponent(GroupEnemies).ResetPos();
                this.SpawnObstacles();
                break;
        }
        //this.startNewWave = false;
    }

    public SetWaveUI(wave: number)
    {
        let MaxWave = (this.isSurvivalMode && !this.usingCustomLevel)? "" : "/" + this.MaxwaveNumber;
        this.WaveDisplay.getComponent(cc.Label).string = "Wave: " + wave + MaxWave;
    }

    private GetNewWave()
    {
        if(this.waveNumber >= this.MaxwaveNumber && (!this.isSurvivalMode || this.usingCustomLevel))
        {
            this.GameOver(true);
        }
        else
        {
            this.startNewWave = true;
            let WaveType = 0;
            this.SetWaveUI(++this.waveNumber);

            if(!this.usingCustomLevel)
            {
                let i = Math.random()*100;
                if(this.waveNumber % this.BossEveryWave == 0 )//|| 
                    //(this.waveNumber == this.MaxwaveNumber && !this.isSurvivalMode))
                {
                    WaveType = 0;
                    this.UI_Panel.children[0].getComponent(cc.Label).string = "Boss Incomming";
                }
                else if(this.waveNumber % this.BossEveryWave != 0 || 
                    (this.waveNumber != this.MaxwaveNumber && !this.isSurvivalMode))
                { 
                    if(i <= this.EnemyWaveRate)
                    {
                        WaveType = 1;
                        this.UI_Panel.children[0].getComponent(cc.Label).string = 
                            "Wave " + this.waveNumber + "\nDestroy Enemies";
                    }
                    else if(i > this.EnemyWaveRate)
                    {
                        WaveType = 2;
                        this.UI_Panel.children[0].getComponent(cc.Label).string = 
                            "Wave " + this.waveNumber + "\nBeware Meteorites";
                    }
                }
            }
            else
            {
                switch(this.LevelScript.WaveList[this.waveNumber-1].ObjectsThisWave[0].data.name)
                {
                    case "Meteo":
                        WaveType = 2;
                        this.UI_Panel.children[0].getComponent(cc.Label).string = 
                            "Wave " + this.waveNumber + "\nBeware Meteorites";
                        break;
                    case "Enemy":
                        WaveType = 1;
                        this.UI_Panel.children[0].getComponent(cc.Label).string = 
                            "Wave " + this.waveNumber + "\nDestroy Enemies";
                        break;
                    case "Boss":
                        WaveType = 0;
                        this.UI_Panel.children[0].getComponent(cc.Label).string = "Boss Incomming";
                        break;
                }
            } 

            this.UI_Panel.children[0].active = true;
            this.UI_Panel.children[1].active = false;
            cc.tween(this.UI_Panel).to(0.5, 
            {
                scale: 1
            }).call(()=>
            {
                cc.tween(this.UI_Panel).delay(1.5).to(0.5,
                {
                    scale: 0
                }).call(()=>
                {
                    this.WaveManager(WaveType);
                    this.BackGroundObj.getComponent(MoveBG).speed = -50;
                    this.UI_Panel.children[0].active = false;
                }).start();
                this.Player.getComponent(HealthManager).Healing(PlayerStats.HP_Gennerate * 10);
            }).start();
                      
        }        
    }

    public GameOver(isWin: boolean = false)
    {
        this.UI_Panel.children[1].getComponent(cc.Label).string = isWin? "You Win" : "You Lose";
        this.UI_Panel.children[0].active = false;
        this.UI_Panel.children[1].active = true;

        this.node.emit("GameOver", isWin);

        cc.tween(this.UI_Panel).to(0.5, 
        {
            scale: 1
        }).call(()=>
        {
            this.GroupEnemies.active = false;
            this.Obstacles.active = false;
            cc.find("Bosses").active = false;
            if(cc.isValid(this.Player) && isWin)
            {
                this.Player?.getComponent(PlayerControler).LockInputProcessing(
                    this.UI_Canvas.getContentSize().width/2,
                    100,
                    true
                );
                this.UI_Panel.children[1].children[0].active = false;
                this.UI_Panel.children[1].children[1].active = false;
                this.BackGroundObj.getComponent(MoveBG).speed = -500;
            }
            else if (!isWin)
            {
                this.UI_Panel.children[1].children[0].active = true;
                this.UI_Panel.children[1].children[1].active = true;

                this.Player?.getComponent(PlayerControler).LockInputProcessing(
                    this.UI_Canvas.getContentSize().width/2,
                    100,
                    true
                );
                this.UI_Panel.children[1].children[0].getComponent(cc.Button).target.children[0].getComponent(cc.Label).string = "Revive (" + PlayerStats.lifeCount + ")";
                if(PlayerStats.lifeCount > 0)
                {
                    this.UI_Panel.children[1].children[0].getComponent(cc.Button).interactable = true;
                }
                else
                {
                    this.UI_Panel.children[1].children[0].getComponent(cc.Button).interactable = false;
                }
                this.BackGroundObj.getComponent(MoveBG).speed = 0;
            }
            cc.log("Finish the level: " + isWin);
        }).start();
    }

    public ReviveClick()
    {
        if(PlayerStats.lifeCount > 0)
        {
            PlayerStats.lifeCount = PlayerStats.lifeCount/1 - 1;
            this.Player.getComponent(HealthManager).RevivePlayer();
            this.Player?.getComponent(PlayerControler).UnlockInputProcessing();
            this.Player.active = true;
            this.UI_Panel.setScale(0,0);
            this.GroupEnemies.active = true;
            this.Obstacles.active = true;
            cc.find("Bosses").active = true;
        }
    }

    update (dt) 
    {
        if(this.GroupEnemies.getComponent(GroupEnemies).CurEnemies <= 0 && 
            this.CurMeteo <= 0 && 
            this.isBossExist == false && 
            this.startNewWave == false)
        {
            if(this.beginMatch)
            {
                this.GetNewWave();
            }            
        }
        else
        {
            // cc.error("Enemy ALL DIE " + this.GroupEnemies.getComponent(GroupEnemies).CurEnemies);
            // cc.error("Meteo ALL Destroyed " + (this.CurMeteo <= 0));
            // cc.error("BOSS DIED " + (this.isBossExist == false));
            // cc.error("START NEW WAVE " + this.startNewWave);
        }

        let fps = 1/dt;//(1/dt>57 && 1/dt<63)? 60 : 1/dt;
        fps = Math.round(fps * 100) / 100;
        this.FPSDisplay.getComponent(cc.Label).string = "FPS: " + fps;
    }
}
