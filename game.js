/**
 * CYBER ROYALE - Neon Protocol
 * Core Game Engine, Combat Simulation, Clash Royale Logic, AI, and Canvas Renderer
 */

// Virtual Arena Coordinate Space
const V_WIDTH = 400;
const V_HEIGHT = 640;

// Complete 12-Card Database (Clash Royale Archetypes)
const CARDS_DATABASE = [
  {
    id: 'mech',
    name: 'Mech Titã',
    role: 'Tanque',
    cost: 5,
    icon: '🤖',
    type: 'unit',
    isBuildingTargeter: true,
    isFlying: false,
    hp: 1850,
    speed: 0.85,
    damage: 120,
    attackSpeed: 1.4,
    range: 30,
    targetsAir: false,
    color: '#00e5ff',
    count: 1,
    desc: 'Alta vida. Ignora tropas inimigas e marcha direto contra as torres.'
  },
  {
    id: 'ronin',
    name: 'Ciborgue Ronin',
    role: 'Combatente',
    cost: 3,
    icon: '⚔️',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: false,
    hp: 800,
    speed: 1.7,
    damage: 105,
    attackSpeed: 0.95,
    range: 26,
    targetsAir: false,
    color: '#38ef7d',
    count: 1,
    desc: 'Guerreiro balanceado armado com lâminas de plasma de alta frequência.'
  },
  {
    id: 'drones',
    name: 'Enxame Drones',
    role: 'Horda Aérea',
    cost: 3,
    icon: '🛸',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: true,
    hp: 125,
    speed: 1.95,
    damage: 38,
    attackSpeed: 0.8,
    range: 36,
    targetsAir: true,
    color: '#a855f7',
    count: 4,
    desc: '4 drones voadores ágeis. Cruzam o abismo sem precisar de pontes.'
  },
  {
    id: 'sniper',
    name: 'Atirador Laser',
    role: 'Alcance',
    cost: 4,
    icon: '🎯',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: false,
    hp: 380,
    speed: 1.15,
    damage: 165,
    attackSpeed: 1.5,
    range: 145,
    targetsAir: true,
    color: '#facc15',
    count: 1,
    desc: 'Longo alcance de feixe contínuo. Atinge tropas aéreas e terrestres.'
  },
  {
    id: 'plasma',
    name: 'Lança-Plasma',
    role: 'Dano em Área',
    cost: 4,
    icon: '💥',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: false,
    hp: 510,
    speed: 1.25,
    damage: 85,
    splashRadius: 48,
    attackSpeed: 1.3,
    range: 95,
    targetsAir: true,
    color: '#fb923c',
    count: 1,
    desc: 'Dispara esferas de plasma explosivas que obliteram hordas inteiras.'
  },
  {
    id: 'emp',
    name: 'Pulso EMP',
    role: 'Feitiço',
    cost: 4,
    icon: '⚡',
    type: 'spell',
    damage: 220,
    towerDamage: 130,
    radius: 75,
    stunDuration: 1.8,
    color: '#60a5fa',
    desc: 'Atinge qualquer ponto do mapa! Causa dano em área e paralisa alvos por 1.8s.'
  },
  {
    id: 'tesla',
    name: 'Torre Tesla',
    role: 'Construção',
    cost: 4,
    icon: '📡',
    type: 'building',
    hp: 780,
    range: 115,
    damage: 54,
    attackSpeed: 0.65,
    lifetime: 30,
    targetsAir: true,
    color: '#22d3ee',
    desc: 'Estrutura defensiva fixa que dispara raios rápidos e atrai tropas tanques.'
  },
  {
    id: 'ninjas',
    name: 'Droids Ninja',
    role: 'Horda',
    cost: 2,
    icon: '🥷',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: false,
    hp: 175,
    speed: 2.1,
    damage: 48,
    attackSpeed: 0.7,
    range: 22,
    targetsAir: false,
    color: '#f43f5e',
    count: 3,
    desc: 'Trio super veloz com dano afiado. Ideal para cercar mechs e defender.'
  },
  {
    id: 'valkyrie',
    name: 'Nanovortex',
    role: 'Giro em Área',
    cost: 4,
    icon: '🌀',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: false,
    hp: 920,
    speed: 1.3,
    damage: 115,
    attackSpeed: 1.15,
    range: 35,
    isSpinAttack: true,
    splashRadius: 40,
    targetsAir: false,
    color: '#ec4899',
    count: 1,
    desc: 'Ciborgue com turbina de lâminas 360° que retalha todos os inimigos ao redor.'
  },
  {
    id: 'rocket',
    name: 'Míssil Orbital',
    role: 'Feitiço Pesado',
    cost: 6,
    icon: '🚀',
    type: 'spell',
    damage: 540,
    towerDamage: 320,
    radius: 65,
    isHeavySpell: true,
    color: '#f97316',
    desc: 'Ataque de satélite orbital de dano massivo contra aglomerações e torres.'
  },
  {
    id: 'spawner',
    name: 'Ninho Nanites',
    role: 'Gerador',
    cost: 5,
    icon: '🏭',
    type: 'spawner',
    hp: 680,
    lifetime: 30,
    spawnInterval: 4.8,
    spawnCardId: 'drones',
    color: '#10b981',
    desc: 'Fábrica de campo que produz periodicamente duplas de drones voadores.'
  },
  {
    id: 'speeder',
    name: 'Motoqueira Neon',
    role: 'Investida',
    cost: 4,
    icon: '🏍️',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: false,
    hp: 640,
    speed: 2.4,
    damage: 95,
    chargeDamageMultiplier: 2.0,
    attackSpeed: 1.0,
    range: 26,
    targetsAir: false,
    color: '#06b6d4',
    count: 1,
    desc: 'Super veloz em moto de luz. Causa dano dobrado no primeiro impacto!'
  }
];

// Default Active Deck (8 cards)
const DEFAULT_DECK_IDS = ['mech', 'ronin', 'drones', 'sniper', 'plasma', 'emp', 'tesla', 'ninjas'];

// --- ENTITY CLASSES ---

class Tower {
  constructor(team, type, x, y, hp, range, damage) {
    this.team = team; // 'player' | 'enemy'
    this.type = type; // 'node_left' | 'node_right' | 'core'
    this.x = x;
    this.y = y;
    this.maxHp = hp;
    this.hp = hp;
    this.range = range;
    this.damage = damage;
    this.attackCooldown = 0;
    this.attackInterval = type === 'core' ? 1.0 : 0.88;
    this.radius = type === 'core' ? 24 : 18;
    this.stunTimer = 0;
    this.isDead = false;

    // Clash Royale Core Mechanic: Core King Tower starts sleeping/inactive!
    this.isActive = (type !== 'core');
    this.turretAngle = type === 'core' ? (team === 'player' ? -Math.PI / 2 : Math.PI / 2) : (team === 'player' ? -Math.PI / 2 : Math.PI / 2);
  }

  activate(game) {
    if (this.isActive || this.isDead) return;
    this.isActive = true;
    if (window.soundEngine) window.soundEngine.playAlert();
    game.floatingTexts.push(new FloatingText(this.x, this.y - 28, 'REATOR ATIVADO!', '#ffcc00'));
    game.createShockwave(this.x, this.y, 45, this.team === 'player' ? '#00f0ff' : '#ff0055');
  }

  update(dt, game) {
    if (this.isDead) return;

    // Check if King should activate because a princess tower died
    if (this.type === 'core' && !this.isActive) {
      const towers = this.team === 'player' ? game.playerTowers : game.enemyTowers;
      if (towers[0].isDead || towers[2].isDead) {
        this.activate(game);
      }
    }

    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      return;
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    // Only active towers attack!
    if (!this.isActive) return;

    if (this.attackCooldown <= 0) {
      const target = game.findNearestTarget(this.x, this.y, this.range, this.team === 'player' ? 'enemy' : 'player', true, true);
      if (target) {
        this.turretAngle = Math.atan2(target.y - this.y, target.x - this.x);
        this.shoot(target, game);
        this.attackCooldown = this.attackInterval;
      }
    }
  }

  shoot(target, game) {
    game.projectiles.push(new Projectile(
      this.x, this.y - 8, target, this.damage, 360, this.team, false, 0
    ));
    if (window.soundEngine) window.soundEngine.playLaser();
  }

  takeDamage(amt, game, isSpell = false) {
    if (this.isDead) return;

    // Waking up King Tower on direct damage!
    if (this.type === 'core' && !this.isActive) {
      this.activate(game);
    }

    this.hp -= amt;
    game.floatingTexts.push(new FloatingText(this.x, this.y - 20, `-${Math.round(amt)}`, '#ff3b30'));

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      game.onTowerDestroyed(this);
    }
  }
}

