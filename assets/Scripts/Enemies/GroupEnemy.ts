import GlobalTime from "../OtherScript/GlobalDTime";
import SingleEnemy from "./SingleEnemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GroupEnemies extends cc.Component {

    @property(cc.Float)
    hozSpeed = 0.75;
    @property(cc.Float)
    curHozSpeed = 0;
    @property(cc.Float)
    verSpeed = -0.25;
    @property(cc.Float)
    transSpeed = -5;
    @property(cc.Float)
    respawnSpeed = 0;
    @property(cc.Boolean)
    canMove: boolean = false;

    @property(cc.Node)
    CanVasBound: cc.Node = null;
    @property(cc.Node)
    Boundaries: cc.Node = null;

    @property(cc.Vec2)
    respawnPosition: cc.Vec2 = cc.Vec2.ZERO;
    @property(cc.Float)
    TimeToSpawn = 0.25;

    @property(cc.Integer)
    EnemyCol = 5;
    @property(cc.Integer)
    EnemyRow = 5;

    @property(cc.Integer)
    CurEnemies = 0;

    @property(cc.Boolean)
    allEnemiesDestroyed: boolean = false;

    @property([cc.Prefab])
    EnemyPrefabs: cc.Prefab[] = [];

    @property(cc.Float)
    statMultiplier = 1;

    @property([cc.Integer])
    FinalShape: number[] = []

    @property([cc.Vec2])
    SpawnPos: cc.Vec2[] = []
    @property([cc.Vec2])
    TravelPath: cc.Vec2[] = []
    @property(cc.Float)
    TravelTime = 0.5; 

    @property(cc.Boolean)
    isDebug: boolean = false; 
    @property(cc.Boolean)
    isRespawn: boolean = false;

    @property(cc.Boolean)
    useShape: boolean = false;
    @property(cc.Boolean)
    usePath: boolean = false;
    @property([cc.Tween])
    TweenPath: cc.Tween[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        if(this.CanVasBound == null)
        {
            this.CanVasBound = cc.find("InGameMenu");
        }
        this.node.setPosition(cc.v2(
            this.CanVasBound.getContentSize().width/2, 
            this.CanVasBound.getContentSize().height/2
        ));
    }

    start()
    {
        this.respawnPosition = this.node.getPosition();
        this.curHozSpeed = this.hozSpeed;
        this.respawnSpeed = this.hozSpeed;
        this.ResetPos();
    }

    public ResetPos(statMultipler: number = 1)
    {
        this.statMultiplier = statMultipler;
        //this.allEnemiesDestroyed = false;
        //this.isRespawn = true;
        this.node.setPosition(this.respawnPosition);
        this.respawnSpeed = this.respawnSpeed*statMultipler > 10? this.respawnSpeed*statMultipler : 10;
        this.verSpeed = this.verSpeed*statMultipler < -5? this.verSpeed*statMultipler : -5;
        this.transSpeed = this.transSpeed*statMultipler < -1?  this.transSpeed*statMultipler : -1;
        this.curHozSpeed = this.respawnSpeed;

        
    }

    public SetEnemyPrefabs(enemyPrefabs: cc.Prefab[])
    {
        this.EnemyPrefabs = [];
        this.EnemyPrefabs = enemyPrefabs;
    }

    public SetTravelPath(spawnID: number[], SpawnPos: cc.Vec2[], MiddlePoint: cc.Vec2[], speed: number)
    {
        this.TravelPath = [];
        this.FinalShape = [];
        this.SpawnPos = [];

        this.FinalShape = spawnID;
        this.SpawnPos = SpawnPos;
        this.TravelPath = MiddlePoint;
        this.TravelTime = speed;    
    }

    public SpawnEnemies(spawnID: number[])
    {
        //this.ResetPos(statMultipler);
        //this.SetTravelPath(spawnID, SpawnPos, MiddlePoint, speed);
        cc.log("SPAWN ID LENGTH " + spawnID.length);
        let i = 0;
        this.schedule(()=>
        {
            this.allEnemiesDestroyed = false;
            this.isRespawn = true;
            cc.log("CURRENT INDEX " + i);
            this.GenerateEnemy(i);
            i++;
        }, this.TimeToSpawn, this.FinalShape.length-1);        
    }

    private GenerateEnemy(idex: number)
    {
        //canMove = false;
        this.allEnemiesDestroyed = false;
        let i = Math.floor(Math.random() * this.SpawnPos.length);
        let j = Math.floor(Math.random() * this.EnemyPrefabs.length);
        let idx = idex;
        this.CurEnemies++;
        cc.log("CURRENT ENEMY " + this.CurEnemies);
        // let path: cc.Vec2[] = [];
        // path.push(this.SpawnPos[j]);
        // if(this.TravelPath.length != 0)
        // {
        //     this.TravelPath.forEach(element => 
        //     {
        //         path.push(element);
        //     });
        // }
        // path.push(this.node.children[this.FinalShape[this.CurEnemies]].getPosition());

        var scene = cc.director.getScene();
        var enemy = cc.instantiate(this.EnemyPrefabs[j]);

        enemy.getComponent(SingleEnemy).SetInitialStats(this.statMultiplier);
        enemy.getComponent(SingleEnemy).EnemyID = this.FinalShape[idx];
        enemy.getComponent(SingleEnemy).isGenerating = true;

        enemy.parent = scene;//this.node.children[this.FinalShape[this.CurEnemies]];
        //enemy.setPosition(cc.Vec2.ZERO);
        //cc.log("SHAPE POINT INPUT " + this.FinalShape[idx]);
        this.GeneratePath(this.FinalShape[idx], enemy);

        enemy.angle = this.node.children[this.FinalShape[idx]].angle;

        enemy?.on("ChangeDirection", this.SetHozSpeed, this);
        enemy?.on("EnemyDead", this.DecreaseCurEnemy, this);

        ////////// Code to make enemy travel along the path

        //this.CurEnemies++;

        if(this.CurEnemies == this.FinalShape.length)
        {
            this.canMove = true;
            this.isRespawn = false;
            this.node.emit("FinishSpawn");
        }
        else
        {
            this.canMove = false;
            this.isRespawn = true;
        } 
        //this.canMove = true;    
    }

    public SpawnEnemyDebug()
    {
        this.ResetPos(1);
        this.canMove = false;

        let TotalEnemy = this.useShape? this.FinalShape.length : 25;

        for(let i=0; i < TotalEnemy; i++)
        {
            let t = Math.floor(Math.random() * this.EnemyPrefabs.length);
            let j = this.useShape? this.FinalShape[i] : i;

            var scene = cc.director.getScene();
            var enemy = cc.instantiate(this.EnemyPrefabs[t]);

            enemy.getComponent(SingleEnemy).SetInitialStats(1);
            enemy.getComponent(SingleEnemy).EnemyID = j;
            enemy.getComponent(SingleEnemy).isGenerating = this.usePath? true : false;
            
            enemy.parent = this.usePath? scene : this.node.children[j];
            if(this.usePath)
            {
                cc.log("Make Enemy Tween: " + j);
                this.GeneratePath(j, enemy);
            }
            else
            {
                enemy.setPosition(cc.Vec2.ZERO);
            }
            
            enemy.angle = this.node.children[j].angle;

            enemy?.on("ChangeDirection", this.SetHozSpeed, this);
            enemy?.on("EnemyDead", this.DecreaseCurEnemy, this);

            // enemy.parent = scene;
            // enemy.setPosition(this.node.convertToWorldSpaceAR(
            //     this.node.children[j].getPosition(), 
            //     cc.v2()
            // ));

            this.CurEnemies++;

            if(i == TotalEnemy-1)
            {
                this.canMove = this.usePath? false : true;
                this.isRespawn = false;
            }
            else
            {
                this.canMove = false;
            }      
        }
    }

    public GeneratePath(finalPoint: number, target: cc.Node)
    {
        cc.log("finalPoint INPUT: " + finalPoint);
        let FinalPos = this.node.convertToWorldSpaceAR(this.node.children[finalPoint].getPosition());
        cc.log("Final Path Pos: " + FinalPos);

        let i = Math.floor(Math.random() * this.SpawnPos.length);

        target.setPosition(this.SpawnPos[i]);

        let path: cc.Vec2[] = [];
        path.push(this.SpawnPos[i]);
        if(this.TravelPath.length != 0)
        {
            this.TravelPath.forEach(element => 
            {
                path.push(element);
            });
        }
        path.push(FinalPos);

        cc.log("Final Path: " + path.length);

        let EnemyGo: cc.Tween[] = [];

        for(let n = 0; n < path.length;)
        {
            cc.log("Create Tween Action " + n);
            if(n + 2 < path.length)
            {
                let action = cc.tween().bezierTo((this.TravelTime*3)/GlobalTime.TimeScale, path[n], path[n+1], path[n+2]);
                //this.TweenPath.push(action);
                cc.tween(target).then(action);
                EnemyGo.push(action);
                n = n+2;
            }
            else if(n + 1 < path.length)   
            {
                let action = cc.tween().bezierTo((this.TravelTime*3)/GlobalTime.TimeScale, path[n], path[n], path[n+1]);
                //this.TweenPath.push(action);
                cc.tween(target).then(action);
                EnemyGo.push(action);
                n = n+1;
            }
            else
            {
                n++;
            }
        }

        cc.log("Final Tween: " + EnemyGo.length);

        for(let m = 0; m < EnemyGo.length; m++)
        {
            if(m == EnemyGo.length-1)
            {    
                EnemyGo[m].target(target).call(()=>
                {
                    target.parent = this.node.children[finalPoint];
                    target.setPosition(cc.Vec2.ZERO);
                    target.getComponent(SingleEnemy).isGenerating = false;
                    cc.log("After Tween Action " + target.getPosition());


                }).start();
            }
            else
            {
                EnemyGo[m].target(target).start();
            }
        }
        
        cc.log("After Finish Travel " + target.getPosition());
    }

    public SetHozSpeed(SpeedMultiplier: number)
    {
        cc.log("ChangeSpeed: " + SpeedMultiplier);
        this.curHozSpeed = this.hozSpeed * SpeedMultiplier;
        if(this.canMove)
        {
            //transform.Translate(new Vector3(0, transSpeed, 0), Space.World);
            let Direction = cc.v2(0, this.transSpeed);

            let Pos = new cc.Vec2();
            this.node.getPosition().add(Direction, Pos);
            this.node.setPosition(Pos);
        }
    }

    public DecreaseCurEnemy(ID: number, isDestroyedbyPlayer: boolean, DeadPos: cc.Vec2)
    {
        this.CurEnemies--;
        cc.log("Enemy Dead, Current is: " + this.CurEnemies);
        if(isDestroyedbyPlayer)
        {
            if(this.node.getComponent(cc.AudioSource) && this.node.getComponent(cc.AudioSource).clip)
            {
                cc.audioEngine.playEffect(this.node.getComponent(cc.AudioSource).clip, false);
            }        
        }  
        
        if(this.CurEnemies <= 0)
        {
            this.allEnemiesDestroyed = true;
            this.node.emit("AllEnemiesDied");
        }
    }

    update(dt) 
    {
        if(this.CurEnemies <= 0 && !this.allEnemiesDestroyed)
        {            
            // cc.warn("WHAT");
            // if(!this.isRespawn)
            // {
            //     this.allEnemiesDestroyed = true;
            // }
                 
            // if(this.isDebug && !this.isRespawn)
            // {
            //     this.isRespawn = true;
            //     this.scheduleOnce(this.SpawnEnemyDebug, 2);    
            // }
        }

        if(this.canMove)
        {
            //transform.Translate(new Vector3(curHozSpeed * Time.deltaTime, verSpeed * Time.deltaTime, 0), Space.World);
            let Direction = cc.v2(this.curHozSpeed, this.verSpeed);

            Direction.multiplyScalar(dt * GlobalTime.TimeScale);

            let Pos = new cc.Vec2();
            this.node.getPosition().add(Direction, Pos);
            this.node.setPosition(Pos);
        }
    }
}
