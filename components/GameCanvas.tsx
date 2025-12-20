
import { 
  CANVAS_HEIGHT, CANVAS_WIDTH, BRAWLERS, 
  TOTAL_TEAMS_SOLO, TOTAL_TEAMS_DUO, BOX_COUNT, BOX_HEALTH, 
  POWER_CUBE_HEALTH_BONUS, POWER_CUBE_DAMAGE_FACTOR,
  SPAWN_SHIELD_DURATION, LEVEL_STAT_BONUS,
  HEAL_DELAY, HEAL_RATE_PER_SEC,
  DYNAMIKE_BLAST_RADIUS, THROW_FLIGHT_DURATION, DUO_RESPAWN_TIME,
  MATCH_START_COUNTDOWN, MAP_WIDTH, MAP_HEIGHT, WALL_COUNT, WALL_SIZE,
  KNOCKOUT_ROUNDS_TO_WIN, TOTAL_TEAMS_KNOCKOUT,
  BRAWLER_TIPS, GAME_TIPS,
  POISON_START_DELAY, POISON_SHRINK_SPEED, POISON_DAMAGE, POISON_DAMAGE_INCREMENT, POISON_TICK_RATE
} from '../constants';
import React, { useEffect, useRef, useState } from 'react';
import { BrawlerType, Character, GameStatus, Projectile, PowerCube, GameStats, Box, Entity, GameMode, Wall, AreaEffect, TeammateStats, Particle, EmoteType } from '../types';
import { playShootSound, playHitSound, playDeathSound, playCollectSound, playClickSound } from '../services/audioService';
import { Target, MessageCircle, Smile, Frown, ThumbsUp, X, Octagon, Sword, Zap, CloudFog, Crown, Skull, Users, Music } from 'lucide-react';

interface GameCanvasProps {
  playerType: BrawlerType;
  playerName: string; // Oyuncunun ismi
  onGameOver: (stats: GameStats) => void;
  playerLevel: number;
  botNames: string[]; // Kulüpten gelen bot isimleri
  currentSkin?: string;
  gameMode: GameMode;
  activeStarPower?: string;
}

interface KillLog {
    id: string;
    killerName?: string;
    killerColor?: string;
    victimName: string;
    victimColor: string;
    type: 'NORMAL' | 'POISON';
}