class Unit {
  constructor(card, team, x, y) {
    this.card = card;
    this.team = team;
    this.x = x;
    this.y = y;
    this.maxHp = card.hp;
    this.hp = card.hp;
    this.speed = card.speed;
    this.damage = card.damage;
    this.attackInterval = card.attackSpeed;
    this.attackCooldown = 0.25;
    this.range = card.range;
    this.radius = card.isBuildingTargeter ? 16 : (card.isFlying ? 11 : 12);
    this.isFlying = card.isFlying;
    this.isBuildingTargeter = card.isBuildingTargeter;
    this.targetsAir = card.targetsAir || false;
    this.splashRadius = card.splashRadius || 0;
    this.isSpinAttack = card.isSpinAttack || false;
    this.hasCharged = false;
    this.chargeDamageMultiplier = card.chargeDamageMultiplier || 1.0;
    this.stunTimer = 0;
    this.isDead = false;
    this.attackAnim = 0;
    this.facingAngle = team === 'player' ? -Math.PI / 2 : Math.PI / 2;

    this.preferredLane = x < V_WIDTH / 2 ? 'left' : 'right';
  }

  update(dt, game) {
    if (this.isDead) return;
    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      return;
    }
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }
    if (this.attackAnim > 0) {
      this.attackAnim -= dt;
    }

    const opponent = this.team === 'player' ? 'enemy' : 'player';

    // 1. Check for targets in range
    let target = null;
    if (this.isBuildingTargeter) {
      target = game.findNearestBuilding(this.x, this.y, this.range, opponent);
    } else {
      target = game.findNearestTarget(this.x, this.y, this.range, opponent, true, this.targetsAir);
    }

    if (target) {
      this.facingAngle = Math.atan2(target.y - this.y, target.x - this.x);
      if (this.attackCooldown <= 0) {
        this.performAttack(target, game);
        this.attackCooldown = this.attackInterval;
        this.attackAnim = 0.22;
      }
      return;
    }

    // 2. Move towards nearest threat in sight or lane objective
    let moveTarget = null;
    if (this.isBuildingTargeter) {
      // Building-targeters check for defensive buildings (Tesla/Spawners) in distraction range (~140)
      const distraction = game.findNearestBuilding(this.x, this.y, 140, opponent);
      if (distraction) {
        moveTarget = distraction;
      }
    } else {
      // Normal units aggro onto nearby enemies in sight range (~100)
      const aggro = game.findNearestTarget(this.x, this.y, 100, opponent, true, this.targetsAir);
      if (aggro) {
        moveTarget = aggro;
      }
    }

    if (!moveTarget) {
      moveTarget = game.getLaneObjective(this.team, this.preferredLane);
    }

    if (moveTarget) {
      this.moveTowards(moveTarget.x, moveTarget.y, dt, game);
    }
  }

  moveTowards(destX, destY, dt, game) {
    let nextX = destX;
    let nextY = destY;

    // Ground units bridge crossing routing
    if (!this.isFlying) {
      const isPlayer = this.team === 'player';
      const bridgeX = this.preferredLane === 'left' ? 90 : 310;

      if (isPlayer) {
        // Player units move from bottom (y ~ 500) to top (y ~ 100)
        if (this.y > 345 && destY < 295) {
          nextX = bridgeX;
          nextY = 320;
        } else if (this.y >= 295 && this.y <= 345 && Math.abs(this.x - bridgeX) > 24) {
          nextX = bridgeX;
          nextY = 320;
        }
      } else {
        // Enemy units move from top (y ~ 100) to bottom (y ~ 500)
        if (this.y < 295 && destY > 345) {
          nextX = bridgeX;
          nextY = 320;
        } else if (this.y >= 295 && this.y <= 345 && Math.abs(this.x - bridgeX) > 24) {
          nextX = bridgeX;
          nextY = 320;
        }
      }
    }

    const dx = nextX - this.x;
    const dy = nextY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 2) {
      this.facingAngle = Math.atan2(dy, dx);
      const moveDist = this.speed * 60 * dt;
      this.x += (dx / dist) * Math.min(moveDist, dist);
      this.y += (dy / dist) * Math.min(moveDist, dist);
    }
  }

  performAttack(target, game) {
    let dmg = this.damage;
    if (this.chargeDamageMultiplier > 1 && !this.hasCharged) {
      dmg *= this.chargeDamageMultiplier;
      this.hasCharged = true;
      game.floatingTexts.push(new FloatingText(this.x, this.y - 16, 'CRÍTICO!', '#00f0ff'));
      if (window.soundEngine) window.soundEngine.playDash();
    }

    if (this.isSpinAttack) {
      // 360 Spin attack (Nanovortex / Valkyrie)
      game.applySplashDamage(this.x, this.y, this.splashRadius, dmg, this.team === 'player' ? 'enemy' : 'player', false);
      game.createShockwave(this.x, this.y, this.splashRadius, '#ec4899');
      if (window.soundEngine) window.soundEngine.playSpin();
    } else if (this.range > 50) {
      // Ranged projectile
      const speed = this.card.id === 'sniper' ? 560 : 330;
      game.projectiles.push(new Projectile(
        this.x, this.y, target, dmg, speed, this.team, this.splashRadius > 0, this.splashRadius
      ));
      if (window.soundEngine) {
        if (this.card.id === 'plasma') window.soundEngine.playPlasma();
        else window.soundEngine.playLaser();
      }
    } else {
      // Melee attack
      target.takeDamage(dmg, game);
      if (window.soundEngine) window.soundEngine.playSlash();
      game.createHitParticles(target.x, target.y, this.team === 'player' ? '#00f0ff' : '#ff0055');
    }
  }

  takeDamage(amt, game) {
    if (this.isDead) return;
    this.hp -= amt;
    game.floatingTexts.push(new FloatingText(this.x, this.y - 12, `-${Math.round(amt)}`, '#ff3b30'));

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      game.createDeathParticles(this.x, this.y, this.team === 'player' ? '#00f0ff' : '#ff0055');
      if (window.soundEngine) window.soundEngine.playExplosion(0.5);
    }
  }
}

class Building {
  constructor(card, team, x, y) {
    this.card = card;
    this.team = team;
    this.x = x;
    this.y = y;
    this.maxHp = card.hp;
    this.hp = card.hp;
    this.range = card.range || 0;
    this.damage = card.damage || 0;
    this.attackInterval = card.attackSpeed || 1.0;
    this.attackCooldown = 0;
    this.lifetime = card.lifetime || 30;
    this.radius = 16;
    this.stunTimer = 0;
    this.isDead = false;

    // Spawner functionality
    this.isSpawner = (card.type === 'spawner');
    this.spawnTimer = 1.0;
    this.spawnInterval = card.spawnInterval || 4.5;
  }

  update(dt, game) {
    if (this.isDead) return;

    this.lifetime -= dt;
    this.hp -= (this.maxHp / (this.card.lifetime || 30)) * dt;

    if (this.hp <= 0 || this.lifetime <= 0) {
      this.hp = 0;
      this.isDead = true;
      game.createDeathParticles(this.x, this.y, '#22d3ee');
      return;
    }

    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      return;
    }

    // Spawner logic
    if (this.isSpawner) {
      this.spawnTimer += dt;
      if (this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        this.spawnUnits(game);
      }
      return;
    }

    // Defensive Tower attack logic (Tesla)
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    if (this.attackCooldown <= 0 && this.range > 0) {
      const opponent = this.team === 'player' ? 'enemy' : 'player';
      const target = game.findNearestTarget(this.x, this.y, this.range, opponent, true, true);
      if (target) {
        target.takeDamage(this.damage, game);
        game.createHitParticles(target.x, target.y, '#22d3ee');
        if (window.soundEngine) window.soundEngine.playLaser();
        this.attackCooldown = this.attackInterval;
      }
    }
  }

  spawnUnits(game) {
    const droneCard = CARDS_DATABASE.find(c => c.id === 'drones');
    if (!droneCard) return;

    // Spawn 2 micro-drones
    for (let i = 0; i < 2; i++) {
      const ox = (i === 0 ? -12 : 12);
      const oy = this.team === 'player' ? -14 : 14;
      game.units.push(new Unit(droneCard, this.team, this.x + ox, this.y + oy));
    }
    game.floatingTexts.push(new FloatingText(this.x, this.y - 18, '+DRONES', '#10b981'));
    if (window.soundEngine) window.soundEngine.playDeploy();
  }

  takeDamage(amt, game) {
    if (this.isDead) return;
    this.hp -= amt;
    game.floatingTexts.push(new FloatingText(this.x, this.y - 15, `-${Math.round(amt)}`, '#ff3b30'));
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      game.createDeathParticles(this.x, this.y, '#22d3ee');
    }
  }
}

class Projectile {
  constructor(x, y, target, damage, speed, team, isSplash, splashRadius) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.damage = damage;
    this.speed = speed;
    this.team = team;
    this.isSplash = isSplash;
    this.splashRadius = splashRadius;
    this.targetLastX = target.x;
    this.targetLastY = target.y;
    this.isDead = false;
  }

  update(dt, game) {
    if (this.isDead) return;
    if (this.target && !this.target.isDead) {
      this.targetLastX = this.target.x;
      this.targetLastY = this.target.y;
    }

    const dx = this.targetLastX - this.x;
    const dy = this.targetLastY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 12) {
      this.hit(game);
      return;
    }

    const move = this.speed * dt;
    this.x += (dx / dist) * Math.min(move, dist);
    this.y += (dy / dist) * Math.min(move, dist);
  }

  hit(game) {
    this.isDead = true;
    const opponent = this.team === 'player' ? 'enemy' : 'player';

    if (this.isSplash) {
      game.applySplashDamage(this.x, this.y, this.splashRadius, this.damage, opponent, true);
      game.createShockwave(this.x, this.y, this.splashRadius, '#fb923c');
      if (window.soundEngine) window.soundEngine.playExplosion(0.65);
    } else {
      if (this.target && !this.target.isDead) {
        this.target.takeDamage(this.damage, game);
        game.createHitParticles(this.target.x, this.target.y, this.team === 'player' ? '#00f0ff' : '#ff0055');
      }
    }
  }
}

class Particle {
  constructor(x, y, vx, vy, color, size, life) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
  }

  update(dt) {
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.life -= dt;
  }
}

class Shockwave {
  constructor(x, y, maxRadius, color) {
    this.x = x;
    this.y = y;
    this.radius = 4;
    this.maxRadius = maxRadius;
    this.color = color;
    this.life = 0.32;
    this.maxLife = 0.32;
  }

  update(dt) {
    this.life -= dt;
    this.radius += (this.maxRadius - this.radius) * 12 * dt;
  }
}

class FloatingText {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.life = 0.75;
  }

  update(dt) {
    this.y -= 25 * dt;
    this.life -= dt;
  }
}

class EmoteBubble {
  constructor(x, y, icon, text, isPlayer) {
    this.x = x;
    this.y = y;
    this.icon = icon;
    this.text = text;
    this.isPlayer = isPlayer;
    this.life = 2.8;
  }

  update(dt) {
    this.life -= dt;
  }
}