const GameCanvas: React.FC<GameCanvasProps> = ({ playerType, playerName, onGameOver, playerLevel, botNames, currentSkin, gameMode, activeStarPower }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game State Refs
  const playerRef = useRef<Character | null>(null);
  const enemiesRef = useRef<Character[]>([]);
  const boxesRef = useRef<Box[]>([]);
  const wallsRef = useRef<Wall[]>([]);
  const bulletsRef = useRef<Projectile[]>([]);
  const poolsRef = useRef<AreaEffect[]>([]); 
  const cubesRef = useRef<PowerCube[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  const keysRef = useRef<Record<string, boolean>>({});
  const mouseRef = useRef<{ x: number; y: number; down: boolean }>({ x: 0, y: 0, down: false });
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const gameStateRef = useRef<GameStatus>(GameStatus.PLAYING);
  
  const matchEndedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const killsRef = useRef<number>(0);
  const cubesCollectedTotalRef = useRef<number>(0);

  // START COUNTDOWN STATE
  const [startCountdown, setStartCountdown] = useState<number>(MATCH_START_COUNTDOWN);
  const startCountdownRef = useRef<number>(MATCH_START_COUNTDOWN);

  // Kill Feed State
  const [killLogs, setKillLogs] = useState<KillLog[]>([]);

  // Knockout Round State
  const roundScoreRef = useRef({ blue: 0, red: 0 });
  const roundEndedRef = useRef(false);
  
  // UI State
  const [roundScore, setRoundScore] = useState({ blue: 0, red: 0 });
  const [roundWinner, setRoundWinner] = useState<'BLUE' | 'RED' | null>(null);
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);

  const [hudState, setHudState] = useState({
    health: 0,
    maxHealth: 100,
    ammo: 0,
    maxAmmo: 0,
    powerCubes: 0,
    teamsLeft: 0,
    damageBoost: 0,
    level: 1,
    respawnTime: 0,
    superCharge: 0 
  });

  const [isEmoteMenuOpen, setIsEmoteMenuOpen] = useState(false);
  const [gameTip, setGameTip] = useState<string | null>(null);
  const safeZoneRef = useRef({ x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT });

  // --- Particle Helpers ---
  const spawnParticle = (
      x: number, 
      y: number, 
      type: Particle['type'], 
      color: string, 
      count: number = 1, 
      options: Partial<Particle> = {}
  ) => {
      for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = (options.vx || options.vy) ? 0 : Math.random() * 3 + 1; 
          const size = options.size || (Math.random() * 4 + 2);
          
          particlesRef.current.push({
              id: Math.random().toString(),
              x: x,
              y: y,
              vx: options.vx !== undefined ? options.vx + (Math.random()-0.5) : Math.cos(angle) * speed,
              vy: options.vy !== undefined ? options.vy + (Math.random()-0.5) : Math.sin(angle) * speed,
              life: options.life || (Math.random() * 500 + 300),
              maxLife: options.life || (Math.random() * 500 + 300),
              color: color,
              size: size,
              type: type,
              text: options.text,
              gravity: options.gravity
          });
      }
  };

  const spawnExplosion = (x: number, y: number, color: string) => {
      spawnParticle(x, y, 'SPARK', color, 10, { size: 4, life: 600 });
      spawnParticle(x, y, 'SMOKE', '#ffffff', 5, { size: 10, life: 800 });
      spawnParticle(x, y, 'SHARD', color, 5, { size: 6, life: 500 });
  };

  const spawnDamageText = (x: number, y: number, amount: number, color: string = '#fff') => {
      particlesRef.current.push({
          id: Math.random().toString(),
          x: x + (Math.random() - 0.5) * 20,
          y: y - 20,
          vx: 0,
          vy: -2,
          life: 800,
          maxLife: 800,
          color: color,
          size: 20,
          type: 'TEXT',
          text: Math.round(amount).toString(),
          gravity: 0
      });
  };

  // --- Game Helpers ---

  const getLevelMultiplier = (level: number) => {
      return 1 + ((level - 1) * LEVEL_STAT_BONUS);
  };

  const getRandomPos = (margin: number = 50) => {
    return {
      x: margin + Math.random() * (MAP_WIDTH - margin * 2),
      y: margin + Math.random() * (MAP_HEIGHT - margin * 2)
    };
  };

  const checkWallCollision = (pos: {x: number, y: number}, radius: number): boolean => {
      for (const wall of wallsRef.current) {
          if (wall.type === 'BUSH') continue; 

          const closestX = Math.max(wall.x, Math.min(pos.x, wall.x + wall.width));
          const closestY = Math.max(wall.y, Math.min(pos.y, wall.y + wall.height));
          const dx = pos.x - closestX;
          const dy = pos.y - closestY;
          const distanceSquared = (dx * dx) + (dy * dy);

          if (distanceSquared < (radius * radius)) {
              return true;
          }
      }
      return false;
  };

  const destroyWall = (x: number, y: number, radius: number) => {
      wallsRef.current = wallsRef.current.filter(wall => {
          if (wall.type === 'BUSH' || wall.type === 'WATER') return true; 
          const wallCenterX = wall.x + wall.width / 2;
          const wallCenterY = wall.y + wall.height / 2;
          const dist = Math.hypot(x - wallCenterX, y - wallCenterY);
          
          if (dist < radius + 20) { 
              spawnParticle(wallCenterX, wallCenterY, 'SHARD', '#6b7280', 5, { size: 5, life: 500 });
              return false; 
          }
          return true;
      });
  };

  const createCharacter = (type: BrawlerType, teamId: number, id: string, name: string, level: number, pos?: {x:number, y:number}, skin?: string, starPowerId?: string): Character => {
    const config = BRAWLERS[type];
    let spawnPos = pos || getRandomPos(100);
    if (!pos) {
        let attempts = 0;
        while (checkWallCollision(spawnPos, 20) && attempts < 10) { spawnPos = getRandomPos(100); attempts++; }
    }
    const multiplier = getLevelMultiplier(level);
    let maxHealth = Math.round(config.maxHealth * multiplier);
    if (type === BrawlerType.FROSTBITE && starPowerId === 'PERMAFROST') maxHealth += 1000;

    return {
      id, name, type, team: teamId === 0 ? 'blue' : 'red', teamId: teamId, pos: spawnPos, velocity: { x: 0, y: 0 }, radius: 20, active: true,
      health: maxHealth, maxHealth: maxHealth, angle: 0, ammo: 3, maxAmmo: 3, powerCubes: 0, lastShotTime: 0, lastDamageTime: 0, 
      spawnShieldEndTime: Date.now() + SPAWN_SHIELD_DURATION + (MATCH_START_COUNTDOWN * 1000), respawnEndTime: 0, level: level, config, skin,
      activeStarPower: starPowerId, starPowerCooldown: 0, lastPoisonTick: 0, poisonTicks: 0, superCharge: 0
    };
  };

  const createBox = (): Box => {
    let pos = getRandomPos(80);
    let attempts = 0;
    while(checkWallCollision(pos, 25) && attempts < 10) { pos = getRandomPos(80); attempts++; }
    return { id: Math.random().toString(), pos, radius: 25, active: true, health: BOX_HEALTH, maxHealth: BOX_HEALTH };
  };

  const generateWalls = () => {
      const walls: Wall[] = [];
      const centerX = MAP_WIDTH / 2;
      const centerY = MAP_HEIGHT / 2;
      walls.push({ id: 'w_top', x: -50, y: -50, width: MAP_WIDTH + 100, height: 50, type: 'STONE' });
      walls.push({ id: 'w_btm', x: -50, y: MAP_HEIGHT, width: MAP_WIDTH + 100, height: 50, type: 'STONE' });
      walls.push({ id: 'w_lft', x: -50, y: 0, width: 50, height: MAP_HEIGHT, type: 'STONE' });
      walls.push({ id: 'w_rgt', x: MAP_WIDTH, y: 0, width: 50, height: MAP_HEIGHT, type: 'STONE' });
      for (let i = 0; i < WALL_COUNT; i++) {
          let x = Math.random() * (MAP_WIDTH - WALL_SIZE);
          let y = Math.random() * (MAP_HEIGHT - WALL_SIZE);
          if (Math.abs(x - centerX) < 200 && Math.abs(y - centerY) < 200) continue;
          const width = WALL_SIZE + Math.random() * (WALL_SIZE);
          const height = WALL_SIZE + Math.random() * (WALL_SIZE);
          const r = Math.random();
          let type: Wall['type'] = 'STONE';
          if (r > 0.8) type = 'WATER'; else if (r > 0.6) type = 'BUSH'; else if (r > 0.4) type = 'BARREL';
          walls.push({ id: `w_${i}`, x, y, width, height, type });
      }
      return walls;
  };

  const spawnPowerCube = (x: number, y: number) => {
    if (gameMode === GameMode.KNOCKOUT) return;
    const scatterX = (Math.random() - 0.5) * 20;
    const scatterY = (Math.random() - 0.5) * 20;
    let pos = { x: x + scatterX, y: y + scatterY };
    if (checkWallCollision(pos, 10)) pos = { x, y };
    cubesRef.current.push({ id: Math.random().toString(), pos: pos, radius: 10, active: true, spawnTime: Date.now(), value: 1 });
  };

  const checkCollision = (c1: { pos: { x: number, y: number }, radius: number }, c2: { pos: { x: number, y: number }, radius: number }) => {
    const dx = c1.pos.x - c2.pos.x;
    const dy = c1.pos.y - c2.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < c1.radius + c2.radius;
  };

  const distance = (p1: {x:number, y:number}, p2: {x:number, y:number}) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

  const distributePowerCube = (teamId: number) => {
      const allChars = [playerRef.current!, ...enemiesRef.current].filter(c => c);
      allChars.forEach(c => {
          if (c && c.teamId === teamId) {
              c.powerCubes += 1;
              c.maxHealth += POWER_CUBE_HEALTH_BONUS;
              c.health += POWER_CUBE_HEALTH_BONUS;
              spawnParticle(c.pos.x, c.pos.y, 'SPARK', '#22c55e', 10, { life: 800, size: 4 });
          }
      });
  };

  const resetRound = (nextRoundNumber: number) => {
      const player = playerRef.current;
      if (!player) return;
      setStartCountdown(3); 
      startCountdownRef.current = 3;
      const centerX = MAP_WIDTH / 2;
      const centerY = MAP_HEIGHT / 2;
      const team0 = [player, ...enemiesRef.current.filter(e => e.teamId === 0)];
      team0.forEach((char, idx) => {
           char.active = true; char.health = char.maxHealth; char.ammo = char.maxAmmo; char.superCharge = 0; char.respawnEndTime = 0;
           char.spawnShieldEndTime = Date.now() + 3000 + 3000; const offsetX = (idx - 1) * 60; char.pos = { x: centerX + offsetX, y: MAP_HEIGHT - 200 };
      });
      const team1 = enemiesRef.current.filter(e => e.teamId === 1);
      team1.forEach((char, idx) => {
           char.active = true; char.health = char.maxHealth; char.ammo = char.maxAmmo; char.respawnEndTime = 0;
           char.spawnShieldEndTime = Date.now() + 3000 + 3000; const offsetX = (idx - 1) * 60; char.pos = { x: centerX + offsetX, y: 200 };
      });
      bulletsRef.current = []; poolsRef.current = []; cubesRef.current = []; particlesRef.current = [];
      setRoundWinner(null); roundEndedRef.current = false; matchEndedRef.current = false; setShowVictoryScreen(false);
  };

  const triggerEmote = (emote: EmoteType) => {
      if (!playerRef.current) return;
      playerRef.current.activeEmote = emote;
      playerRef.current.emoteEndTime = Date.now() + 2500;
      setIsEmoteMenuOpen(false);
      playClickSound();
  };

  const activateSuper = () => {
      const player = playerRef.current;
      if (!player || !player.active || player.superCharge < 100) return;
      player.superCharge = 0;
      playCollectSound();
      spawnParticle(player.pos.x, player.pos.y, 'SPARK', '#fbbf24', 20, { size: 6, life: 1000 });
      const type = player.type;
      const cameraX = Math.max(0, Math.min(MAP_WIDTH - CANVAS_WIDTH, player.pos.x - CANVAS_WIDTH / 2));
      const cameraY = Math.max(0, Math.min(MAP_HEIGHT - CANVAS_HEIGHT, player.pos.y - CANVAS_HEIGHT / 2));
      const target = { x: mouseRef.current.x + cameraX, y: mouseRef.current.y + cameraY };
      const levelMult = getLevelMultiplier(player.level);
      const cubeMult = 1 + (player.powerCubes * POWER_CUBE_DAMAGE_FACTOR);
      const damageMult = levelMult * cubeMult;

      if (type === BrawlerType.SHELLY) {
          const count = 10; const spread = 0.5; const startAngle = player.angle - (spread * (count - 1)) / 2;
          for(let i=0; i<count; i++) {
              const angle = startAngle + i * spread;
              bulletsRef.current.push({ id: Math.random().toString(), ownerId: player.id, teamId: player.teamId, pos: { ...player.pos }, velocity: { x: Math.cos(angle) * 12, y: Math.sin(angle) * 12 }, radius: 10, active: true, damage: 400 * damageMult, color: '#fbbf24', isSuper: true, isWallBreaker: true, maxRange: 400 });
          }
      } else if (type === BrawlerType.COLT) {
          const bulletCount = 12;
          for(let i=0; i<bulletCount; i++) {
              setTimeout(() => { if(!player.active) return; const angle = player.angle + (Math.random() - 0.5) * 0.1; bulletsRef.current.push({ id: Math.random().toString(), ownerId: player.id, teamId: player.teamId, pos: { ...player.pos }, velocity: { x: Math.cos(angle) * 18, y: Math.sin(angle) * 18 }, radius: 8, active: true, damage: 320 * damageMult, color: '#fbbf24', isSuper: true, isWallBreaker: true, maxRange: 600 }); }, i * 80);
          }
      } else if (type === BrawlerType.EL_PRIMO || type === BrawlerType.EDGAR) {
          player.isSuperActive = true; player.superEndTime = Date.now() + 1000;
          const jumpDist = Math.min(distance(player.pos, target), 300); const jumpAngle = Math.atan2(target.y - player.pos.y, target.x - player.pos.x);
          const landX = player.pos.x + Math.cos(jumpAngle) * jumpDist; const landY = player.pos.y + Math.sin(jumpAngle) * jumpDist;
          setTimeout(() => {
              if(!player.active) return; player.pos.x = Math.min(Math.max(landX, 20), MAP_WIDTH-20); player.pos.y = Math.min(Math.max(landY, 20), MAP_HEIGHT-20); player.isSuperActive = false;
              if (type === BrawlerType.EL_PRIMO) { spawnExplosion(player.pos.x, player.pos.y, '#fbbf24'); destroyWall(player.pos.x, player.pos.y, 80); enemiesRef.current.forEach(e => { if (e.active && e.teamId !== player.teamId && distance(player.pos, e.pos) < 80) { e.health -= 800 * damageMult; spawnDamageText(e.pos.x, e.pos.y, 800 * damageMult, '#fbbf24'); } }); } 
              else if (type === BrawlerType.EDGAR) { player.health = Math.min(player.maxHealth, player.health + 1000); spawnDamageText(player.pos.x, player.pos.y, 1000, '#00ff00'); }
          }, 800);
      } else if (type === BrawlerType.DYNAMIKE) {
          bulletsRef.current.push({ id: Math.random().toString(), ownerId: player.id, teamId: player.teamId, pos: { ...player.pos }, velocity: { x: 0, y: 0 }, radius: 15, active: true, damage: 2500 * damageMult, color: '#fbbf24', isLobbed: true, startPos: { ...player.pos }, targetPos: target, startTime: Date.now(), flightDuration: 1000, aoeRadius: 100, isSuper: true, isWallBreaker: true });
      } else if (type === BrawlerType.NITA) {
          const bear = createCharacter(BrawlerType.EL_PRIMO, player.teamId, `bear_${Date.now()}`, 'Bruce', player.level, { x: player.pos.x + 20, y: player.pos.y + 20 });
          bear.name = "Bruce"; bear.maxHealth = 4000 * levelMult; bear.health = bear.maxHealth; bear.config.speed = 2.5; bear.config.color = '#7f1d1d';
          enemiesRef.current.push(bear); 
      } else if (type === BrawlerType.BULL) {
          player.isSuperActive = true; player.superEndTime = Date.now() + 1000;
          player.velocity = { x: Math.cos(player.angle) * 15, y: Math.sin(player.angle) * 15 };
      } else if (type === BrawlerType.BROCK) {
          for(let i=0; i<9; i++) { setTimeout(() => { const offsetX = (Math.random() - 0.5) * 150; const offsetY = (Math.random() - 0.5) * 150; bulletsRef.current.push({ id: Math.random().toString(), ownerId: player.id, teamId: player.teamId, pos: { ...player.pos }, velocity: { x: 0, y: 0 }, radius: 8, active: true, damage: 1000 * damageMult, color: '#fbbf24', isLobbed: true, startPos: { ...player.pos }, targetPos: { x: target.x + offsetX, y: target.y + offsetY }, startTime: Date.now(), flightDuration: 800, aoeRadius: 60, isSuper: true, isWallBreaker: false, leavePool: true }); }, i * 200); }
      } else if (type === BrawlerType.BARLEY) {
          for(let i=0; i<5; i++) { const offsetX = (Math.random() - 0.5) * 200; const offsetY = (Math.random() - 0.5) * 200; bulletsRef.current.push({ id: Math.random().toString(), ownerId: player.id, teamId: player.teamId, pos: { ...player.pos }, velocity: { x: 0, y: 0 }, radius: 8, active: true, damage: 600 * damageMult, color: '#fbbf24', isLobbed: true, startPos: { ...player.pos }, targetPos: { x: target.x + offsetX, y: target.y + offsetY }, startTime: Date.now(), flightDuration: 800, aoeRadius: 80, isSuper: true }); }
      } else if (type === BrawlerType.STU) {
          const dashDist = 150; const nextX = player.pos.x + Math.cos(player.angle) * dashDist; const nextY = player.pos.y + Math.sin(player.angle) * dashDist;
          if (!checkWallCollision({x: nextX, y: nextY}, player.radius)) { player.pos.x = nextX; player.pos.y = nextY; poolsRef.current.push({ id: Math.random().toString(), ownerId: player.id, teamId: player.teamId, damage: 400 * damageMult, pos: { ...player.pos }, radius: 40, active: true, spawnTime: Date.now(), duration: 3000, color: '#f97316', tickRate: 500 }); }
      } else if (type === BrawlerType.SPIKE) {
          bulletsRef.current.push({ id: Math.random().toString(), ownerId: player.id, teamId: player.teamId, pos: { ...player.pos }, velocity: { x: 0, y: 0 }, radius: 10, active: true, damage: 400 * damageMult, color: '#22c55e', isLobbed: true, startPos: { ...player.pos }, targetPos: target, startTime: Date.now(), flightDuration: 800, aoeRadius: 120, isSuper: true, leavePool: true });
      } else if (type === BrawlerType.SPECTRE) {
          const jumpDist = 200; const jumpAngle = Math.atan2(target.y - player.pos.y, target.x - player.pos.x);
          const landX = player.pos.x + Math.cos(jumpAngle) * jumpDist; const landY = player.pos.y + Math.sin(jumpAngle) * jumpDist;
          spawnParticle(player.pos.x, player.pos.y, 'SMOKE', '#a855f7', 15, { life: 800 });
          player.pos.x = Math.min(Math.max(landX, 20), MAP_WIDTH-20); player.pos.y = Math.min(Math.max(landY, 20), MAP_HEIGHT-20);
          spawnExplosion(player.pos.x, player.pos.y, '#a855f7'); 
          enemiesRef.current.forEach(e => { if (e.active && e.teamId !== player.teamId && distance(player.pos, e.pos) < 100) { e.health -= 1000 * damageMult; spawnDamageText(e.pos.x, e.pos.y, 1000 * damageMult, '#a855f7'); } });
      } else if (type === BrawlerType.AXEL) {
          player.isSuperActive = true; player.superEndTime = Date.now() + 3000;
          player.velocity = { x: Math.cos(player.angle) * 8, y: Math.sin(player.angle) * 8 };
      } else if (type === BrawlerType.VEGA) {
          spawnExplosion(player.pos.x, player.pos.y, '#06b6d4');
          const angle = player.angle;
          for(let i=0; i<5; i++) {
              setTimeout(() => {
                  bulletsRef.current.push({ id: Math.random().toString(), ownerId: player.id, teamId: player.teamId, pos: { x: player.pos.x + Math.cos(angle)*i*50, y: player.pos.y + Math.sin(angle)*i*50 }, velocity: { x: Math.cos(angle)*15, y: Math.sin(angle)*15 }, radius: 40, active: true, damage: 800 * damageMult, color: '#06b6d4', isSuper: true });
              }, i * 100);
          }
      } else if (type === BrawlerType.INFERNO || type === BrawlerType.FROSTBITE || type === BrawlerType.VOLT) {
          const range = 150; const color = type === BrawlerType.INFERNO ? '#ef4444' : (type === BrawlerType.FROSTBITE ? '#06b6d4' : '#a855f7');
          if (type === BrawlerType.VOLT) { const tX = player.pos.x + Math.cos(player.angle) * 100; const tY = player.pos.y + Math.sin(player.angle) * 100; if (!checkWallCollision({x: tX, y: tY}, player.radius)) { player.pos.x = tX; player.pos.y = tY; } }
          spawnExplosion(player.pos.x, player.pos.y, color); enemiesRef.current.forEach(e => { if (e.active && e.teamId !== player.teamId && distance(player.pos, e.pos) < range) { e.health -= 1000 * damageMult; spawnDamageText(e.pos.x, e.pos.y, 1000 * damageMult, color); } });
          if (type === BrawlerType.FROSTBITE) { spawnParticle(player.pos.x, player.pos.y, 'GAS', '#cffafe', 10, { size: 10, life: 1000 }); }
      }
  };

  const update = (dt: number) => {
    if (gameStateRef.current !== GameStatus.PLAYING) return;
    if (startCountdownRef.current > 0) return;
    const player = playerRef.current;
    if (!player) return;
    const cameraX = Math.max(0, Math.min(MAP_WIDTH - CANVAS_WIDTH, player.pos.x - CANVAS_WIDTH / 2));
    const cameraY = Math.max(0, Math.min(MAP_HEIGHT - CANVAS_HEIGHT, player.pos.y - CANVAS_HEIGHT / 2));
    const worldMouseX = mouseRef.current.x + cameraX;
    const worldMouseY = mouseRef.current.y + cameraY;
    const now = Date.now();

    if (keysRef.current[' '] && player.superCharge >= 100) { activateSuper(); keysRef.current[' '] = false; }
    if (matchEndedRef.current && showVictoryScreen) {
        if (Math.random() < 0.2) { spawnParticle(player.pos.x + (Math.random()-0.5)*100, player.pos.y + (Math.random()-0.5)*100, 'SPARK', '#facc15', 5, { life: 1000, size: 4 }); spawnParticle(player.pos.x + (Math.random()-0.5)*100, player.pos.y + (Math.random()-0.5)*100, 'SPARK', '#ffffff', 2, { life: 800, size: 3 }); }
        for (let i = particlesRef.current.length - 1; i >= 0; i--) { const p = particlesRef.current[i]; p.x += p.vx; p.y += p.vy; p.life -= dt; if (p.gravity) p.vy += p.gravity; if (p.life <= 0) particlesRef.current.splice(i, 1); }
        return; 
    }

    if (gameMode === GameMode.SOLO || gameMode === GameMode.DUO) {
        const timeSinceStart = now - (startTimeRef.current + (MATCH_START_COUNTDOWN * 1000));
        if (timeSinceStart > POISON_START_DELAY) {
            const shrinkAmount = (timeSinceStart - POISON_START_DELAY) / 1000 * POISON_SHRINK_SPEED;
            const maxShrink = (MAP_WIDTH / 2) - 150;
            const currentShrink = Math.min(shrinkAmount, maxShrink);
            safeZoneRef.current = { x: currentShrink, y: currentShrink, w: MAP_WIDTH - (currentShrink * 2), h: MAP_HEIGHT - (currentShrink * 2) };
            if (Math.random() < 0.3) {
                const perimeter = (safeZoneRef.current.w + safeZoneRef.current.h) * 2; const r = Math.random() * perimeter; let px, py;
                if (r < safeZoneRef.current.w) { px = safeZoneRef.current.x + r; py = safeZoneRef.current.y; } else if (r < safeZoneRef.current.w + safeZoneRef.current.h) { px = safeZoneRef.current.x + safeZoneRef.current.w; py = safeZoneRef.current.y + (r - safeZoneRef.current.w); } else if (r < safeZoneRef.current.w * 2 + safeZoneRef.current.h) { px = safeZoneRef.current.x + (r - (safeZoneRef.current.w + safeZoneRef.current.h)); py = safeZoneRef.current.y + safeZoneRef.current.h; } else { px = safeZoneRef.current.x; py = safeZoneRef.current.y + (r - (safeZoneRef.current.w * 2 + safeZoneRef.current.h)); }
                spawnParticle(px, py, 'GAS', '#4ade80', 1, { life: 1000, size: 20 + Math.random() * 20 });
            }
        }
    }

    for (let i = particlesRef.current.length - 1; i >= 0; i--) { const p = particlesRef.current[i]; p.x += p.vx; p.y += p.vy; p.life -= dt; if (p.gravity) p.vy += p.gravity; if (p.life <= 0) particlesRef.current.splice(i, 1); }

    if (player.active) {
        if (player.isSuperActive && player.superEndTime && player.superEndTime > now && (player.type === BrawlerType.BULL || player.type === BrawlerType.AXEL)) {
             const nextX = player.pos.x + player.velocity.x; const nextY = player.pos.y + player.velocity.y; destroyWall(nextX, nextY, player.radius + 10);
             if (nextX > 0 && nextX < MAP_WIDTH) player.pos.x = nextX; if (nextY > 0 && nextY < MAP_HEIGHT) player.pos.y = nextY;
             enemiesRef.current.forEach(e => { if (e.active && e.teamId !== player.teamId && distance(player.pos, e.pos) < 40) { if (now - e.lastDamageTime > 500) { e.health -= (player.type === BrawlerType.AXEL ? 600 : 1200); e.lastDamageTime = now; spawnDamageText(e.pos.x, e.pos.y, (player.type === BrawlerType.AXEL ? 600 : 1200), '#fbbf24'); } } });
             spawnParticle(player.pos.x, player.pos.y + player.radius, 'DUST', '#a1a1aa', 2, { life: 300, size: 8 });
             if (player.type === BrawlerType.AXEL) spawnParticle(player.pos.x, player.pos.y, 'SPARK', '#f97316', 5, { size: 4 });
        } else {
            if (player.isSuperActive && player.superEndTime && player.superEndTime <= now) player.isSuperActive = false;
            let speed = player.config.speed;
            if (player.activeStarPower === 'SLICK_BOOTS') speed *= 1.15;
            const move = { x: 0, y: 0 };
            if (keysRef.current['w'] || keysRef.current['arrowup']) move.y -= 1; if (keysRef.current['s'] || keysRef.current['arrowdown']) move.y += 1; if (keysRef.current['a'] || keysRef.current['arrowleft']) move.x -= 1; if (keysRef.current['d'] || keysRef.current['arrowright']) move.x += 1;
            if (move.x !== 0 || move.y !== 0) {
              const len = Math.sqrt(move.x * move.x + move.y * move.y); const nextX = player.pos.x + (move.x / len) * speed; const nextY = player.pos.y + (move.y / len) * speed;
              let canMoveX = true; let canMoveY = true;
              if (nextX < player.radius || nextX > MAP_WIDTH - player.radius || checkWallCollision({ x: nextX, y: player.pos.y }, player.radius)) canMoveX = false;
              if (nextY < player.radius || nextY > MAP_HEIGHT - player.radius || checkWallCollision({ x: player.pos.x, y: nextY }, player.radius)) canMoveY = false;
              if (canMoveX) player.pos.x = nextX; if (canMoveY) player.pos.y = nextY;
              if (Math.random() < 0.1) spawnParticle(player.pos.x, player.pos.y + player.radius, 'DUST', '#a1a1aa', 1, { life: 400, size: 5, vy: -0.5 });
            }
            const dx = worldMouseX - player.pos.x; const dy = worldMouseY - player.pos.y; player.angle = Math.atan2(dy, dx);
            if (mouseRef.current.down && now - player.lastShotTime > 250) fireBullet(player, { x: worldMouseX, y: worldMouseY });
        }
    }

    const allChars = [player, ...enemiesRef.current];
    allChars.forEach(char => {
      if (gameMode !== GameMode.KNOCKOUT && !char.active && char.respawnEndTime > 0) {
          const teammate = allChars.find(c => c.teamId === char.teamId && c.id !== char.id);
          const canRespawn = gameMode === GameMode.SOLO ? false : (teammate && (teammate.active || teammate.respawnEndTime > 0));
          if (!canRespawn && gameMode === GameMode.DUO) { char.respawnEndTime = 0; } else if (now > char.respawnEndTime) { char.active = true; char.health = char.maxHealth; char.ammo = char.maxAmmo; char.superCharge = 0; char.pos = (teammate && teammate.active) ? { ...teammate.pos } : getRandomPos(); char.spawnShieldEndTime = now + SPAWN_SHIELD_DURATION; char.respawnEndTime = 0; char.poisonTicks = 0; spawnParticle(char.pos.x, char.pos.y, 'SPARK', '#3b82f6', 20, { size: 5, life: 1000 }); }
      }
      if (char.active) {
        if (gameMode === GameMode.SOLO || gameMode === GameMode.DUO) { 
            const inSafeZone = char.pos.x >= safeZoneRef.current.x && char.pos.x <= safeZoneRef.current.x + safeZoneRef.current.w && char.pos.y >= safeZoneRef.current.y && char.pos.y <= safeZoneRef.current.y + safeZoneRef.current.h; 
            if (!inSafeZone) {
                if (!char.lastPoisonTick || now - char.lastPoisonTick > POISON_TICK_RATE) { 
                    char.lastPoisonTick = now; 
                    char.poisonTicks = (char.poisonTicks || 0) + 1;
                    const currentDamage = POISON_DAMAGE + (char.poisonTicks - 1) * POISON_DAMAGE_INCREMENT;
                    char.health -= currentDamage; 
                    char.lastDamageTime = now; 
                    spawnDamageText(char.pos.x, char.pos.y, currentDamage, '#00ff00'); 
                    spawnParticle(char.pos.x, char.pos.y, 'GAS', '#4ade80', 5, { life: 500, size: 8 }); 
                    if (char.health <= 0) handleDeath(char, null); 
                }
            } else {
                char.poisonTicks = 0; 
            }
        }
        if (char.activeStarPower === 'BAND_AID' && char.health < char.maxHealth * 0.4 && (char.starPowerCooldown || 0) <= now) { char.health += char.maxHealth * 0.4; char.starPowerCooldown = now + 20000; spawnParticle(char.pos.x, char.pos.y, 'TEXT', '#00ff00', 1, { text: 'BAND-AID', vy: -2, life: 1000 }); }
        if (char.burnEndTime && char.burnEndTime > now && now % 1000 < 50) { char.health -= 100; spawnDamageText(char.pos.x, char.pos.y, 100, '#f97316'); spawnParticle(char.pos.x, char.pos.y, 'SPARK', '#f97316', 3, { size: 2, life: 300 }); if (char.health <= 0) handleDeath(char, null); }
        let effectiveReloadSpeed = char.config.reloadSpeed;
        if (char.activeStarPower === 'BERSERKER' && char.health < char.maxHealth * 0.4) effectiveReloadSpeed /= 2;
        if (char.activeStarPower === 'HYPER_BEAR') effectiveReloadSpeed *= 0.8;
        if (char.activeStarPower === 'OVERCHARGE') effectiveReloadSpeed *= 0.7;
        if (now - char.lastShotTime > 500 && char.ammo < char.maxAmmo) char.ammo = Math.min(char.maxAmmo, char.ammo + (dt / effectiveReloadSpeed));
        if (char.health < char.maxHealth && now - char.lastDamageTime > HEAL_DELAY && now - char.lastShotTime > HEAL_DELAY) { char.health = Math.min(char.maxHealth, char.health + (char.maxHealth * HEAL_RATE_PER_SEC * (dt / 1000))); if (Math.random() < 0.05) spawnParticle(char.pos.x, char.pos.y - 20, 'SPARK', '#22c55e', 1, { vy: -2, life: 500 }); }
      }
    });

    enemiesRef.current.forEach(enemy => {
        if (!enemy.active) return;
        if (Math.random() < 0.001) { const emotes = [EmoteType.ANGRY, EmoteType.HAPPY, EmoteType.SAD, EmoteType.THUMBS_UP, EmoteType.SURPRISED]; enemy.activeEmote = emotes[Math.floor(Math.random() * emotes.length)]; enemy.emoteEndTime = now + 2000; }
        const possibleTargets: Entity[] = [];
        if (player.active && player.teamId !== enemy.teamId) possibleTargets.push(player);
        enemiesRef.current.forEach(e => { if (e.active && e.id !== enemy.id && e.teamId !== enemy.teamId) possibleTargets.push(e); });
        if (gameMode !== GameMode.KNOCKOUT) boxesRef.current.forEach(b => { if (b.active) possibleTargets.push(b); });
        let target: Entity | null = null; let minDist = Infinity;
        possibleTargets.forEach(t => { const d = Math.hypot(t.pos.x - enemy.pos.x, t.pos.y - enemy.pos.y); if (d < minDist) { minDist = d; target = t; } });
        let moveToTarget = true;
        if ((gameMode === GameMode.SOLO || gameMode === GameMode.DUO) && safeZoneRef.current) { const inSafeZone = enemy.pos.x >= safeZoneRef.current.x && enemy.pos.x <= safeZoneRef.current.x + safeZoneRef.current.w && enemy.pos.y >= safeZoneRef.current.y && enemy.pos.y <= safeZoneRef.current.y + safeZoneRef.current.h; if (!inSafeZone) { const centerX = safeZoneRef.current.x + safeZoneRef.current.w / 2; const centerY = safeZoneRef.current.y + safeZoneRef.current.h / 2; const angle = Math.atan2(centerY - enemy.pos.y, centerX - enemy.pos.x); enemy.angle = angle; const nextX = enemy.pos.x + Math.cos(angle) * enemy.config.speed; const nextY = enemy.pos.y + Math.sin(angle) * enemy.config.speed; if (!checkWallCollision({x: nextX, y: enemy.pos.y}, enemy.radius)) enemy.pos.x = nextX; if (!checkWallCollision({x: enemy.pos.x, y: nextY}, enemy.radius)) enemy.pos.y = nextY; moveToTarget = false; target = null; } }
        if (moveToTarget && gameMode === GameMode.DUO || gameMode === GameMode.KNOCKOUT) { const teammates = enemiesRef.current.filter(m => m.teamId === enemy.teamId && m.id !== enemy.id); if (enemy.teamId === player.teamId) teammates.push(player); const aliveTeammate = teammates.find(t => t.active); if (aliveTeammate) { const distToMate = distance(enemy.pos, aliveTeammate.pos); if (distToMate > 250 && (!target || minDist > 150)) { const angle = Math.atan2(aliveTeammate.pos.y - enemy.pos.y, aliveTeammate.pos.x - enemy.pos.x); const nextX = enemy.pos.x + Math.cos(angle) * enemy.config.speed; const nextY = enemy.pos.y + Math.sin(angle) * enemy.config.speed; if (!checkWallCollision({x: nextX, y: enemy.pos.y}, enemy.radius)) enemy.pos.x = nextX; if (!checkWallCollision({x: enemy.pos.x, y: nextY}, enemy.radius)) enemy.pos.y = nextY; moveToTarget = false; if (Math.random() < 0.1) spawnParticle(enemy.pos.x, enemy.pos.y + enemy.radius, 'DUST', '#a1a1aa', 1, { life: 400, size: 5, vy: -0.5 }); } } }
        if (target) { const tdx = target.pos.x - enemy.pos.x; const tdy = target.pos.y - enemy.pos.y; const dist = Math.hypot(tdx, tdy); const angle = Math.atan2(tdy, tdx); enemy.angle = angle; if (moveToTarget) { const stopDistance = ('config' in target) ? (target as Character).config.range * 0.6 : 10; if (dist > stopDistance) { const nextX = enemy.pos.x + Math.cos(angle) * enemy.config.speed * 0.8; const nextY = enemy.pos.y + Math.sin(angle) * enemy.config.speed * 0.8; if (!checkWallCollision({x: nextX, y: enemy.pos.y}, enemy.radius) && nextX > 0 && nextX < MAP_WIDTH) enemy.pos.x = nextX; if (!checkWallCollision({x: enemy.pos.x, y: nextY}, enemy.radius) && nextY > 0 && nextY < MAP_HEIGHT) enemy.pos.y = nextY; if (Math.random() < 0.1) spawnParticle(enemy.pos.x, enemy.pos.y + enemy.radius, 'DUST', '#a1a1aa', 1, { life: 400, size: 5, vy: -0.5 }); } } const shootRange = ('config' in target) ? enemy.config.range : 120; if (dist < shootRange) { if (now - enemy.lastShotTime > 500) { fireBullet(enemy, target.pos); } } }
    });

    for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
        const b = bulletsRef.current[i];
        if (!b.isLobbed && Math.random() < 0.3) spawnParticle(b.pos.x, b.pos.y, 'SPARK', b.color, 1, { life: 200, size: 2 });
        if (b.isLobbed && b.startPos && b.targetPos && b.startTime) {
            const elapsed = now - b.startTime; const duration = b.flightDuration || THROW_FLIGHT_DURATION; const t = Math.min(1, elapsed / duration); b.pos.x = b.startPos.x + (b.targetPos.x - b.startPos.x) * t; b.pos.y = b.startPos.y + (b.targetPos.y - b.startPos.y) * t;
            if (t >= 1) { playHitSound(); bulletsRef.current.splice(i, 1); spawnExplosion(b.pos.x, b.pos.y, b.color); if (b.isWallBreaker) destroyWall(b.pos.x, b.pos.y, b.aoeRadius || 60);
                const blastRadius = b.aoeRadius || DYNAMIKE_BLAST_RADIUS; const isBarley = b.color === BRAWLERS[BrawlerType.BARLEY].color;
                if (isBarley || (b.isSuper && b.leavePool)) { poolsRef.current.push({ id: Math.random().toString(), ownerId: b.ownerId, teamId: b.teamId, damage: b.damage / (b.isSuper ? 2 : 1), pos: { ...b.pos }, radius: blastRadius, active: true, spawnTime: now, duration: 1500, color: b.color, tickRate: 500, isSuper: b.isSuper }); } 
                else { if (b.leavePool && !b.isSuper) poolsRef.current.push({ id: Math.random().toString(), ownerId: b.ownerId, teamId: b.teamId, damage: 500, pos: { ...b.pos }, radius: 40, active: true, spawnTime: now, duration: 2000, color: '#f97316', tickRate: 500 });
                    boxesRef.current.forEach(box => { if (box.active && distance(b.pos, box.pos) < blastRadius + box.radius) { box.health -= b.damage; spawnDamageText(box.pos.x, box.pos.y, b.damage); if (box.health <= 0) { box.active = false; spawnExplosion(box.pos.x, box.pos.y, '#8b5cf6'); spawnPowerCube(box.pos.x, box.pos.y); } } });
                    const chars = [player, ...enemiesRef.current]; const shooter = chars.find(c => c.id === b.ownerId); chars.forEach(char => { if (char.active && char.teamId !== b.teamId && distance(b.pos, char.pos) < blastRadius + char.radius) { if (now < char.spawnShieldEndTime) return; char.health -= b.damage; char.lastDamageTime = now; if (shooter) shooter.superCharge = Math.min(100, shooter.superCharge + (b.isSuper ? 0 : 25)); spawnDamageText(char.pos.x, char.pos.y, b.damage, '#ef4444'); if (char.health <= 0) handleDeath(char, shooter || null); } });
                } continue;
            } continue;
        }
        b.pos.x += b.velocity.x; b.pos.y += b.velocity.y;
        if (!b.isLobbed && b.startPos && b.maxRange) { const dist = Math.hypot(b.pos.x - b.startPos.x, b.pos.y - b.startPos.y); if (dist >= b.maxRange) { if (b.leavePool) poolsRef.current.push({ id: Math.random().toString(), ownerId: b.ownerId, teamId: b.teamId, damage: 500, pos: { ...b.pos }, radius: 40, active: true, spawnTime: now, duration: 2000, color: '#f97316', tickRate: 500 }); bulletsRef.current.splice(i, 1); spawnParticle(b.pos.x, b.pos.y, 'SPARK', b.color, 3, { life: 100, size: 2 }); continue; } }
        let hit = false; if (b.pos.x < 0 || b.pos.x > MAP_WIDTH || b.pos.y < 0 || b.pos.y > MAP_HEIGHT) hit = true;
        if (!hit) { const hitWall = checkWallCollision(b.pos, 5); if (hitWall) { if (b.isWallBreaker) { destroyWall(b.pos.x, b.pos.y, 40); spawnExplosion(b.pos.x, b.pos.y, '#333'); } else { hit = true; } } }
        if (!hit) { for (const box of boxesRef.current) { if (box.active && checkCollision(b, box)) { box.health -= b.damage; playHitSound(); spawnDamageText(box.pos.x, box.pos.y, b.damage); spawnParticle(box.pos.x, box.pos.y, 'SPARK', '#fbbf24', 3, { life: 300, size: 3 }); const shooter = [player, ...enemiesRef.current].find(c => c.id === b.ownerId); if (shooter && !b.isSuper) shooter.superCharge = Math.min(100, shooter.superCharge + 5); if (shooter && shooter.active && shooter.type === BrawlerType.EDGAR) { let healRatio = 0.35; if (shooter.activeStarPower === 'FISTICUFFS') healRatio = 0.50; const healAmount = b.damage * healRatio; shooter.health = Math.min(shooter.health + healAmount, shooter.maxHealth); spawnParticle(shooter.pos.x, shooter.pos.y - 40, 'TEXT', '#00ff00', 1, { text: `+${Math.round(healAmount)}`, vy: -1, life: 500 }); } if (shooter && shooter.active && shooter.type === BrawlerType.STU && shooter.activeStarPower === 'GASO_HEAL') { const healAmount = 200; shooter.health = Math.min(shooter.maxHealth, shooter.health + healAmount); spawnParticle(shooter.pos.x, shooter.pos.y - 40, 'TEXT', '#00ff00', 1, { text: `+${healAmount}`, vy: -1, life: 500 }); } if (shooter && shooter.active && shooter.type === BrawlerType.SPIKE && shooter.activeStarPower === 'FERTILIZE') { const healAmount = 400; shooter.health = Math.min(shooter.maxHealth, shooter.health + healAmount); spawnParticle(shooter.pos.x, shooter.pos.y - 40, 'TEXT', '#00ff00', 1, { text: `+${healAmount}`, vy: -1, life: 500 }); } if (box.health <= 0) { box.active = false; spawnExplosion(box.pos.x, box.pos.y, '#8b5cf6'); spawnPowerCube(box.pos.x, box.pos.y); } if (!b.isWallBreaker) hit = true; break; } } }
        if (!hit) { const chars = [player, ...enemiesRef.current]; for (const char of chars) { if (char.active && char.id !== b.ownerId && char.teamId !== b.teamId && checkCollision(b, char)) { if (now < char.spawnShieldEndTime) { hit = true; break; } char.health -= b.damage; char.lastDamageTime = now; const shooter = chars.find(c => c.id === b.ownerId); if (shooter && !b.isSuper) { const chargeAmount = shooter.type === BrawlerType.STU ? 100 : 20; shooter.superCharge = Math.min(100, shooter.superCharge + chargeAmount); } if (b.burnEffect) { char.burnEndTime = now + 4000; spawnParticle(char.pos.x, char.pos.y, 'TEXT', '#f97316', 1, { text: 'YANMA!', vy: -2, life: 1000 }); } playHitSound(); spawnDamageText(char.pos.x, char.pos.y, b.damage, '#ef4444'); spawnParticle(b.pos.x, b.pos.y, 'SPARK', '#ef4444', 5, { life: 300, size: 3 }); if (shooter && shooter.active && shooter.type === BrawlerType.EDGAR) { let healRatio = 0.35; if (shooter.activeStarPower === 'FISTICUFFS') healRatio = 0.50; const healAmount = b.damage * healRatio; shooter.health = Math.min(shooter.maxHealth, shooter.health + healAmount); spawnParticle(shooter.pos.x, shooter.pos.y - 40, 'TEXT', '#00ff00', 1, { text: `+${Math.round(healAmount)}`, vy: -1, life: 500 }); } if (shooter && shooter.active && shooter.type === BrawlerType.STU && shooter.activeStarPower === 'GASO_HEAL') { const healAmount = 200; shooter.health = Math.min(shooter.maxHealth, shooter.health + healAmount); spawnParticle(shooter.pos.x, shooter.pos.y - 40, 'TEXT', '#00ff00', 1, { text: `+${healAmount}`, vy: -1, life: 500 }); } if (shooter && shooter.active && shooter.type === BrawlerType.SPIKE && shooter.activeStarPower === 'FERTILIZE') { const healAmount = 400; shooter.health = Math.min(shooter.maxHealth, shooter.health + healAmount); spawnParticle(shooter.pos.x, shooter.pos.y - 40, 'TEXT', '#00ff00', 1, { text: `+${healAmount}`, vy: -1, life: 500 }); } if (shooter && shooter.active && shooter.type === BrawlerType.SPECTRE && shooter.activeStarPower === 'HAUNTED') { char.velocity.x *= 0.5; char.velocity.y *= 0.5; spawnParticle(char.pos.x, char.pos.y, 'TEXT', '#a855f7', 1, { text: 'YAVAŞ!', vy: -2, life: 1000 }); } if (char.health <= 0) { handleDeath(char, shooter || null); } if (!b.isSuper || (shooter && shooter.type === BrawlerType.BROCK)) { hit = true; } break; } } }
        if (hit) { if (b.leavePool) { poolsRef.current.push({ id: Math.random().toString(), ownerId: b.ownerId, teamId: b.teamId, damage: 500, pos: { ...b.pos }, radius: 40, active: true, spawnTime: now, duration: 2000, color: '#f97316', tickRate: 500 }); } bulletsRef.current.splice(i, 1); spawnParticle(b.pos.x, b.pos.y, 'SPARK', b.color, 3, { life: 200, size: 2 }); }
    }

    poolsRef.current = poolsRef.current.filter(pool => now < pool.spawnTime + pool.duration);
    poolsRef.current.forEach(pool => {
        if (Math.random() < 0.1) spawnParticle(pool.pos.x + (Math.random()-0.5)*pool.radius, pool.pos.y + (Math.random()-0.5)*pool.radius, 'SMOKE', pool.color, 1, { life: 500, size: 3, vy: -1 });
        const chars = [player, ...enemiesRef.current]; const shooter = chars.find(c => c.id === pool.ownerId); chars.forEach(char => { if (char.active && char.teamId !== pool.teamId && distance(pool.pos, char.pos) < pool.radius + char.radius) { if (now < char.spawnShieldEndTime) return; if (shooter && now - char.lastDamageTime > pool.tickRate && !pool.isSuper) shooter.superCharge = Math.min(100, shooter.superCharge + 5); if (now - char.lastDamageTime > pool.tickRate) { char.health -= pool.damage; char.lastDamageTime = now; spawnDamageText(char.pos.x, char.pos.y, pool.damage, '#ef4444'); if (char.health <= 0) handleDeath(char, shooter || null); } } });
        boxesRef.current.forEach(box => { if (box.active && distance(pool.pos, box.pos) < pool.radius + box.radius) { if (Math.random() < 0.05) { box.health -= pool.damage; spawnDamageText(box.pos.x, box.pos.y, pool.damage); if (box.health <= 0) { box.active = false; spawnExplosion(box.pos.x, box.pos.y, '#8b5cf6'); spawnPowerCube(box.pos.x, box.pos.y); } } } });
    });

    for (let i = cubesRef.current.length - 1; i >= 0; i--) { const cube = cubesRef.current[i]; const checkCollect = (char: Character) => { if (char.active && checkCollision({ ...cube, pos: { x: cube.pos.x, y: cube.pos.y } }, char)) { distributePowerCube(char.teamId); playCollectSound(); if (char.id === player.id) cubesCollectedTotalRef.current += 1; cubesRef.current.splice(i, 1); return true; } return false; }; if (checkCollect(player)) continue; let collected = false; for (const enemy of enemiesRef.current) { if (checkCollect(enemy)) { collected = true; break; } } if (collected) continue; }

    const activeTeams = new Set<number>();
    if (player.active || player.respawnEndTime > 0 || enemiesRef.current.some(e => e.teamId === player.teamId && (e.active || e.respawnEndTime > 0))) { activeTeams.add(player.teamId); }
    enemiesRef.current.forEach(e => { const members = enemiesRef.current.filter(m => m.teamId === e.teamId); if (members.some(m => m.active || m.respawnEndTime > 0)) activeTeams.add(e.teamId); });

    if (gameMode === GameMode.KNOCKOUT && !roundEndedRef.current) {
        if (activeTeams.size <= 1) {
            roundEndedRef.current = true; const winnerTeam = activeTeams.has(0) ? 0 : 1; const winnerName = winnerTeam === 0 ? 'BLUE' : 'RED'; setRoundWinner(winnerName);
            if (winnerTeam === 0) roundScoreRef.current.blue += 1; else roundScoreRef.current.red += 1; setRoundScore({ ...roundScoreRef.current });
            if (roundScoreRef.current.blue >= KNOCKOUT_ROUNDS_TO_WIN) setTimeout(() => endGame(1, roundScoreRef.current.blue, roundScoreRef.current.red), 2000); else if (roundScoreRef.current.red >= KNOCKOUT_ROUNDS_TO_WIN) setTimeout(() => endGame(2, roundScoreRef.current.blue, roundScoreRef.current.red), 2000); else setTimeout(() => resetRound(roundScoreRef.current.blue + roundScoreRef.current.red + 1), 3000); return;
        }
    } else if (gameMode !== GameMode.KNOCKOUT) {
        if (!activeTeams.has(player.teamId)) { endGame(activeTeams.size + 1); return; }
        if (activeTeams.size === 1 && activeTeams.has(player.teamId)) { if (!matchEndedRef.current) { matchEndedRef.current = true; setShowVictoryScreen(true); setTimeout(() => { endGame(1); }, 2500); } return; }
    }
  };

  const handleDeath = (char: Character, killer: Character | null) => {
      char.active = false; char.poisonTicks = 0; spawnExplosion(char.pos.x, char.pos.y, char.config.color); spawnPowerCube(char.pos.x, char.pos.y);
      const killedByPlayer = killer?.id === playerRef.current?.id; if (killedByPlayer) killsRef.current += 1; playDeathSound();
      const newLog: KillLog = { id: Date.now().toString() + Math.random(), killerName: killer ? killer.name : undefined, killerColor: killer ? (killer.teamId === playerRef.current?.teamId ? '#4ade80' : '#f87171') : undefined, victimName: char.name, victimColor: char.teamId === playerRef.current?.teamId ? '#4ade80' : '#f87171', type: killer ? 'NORMAL' : 'POISON' };
      setKillLogs(prev => [newLog, ...prev].slice(0, 5)); setTimeout(() => setKillLogs(prev => prev.filter(l => l.id !== newLog.id)), 3000);
      if (gameMode === GameMode.DUO) { const allChars = [playerRef.current!, ...enemiesRef.current]; const teammate = allChars.find(c => c.teamId === char.teamId && c.id !== char.id); if (teammate && teammate.active) char.respawnEndTime = Date.now() + DUO_RESPAWN_TIME; else { char.respawnEndTime = 0; if (teammate) teammate.respawnEndTime = 0; } } else if (gameMode === GameMode.KNOCKOUT || gameMode === GameMode.SOLO) { char.respawnEndTime = 0; }
  };

  const fireBullet = (char: Character, target: {x: number, y: number}) => {
    if (char.ammo >= 1) {
      char.ammo -= 1; char.lastShotTime = Date.now(); playShootSound(char.config.type);
      if (char.activeStarPower === 'MEDICAL_USE') { char.health = Math.min(char.maxHealth, char.health + 400); spawnParticle(char.pos.x, char.pos.y - 20, 'TEXT', '#00ff00', 1, { text: '+400', vy: -2, life: 500 }); }
      const tipX = char.pos.x + Math.cos(char.angle) * 30; const tipY = char.pos.y + Math.sin(char.angle) * 30; spawnParticle(tipX, tipY, 'MUZZLE', '#fff', 3, { life: 100, size: 5, vx: Math.cos(char.angle)*2, vy: Math.sin(char.angle)*2 });
      const levelMult = getLevelMultiplier(char.level); const cubeMult = 1 + (char.powerCubes * POWER_CUBE_DAMAGE_FACTOR); const finalDamage = char.config.damage * levelMult * cubeMult;
      if (char.config.type === BrawlerType.DYNAMIKE || char.config.type === BrawlerType.BARLEY) {
           const dist = distance(char.pos, target); const clampedDist = Math.min(dist, char.config.range); const angle = Math.atan2(target.y - char.pos.y, target.x - char.pos.x); const targetPos = { x: char.pos.x + Math.cos(angle) * clampedDist, y: char.pos.y + Math.sin(angle) * clampedDist };
           let blastRadius = DYNAMIKE_BLAST_RADIUS; if (char.activeStarPower === 'DEMOLITION') blastRadius *= 1.20;
           const count = char.config.type === BrawlerType.DYNAMIKE ? 2 : 1;
           for(let i=0; i<count; i++) { const offset = i === 0 ? -10 : 10; const finalOffset = count === 1 ? 0 : offset; bulletsRef.current.push({ id: Math.random().toString(), ownerId: char.id, teamId: char.teamId, pos: { ...char.pos }, velocity: { x: 0, y: 0 }, radius: 4, active: true, damage: finalDamage, color: char.config.color, isLobbed: true, startPos: { ...char.pos }, targetPos: { x: targetPos.x + finalOffset, y: targetPos.y + finalOffset }, startTime: Date.now(), flightDuration: THROW_FLIGHT_DURATION, aoeRadius: blastRadius, skin: char.skin }); } return;
      }
      const count = char.config.projectileCount; const spread = char.config.spread; const startAngle = char.angle - (spread * (count - 1)) / 2;
      for (let i = 0; i < count; i++) { const angle = startAngle + i * spread; bulletsRef.current.push({ id: Math.random().toString(), ownerId: char.id, teamId: char.teamId, pos: { ...char.pos }, velocity: { x: Math.cos(angle) * char.config.projectileSpeed, y: Math.sin(angle) * char.config.projectileSpeed }, radius: 5, active: true, damage: finalDamage, color: char.config.color, startPos: { ...char.pos }, maxRange: char.config.range, skin: char.skin, burnEffect: char.activeStarPower === 'EL_FUEGO' || char.type === BrawlerType.INFERNO, leavePool: char.activeStarPower === 'INCENDIARY' || (char.type === BrawlerType.INFERNO && char.activeStarPower === 'MAGMA_STEPS') }); }
    }
  };

  const endGame = (rank: number, wins?: number, losses?: number) => {
    if (gameStateRef.current === GameStatus.GAME_OVER) return;
    gameStateRef.current = GameStatus.GAME_OVER;
    const totalTeams = gameMode === GameMode.DUO ? TOTAL_TEAMS_DUO : (gameMode === GameMode.KNOCKOUT ? 2 : TOTAL_TEAMS_SOLO);
    let teammateType: BrawlerType | undefined; let teammateSkin: string | undefined; let teammateName: string | undefined; const teammatesList: TeammateStats[] = [];
    if ((gameMode === GameMode.DUO || gameMode === GameMode.KNOCKOUT) && playerRef.current) { const teammates = enemiesRef.current.filter(e => e.teamId === playerRef.current!.teamId); teammates.forEach(t => teammatesList.push({ type: t.type, skin: t.skin, name: t.name })); if (teammates.length > 0) { teammateType = teammates[0].type; teammateSkin = teammates[0].skin; teammateName = teammates[0].name; } }
    const stats: GameStats = { kills: killsRef.current, powerCubesCollected: cubesCollectedTotalRef.current, duration: Date.now() - startTimeRef.current, rank: rank, totalPlayers: totalTeams, brawlerName: BRAWLERS[playerType].name, playerName: playerName, trophyChange: 0, teammateType: teammateType, teammateSkin: teammateSkin, teammateName: teammateName, teammates: teammatesList, roundsWon: wins, roundsLost: losses, masteryPointsGained: 0 };
    onGameOver(stats);
  };

  const drawEmote = (ctx: CanvasRenderingContext2D, char: Character) => {
      if (!char.activeEmote || !char.emoteEndTime || Date.now() > char.emoteEndTime) return;
      const x = char.pos.x + 20; const y = char.pos.y - 60; const size = 32;
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'white'; ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-size, -size, size * 2, size * 2, 8); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-5, size); ctx.lineTo(0, size + 8); ctx.lineTo(5, size); ctx.fill(); ctx.stroke();
      if (char.activeEmote === EmoteType.HAPPY) { ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 8, 0.2, Math.PI - 0.2); ctx.stroke(); } 
      else if (char.activeEmote === EmoteType.ANGRY) { ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(-6, -4); ctx.lineTo(-2, -2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(6, -4); ctx.lineTo(2, -2); ctx.stroke(); } 
      else if (char.activeEmote === EmoteType.SAD) { ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 8, 6, Math.PI + 0.2, Math.PI * 2 - 0.2); ctx.stroke(); } 
      else if (char.activeEmote === EmoteType.THUMBS_UP) { ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-2, 4); ctx.lineTo(5, -4); ctx.stroke(); } 
      else if (char.activeEmote === EmoteType.SURPRISED) { ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    if (!playerRef.current) return;
    const player = playerRef.current;
    
    const cameraX = Math.max(0, Math.min(MAP_WIDTH - CANVAS_WIDTH, player.pos.x - CANVAS_WIDTH / 2));
    const cameraY = Math.max(0, Math.min(MAP_HEIGHT - CANVAS_HEIGHT, player.pos.y - CANVAS_HEIGHT / 2));
    const worldMouseX = mouseRef.current.x + cameraX;
    const worldMouseY = mouseRef.current.y + cameraY;
    const now = Date.now();

    ctx.fillStyle = '#1e1e24'; ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save(); ctx.translate(-cameraX, -cameraY);

    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    const startGridX = Math.floor(cameraX / 40) * 40, startGridY = Math.floor(cameraY / 40) * 40;
    const endGridX = startGridX + CANVAS_WIDTH + 40, endGridY = startGridY + CANVAS_HEIGHT + 40;
    for (let x = startGridX; x <= endGridX; x += 40) { ctx.beginPath(); ctx.moveTo(x, startGridY); ctx.lineTo(x, endGridY); ctx.stroke(); }
    for (let y = startGridY; y <= endGridY; y += 40) { ctx.beginPath(); ctx.moveTo(startGridX, y); ctx.lineTo(endGridX, y); ctx.stroke(); }
    ctx.strokeStyle = '#f00'; ctx.lineWidth = 5; ctx.strokeRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    if (gameMode === GameMode.SOLO || gameMode === GameMode.DUO) {
        const { x, y, w, h } = safeZoneRef.current;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)'; ctx.fillRect(0, 0, MAP_WIDTH, y); ctx.fillRect(0, y + h, MAP_WIDTH, MAP_HEIGHT - (y + h)); ctx.fillRect(0, y, x, h); ctx.fillRect(x + w, y, MAP_WIDTH - (x + w), h);
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h);
    }

    wallsRef.current.forEach(wall => {
        if (wall.x + wall.width < cameraX || wall.x > cameraX + CANVAS_WIDTH || wall.y + wall.height < cameraY || wall.y > cameraY + CANVAS_HEIGHT) return;
        if (wall.type === 'WATER') { ctx.fillStyle = '#3b82f6'; ctx.fillRect(wall.x, wall.y, wall.width, wall.height); ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2; for(let i=0; i<wall.width; i+=20) { ctx.beginPath(); ctx.moveTo(wall.x + i, wall.y); ctx.lineTo(wall.x + i - 10, wall.y + wall.height); ctx.stroke(); } const waveY = Math.sin(now / 500 + wall.x) * 5; ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.ellipse(wall.x + wall.width/2, wall.y + wall.height/2, wall.width/3 + waveY, wall.height/3, 0, 0, Math.PI*2); ctx.fill(); } 
        else if (wall.type === 'STONE' || wall.type === 'BARREL') { const depth = 15; ctx.fillStyle = '#374151'; ctx.fillRect(wall.x, wall.y + wall.height, wall.width, depth); ctx.fillStyle = wall.type === 'STONE' ? '#6b7280' : '#854d0e'; ctx.fillRect(wall.x, wall.y, wall.width, wall.height); ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 2; ctx.strokeRect(wall.x, wall.y, wall.width, wall.height); if (wall.type === 'BARREL') { ctx.fillStyle = '#a16207'; ctx.beginPath(); ctx.arc(wall.x + wall.width/2, wall.y + wall.height/2, Math.min(wall.width, wall.height)/3, 0, Math.PI*2); ctx.fill(); } }
    });

    particlesRef.current.forEach(p => { if (p.type === 'DUST') { ctx.globalAlpha = p.life / p.maxLife; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1.0; } });

    poolsRef.current.forEach(pool => { ctx.globalAlpha = 0.5; ctx.fillStyle = pool.color; ctx.beginPath(); ctx.arc(pool.pos.x, pool.pos.y, pool.radius, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1.0; if (Math.random() > 0.8) { const bubbleX = pool.pos.x + (Math.random() - 0.5) * pool.radius * 1.5; const bubbleY = pool.pos.y + (Math.random() - 0.5) * pool.radius * 1.5; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(bubbleX, bubbleY, 3 + Math.random() * 3, 0, Math.PI * 2); ctx.fill(); } });

    boxesRef.current.forEach(box => { if (box.active) { if (box.pos.x + 30 < cameraX || box.pos.x - 30 > cameraX + CANVAS_WIDTH || box.pos.y + 30 < cameraY || box.pos.y - 30 > cameraY + CANVAS_HEIGHT) return; ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(box.pos.x - 20 + 5, box.pos.y - 20 + 5, 40, 40); ctx.fillStyle = '#8b5cf6'; ctx.beginPath(); ctx.rect(box.pos.x - 20, box.pos.y - 20, 40, 40); ctx.fill(); ctx.strokeStyle = '#5b21b6'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = '#4c1d95'; ctx.beginPath(); ctx.arc(box.pos.x, box.pos.y, 10, 0, Math.PI*2); ctx.fill(); const hpPercent = box.health / box.maxHealth; ctx.fillStyle = '#ef4444'; ctx.fillRect(box.pos.x - 20, box.pos.y - 35, 40, 5); ctx.fillStyle = '#22c55e'; ctx.fillRect(box.pos.x - 20, box.pos.y - 35, 40 * hpPercent, 5); } });

    cubesRef.current.forEach(cube => { if (cube.pos.x < cameraX - 20 || cube.pos.x > cameraX + CANVAS_WIDTH + 20) return; const floatY = Math.sin(now / 200) * 5; const rotate = Math.sin(now / 300) * 0.2; ctx.save(); ctx.translate(cube.pos.x, cube.pos.y + floatY); ctx.rotate(rotate); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-8, 5, 16, 16); ctx.fillStyle = '#22c55e'; ctx.fillRect(-8, -8, 16, 16); ctx.strokeStyle = '#bbf7d0'; ctx.lineWidth = 2; ctx.strokeRect(-8, -8, 16, 16); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI*2); ctx.fill(); ctx.restore(); });

    const drawCharacter = (char: Character) => {
      if (!char.active) return;
      if (char.pos.x < cameraX - 50 || char.pos.x > cameraX + CANVAS_WIDTH || char.pos.y < cameraY - 50 || char.pos.y > cameraY + CANVAS_HEIGHT) return;

      if (now < char.spawnShieldEndTime) { ctx.save(); ctx.beginPath(); ctx.arc(char.pos.x, char.pos.y, char.radius + 10, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255, 255, 100, 0.3)'; ctx.fill(); ctx.strokeStyle = 'rgba(255, 255, 100, 0.6)'; ctx.setLineDash([5, 5]); ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }

      if (char.superCharge >= 100) { ctx.save(); ctx.beginPath(); ctx.arc(char.pos.x, char.pos.y, char.radius + 15, 0, Math.PI * 2); const alpha = 0.3 + Math.sin(now/200) * 0.2; ctx.fillStyle = `rgba(250, 204, 21, ${alpha})`; ctx.fill(); ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }

      ctx.save(); 
      ctx.translate(char.pos.x, char.pos.y);
      
      const hitFlash = now - char.lastDamageTime < 100;
      
      ctx.rotate(char.angle);
      
      const recoil = now - char.lastShotTime < 100 ? -5 : 0;
      ctx.translate(recoil, 0);
      const breathe = 1 + Math.sin(now / 300) * 0.03;
      ctx.scale(breathe, breathe);

      if (hitFlash) {
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, char.radius, 0, Math.PI * 2); ctx.fill();
      } else {
          if (char.type !== BrawlerType.STU && char.type !== BrawlerType.FROSTBITE && char.type !== BrawlerType.SPECTRE && char.type !== BrawlerType.VEGA && char.type !== BrawlerType.AXEL) {
              ctx.fillStyle = '#000';
              ctx.beginPath(); ctx.ellipse(-10, 10, 6, 4, 0, 0, Math.PI*2); ctx.fill(); 
              ctx.beginPath(); ctx.ellipse(-10, -10, 6, 4, 0, 0, Math.PI*2); ctx.fill(); 
          }

          switch (char.type) {
              case BrawlerType.SHELLY:
                  ctx.fillStyle = '#475569'; ctx.fillRect(0, -5, 25, 10); ctx.fillStyle = '#000'; ctx.fillRect(25, -5, 5, 10);
                  ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(10, 0); ctx.lineTo(0, -10); ctx.fill();
                  ctx.fillStyle = '#6d28d9'; ctx.beginPath(); ctx.arc(-5, 0, 14, 0, Math.PI*2); ctx.fill();
                  break;

              case BrawlerType.COLT:
                  ctx.fillStyle = '#94a3b8'; 
                  ctx.fillRect(10, -15, 15, 6); 
                  ctx.fillRect(10, 9, 15, 6); 
                  ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.ellipse(-5, 0, 12, 14, 0, 0, Math.PI*2); ctx.fill();
                  break;

              case BrawlerType.EL_PRIMO:
                  ctx.fillStyle = '#d69e2e'; 
                  ctx.beginPath(); ctx.arc(15, -10, 8, 0, Math.PI*2); ctx.fill();
                  ctx.beginPath(); ctx.arc(15, 10, 8, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#d69e2e'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(-2, 0, 12, 0, Math.PI*2); ctx.fill();
                  break;

              case BrawlerType.SPIKE:
                  ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#166534';
                  ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(5, -22); ctx.lineTo(-5, -22); ctx.fill(); 
                  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-8, 0, 6, 0, Math.PI*2); ctx.fill();
                  ctx.strokeStyle = '#7e22ce'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 16, 1, 5); ctx.stroke();
                  break;

              case BrawlerType.DYNAMIKE:
                  ctx.fillStyle = '#854d0e'; ctx.beginPath(); ctx.arc(-10, 0, 10, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(5, 0, 12, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(5, 0, 8, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(10, 0, 6, 0, Math.PI*2); ctx.fill();
                  break;

              case BrawlerType.NITA:
                  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-5, 0, 18, 0, Math.PI*2); ctx.fill();
                  ctx.beginPath(); ctx.arc(-10, -12, 6, 0, Math.PI*2); ctx.fill();
                  ctx.beginPath(); ctx.arc(-10, 12, 6, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#fca5a5'; ctx.beginPath(); ctx.arc(5, 0, 8, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#0ea5e9'; ctx.beginPath(); ctx.arc(0, 0, 18, 1, 2); ctx.stroke();
                  break;

              case BrawlerType.BULL:
                  ctx.fillStyle = '#333'; ctx.fillRect(10, -6, 20, 12);
                  ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(-5, 0, 14, 10, 0, 0, Math.PI*2); ctx.fill();
                  ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(12, 0, 3, 0, Math.PI*2); ctx.stroke();
                  break;

              case BrawlerType.BROCK:
                  ctx.fillStyle = '#333'; ctx.fillRect(-10, -20, 40, 10);
                  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(28, -15, 4, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(0, 5, 12, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#000'; ctx.fillRect(8, 0, 8, 4);
                  break;

              case BrawlerType.BARLEY:
                  ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.ellipse(20, 10, 6, 4, 0, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(5, 0, 3, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-5, 0, 10, 0, Math.PI*2); ctx.fill();
                  break;

              case BrawlerType.EDGAR:
                  ctx.fillStyle = '#a855f7'; 
                  ctx.beginPath(); ctx.arc(15, -10, 6, 0, Math.PI*2); ctx.fill();
                  ctx.beginPath(); ctx.arc(15, 10, 6, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill();
                  ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(10, 0); ctx.lineTo(0, 10); ctx.fill();
                  break;

              case BrawlerType.STU:
                  ctx.fillStyle = '#333'; ctx.beginPath(); ctx.rect(-10, -5, 20, 10); ctx.fill();
                  ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(2, 0); ctx.lineTo(-2, 0); ctx.fill();
                  break;

              case BrawlerType.INFERNO:
                  ctx.fillStyle = 'rgba(239, 68, 68, 0.5)'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#b91c1c'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(5, 0, 8, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#facc15'; ctx.fillRect(10, -3, 4, 6);
                  break;

              case BrawlerType.FROSTBITE:
                  ctx.fillStyle = '#06b6d4'; ctx.beginPath(); ctx.rect(-12, -12, 24, 24); ctx.fill();
                  ctx.fillStyle = '#22d3ee';
                  ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(-5, -20); ctx.lineTo(5, -20); ctx.fill();
                  ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(-5, 20); ctx.lineTo(5, 20); ctx.fill();
                  break;

              case BrawlerType.VOLT:
                  ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#facc15'; ctx.fillRect(0, -8, 12, 16);
                  ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-15, 0); ctx.stroke();
                  break;

              case BrawlerType.SPECTRE:
                  ctx.fillStyle = 'rgba(168, 85, 247, 0.4)'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#4c1d95'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.arc(-5, -5, 4, 0, Math.PI*2); ctx.fill();
                  ctx.beginPath(); ctx.arc(-5, 5, 4, 0, Math.PI*2); ctx.fill();
                  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(8, 0); ctx.lineTo(0, 10); ctx.stroke();
                  break;

              case BrawlerType.AXEL:
                  ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
                  ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.arc(14, 0, 10, 0, Math.PI * 2); ctx.fill();
                  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(14, 0, 4, 0, Math.PI * 2); ctx.fill();
                  ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(-5, -5, 3, 0, Math.PI * 2); ctx.stroke();
                  ctx.beginPath(); ctx.arc(-5, 5, 3, 0, Math.PI * 2); ctx.stroke();
                  break;
              case BrawlerType.VEGA:
                  ctx.fillStyle = '#0891b2'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
                  ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.ellipse(5, 0, 10, 8, 0, 0, Math.PI*2); ctx.fill();
                  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(8, 4, 2, 0, Math.PI*2); ctx.fill();
                  ctx.beginPath(); ctx.arc(8, -4, 2, 0, Math.PI*2); ctx.fill();
                  break;
              default:
                  ctx.fillStyle = char.config.color; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
                  break;
          }
      }
      ctx.restore();

      // UI (Name and Health)
      const x = char.pos.x - cameraX;
      const y = char.pos.y - cameraY;
      
      const barW = 40;
      const barH = 6;
      const hpPercent = char.health / char.maxHealth;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(x - barW/2, y - 40, barW, barH);
      ctx.fillStyle = char.teamId === 0 ? '#4ade80' : '#f87171';
      ctx.fillRect(x - barW/2, y - 40, barW * Math.max(0, hpPercent), barH);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(char.name, x, y - 45);
    };

    [player, ...enemiesRef.current].forEach(char => drawCharacter(char));

    bulletsRef.current.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.pos.x, b.pos.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    [player, ...enemiesRef.current].forEach(char => drawEmote(ctx, char));

    particlesRef.current.forEach(p => {
        if (p.type === 'TEXT') {
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.font = `bold ${p.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(p.text || '', p.x, p.y);
            ctx.globalAlpha = 1.0;
        } else if (p.type !== 'DUST') {
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    });

    ctx.restore();
  };

  // --- Main Lifecycle ---
  useEffect(() => {
    // Initialization
    wallsRef.current = generateWalls();
    const boxes: Box[] = [];
    for (let i = 0; i < BOX_COUNT; i++) boxes.push(createBox());
    boxesRef.current = boxes;

    const player = createCharacter(playerType, 0, 'player_me', playerName, playerLevel, undefined, currentSkin, activeStarPower);
    playerRef.current = player;

    const enemies: Character[] = [];
    const brawlerTypes = Object.values(BrawlerType);
    
    if (gameMode === GameMode.DUO) {
        const type = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
        enemies.push(createCharacter(type, 0, 'teammate_1', botNames[0] || 'Dost', playerLevel));
        for (let t = 1; t < TOTAL_TEAMS_DUO; t++) {
            for (let m = 0; m < 2; m++) {
                const bType = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
                const name = botNames[(t * 2 + m) % botNames.length] || `Bot ${t}-${m}`;
                enemies.push(createCharacter(bType, t, `bot_${t}_${m}`, name, Math.max(1, playerLevel + Math.floor(Math.random()*3)-1)));
            }
        }
    } else if (gameMode === GameMode.KNOCKOUT) {
        for (let i = 0; i < 2; i++) {
            const bType = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
            enemies.push(createCharacter(bType, 0, `ally_${i}`, botNames[i % botNames.length] || `Ally ${i}`, playerLevel));
        }
        for (let i = 0; i < 3; i++) {
            const bType = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
            enemies.push(createCharacter(bType, 1, `enemy_${i}`, botNames[(i+2) % botNames.length] || `Enemy ${i}`, playerLevel));
        }
    } else {
        for (let i = 0; i < TOTAL_TEAMS_SOLO - 1; i++) {
            const bType = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
            const name = botNames[i % botNames.length] || `Bot ${i}`;
            enemies.push(createCharacter(bType, i + 1, `bot_${i}`, name, Math.max(1, playerLevel + Math.floor(Math.random()*3)-1)));
        }
    }
    enemiesRef.current = enemies;

    // Game Loop
    let lastT = performance.now();
    const loop = (t: number) => {
        const dt = t - lastT;
        lastT = t;
        if (gameStateRef.current === GameStatus.PLAYING) {
            update(dt);
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) draw(ctx);
        }
        frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    // Countdown Timer
    const timer = setInterval(() => {
        setStartCountdown(prev => {
            const next = prev - 1;
            startCountdownRef.current = next;
            if (next <= 0) {
                clearInterval(timer);
                return 0;
            }
            return next;
        });
    }, 1000);

    // Event Listeners
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current[e.key.toLowerCase()] = true;
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current[e.key.toLowerCase()] = false;
    const handleMouseDown = () => mouseRef.current.down = true;
    const handleMouseUp = () => mouseRef.current.down = false;
    const handleMouseMove = (e: MouseEvent) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    // HUD Update
    const hudInterval = setInterval(() => {
        const p = playerRef.current;
        if (p) {
            const activeTeams = new Set<number>();
            const chars = [p, ...enemiesRef.current];
            chars.forEach(c => {
                if (c.active || c.respawnEndTime > 0) activeTeams.add(c.teamId);
            });

            setHudState({
                health: p.health,
                maxHealth: p.maxHealth,
                ammo: p.ammo,
                maxAmmo: p.maxAmmo,
                powerCubes: p.powerCubes,
                teamsLeft: activeTeams.size,
                damageBoost: p.powerCubes * 10,
                level: p.level,
                respawnTime: p.respawnEndTime > 0 ? Math.ceil((p.respawnEndTime - Date.now()) / 1000) : 0,
                superCharge: p.superCharge
            });
        }
    }, 100);

    return () => {
        cancelAnimationFrame(frameRef.current);
        clearInterval(timer);
        clearInterval(hudInterval);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#1a1a2e] flex items-center justify-center overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT} 
        className="bg-[#1e1e24] shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-crosshair border-4 border-black/20" 
      />

      {/* --- HUD OVERLAY --- */}
      <div className="absolute inset-0 pointer-events-none select-none p-4 flex flex-col justify-between z-10">
          
          {/* Top HUD */}
          <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                  <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border-2 border-white/10 flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center border-2 border-black">
                          <Zap size={20} className="text-white fill-white" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-white font-brawl text-2xl leading-none">{hudState.powerCubes}</span>
                          <span className="text-green-400 text-[8px] font-bold uppercase">ENERJİ KÜPÜ</span>
                      </div>
                  </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-xl border-2 border-white/10 flex flex-col items-center">
                  <span className="text-white font-brawl text-3xl leading-none">{hudState.teamsLeft}</span>
                  <span className="text-blue-400 text-[10px] font-bold uppercase">TAKIM KALDI</span>
              </div>
          </div>

          {/* Kill Feed */}
          <div className="absolute top-20 right-4 flex flex-col gap-2">
              {killLogs.map(log => (
                  <div key={log.id} className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 animate-slideLeft">
                      {log.killerName && (
                          <span style={{ color: log.killerColor }} className="font-bold text-xs uppercase">{log.killerName}</span>
                      )}
                      {log.type === 'POISON' ? (
                          <CloudFog size={14} className="text-green-400" />
                      ) : (
                          <Skull size={14} className="text-white" />
                      )}
                      <span style={{ color: log.victimColor }} className="font-bold text-xs uppercase">{log.victimName}</span>
                  </div>
              ))}
          </div>

          {/* Bottom HUD */}
          <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md flex flex-col gap-2">
                  {/* Ammo Bars */}
                  <div className="flex justify-center gap-2">
                      {[...Array(hudState.maxAmmo)].map((_, i) => (
                          <div key={i} className="w-12 h-3 bg-black/50 rounded-full border border-white/20 overflow-hidden">
                              <div 
                                className="h-full bg-orange-500" 
                                style={{ width: `${Math.max(0, Math.min(1, hudState.ammo - i)) * 100}%` }}
                              />
                          </div>
                      ))}
                  </div>
                  
                  {/* Health Bar */}
                  <div className="h-8 bg-black/50 rounded-lg border-2 border-black overflow-hidden relative shadow-lg">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                        style={{ width: `${(hudState.health / hudState.maxHealth) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-brawl text-xl drop-shadow-md">{Math.max(0, Math.round(hudState.health))} / {hudState.maxHealth}</span>
                      </div>
                  </div>
              </div>

              {/* Super & Emotes */}
              <div className="flex items-center gap-10">
                   <button 
                      className={`
                        w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-xl pointer-events-auto transition-all active:scale-95
                        ${hudState.superCharge >= 100 ? 'bg-yellow-400 border-white animate-pulse scale-110 cursor-pointer' : 'bg-slate-700 border-black opacity-50'}
                      `}
                      onClick={activateSuper}
                   >
                       <Skull size={48} className={hudState.superCharge >= 100 ? 'text-black' : 'text-slate-500'} />
                       {hudState.superCharge < 100 && (
                           <div className="absolute inset-0 flex items-center justify-center">
                               <span className="text-white font-bold text-xs">{Math.floor(hudState.superCharge)}%</span>
                           </div>
                       )}
                   </button>

                   <div className="relative pointer-events-auto">
                        <button 
                            onClick={() => setIsEmoteMenuOpen(!isEmoteMenuOpen)}
                            className="bg-blue-600 p-3 rounded-full border-2 border-black shadow-lg hover:bg-blue-500 transition-colors"
                        >
                            <MessageCircle size={28} className="text-white" />
                        </button>
                        {isEmoteMenuOpen && (
                            <div className="absolute bottom-16 -left-12 bg-black/60 backdrop-blur-md p-2 rounded-xl border-2 border-white/20 flex gap-2 animate-slideUp">
                                <button onClick={() => triggerEmote(EmoteType.HAPPY)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Smile size={32} className="text-green-400" /></button>
                                <button onClick={() => triggerEmote(EmoteType.SAD)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Frown size={32} className="text-blue-400" /></button>
                                <button onClick={() => triggerEmote(EmoteType.ANGRY)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Octagon size={32} className="text-red-400" /></button>
                                <button onClick={() => triggerEmote(EmoteType.THUMBS_UP)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ThumbsUp size={32} className="text-yellow-400" /></button>
                            </div>
                        )}
                   </div>
              </div>
          </div>
      </div>

      {/* --- START COUNTDOWN --- */}
      {startCountdown > 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex flex-col items-center justify-center animate-fadeIn">
              <div className="bg-[#1e40af] p-10 rounded-[40px] border-8 border-black shadow-2xl flex flex-col items-center scale-125">
                  <div className="text-white font-brawl text-8xl md:text-9xl drop-shadow-[0_10px_0_rgba(0,0,0,1)] stroke-black" style={{ WebkitTextStroke: '4px black' }}>
                      {startCountdown}
                  </div>
                  <div className="mt-4 bg-yellow-400 px-6 py-2 rounded-full border-4 border-black">
                      <span className="text-black font-brawl text-2xl uppercase tracking-widest">HAZIRLAN!</span>
                  </div>
              </div>
              <div className="mt-12 max-w-md text-center bg-black/60 p-4 rounded-xl border-2 border-white/10">
                  <p className="text-yellow-400 font-bold text-xs uppercase mb-2">İPUCU</p>
                  <p className="text-white text-sm font-medium italic">"{GAME_TIPS[Math.floor(Math.random() * GAME_TIPS.length)]}"</p>
              </div>
          </div>
      )}

      {/* --- VICTORY OVERLAY --- */}
      {showVictoryScreen && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center animate-fadeIn">
              <div className="bg-[#facc15] w-full py-12 transform -skew-y-3 shadow-[0_0_100px_rgba(250,204,21,0.5)] border-y-8 border-black">
                  <h1 className="text-center font-brawl text-8xl md:text-[10rem] text-white drop-shadow-[0_10px_0_#000] stroke-black tracking-tighter" style={{ WebkitTextStroke: '5px black' }}>
                      HESAPLAŞMA!
                  </h1>
              </div>
          </div>
      )}

      {/* --- DEAD / RESPAWN OVERLAY --- */}
      {hudState.respawnTime > 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fadeIn">
               <Skull size={80} className="text-red-500 mb-6 animate-bounce" />
               <h2 className="text-white font-brawl text-5xl uppercase mb-2">ELENDİN!</h2>
               <div className="flex items-center gap-3">
                   <div className="text-blue-300 font-bold text-xl">YENİDEN DOĞUŞA KALAN SÜRE:</div>
                   <div className="text-white font-brawl text-4xl bg-black/40 px-4 py-1 rounded-lg border-2 border-white/20">{hudState.respawnTime}</div>
               </div>
          </div>
      )}

    </div>
  );
};

// Fixed module import by adding default export
export default GameCanvas;