// --- MAIN GAME MANAGER ---

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // State
    this.state = 'MENU'; // 'MENU' | 'PLAYING' | 'GAMEOVER'
    this.difficulty = 'normal'; // 'easy' | 'normal' | 'hard'
    this.matchTime = 180; // 3:00 min
    this.isOvertime = false;
    this.isSuddenDeath = false;
    this.deployedUnitsCount = 0;

    // Energy / Elixir
    this.playerEnergy = 5;
    this.enemyEnergy = 5;
    this.maxEnergy = 10;
    this.energyRate = 1 / 2.8; // Standard ~1 elixir every 2.8s

    // Decks
    this.activeDeckIds = this.loadDeckPreference();
    this.playerDeck = [];
    this.enemyDeck = [];
    this.playerHand = [];
    this.deckQueue = [];
    this.playerNextCard = null;
    this.selectedCardIndex = null;

    // Entities
    this.playerTowers = [];
    this.enemyTowers = [];
    this.units = [];
    this.buildings = [];
    this.projectiles = [];
    this.particles = [];
    this.shockwaves = [];
    this.floatingTexts = [];
    this.emoteBubbles = [];

    // AI
    this.aiTimer = 0;

    // Visuals & Scale
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.cameraShakeTimer = 0;
    this.cameraShakeMagnitude = 0;

    // Drag-and-drop state
    this.isDragging = false;
    this.draggedCardIndex = null;
    this.dragVirtualX = 0;
    this.dragVirtualY = 0;

    // Background Matrix stream particles
    this.riverStreams = [];
    for (let i = 0; i < 30; i++) {
      this.riverStreams.push({
        x: Math.random() * V_WIDTH,
        y: 308 + Math.random() * 24,
        speed: (Math.random() * 1.5 + 0.8) * (Math.random() < 0.5 ? 1 : -1),
        char: Math.random() < 0.5 ? '0' : '1',
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    this.initUI();
    this.setupResize();
    this.renderHangarGrids();
    this.updateAverageElixirUI();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  loadDeckPreference() {
    try {
      const saved = localStorage.getItem('cyber_royale_deck');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 8) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return [...DEFAULT_DECK_IDS];
  }

  saveDeckPreference() {
    try {
      localStorage.setItem('cyber_royale_deck', JSON.stringify(this.activeDeckIds));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  setupResize() {
    const resize = () => {
      const container = document.getElementById('canvas-container');
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.resetTransform();
      this.ctx.scale(dpr, dpr);

      this.scale = Math.min(rect.width / V_WIDTH, rect.height / V_HEIGHT);
      this.offsetX = (rect.width - V_WIDTH * this.scale) / 2;
      this.offsetY = (rect.height - V_HEIGHT * this.scale) / 2;
    };

    window.addEventListener('resize', resize);
    resize();
  }

  initUI() {
    // Sound Button
    const soundBtn = document.getElementById('sound-btn');
    soundBtn.addEventListener('click', () => {
      const enabled = window.soundEngine.toggle();
      soundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    // Emotes Toggle & Emote Click
    const emoteToggleBtn = document.getElementById('btn-emote-toggle');
    const emotesWheel = document.getElementById('emotes-wheel');
    emoteToggleBtn.addEventListener('click', () => {
      emotesWheel.classList.toggle('hidden');
    });

    document.querySelectorAll('.emote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const emote = btn.getAttribute('data-emote');
        const msg = btn.getAttribute('data-msg');
        this.triggerEmote('player', emote, msg);
        emotesWheel.classList.add('hidden');
      });
    });

    // Menu Navigation Tabs
    const tabs = ['battle', 'deck', 'rules'];
    tabs.forEach(tab => {
      const tabBtn = document.getElementById(`tab-btn-${tab}`);
      const panel = document.getElementById(`tab-panel-${tab}`);
      tabBtn.addEventListener('click', () => {
        tabs.forEach(t => {
          document.getElementById(`tab-btn-${t}`).classList.remove('active');
          document.getElementById(`tab-panel-${t}`).classList.remove('active');
        });
        tabBtn.classList.add('active');
        panel.classList.add('active');
      });
    });

    // Difficulty Buttons
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.difficulty = btn.getAttribute('data-diff');
      });
    });

    // Start & Restart Buttons
    document.getElementById('btn-start-game').addEventListener('click', () => {
      window.soundEngine.init();
      this.startMatch();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
      this.startMatch();
    });

    document.getElementById('btn-menu-back').addEventListener('click', () => {
      document.getElementById('screen-gameover').classList.add('hidden');
      document.getElementById('screen-menu').classList.remove('hidden');
      this.state = 'MENU';
      if (window.soundEngine) window.soundEngine.stopBattleMusic();
    });

    // Modal Close
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      document.getElementById('card-modal').classList.add('hidden');
    });
    document.getElementById('btn-close-swap-modal').addEventListener('click', () => {
      document.getElementById('swap-modal').classList.add('hidden');
    });

    // Setup Canvas Drag and Tap Deployments
    this.setupDeploymentInputs();
  }

  setupDeploymentInputs() {
    const toVirtualCoords = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (clientX - rect.left - this.offsetX) / this.scale;
      const y = (clientY - rect.top - this.offsetY) / this.scale;
      return { x, y };
    };

    // Canvas Tap to deploy selected card
    const handleCanvasTap = (clientX, clientY) => {
      if (this.state !== 'PLAYING') return;
      if (this.selectedCardIndex === null) return;

      const { x, y } = toVirtualCoords(clientX, clientY);
      this.tryDeploySelectedCard(x, y);
    };

    this.canvas.addEventListener('click', (e) => {
      if (!this.isDragging) {
        handleCanvasTap(e.clientX, e.clientY);
      }
    });

    // Drag-and-drop movement tracking
    const handleMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const { x, y } = toVirtualCoords(clientX, clientY);
      this.dragVirtualX = x;
      this.dragVirtualY = y;
    };

    const handleRelease = (clientX, clientY) => {
      if (!this.isDragging) return;
      const { x, y } = toVirtualCoords(clientX, clientY);
      this.isDragging = false;

      // Check if dropped within the canvas arena
      const rect = this.canvas.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        this.selectedCardIndex = this.draggedCardIndex;
        this.tryDeploySelectedCard(x, y);
      } else {
        this.selectedCardIndex = null;
        document.getElementById('deploy-guide').classList.add('hidden');
        this.updateCardHandUI();
      }
      this.draggedCardIndex = null;
    };

    window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', (e) => handleRelease(e.clientX, e.clientY));

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging) {
        e.preventDefault();
        const t = e.touches[0];
        handleMove(t.clientX, t.clientY);
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (this.isDragging) {
        const t = e.changedTouches[0];
        handleRelease(t.clientX, t.clientY);
      }
    });
  }

  triggerEmote(team, icon, msg) {
    if (this.state !== 'PLAYING') return;
    const isPlayer = team === 'player';
    const core = isPlayer ? this.playerTowers[1] : this.enemyTowers[1];
    if (core && !core.isDead) {
      this.emoteBubbles.push(new EmoteBubble(core.x, core.y - 36, icon, msg, isPlayer));
      if (window.soundEngine) window.soundEngine.playEmote();
    }
  }

  // --- HANGAR & DECK CUSTOMIZATION ---

  renderHangarGrids() {
    const activeGrid = document.getElementById('active-deck-grid');
    const reserveGrid = document.getElementById('reserve-deck-grid');
    activeGrid.innerHTML = '';
    reserveGrid.innerHTML = '';

    CARDS_DATABASE.forEach(card => {
      const inDeck = this.activeDeckIds.includes(card.id);
      const cardEl = document.createElement('div');
      cardEl.className = `deck-slot-card ${inDeck ? 'in-deck' : ''}`;
      cardEl.innerHTML = `
        <div class="deck-slot-cost">${card.cost}</div>
        <div class="deck-slot-icon">${card.icon}</div>
        <div class="deck-slot-name">${card.name}</div>
      `;

      cardEl.addEventListener('click', () => {
        this.openCardInspector(card);
      });

      if (inDeck) {
        activeGrid.appendChild(cardEl);
      } else {
        reserveGrid.appendChild(cardEl);
      }
    });

    this.renderMiniDeckPreview();
  }

  renderMiniDeckPreview() {
    const container = document.getElementById('deck-mini-icons');
    container.innerHTML = '';

    this.activeDeckIds.forEach(id => {
      const card = CARDS_DATABASE.find(c => c.id === id);
      if (!card) return;

      const mini = document.createElement('div');
      mini.className = 'mini-icon-box';
      mini.innerHTML = `
        <span class="mini-icon-cost">${card.cost}</span>
        <span>${card.icon}</span>
      `;
      mini.addEventListener('click', () => this.openCardInspector(card));
      container.appendChild(mini);
    });
  }

  updateAverageElixirUI() {
    let sum = 0;
    this.activeDeckIds.forEach(id => {
      const card = CARDS_DATABASE.find(c => c.id === id);
      if (card) sum += card.cost;
    });
    const avg = (sum / 8).toFixed(1);
    document.getElementById('avg-elixir-badge').textContent = `CUSTO MÉDIO: ${avg} ⚡`;
  }

  openCardInspector(card) {
    const modal = document.getElementById('card-modal');
    document.getElementById('modal-card-icon').textContent = card.icon;
    document.getElementById('modal-card-name').textContent = card.name;
    document.getElementById('modal-card-role').textContent = card.role;
    document.getElementById('modal-card-cost').textContent = `${card.cost} ⚡`;
    document.getElementById('modal-card-desc').textContent = card.desc;

    // Stats
    document.getElementById('modal-stat-hp').textContent = card.hp ? (card.count > 1 ? `${card.hp} (x${card.count})` : card.hp) : '-';
    document.getElementById('modal-stat-dmg').textContent = card.damage ? (card.splashRadius ? `${card.damage} (Área)` : card.damage) : '-';
    document.getElementById('modal-stat-speed').textContent = card.attackSpeed ? `${card.attackSpeed}s` : '-';
    document.getElementById('modal-stat-range').textContent = card.range > 50 ? `${card.range}m (Distância)` : (card.type === 'spell' ? 'Global' : 'Corpo a Corpo');
    document.getElementById('modal-stat-targets').textContent = card.isBuildingTargeter ? 'Construções' : (card.targetsAir ? 'Solo e Ar' : 'Apenas Solo');
    document.getElementById('modal-stat-movespeed').textContent = card.speed ? (card.speed > 2.0 ? 'Muito Rápido' : (card.speed > 1.5 ? 'Rápido' : (card.speed < 1.0 ? 'Lento' : 'Médio'))) : '-';

    const equipBtn = document.getElementById('btn-equip-card');
    const inDeck = this.activeDeckIds.includes(card.id);

    if (inDeck) {
      equipBtn.firstElementChild.textContent = 'JÁ EQUIPADO NO DECK';
      equipBtn.classList.remove('primary');
      equipBtn.classList.add('secondary');
      equipBtn.disabled = true;
    } else {
      equipBtn.firstElementChild.textContent = 'EQUIPAR NO DECK';
      equipBtn.classList.add('primary');
      equipBtn.classList.remove('secondary');
      equipBtn.disabled = false;
      equipBtn.onclick = () => {
        modal.classList.add('hidden');
        this.openSwapPicker(card);
      };
    }

    modal.classList.remove('hidden');
  }

  openSwapPicker(newCard) {
    const swapModal = document.getElementById('swap-modal');
    const swapGrid = document.getElementById('swap-deck-grid');
    swapGrid.innerHTML = '';

    this.activeDeckIds.forEach((id, idx) => {
      const oldCard = CARDS_DATABASE.find(c => c.id === id);
      if (!oldCard) return;

      const cardEl = document.createElement('div');
      cardEl.className = 'deck-slot-card in-deck';
      cardEl.innerHTML = `
        <div class="deck-slot-cost">${oldCard.cost}</div>
        <div class="deck-slot-icon">${oldCard.icon}</div>
        <div class="deck-slot-name">${oldCard.name}</div>
      `;

      cardEl.addEventListener('click', () => {
        this.activeDeckIds[idx] = newCard.id;
        this.saveDeckPreference();
        swapModal.classList.add('hidden');
        this.renderHangarGrids();
        this.updateAverageElixirUI();
      });

      swapGrid.appendChild(cardEl);
    });

    swapModal.classList.remove('hidden');
  }

  // --- MATCH INITIALIZATION ---

  startMatch() {
    document.getElementById('screen-menu').classList.add('hidden');
    document.getElementById('screen-gameover').classList.add('hidden');
    document.getElementById('battle-alert-banner').classList.add('hidden');
    document.getElementById('emotes-wheel').classList.add('hidden');

    this.state = 'PLAYING';
    this.matchTime = 180;
    this.isOvertime = false;
    this.isSuddenDeath = false;
    this.deployedUnitsCount = 0;
    document.getElementById('overtime-badge').classList.add('hidden');

    this.playerEnergy = 5;
    this.enemyEnergy = 5;

    // Reset Entities
    this.units = [];
    this.buildings = [];
    this.projectiles = [];
    this.particles = [];
    this.shockwaves = [];
    this.floatingTexts = [];
    this.emoteBubbles = [];

    // Initialize Towers (Clash Royale King + 2 Princess layout)
    // Enemy (Top)
    this.enemyTowers = [
      new Tower('enemy', 'node_left', 90, 130, 1400, 120, 56),
      new Tower('enemy', 'core', 200, 60, 2400, 135, 75),
      new Tower('enemy', 'node_right', 310, 130, 1400, 120, 56)
    ];

    // Player (Bottom)
    this.playerTowers = [
      new Tower('player', 'node_left', 90, 510, 1400, 120, 56),
      new Tower('player', 'core', 200, 580, 2400, 135, 75),
      new Tower('player', 'node_right', 310, 510, 1400, 120, 56)
    ];

    // Build Player Deck from selected active deck
    this.playerDeck = this.shuffle(
      this.activeDeckIds.map(id => CARDS_DATABASE.find(c => c.id === id)).filter(Boolean)
    );
    this.playerHand = this.playerDeck.slice(0, 4);
    this.deckQueue = this.playerDeck.slice(4);
    this.playerNextCard = this.deckQueue.shift();
    this.selectedCardIndex = null;

    // Build Enemy AI Deck (Varied cyber deck based on difficulty)
    const enemyCardPool = [...CARDS_DATABASE];
    this.enemyDeck = this.shuffle(enemyCardPool).slice(0, 8);

    this.updateCardHandUI();
    this.updateHUD();

    if (window.soundEngine) {
      window.soundEngine.startBattleMusic();
      window.soundEngine.playDeploy();
    }
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // --- CARD HAND & DRAG HANDLING ---

  updateCardHandUI() {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    this.playerHand.forEach((card, index) => {
      const cardEl = document.createElement('div');
      const canAfford = this.playerEnergy >= card.cost;
      const isSelected = this.selectedCardIndex === index;

      cardEl.className = `card-item ${isSelected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}`;
      cardEl.innerHTML = `
        <div class="card-cost">${card.cost}</div>
        <div class="card-icon">${card.icon}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-role">${card.role}</div>
      `;

      // Tap Selection
      cardEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!canAfford) return;
        if (this.selectedCardIndex === index) {
          this.selectedCardIndex = null;
          document.getElementById('deploy-guide').classList.add('hidden');
        } else {
          this.selectedCardIndex = index;
          document.getElementById('deploy-guide').classList.remove('hidden');
          if (window.soundEngine) window.soundEngine.playDeploy();
        }
        this.updateCardHandUI();
      });

      // Drag Initiation (Pointer / Touch)
      const startDrag = (clientX, clientY) => {
        if (!canAfford) return;
        this.isDragging = true;
        this.draggedCardIndex = index;
        this.selectedCardIndex = index;

        const rect = this.canvas.getBoundingClientRect();
        this.dragVirtualX = (clientX - rect.left - this.offsetX) / this.scale;
        this.dragVirtualY = (clientY - rect.top - this.offsetY) / this.scale;

        document.getElementById('deploy-guide').classList.remove('hidden');
      };

      cardEl.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
      cardEl.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
      }, { passive: true });

      container.appendChild(cardEl);
    });

    // Next Card Preview
    const nextPreview = document.getElementById('next-card-preview');
    if (this.playerNextCard) {
      nextPreview.innerHTML = `
        <span>${this.playerNextCard.icon}</span>
        <span class="mini-cost">${this.playerNextCard.cost}</span>
      `;
    }
  }

  // --- CARD DEPLOYMENT LOGIC ---

  tryDeploySelectedCard(x, y) {
    if (this.selectedCardIndex === null) return;
    const card = this.playerHand[this.selectedCardIndex];
    if (!card || this.playerEnergy < card.cost) return;

    const isValid = this.isLocationValidForDeploy('player', card, x, y);
    if (!isValid) {
      this.floatingTexts.push(new FloatingText(x, y, 'ZONA INVÁLIDA!', '#ff0055'));
      return;
    }

    this.playerEnergy -= card.cost;
    this.deployCard(card, 'player', x, y);
    this.deployedUnitsCount++;

    // Cycle Card
    this.cyclePlayerCard(this.selectedCardIndex);
    this.selectedCardIndex = null;
    document.getElementById('deploy-guide').classList.add('hidden');
    this.updateCardHandUI();
  }

  isLocationValidForDeploy(team, card, x, y) {
    // Spells (EMP & Orbital Rocket) can be dropped anywhere on the battlefield!
    if (card.type === 'spell') return true;

    // Field boundary margins
    if (x < 25 || x > V_WIDTH - 25 || y < 25 || y > V_HEIGHT - 25) return false;

    if (team === 'player') {
      // Default player zone: below the river (y >= 330)
      if (y >= 330) return true;

      // Extended territorial pocket deployment if enemy lane tower destroyed!
      if (this.enemyTowers[0].isDead && x < V_WIDTH / 2 && y >= 190) return true;
      if (this.enemyTowers[2].isDead && x >= V_WIDTH / 2 && y >= 190) return true;

      return false;
    } else {
      // Enemy AI zone: above the river (y <= 310)
      if (y <= 310) return true;
      if (this.playerTowers[0].isDead && x < V_WIDTH / 2 && y <= 450) return true;
      if (this.playerTowers[2].isDead && x >= V_WIDTH / 2 && y <= 450) return true;
      return false;
    }
  }

  deployCard(card, team, x, y) {
    if (card.id === 'emp') {
      this.applyEMPSpell(x, y, card, team);
      return;
    }

    if (card.id === 'rocket') {
      this.applyRocketSpell(x, y, card, team);
      return;
    }

    if (card.type === 'building' || card.type === 'spawner') {
      this.buildings.push(new Building(card, team, x, y));
      if (window.soundEngine) window.soundEngine.playDeploy();
      return;
    }

    // Units deployment with swarm offsets
    const count = card.count || 1;
    const offsets = count === 1 ? [[0, 0]] :
      count === 3 ? [[0, -10], [-14, 10], [14, 10]] :
      [[-12, -12], [12, -12], [-12, 12], [12, 12]];

    for (let i = 0; i < count; i++) {
      const ox = offsets[i][0];
      const oy = offsets[i][1];
      this.units.push(new Unit(card, team, x + ox, y + oy));
    }

    if (window.soundEngine) window.soundEngine.playDeploy();
  }

  cyclePlayerCard(index) {
    this.deckQueue.push(this.playerHand[index]);
    this.playerHand[index] = this.playerNextCard;
    this.playerNextCard = this.deckQueue.shift();
  }

  applyEMPSpell(x, y, card, team) {
    if (window.soundEngine) window.soundEngine.playEMP();
    this.createShockwave(x, y, card.radius, '#60a5fa');
    this.triggerScreenShake(0.2, 5);

    const opponent = team === 'player' ? 'enemy' : 'player';

    // Stun & damage units
    this.units.forEach(u => {
      if (u.team === opponent && !u.isDead) {
        if (Math.hypot(u.x - x, u.y - y) <= card.radius) {
          u.takeDamage(card.damage, this);
          u.stunTimer = card.stunDuration;
          this.floatingTexts.push(new FloatingText(u.x, u.y - 18, 'PARALISADO!', '#60a5fa'));
        }
      }
    });

    // Stun & damage buildings / towers
    const towers = opponent === 'player' ? this.playerTowers : this.enemyTowers;
    towers.forEach(t => {
      if (!t.isDead && Math.hypot(t.x - x, t.y - y) <= card.radius + t.radius) {
        t.takeDamage(card.towerDamage, this, true);
        t.stunTimer = card.stunDuration;
        this.floatingTexts.push(new FloatingText(t.x, t.y - 24, 'EMP!', '#60a5fa'));
      }
    });

    this.buildings.forEach(b => {
      if (b.team === opponent && !b.isDead && Math.hypot(b.x - x, b.y - y) <= card.radius + b.radius) {
        b.takeDamage(card.damage, this);
        b.stunTimer = card.stunDuration;
      }
    });
  }

  applyRocketSpell(x, y, card, team) {
    if (window.soundEngine) window.soundEngine.playRocket();

    // Rocket incoming warning reticle
    this.createShockwave(x, y, card.radius, '#f97316');

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.playExplosion(2.2);
      this.createDeathParticles(x, y, '#f97316');
      this.createShockwave(x, y, card.radius * 1.3, '#ffaa00');
      this.triggerScreenShake(0.4, 10);

      const opponent = team === 'player' ? 'enemy' : 'player';

      this.units.forEach(u => {
        if (u.team === opponent && !u.isDead) {
          if (Math.hypot(u.x - x, u.y - y) <= card.radius) {
            u.takeDamage(card.damage, this);
          }
        }
      });

      const towers = opponent === 'player' ? this.playerTowers : this.enemyTowers;
      towers.forEach(t => {
        if (!t.isDead && Math.hypot(t.x - x, t.y - y) <= card.radius + t.radius) {
          t.takeDamage(card.towerDamage, this, true);
        }
      });

      this.buildings.forEach(b => {
        if (b.team === opponent && !b.isDead && Math.hypot(b.x - x, b.y - y) <= card.radius + b.radius) {
          b.takeDamage(card.damage, this);
        }
      });
    }, 450);
  }

  applySplashDamage(x, y, radius, damage, opponent, hitAir = true) {
    this.units.forEach(u => {
      if (u.team === opponent && !u.isDead) {
        if (!hitAir && u.isFlying) return;
        if (Math.hypot(u.x - x, u.y - y) <= radius + u.radius) {
          u.takeDamage(damage, this);
        }
      }
    });

    const towers = opponent === 'player' ? this.playerTowers : this.enemyTowers;
    towers.forEach(t => {
      if (!t.isDead && Math.hypot(t.x - x, t.y - y) <= radius + t.radius) {
        t.takeDamage(damage, this);
      }
    });

    this.buildings.forEach(b => {
      if (b.team === opponent && !b.isDead && Math.hypot(b.x - x, b.y - y) <= radius + b.radius) {
        b.takeDamage(damage, this);
      }
    });
  }

  // --- PATHFINDING & TARGETING QUERIES ---

  findNearestTarget(x, y, range, targetTeam, includeUnits = true, canTargetAir = true) {
    let closest = null;
    let minDist = range;

    // Check active towers
    const towers = targetTeam === 'player' ? this.playerTowers : this.enemyTowers;
    towers.forEach(t => {
      if (!t.isDead) {
        const d = Math.hypot(t.x - x, t.y - y);
        if (d <= minDist) {
          minDist = d;
          closest = t;
        }
      }
    });

    // Check buildings
    this.buildings.forEach(b => {
      if (b.team === targetTeam && !b.isDead) {
        const d = Math.hypot(b.x - x, b.y - y);
        if (d <= minDist) {
          minDist = d;
          closest = b;
        }
      }
    });

    // Check units
    if (includeUnits) {
      this.units.forEach(u => {
        if (u.team === targetTeam && !u.isDead) {
          if (u.isFlying && !canTargetAir) return;
          const d = Math.hypot(u.x - x, u.y - y);
          if (d <= minDist) {
            minDist = d;
            closest = u;
          }
        }
      });
    }

    return closest;
  }

  findNearestBuilding(x, y, range, targetTeam) {
    let closest = null;
    let minDist = range;

    const towers = targetTeam === 'player' ? this.playerTowers : this.enemyTowers;
    towers.forEach(t => {
      if (!t.isDead) {
        const d = Math.hypot(t.x - x, t.y - y);
        if (d <= minDist) {
          minDist = d;
          closest = t;
        }
      }
    });

    this.buildings.forEach(b => {
      if (b.team === targetTeam && !b.isDead) {
        const d = Math.hypot(b.x - x, b.y - y);
        if (d <= minDist) {
          minDist = d;
          closest = b;
        }
      }
    });

    return closest;
  }

  getLaneObjective(team, lane) {
    const towers = team === 'player' ? this.enemyTowers : this.playerTowers;
    const nodeIndex = lane === 'left' ? 0 : 2;

    if (!towers[nodeIndex].isDead) {
      return towers[nodeIndex];
    }
    if (!towers[1].isDead) {
      return towers[1];
    }
    const otherIndex = lane === 'left' ? 2 : 0;
    return towers[otherIndex];
  }

  // Soft Unit-to-Unit Separation Physics (Boids)
  applyUnitCollisions() {
    const len = this.units.length;
    for (let i = 0; i < len; i++) {
      const u1 = this.units[i];
      if (u1.isDead || u1.isFlying) continue;

      for (let j = i + 1; j < len; j++) {
        const u2 = this.units[j];
        if (u2.isDead || u2.isFlying) continue;

        const dx = u2.x - u1.x;
        const dy = u2.y - u1.y;
        const minDist = u1.radius + u2.radius;
        const distSq = dx * dx + dy * dy;

        if (distSq < minDist * minDist && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const overlap = (minDist - dist) * 0.5;
          const nx = dx / dist;
          const ny = dy / dist;

          u1.x -= nx * overlap * 0.35;
          u1.y -= ny * overlap * 0.35;
          u2.x += nx * overlap * 0.35;
          u2.y += ny * overlap * 0.35;
        }
      }
    }
  }

  // --- TOWER DESTRUCTION & VICTORY LOGIC ---

  onTowerDestroyed(tower) {
    if (window.soundEngine) window.soundEngine.playTowerDestroyed();
    this.createShockwave(tower.x, tower.y, 110, tower.team === 'player' ? '#00f0ff' : '#ff0055');
    this.triggerScreenShake(0.5, 12);

    this.updateCrownCount();

    // AI reacts with emote
    if (tower.team === 'player') {
      setTimeout(() => this.triggerEmote('enemy', '💥', 'Torre Conquistada!'), 300);
    } else {
      setTimeout(() => this.triggerEmote('enemy', '🤖', 'Reiniciando Defesas!'), 300);
    }

    // Clash Royale Sudden Death Victory Rule: In sudden death, FIRST tower to fall ends game!
    if (this.isSuddenDeath) {
      if (tower.team === 'enemy') {
        this.endMatch('VICTORY', 'Morte Súbita! Você derrubou a torre primeiro!');
      } else {
        this.endMatch('DEFEAT', 'Morte Súbita! O inimigo derrubou sua torre primeiro!');
      }
      return;
    }

    // Core King Tower destruction = Immediate 3-Crown Victory
    if (tower.type === 'core') {
      if (tower.team === 'enemy') {
        this.endMatch('VICTORY', 'O Reator Inimigo foi aniquilado! Vitória Perfeita (3 Coroas)!');
      } else {
        this.endMatch('DEFEAT', 'Seu Reator Central caiu! Derrota Total.');
      }
    }
  }

  updateCrownCount() {
    const enemyDeadCount = this.enemyTowers.filter(t => t.isDead).length;
    const playerDeadCount = this.playerTowers.filter(t => t.isDead).length;

    document.getElementById('player-crowns').textContent = enemyDeadCount;
    document.getElementById('enemy-crowns').textContent = playerDeadCount;
  }

  // --- ENEMY AI LOGIC ---

  updateAI(dt) {
    this.aiTimer += dt;
    const reactionDelay = this.difficulty === 'hard' ? 1.2 : (this.difficulty === 'easy' ? 3.2 : 2.0);

    if (this.aiTimer < reactionDelay) return;
    this.aiTimer = 0;

    // AI senses threatening player units approaching or on AI side
    const threateningUnits = this.units.filter(u => u.team === 'player' && !u.isDead && u.y < 380);

    if (threateningUnits.length > 0) {
      const threat = threateningUnits[0];

      // Smart counters
      if (threat.card.isBuildingTargeter && this.enemyEnergy >= 4 && this.hasAICard('tesla')) {
        // Place defensive Tesla in the middle to pull the tank!
        this.aiDeploy('tesla', 200, 230);
      } else if (threat.card.isBuildingTargeter && this.enemyEnergy >= 3 && this.hasAICard('drones')) {
        // Drop air swarm on tank
        this.aiDeploy('drones', threat.x, threat.y - 30);
      } else if (threat.card.count > 1 && this.enemyEnergy >= 4 && this.hasAICard('plasma')) {
        // Drop splash vs swarms
        this.aiDeploy('plasma', threat.x, 210);
      } else if (threat.card.count > 1 && this.enemyEnergy >= 4 && this.hasAICard('valkyrie')) {
        // Drop Nanovortex spinner right into the swarm
        this.aiDeploy('valkyrie', threat.x, threat.y);
      } else if (threateningUnits.length >= 3 && this.enemyEnergy >= 4 && this.hasAICard('emp')) {
        // Clustered push -> EMP Shock
        this.aiDeploy('emp', threat.x, threat.y);
      } else if (this.enemyEnergy >= 3) {
        const counterCard = this.hasAICard('ronin') ? 'ronin' : (this.hasAICard('ninjas') ? 'ninjas' : 'sniper');
        this.aiDeploy(counterCard, threat.x, 220);
      }
    } else if (this.enemyEnergy >= 8.5) {
      // Offensive Push Initiative (avoid elixir leaking!)
      const targetLane = Math.random() < 0.5 ? 'left' : 'right';
      const deployX = targetLane === 'left' ? 90 + (Math.random() * 30 - 15) : 310 + (Math.random() * 30 - 15);

      if (this.difficulty === 'hard' && this.hasAICard('mech')) {
        // Build push from behind king tower
        this.aiDeploy('mech', deployX, 90);
      } else {
        const offensivePicks = ['mech', 'ronin', 'speeder', 'sniper', 'drones', 'spawner'];
        const pick = offensivePicks.find(id => this.hasAICard(id)) || 'ronin';
        this.aiDeploy(pick, deployX, 130);
      }
    }
  }

  hasAICard(cardId) {
    return this.enemyDeck.some(c => c.id === cardId);
  }

  aiDeploy(cardId, x, y) {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card || this.enemyEnergy < card.cost) return;

    this.enemyEnergy -= card.cost;
    this.deployCard(card, 'enemy', x, y);
  }

  // --- VISUAL EFFECTS & SHAKE ---

  triggerScreenShake(duration, magnitude) {
    this.cameraShakeTimer = duration;
    this.cameraShakeMagnitude = magnitude;
  }

  createHitParticles(x, y, color) {
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.2 + 1;
      this.particles.push(new Particle(
        x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 3, 0.25
      ));
    }
  }

  createDeathParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      this.particles.push(new Particle(
        x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, Math.random() * 4 + 2, 0.45
      ));
    }
  }

  createShockwave(x, y, radius, color) {
    this.shockwaves.push(new Shockwave(x, y, radius, color));
  }

  // --- GAME LOOP & UPDATES ---

  gameLoop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    if (this.state === 'PLAYING') {
      this.update(dt);
    }

    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(dt) {
    // 1. Timer & Match Events
    this.matchTime -= dt;

    // 60s Overdrive 2X Energy Alert
    if (this.matchTime <= 60 && !this.isOvertime && !this.isSuddenDeath) {
      this.isOvertime = true;
      document.getElementById('overtime-badge').classList.remove('hidden');
      this.showTemporaryBanner('OVERDRIVE 2X: ENERGIA DUPLA!');
      if (window.soundEngine) {
        window.soundEngine.setOverdrive(true);
        window.soundEngine.playSiren();
      }
    }

    // Time's Up Handling
    if (this.matchTime <= 0) {
      this.matchTime = 0;
      this.resolveTimeEnd();
      return;
    }

    // 2. Energy Generation
    const multiplier = (this.isOvertime || this.isSuddenDeath) ? 2.0 : 1.0;
    this.playerEnergy = Math.min(this.maxEnergy, this.playerEnergy + this.energyRate * multiplier * dt);
    this.enemyEnergy = Math.min(this.maxEnergy, this.enemyEnergy + this.energyRate * multiplier * dt);

    this.updateHUD();

    // 3. AI Update
    this.updateAI(dt);

    // 4. Soft unit separation physics
    this.applyUnitCollisions();

    // 5. Update Entities
    this.playerTowers.forEach(t => t.update(dt, this));
    this.enemyTowers.forEach(t => t.update(dt, this));
    this.buildings.forEach(b => b.update(dt, this));
    this.units.forEach(u => u.update(dt, this));
    this.projectiles.forEach(p => p.update(dt, this));
    this.particles.forEach(p => p.update(dt));
    this.shockwaves.forEach(s => s.update(dt));
    this.floatingTexts.forEach(f => f.update(dt));
    this.emoteBubbles.forEach(e => e.update(dt));

    // Update screen shake
    if (this.cameraShakeTimer > 0) {
      this.cameraShakeTimer -= dt;
    }

    // Update river cyber streams
    this.riverStreams.forEach(s => {
      s.x += s.speed * dt * 30;
      if (s.x > V_WIDTH + 10) s.x = -10;
      if (s.x < -10) s.x = V_WIDTH + 10;
    });

    // Cleanup dead entities
    this.buildings = this.buildings.filter(b => !b.isDead);
    this.units = this.units.filter(u => !u.isDead);
    this.projectiles = this.projectiles.filter(p => !p.isDead);
    this.particles = this.particles.filter(p => p.life > 0);
    this.shockwaves = this.shockwaves.filter(s => s.life > 0);
    this.floatingTexts = this.floatingTexts.filter(f => f.life > 0);
    this.emoteBubbles = this.emoteBubbles.filter(e => e.life > 0);
  }

  showTemporaryBanner(text) {
    const banner = document.getElementById('battle-alert-banner');
    banner.textContent = text;
    banner.classList.remove('hidden');
    setTimeout(() => {
      banner.classList.add('hidden');
    }, 3500);
  }

  updateHUD() {
    // Timer text
    const mins = Math.floor(this.matchTime / 60);
    const secs = Math.floor(this.matchTime % 60);
    document.getElementById('match-timer').textContent =
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Energy Bar
    const energyFill = (this.playerEnergy / this.maxEnergy) * 100;
    document.getElementById('energy-bar-fill').style.width = `${energyFill}%`;
    document.getElementById('energy-count').textContent = Math.floor(this.playerEnergy);

    // Update disabled state on hand cards
    const cards = document.querySelectorAll('.card-item');
    cards.forEach((el, idx) => {
      const card = this.playerHand[idx];
      if (card) {
        if (this.playerEnergy < card.cost) {
          el.classList.add('disabled');
        } else {
          el.classList.remove('disabled');
        }
      }
    });
  }

  resolveTimeEnd() {
    const enemyCrownsLost = this.enemyTowers.filter(t => t.isDead).length;
    const playerCrownsLost = this.playerTowers.filter(t => t.isDead).length;

    if (enemyCrownsLost > playerCrownsLost) {
      this.endMatch('VICTORY', `Tempo Esgotado! Você destruiu ${enemyCrownsLost} contra ${playerCrownsLost}.`);
    } else if (playerCrownsLost > enemyCrownsLost) {
      this.endMatch('DEFEAT', `Tempo Esgotado! O inimigo destruiu ${playerCrownsLost} contra ${enemyCrownsLost}.`);
    } else {
      // Equal crowns: Enter Sudden Death if not already in sudden death!
      if (!this.isSuddenDeath) {
        this.isSuddenDeath = true;
        this.matchTime = 60; // 60s sudden death
        document.getElementById('overtime-badge').textContent = 'MORTE SÚBITA';
        document.getElementById('overtime-badge').classList.remove('hidden');
        this.showTemporaryBanner('MORTE SÚBITA: A PRÓXIMA TORRE VENCE!');
        if (window.soundEngine) {
          window.soundEngine.setOverdrive(true);
          window.soundEngine.playAlert();
        }
        return;
      }

      // Tiebreaker after sudden death: Lowest Tower HP
      const lowestEnemyHp = Math.min(...this.enemyTowers.map(t => t.isDead ? 99999 : t.hp));
      const lowestPlayerHp = Math.min(...this.playerTowers.map(t => t.isDead ? 99999 : t.hp));

      if (lowestPlayerHp > lowestEnemyHp) {
        this.endMatch('VICTORY', 'Desempate Técnico! Suas torres sofreram menos dano.');
      } else {
        this.endMatch('DEFEAT', 'Desempate Técnico! As torres inimigas resistiram mais.');
      }
    }
  }

  endMatch(outcome, reason) {
    this.state = 'GAMEOVER';
    if (window.soundEngine) window.soundEngine.stopBattleMusic();

    const modal = document.getElementById('screen-gameover');
    const title = document.getElementById('gameover-title');
    const desc = document.getElementById('gameover-desc');
    const crownsDisplay = document.getElementById('gameover-crowns');

    const enemyDeadCount = this.enemyTowers.filter(t => t.isDead).length;
    const playerAliveCount = this.playerTowers.filter(t => !t.isDead).length;

    document.getElementById('stat-enemy-destroyed').textContent = enemyDeadCount;
    document.getElementById('stat-player-alive').textContent = playerAliveCount;
    document.getElementById('stat-deployed-count').textContent = this.deployedUnitsCount;

    crownsDisplay.textContent = '👑 '.repeat(Math.max(1, enemyDeadCount)).trim();

    if (outcome === 'VICTORY') {
      title.textContent = 'VITÓRIA TÁTICA!';
      title.className = 'victory-title';
      desc.textContent = reason;
      if (window.soundEngine) window.soundEngine.playVictory();
    } else {
      title.textContent = 'DERROTA';
      title.className = 'defeat-title';
      desc.textContent = reason;
      if (window.soundEngine) window.soundEngine.playDefeat();
    }

    modal.classList.remove('hidden');
  }

  // --- RENDERER ---

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();

    // Camera shake offset
    let shakeX = 0;
    let shakeY = 0;
    if (this.cameraShakeTimer > 0) {
      shakeX = (Math.random() * 2 - 1) * this.cameraShakeMagnitude;
      shakeY = (Math.random() * 2 - 1) * this.cameraShakeMagnitude;
    }

    ctx.translate(this.offsetX + shakeX, this.offsetY + shakeY);
    ctx.scale(this.scale, this.scale);

    // 1. Arena Floor, River, Bridges, Grid
    this.renderArena(ctx);

    // 2. Deploy Validity Zone Highlight
    if ((this.selectedCardIndex !== null || this.isDragging) && this.state === 'PLAYING') {
      this.renderDeployHighlight(ctx);
    }

    // 3. Shockwaves
    this.shockwaves.forEach(s => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = Math.max(0, s.life / s.maxLife);
      ctx.stroke();
      ctx.restore();
    });

    // 4. Towers
    [...this.enemyTowers, ...this.playerTowers].forEach(t => this.renderTower(ctx, t));

    // 5. Buildings
    this.buildings.forEach(b => this.renderBuilding(ctx, b));

    // 6. Units
    this.units.forEach(u => this.renderUnit(ctx, u));

    // 7. Projectiles
    this.projectiles.forEach(p => this.renderProjectile(ctx, p));

    // 8. Particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 9. Floating Combat Damage Text
    this.floatingTexts.forEach(f => {
      ctx.save();
      ctx.font = 'bold 12px "Orbitron", sans-serif';
      ctx.fillStyle = f.color;
      ctx.textAlign = 'center';
      ctx.globalAlpha = Math.min(1, f.life * 1.5);
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
    });

    // 10. Emote Speech Bubbles
    this.emoteBubbles.forEach(e => this.renderEmoteBubble(ctx, e));

    // 11. Live Drag Reticle
    if (this.isDragging && this.selectedCardIndex !== null) {
      this.renderDragPreview(ctx);
    }

    ctx.restore();
  }

  renderArena(ctx) {
    // Dark void base
    ctx.fillStyle = '#060a17';
    ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

    // Subtle isometric cyan grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    const step = 25;
    for (let x = 0; x <= V_WIDTH; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, V_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= V_HEIGHT; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(V_WIDTH, y);
      ctx.stroke();
    }

    // Top Territory Tint (Enemy Pink)
    const enemyGrad = ctx.createLinearGradient(0, 0, 0, 310);
    enemyGrad.addColorStop(0, 'rgba(255, 0, 85, 0.14)');
    enemyGrad.addColorStop(1, 'rgba(255, 0, 85, 0.02)');
    ctx.fillStyle = enemyGrad;
    ctx.fillRect(0, 0, V_WIDTH, 310);

    // Bottom Territory Tint (Player Cyan)
    const playerGrad = ctx.createLinearGradient(0, 330, 0, V_HEIGHT);
    playerGrad.addColorStop(0, 'rgba(0, 240, 255, 0.02)');
    playerGrad.addColorStop(1, 'rgba(0, 240, 255, 0.14)');
    ctx.fillStyle = playerGrad;
    ctx.fillRect(0, 330, V_WIDTH, V_HEIGHT - 330);

    // Central Data Abyss / River (y: 305 to 335)
    ctx.fillStyle = '#020409';
    ctx.fillRect(0, 305, V_WIDTH, 30);

    // Neon River Conduits
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 320);
    ctx.lineTo(V_WIDTH, 320);
    ctx.stroke();

    // Drifting Binary Bits in the River
    ctx.font = '9px monospace';
    this.riverStreams.forEach(s => {
      ctx.fillStyle = `rgba(0, 240, 255, ${s.alpha})`;
      ctx.fillText(s.char, s.x, s.y);
    });

    // Left and Right Energy Bridges
    this.renderBridge(ctx, 65, 298, 50, 44);
    this.renderBridge(ctx, 285, 298, 50, 44);
  }

  renderBridge(ctx, x, y, w, h) {
    ctx.fillStyle = '#0e162d';
    ctx.fillRect(x, y, w, h);

    // Holographic railing borders
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Neon cross struts
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.stroke();
  }

  renderDeployHighlight(ctx) {
    const card = this.playerHand[this.selectedCardIndex];
    if (!card) return;

    if (card.type === 'spell') {
      ctx.fillStyle = 'rgba(96, 165, 250, 0.12)';
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);
      return;
    }

    // Normal player territory
    ctx.fillStyle = 'rgba(0, 240, 255, 0.14)';
    ctx.fillRect(20, 330, V_WIDTH - 40, V_HEIGHT - 340);

    // Extended pockets if enemy towers destroyed
    if (this.enemyTowers[0].isDead) {
      ctx.fillRect(20, 190, V_WIDTH / 2 - 25, 140);
    }
    if (this.enemyTowers[2].isDead) {
      ctx.fillRect(V_WIDTH / 2 + 5, 190, V_WIDTH / 2 - 25, 140);
    }
  }

  renderDragPreview(ctx) {
    const card = this.playerHand[this.selectedCardIndex];
    if (!card) return;

    const x = this.dragVirtualX;
    const y = this.dragVirtualY;
    const isValid = this.isLocationValidForDeploy('player', card, x, y);

    ctx.save();

    // Range preview circle
    if (card.range || card.radius) {
      const previewRadius = card.radius || (card.range > 50 ? card.range : 35);
      ctx.beginPath();
      ctx.arc(x, y, previewRadius, 0, Math.PI * 2);
      ctx.fillStyle = isValid ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 0, 85, 0.2)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isValid ? '#00f0ff' : '#ff0055';
      ctx.stroke();
    }

    // Holographic Ghost Silhouette
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = isValid ? 'rgba(0, 240, 255, 0.5)' : 'rgba(255, 0, 85, 0.5)';
    ctx.fill();

    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.icon, x, y);

    ctx.restore();
  }

  renderTower(ctx, t) {
    if (t.isDead) {
      ctx.save();
      ctx.fillStyle = 'rgba(25, 30, 48, 0.7)';
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#334';
      ctx.stroke();
      ctx.restore();
      return;
    }

    const isPlayer = t.team === 'player';
    const mainColor = isPlayer ? '#00f0ff' : '#ff0055';
    const subColor = isPlayer ? '#082545' : '#45081c';

    ctx.save();

    // Outer Hex Base
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
    ctx.fillStyle = subColor;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = mainColor;
    ctx.stroke();

    // Inactive King Tower Shield
    if (t.type === 'core' && !t.isActive) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Turret Cannon Barrel pointing at target
    if (t.isActive) {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.turretAngle);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, -3, t.radius + 6, 6);
      ctx.restore();
    }

    // Core Icon / Reactor
    ctx.fillStyle = '#fff';
    ctx.font = t.type === 'core' ? '18px sans-serif' : '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.type === 'core' ? (t.isActive ? '⚡' : '🛡️') : '🛡️', t.x, t.y);

    // Stun Indicator
    if (t.stunTimer > 0) {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Health Bar
    this.renderHealthBar(ctx, t.x, t.y - t.radius - 8, t.hp, t.maxHp, 36, mainColor);

    ctx.restore();
  }

  renderBuilding(ctx, b) {
    ctx.save();
    ctx.fillStyle = '#0f2038';
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#22d3ee';
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.card.icon, b.x, b.y);

    this.renderHealthBar(ctx, b.x, b.y - b.radius - 6, b.hp, b.maxHp, 28, '#22d3ee');
    ctx.restore();
  }

  renderUnit(ctx, u) {
    const isPlayer = u.team === 'player';
    const teamColor = isPlayer ? '#00f0ff' : '#ff0055';

    ctx.save();

    // Attack Visual Splash Ring / Arc
    if (u.attackAnim > 0) {
      ctx.strokeStyle = teamColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (u.isSpinAttack) {
        ctx.arc(u.x, u.y, u.splashRadius, 0, Math.PI * 2);
      } else {
        ctx.arc(u.x, u.y, u.range, u.facingAngle - 0.5, u.facingAngle + 0.5);
      }
      ctx.stroke();
    }

    // Direction Chevron Indicator
    ctx.save();
    ctx.translate(u.x, u.y);
    ctx.rotate(u.facingAngle);
    ctx.fillStyle = teamColor;
    ctx.beginPath();
    ctx.moveTo(u.radius + 4, 0);
    ctx.lineTo(u.radius - 1, -4);
    ctx.lineTo(u.radius - 1, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Unit Body Outer Ring
    ctx.beginPath();
    ctx.arc(u.x, u.y, u.radius, 0, Math.PI * 2);
    ctx.fillStyle = isPlayer ? 'rgba(0, 140, 255, 0.45)' : 'rgba(255, 0, 85, 0.45)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = teamColor;
    ctx.stroke();

    // Flying Altitude Shadow
    if (u.isFlying) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(u.x, u.y + 12, u.radius * 0.8, u.radius * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Unit Icon
    ctx.font = `${u.radius * 1.3}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(u.card.icon, u.x, u.y);

    // Stun Indicator Ring
    if (u.stunTimer > 0) {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(u.x, u.y, u.radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Health Bar
    this.renderHealthBar(ctx, u.x, u.y - u.radius - 5, u.hp, u.maxHp, u.radius * 2 + 6, teamColor);

    ctx.restore();
  }

  renderProjectile(ctx, p) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.isSplash ? 5.5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = p.isSplash ? '#fb923c' : (p.team === 'player' ? '#00f0ff' : '#ff0055');
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  renderEmoteBubble(ctx, e) {
    ctx.save();
    const alpha = Math.min(1, e.life * 1.5);
    ctx.globalAlpha = alpha;

    // Speech bubble background
    ctx.fillStyle = 'rgba(12, 18, 36, 0.95)';
    ctx.strokeStyle = e.isPlayer ? '#00f0ff' : '#ff0055';
    ctx.lineWidth = 1.5;

    const w = 110;
    const h = 34;
    const bx = e.x - w / 2;
    const by = e.y - h;

    ctx.beginPath();
    ctx.roundRect(bx, by, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Emote Icon & Text
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(e.icon, bx + 8, by + h / 2);

    ctx.font = 'bold 10px "Rajdhani", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(e.text, bx + 30, by + h / 2);

    ctx.restore();
  }

  renderHealthBar(ctx, x, y, hp, maxHp, width, color) {
    const h = 4.5;
    const pct = Math.max(0, Math.min(1, hp / maxHp));

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x - width / 2, y, width, h);

    ctx.fillStyle = color;
    ctx.fillRect(x - width / 2, y, width * pct, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - width / 2, y, width, h);
  }
}

// Instantiate engine when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new GameEngine();
});
