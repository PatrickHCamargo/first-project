/**
 * CYBER ROYALE - Neon Protocol
 * Core Game Engine, Combat Simulation, AI, and Canvas Renderer
 */

// Virtual Coordinate System
const V_WIDTH = 400;
const V_HEIGHT = 640;

// Card Definitions
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
    hp: 1750,
    speed: 0.85,
    damage: 110,
    attackSpeed: 1.4,
    range: 30,
    color: '#00e5ff',
    count: 1,
    desc: 'Alta vida. Ignora tropas e avança direto às torres.'
  },
  {
    id: 'ronin',
    name: 'Ciborgue Ronin',
    role: 'Lutador',
    cost: 3,
    icon: '⚔️',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: false,
    hp: 750,
    speed: 1.7,
    damage: 90,
    attackSpeed: 0.9,
    range: 26,
    color: '#38ef7d',
    count: 1,
    desc: 'Guerreiro veloz armado com katanas de plasma.'
  },
  {
    id: 'drones',
    name: 'Enxame de Drones',
    role: 'Aéreo / Horda',
    cost: 3,
    icon: '🛸',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: true,
    hp: 120,
    speed: 1.9,
    damage: 34,
    attackSpeed: 0.8,
    range: 35,
    color: '#a855f7',
    count: 4,
    desc: '4 drones voadores. Cruzam o abismo sem precisar de ponte.'
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
    hp: 360,
    speed: 1.15,
    damage: 160,
    attackSpeed: 1.6,
    range: 145,
    color: '#facc15',
    count: 1,
    desc: 'Longo alcance com rifle de feixe contínuo.'
  },
  {
    id: 'plasma',
    name: 'Canhão Plasma',
    role: 'Dano em Área',
    cost: 4,
    icon: '💥',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: false,
    hp: 480,
    speed: 1.25,
    damage: 80,
    splashRadius: 45,
    attackSpeed: 1.3,
    range: 95,
    color: '#fb923c',
    count: 1,
    desc: 'Dispara esferas explosivas que atingem vários alvos.'
  },
  {
    id: 'emp',
    name: 'Pulso EMP',
    role: 'Feitiço',
    cost: 4,
    icon: '⚡',
    type: 'spell',
    damage: 200,
    towerDamage: 120,
    radius: 75,
    stunDuration: 1.8,
    color: '#60a5fa',
    desc: 'Atinge qualquer ponto do mapa! Causa dano e paralisa por 1.8s.'
  },
  {
    id: 'tesla',
    name: 'Torre Tesla',
    role: 'Defesa',
    cost: 4,
    icon: '📡',
    type: 'building',
    hp: 750,
    range: 110,
    damage: 48,
    attackSpeed: 0.65,
    lifetime: 30,
    color: '#22d3ee',
    desc: 'Estrutura defensiva fixa que dispara raios rápidos.'
  },
  {
    id: 'ninjas',
    name: 'Droids Ninja',
    role: 'Enxame',
    cost: 2,
    icon: '🥷',
    type: 'unit',
    isBuildingTargeter: false,
    isFlying: false,
    hp: 170,
    speed: 2.1,
    damage: 45,
    attackSpeed: 0.7,
    range: 22,
    color: '#f43f5e',
    count: 3,
    desc: 'Trio ágil ideal para cercar tropas pesadas ou distrair.'
  }
];

// Entity Classes
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
    this.attackInterval = 0.95; // seconds
    this.radius = type === 'core' ? 24 : 18;
    this.stunTimer = 0;
    this.isDead = false;
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

    if (this.attackCooldown <= 0) {
      // Find nearest enemy unit or building in range
      const target = game.findNearestTarget(this.x, this.y, this.range, this.team === 'player' ? 'enemy' : 'player', false);
      if (target) {
        this.shoot(target, game);
        this.attackCooldown = this.attackInterval;
      }
    }
  }

  shoot(target, game) {
    game.projectiles.push(new Projectile(
      this.x, this.y - 10, target, this.damage, 340, this.team, false, 0
    ));
    if (window.soundEngine) window.soundEngine.playLaser();
  }

  takeDamage(amt, game, isSpell = false) {
    if (this.isDead) return;
    this.hp -= amt;
    game.floatingTexts.push(new FloatingText(this.x, this.y - 20, `-${Math.round(amt)}`, '#ff3b30'));
    
    // Tower explosion check
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
    this.team = team; // 'player' | 'enemy'
    this.x = x;
    this.y = y;
    this.maxHp = card.hp;
    this.hp = card.hp;
    this.speed = card.speed;
    this.damage = card.damage;
    this.attackInterval = card.attackSpeed;
    this.attackCooldown = 0.3; // brief initial delay
    this.range = card.range;
    this.radius = card.isBuildingTargeter ? 16 : (card.isFlying ? 10 : 12);
    this.isFlying = card.isFlying;
    this.isBuildingTargeter = card.isBuildingTargeter;
    this.splashRadius = card.splashRadius || 0;
    this.stunTimer = 0;
    this.isDead = false;
    this.attackAnim = 0;

    // Determine initial lane based on deployment X
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

    // 1. Check for targets in range to attack
    let target = null;
    if (this.isBuildingTargeter) {
      target = game.findNearestBuilding(this.x, this.y, this.range, opponent);
    } else {
      target = game.findNearestTarget(this.x, this.y, this.range, opponent, true);
    }

    if (target) {
      // In range: perform attack!
      if (this.attackCooldown <= 0) {
        this.performAttack(target, game);
        this.attackCooldown = this.attackInterval;
        this.attackAnim = 0.2;
      }
      return;
    }

    // 2. Not in attack range: Move toward target or lane objective
    let moveTarget = null;

    // Check if an enemy is in aggro sight (unless building-targeter)
    if (!this.isBuildingTargeter) {
      const aggroTarget = game.findNearestTarget(this.x, this.y, 95, opponent, true);
      if (aggroTarget) {
        moveTarget = aggroTarget;
      }
    }

    // Otherwise, follow lane tower progression
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

    // River crossing logic for ground units
    // Central river is between Y=290 and Y=350
    if (!this.isFlying) {
      const isPlayer = this.team === 'player';
      const bridgeX = this.preferredLane === 'left' ? 90 : 310;

      if (isPlayer) {
        // Player units move UP from ~600 to ~50
        if (this.y > 350 && destY < 290) {
          // Must reach bridge entry first
          nextX = bridgeX;
          nextY = 320;
        } else if (this.y >= 290 && this.y <= 350 && Math.abs(this.x - bridgeX) > 28) {
          // In the river zone, align with bridge
          nextX = bridgeX;
          nextY = 320;
        }
      } else {
        // Enemy units move DOWN from ~50 to ~600
        if (this.y < 290 && destY > 350) {
          nextX = bridgeX;
          nextY = 320;
        } else if (this.y >= 290 && this.y <= 350 && Math.abs(this.x - bridgeX) > 28) {
          nextX = bridgeX;
          nextY = 320;
        }
      }
    }

    const dx = nextX - this.x;
    const dy = nextY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 2) {
      const moveDist = this.speed * 60 * dt;
      this.x += (dx / dist) * Math.min(moveDist, dist);
      this.y += (dy / dist) * Math.min(moveDist, dist);
    }
  }

  performAttack(target, game) {
    if (this.range > 50) {
      // Ranged projectile
      const speed = this.card.id === 'sniper' ? 550 : 320;
      game.projectiles.push(new Projectile(
        this.x, this.y, target, this.damage, speed, this.team, this.splashRadius > 0, this.splashRadius
      ));
      if (window.soundEngine) {
        if (this.card.id === 'plasma') window.soundEngine.playPlasma();
        else window.soundEngine.playLaser();
      }
    } else {
      // Melee attack
      target.takeDamage(this.damage, game);
      if (window.soundEngine) window.soundEngine.playSlash();
      // Attack spark
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
    this.range = card.range;
    this.damage = card.damage;
    this.attackInterval = card.attackSpeed;
    this.attackCooldown = 0;
    this.lifetime = card.lifetime;
    this.radius = 16;
    this.stunTimer = 0;
    this.isDead = false;
  }

  update(dt, game) {
    if (this.isDead) return;
    this.lifetime -= dt;
    this.hp -= (this.maxHp / this.card.lifetime) * dt;

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

    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    if (this.attackCooldown <= 0) {
      const opponent = this.team === 'player' ? 'enemy' : 'player';
      const target = game.findNearestTarget(this.x, this.y, this.range, opponent, true);
      if (target) {
        target.takeDamage(this.damage, game);
        game.createHitParticles(target.x, target.y, '#22d3ee');
        if (window.soundEngine) window.soundEngine.playLaser();
        this.attackCooldown = this.attackInterval;
      }
    }
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
    if (!this.target.isDead) {
      this.targetLastX = this.target.x;
      this.targetLastY = this.target.y;
    }

    const dx = this.targetLastX - this.x;
    const dy = this.targetLastY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 10) {
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
      // AoE damage
      game.applySplashDamage(this.x, this.y, this.splashRadius, this.damage, opponent);
      game.createShockwave(this.x, this.y, this.splashRadius, '#fb923c');
      if (window.soundEngine) window.soundEngine.playExplosion(0.7);
    } else {
      // Single target damage
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
    this.life = 0.3;
    this.maxLife = 0.3;
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

// MAIN GAME MANAGER
class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // State
    this.state = 'MENU'; // 'MENU' | 'PLAYING' | 'GAMEOVER'
    this.matchTime = 180; // 3 minutes in seconds
    this.isOvertime = false;

    // Energy / Elixir
    this.playerEnergy = 5;
    this.enemyEnergy = 5;
    this.maxEnergy = 10;
    this.energyRate = 1 / 2.8; // 1 energy per 2.8 seconds

    // Towers
    this.playerTowers = [];
    this.enemyTowers = [];

    // Active Entities
    this.units = [];
    this.buildings = [];
    this.projectiles = [];
    this.particles = [];
    this.shockwaves = [];
    this.floatingTexts = [];

    // Decks and Hand
    this.playerDeck = [...CARDS_DATABASE];
    this.enemyDeck = [...CARDS_DATABASE];
    this.playerHand = [];
    this.playerNextCard = null;
    this.selectedCardIndex = null;

    // Enemy AI State
    this.aiTimer = 0;
    this.aiReactionCooldown = 2.0;

    // Canvas scaling
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this.initUI();
    this.setupResize();
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
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
    // Sound button toggle
    const soundBtn = document.getElementById('sound-btn');
    soundBtn.addEventListener('click', () => {
      const enabled = window.soundEngine.toggle();
      soundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    // Start Button
    document.getElementById('btn-start-game').addEventListener('click', () => {
      window.soundEngine.init();
      this.startMatch();
    });

    // Restart Button
    document.getElementById('btn-restart').addEventListener('click', () => {
      this.startMatch();
    });

    // Canvas Tap / Click for deployment
    const handleTap = (clientX, clientY) => {
      if (this.state !== 'PLAYING') return;
      if (this.selectedCardIndex === null) return;

      const rect = this.canvas.getBoundingClientRect();
      const clickX = (clientX - rect.left - this.offsetX) / this.scale;
      const clickY = (clientY - rect.top - this.offsetY) / this.scale;

      this.tryDeploySelectedCard(clickX, clickY);
    };

    this.canvas.addEventListener('click', (e) => {
      handleTap(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleTap(touch.clientX, touch.clientY);
    }, { passive: false });
  }

  startMatch() {
    document.getElementById('screen-menu').classList.add('hidden');
    document.getElementById('screen-gameover').classList.add('hidden');

    this.state = 'PLAYING';
    this.matchTime = 180;
    this.isOvertime = false;
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

    // Initialize Towers
    // Enemy (Top)
    this.enemyTowers = [
      new Tower('enemy', 'node_left', 90, 130, 1400, 115, 52),
      new Tower('enemy', 'core', 200, 60, 2400, 135, 70),
      new Tower('enemy', 'node_right', 310, 130, 1400, 115, 52)
    ];

    // Player (Bottom)
    this.playerTowers = [
      new Tower('player', 'node_left', 90, 510, 1400, 115, 52),
      new Tower('player', 'core', 200, 580, 2400, 135, 70),
      new Tower('player', 'node_right', 310, 510, 1400, 115, 52)
    ];

    // Shuffle and init Player Deck & Hand
    this.playerDeck = this.shuffle([...CARDS_DATABASE]);
    this.playerHand = this.playerDeck.slice(0, 4);
    this.deckQueue = this.playerDeck.slice(4);
    this.playerNextCard = this.deckQueue.shift();
    this.selectedCardIndex = null;

    this.updateCardHandUI();
    this.updateHUD();

    if (window.soundEngine) window.soundEngine.playDeploy();
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

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

      cardEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!canAfford) return;
        if (this.selectedCardIndex === index) {
          // Deselect
          this.selectedCardIndex = null;
          document.getElementById('deploy-guide').classList.add('hidden');
        } else {
          this.selectedCardIndex = index;
          document.getElementById('deploy-guide').classList.remove('hidden');
          if (window.soundEngine) window.soundEngine.playDeploy();
        }
        this.updateCardHandUI();
      });

      container.appendChild(cardEl);
    });

    // Update next card preview
    const nextPreview = document.getElementById('next-card-preview');
    if (this.playerNextCard) {
      nextPreview.innerHTML = `
        <span>${this.playerNextCard.icon}</span>
        <span class="mini-cost">${this.playerNextCard.cost}</span>
      `;
    }
  }

  tryDeploySelectedCard(x, y) {
    const card = this.playerHand[this.selectedCardIndex];
    if (!card || this.playerEnergy < card.cost) return;

    // Deployment boundaries check
    const isValid = this.isLocationValidForDeploy('player', card, x, y);
    if (!isValid) {
      this.floatingTexts.push(new FloatingText(x, y, 'ZONA INVÁLIDA!', '#ff0055'));
      return;
    }

    // Spend energy
    this.playerEnergy -= card.cost;

    // Deploy
    this.deployCard(card, 'player', x, y);

    // Cycle card
    this.cyclePlayerCard(this.selectedCardIndex);
    this.selectedCardIndex = null;
    document.getElementById('deploy-guide').classList.add('hidden');
    this.updateCardHandUI();
  }

  isLocationValidForDeploy(team, card, x, y) {
    // Spells can be dropped ANYWHERE on map
    if (card.type === 'spell') return true;

    // Restrict within field bounds
    if (x < 30 || x > V_WIDTH - 30 || y < 30 || y > V_HEIGHT - 30) return false;

    // If unit, check team territorial boundary
    if (team === 'player') {
      // Default: Player can drop anywhere below the river line (y >= 330)
      if (y >= 330) return true;

      // If enemy Left tower is dead, player can drop up to y = 200 on left side
      const leftDead = this.enemyTowers[0].isDead;
      if (leftDead && x < V_WIDTH / 2 && y >= 200) return true;

      // If enemy Right tower is dead, player can drop up to y = 200 on right side
      const rightDead = this.enemyTowers[2].isDead;
      if (rightDead && x >= V_WIDTH / 2 && y >= 200) return true;

      return false;
    } else {
      // Enemy AI side:
      if (y <= 310) return true;
      const leftDead = this.playerTowers[0].isDead;
      if (leftDead && x < V_WIDTH / 2 && y <= 440) return true;
      const rightDead = this.playerTowers[2].isDead;
      if (rightDead && x >= V_WIDTH / 2 && y <= 440) return true;
      return false;
    }
  }

  deployCard(card, team, x, y) {
    if (card.type === 'spell') {
      // EMP Spell deployment
      this.applyEMPSpell(x, y, card, team);
      return;
    }

    if (card.type === 'building') {
      this.buildings.push(new Building(card, team, x, y));
      if (window.soundEngine) window.soundEngine.playDeploy();
      return;
    }

    // Regular Units (handle swarms: count > 1)
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

    const opponent = team === 'player' ? 'enemy' : 'player';

    // Units damage and stun
    this.units.forEach(u => {
      if (u.team === opponent && !u.isDead) {
        const d = Math.hypot(u.x - x, u.y - y);
        if (d <= card.radius) {
          u.takeDamage(card.damage, this);
          u.stunTimer = card.stunDuration;
          this.floatingTexts.push(new FloatingText(u.x, u.y - 18, 'PARALISADO!', '#60a5fa'));
        }
      }
    });

    // Buildings & Towers damage and stun
    const towers = opponent === 'player' ? this.playerTowers : this.enemyTowers;
    towers.forEach(t => {
      if (!t.isDead) {
        const d = Math.hypot(t.x - x, t.y - y);
        if (d <= card.radius + t.radius) {
          t.takeDamage(card.towerDamage, this, true);
          t.stunTimer = card.stunDuration;
          this.floatingTexts.push(new FloatingText(t.x, t.y - 24, 'EMP!', '#60a5fa'));
        }
      }
    });
  }

  applySplashDamage(x, y, radius, damage, opponent) {
    this.units.forEach(u => {
      if (u.team === opponent && !u.isDead) {
        const d = Math.hypot(u.x - x, u.y - y);
        if (d <= radius + u.radius) {
          u.takeDamage(damage, this);
        }
      }
    });

    const towers = opponent === 'player' ? this.playerTowers : this.enemyTowers;
    towers.forEach(t => {
      if (!t.isDead) {
        const d = Math.hypot(t.x - x, t.y - y);
        if (d <= radius + t.radius) {
          t.takeDamage(damage, this);
        }
      }
    });
  }

  // Pathfinding & Targeting Queries
  findNearestTarget(x, y, range, targetTeam, includeUnits = true) {
    let closest = null;
    let minDist = range;

    // Check towers
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

    // If node tower in this lane is alive, aim for it
    if (!towers[nodeIndex].isDead) {
      return towers[nodeIndex];
    }

    // If node tower is down, aim for the central core (King)
    if (!towers[1].isDead) {
      return towers[1];
    }

    // Otherwise target other side node
    const otherIndex = lane === 'left' ? 2 : 0;
    return towers[otherIndex];
  }

  onTowerDestroyed(tower) {
    if (window.soundEngine) window.soundEngine.playTowerDestroyed();
    this.createShockwave(tower.x, tower.y, 110, tower.team === 'player' ? '#00f0ff' : '#ff0055');

    // Update crown counts
    this.updateCrownCount();

    // Core destruction = Immediate Win/Loss
    if (tower.type === 'core') {
      if (tower.team === 'enemy') {
        this.endMatch('VICTORY', 'O Reator Inimigo foi aniquilado!');
      } else {
        this.endMatch('DEFEAT', 'Seu Reator Central foi destruído!');
      }
    }
  }

  updateCrownCount() {
    const enemyDeadCount = this.enemyTowers.filter(t => t.isDead).length;
    const playerDeadCount = this.playerTowers.filter(t => t.isDead).length;

    document.getElementById('player-crowns').textContent = enemyDeadCount;
    document.getElementById('enemy-crowns').textContent = playerDeadCount;
  }

  // Enemy AI Logic
  updateAI(dt) {
    this.aiTimer += dt;
    if (this.aiTimer < this.aiReactionCooldown) return;
    this.aiTimer = 0;

    // AI decisions:
    // Check if player has threatening units advancing into AI territory
    const threateningUnits = this.units.filter(u => u.team === 'player' && !u.isDead && u.y < 350);

    if (threateningUnits.length > 0) {
      const threat = threateningUnits[0];
      // Counter:
      if (threat.card.id === 'mech' && this.enemyEnergy >= 3) {
        // Counter tank with swarm
        this.aiDeploy('drones', threat.x, 180);
      } else if (threat.card.count > 1 && this.enemyEnergy >= 4) {
        // Counter swarm with splash
        this.aiDeploy('plasma', threat.x, 200);
      } else if (threateningUnits.length >= 3 && this.enemyEnergy >= 4) {
        // Clustered push -> EMP spell
        this.aiDeploy('emp', threat.x, threat.y);
      } else if (this.enemyEnergy >= 3) {
        this.aiDeploy('ronin', threat.x, 220);
      }
    } else if (this.enemyEnergy >= 8) {
      // Initiate push!
      const lane = Math.random() < 0.5 ? 'left' : 'right';
      const deployX = lane === 'left' ? 90 + (Math.random() * 40 - 20) : 310 + (Math.random() * 40 - 20);

      // Deploy tank or fighter
      const choices = ['mech', 'ronin', 'sniper', 'drones', 'ninjas'];
      const choice = choices[Math.floor(Math.random() * choices.length)];
      this.aiDeploy(choice, deployX, 100);
    }
  }

  aiDeploy(cardId, x, y) {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card || this.enemyEnergy < card.cost) return;

    this.enemyEnergy -= card.cost;
    this.deployCard(card, 'enemy', x, y);
  }

  // Particles & Visual FX
  createHitParticles(x, y, color) {
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      this.particles.push(new Particle(
        x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 3, 0.25
      ));
    }
  }

  createDeathParticles(x, y, color) {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.particles.push(new Particle(
        x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, Math.random() * 4 + 2, 0.4
      ));
    }
  }

  createShockwave(x, y, radius, color) {
    this.shockwaves.push(new Shockwave(x, y, radius, color));
  }

  // Game Loop
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
    // 1. Timer & Overdrive
    this.matchTime -= dt;
    if (this.matchTime <= 60 && !this.isOvertime) {
      this.isOvertime = true;
      document.getElementById('overtime-badge').classList.remove('hidden');
    }

    // Time's up check
    if (this.matchTime <= 0) {
      this.matchTime = 0;
      this.resolveTimeEnd();
      return;
    }

    // 2. Energy Generation
    const multiplier = this.isOvertime ? 2.0 : 1.0;
    this.playerEnergy = Math.min(this.maxEnergy, this.playerEnergy + this.energyRate * multiplier * dt);
    this.enemyEnergy = Math.min(this.maxEnergy, this.enemyEnergy + this.energyRate * multiplier * dt);

    this.updateHUD();

    // 3. AI Update
    this.updateAI(dt);

    // 4. Update Entities
    this.playerTowers.forEach(t => t.update(dt, this));
    this.enemyTowers.forEach(t => t.update(dt, this));
    this.buildings.forEach(b => b.update(dt, this));
    this.units.forEach(u => u.update(dt, this));
    this.projectiles.forEach(p => p.update(dt, this));
    this.particles.forEach(p => p.update(dt));
    this.shockwaves.forEach(s => s.update(dt));
    this.floatingTexts.forEach(f => f.update(dt));

    // Cleanup dead entities
    this.buildings = this.buildings.filter(b => !b.isDead);
    this.units = this.units.filter(u => !u.isDead);
    this.projectiles = this.projectiles.filter(p => !p.isDead);
    this.particles = this.particles.filter(p => p.life > 0);
    this.shockwaves = this.shockwaves.filter(s => s.life > 0);
    this.floatingTexts = this.floatingTexts.filter(f => f.life > 0);
  }

  updateHUD() {
    // Timer display
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
      this.endMatch('VICTORY', `Tempo esgotado! Você destruiu ${enemyCrownsLost} contra ${playerCrownsLost}.`);
    } else if (playerCrownsLost > enemyCrownsLost) {
      this.endMatch('DEFEAT', `Tempo esgotado! O inimigo destruiu ${playerCrownsLost} contra ${enemyCrownsLost}.`);
    } else {
      // Tie breaker: lowest health tower
      const lowestEnemyHp = Math.min(...this.enemyTowers.map(t => t.isDead ? 99999 : t.hp));
      const lowestPlayerHp = Math.min(...this.playerTowers.map(t => t.isDead ? 99999 : t.hp));

      if (lowestPlayerHp > lowestEnemyHp) {
        this.endMatch('VICTORY', 'Empate desfeito! Suas torres sofreram menos dano.');
      } else {
        this.endMatch('DEFEAT', 'Empate desfeito! Suas torres sofreram mais dano.');
      }
    }
  }

  endMatch(outcome, reason) {
    this.state = 'GAMEOVER';
    const modal = document.getElementById('screen-gameover');
    const title = document.getElementById('gameover-title');
    const desc = document.getElementById('gameover-desc');

    const enemyDeadCount = this.enemyTowers.filter(t => t.isDead).length;
    const playerAliveCount = this.playerTowers.filter(t => !t.isDead).length;

    document.getElementById('stat-enemy-destroyed').textContent = enemyDeadCount;
    document.getElementById('stat-player-alive').textContent = playerAliveCount;

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

  // RENDERER
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // 1. Draw Arena Background & Grid
    this.renderArena(ctx);

    // 2. Draw Deploy Validity Highlight when a card is selected
    if (this.selectedCardIndex !== null && this.state === 'PLAYING') {
      this.renderDeployHighlight(ctx);
    }

    // 3. Draw Shockwaves
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

    // 4. Draw Towers
    [...this.enemyTowers, ...this.playerTowers].forEach(t => this.renderTower(ctx, t));

    // 5. Draw Buildings
    this.buildings.forEach(b => this.renderBuilding(ctx, b));

    // 6. Draw Units
    this.units.forEach(u => this.renderUnit(ctx, u));

    // 7. Draw Projectiles
    this.projectiles.forEach(p => this.renderProjectile(ctx, p));

    // 8. Draw Particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 9. Floating Combat Text
    this.floatingTexts.forEach(f => {
      ctx.save();
      ctx.font = 'bold 12px "Orbitron", sans-serif';
      ctx.fillStyle = f.color;
      ctx.textAlign = 'center';
      ctx.globalAlpha = Math.min(1, f.life * 1.5);
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
    });

    ctx.restore();
  }

  renderArena(ctx) {
    // Base dark background
    ctx.fillStyle = '#080d1e';
    ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

    // Subtle isometric-styled cyber grid
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

    // Top / Bottom territory tints
    // Enemy side
    const enemyGrad = ctx.createLinearGradient(0, 0, 0, 310);
    enemyGrad.addColorStop(0, 'rgba(255, 0, 85, 0.12)');
    enemyGrad.addColorStop(1, 'rgba(255, 0, 85, 0.02)');
    ctx.fillStyle = enemyGrad;
    ctx.fillRect(0, 0, V_WIDTH, 310);

    // Player side
    const playerGrad = ctx.createLinearGradient(0, 330, 0, V_HEIGHT);
    playerGrad.addColorStop(0, 'rgba(0, 240, 255, 0.02)');
    playerGrad.addColorStop(1, 'rgba(0, 240, 255, 0.12)');
    ctx.fillStyle = playerGrad;
    ctx.fillRect(0, 330, V_WIDTH, V_HEIGHT - 330);

    // Central Data Rift / River (y: 300 to 340)
    ctx.fillStyle = '#03050c';
    ctx.fillRect(0, 305, V_WIDTH, 30);

    // Flowing digital energy streams
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 320);
    ctx.lineTo(V_WIDTH, 320);
    ctx.stroke();

    // Two Energy Bridges (Left & Right Lanes)
    this.renderBridge(ctx, 65, 298, 50, 44);
    this.renderBridge(ctx, 285, 298, 50, 44);
  }

  renderBridge(ctx, x, y, w, h) {
    // Bridge deck
    ctx.fillStyle = '#10172e';
    ctx.fillRect(x, y, w, h);

    // Holographic glowing railings
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Neon crossbars
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();
  }

  renderDeployHighlight(ctx) {
    const card = this.playerHand[this.selectedCardIndex];
    if (!card) return;

    if (card.type === 'spell') {
      // Entire map is valid for spell!
      ctx.fillStyle = 'rgba(96, 165, 250, 0.12)';
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);
      return;
    }

    // Player deploy zone
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.fillRect(20, 330, V_WIDTH - 40, V_HEIGHT - 340);

    // Extended zone if enemy towers down
    if (this.enemyTowers[0].isDead) {
      ctx.fillRect(20, 200, V_WIDTH / 2 - 25, 130);
    }
    if (this.enemyTowers[2].isDead) {
      ctx.fillRect(V_WIDTH / 2 + 5, 200, V_WIDTH / 2 - 25, 130);
    }
  }

  renderTower(ctx, t) {
    if (t.isDead) {
      // Ruins / deactivated pedestal
      ctx.save();
      ctx.fillStyle = 'rgba(40, 45, 65, 0.8)';
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#445';
      ctx.stroke();
      ctx.restore();
      return;
    }

    const isPlayer = t.team === 'player';
    const mainColor = isPlayer ? '#00f0ff' : '#ff0055';
    const subColor = isPlayer ? '#0066cc' : '#990033';

    ctx.save();
    // Tower Outer Ring / Energy Base
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
    ctx.fillStyle = subColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = mainColor;
    ctx.stroke();

    // Tower Core Icon
    ctx.fillStyle = '#fff';
    ctx.font = t.type === 'core' ? '18px sans-serif' : '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.type === 'core' ? '⚡' : '🛡️', t.x, t.y);

    // Stun Indicator
    if (t.stunTimer > 0) {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Health Bar
    this.renderHealthBar(ctx, t.x, t.y - t.radius - 8, t.hp, t.maxHp, 36, isPlayer ? '#00f0ff' : '#ff0055');

    ctx.restore();
  }

  renderBuilding(ctx, b) {
    ctx.save();
    ctx.fillStyle = '#132338';
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#22d3ee';
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📡', b.x, b.y);

    this.renderHealthBar(ctx, b.x, b.y - b.radius - 6, b.hp, b.maxHp, 28, '#22d3ee');
    ctx.restore();
  }

  renderUnit(ctx, u) {
    const isPlayer = u.team === 'player';
    const teamColor = isPlayer ? '#00f0ff' : '#ff0055';

    ctx.save();

    // Attack Slash animation
    if (u.attackAnim > 0) {
      ctx.strokeStyle = teamColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(u.x, u.y, u.range, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Unit Body Shadow/Ring
    ctx.beginPath();
    ctx.arc(u.x, u.y, u.radius, 0, Math.PI * 2);
    ctx.fillStyle = isPlayer ? 'rgba(0, 140, 255, 0.4)' : 'rgba(255, 0, 85, 0.4)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = teamColor;
    ctx.stroke();

    // Unit Icon
    ctx.font = `${u.radius * 1.3}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(u.card.icon, u.x, u.y);

    // Stun Indicator
    if (u.stunTimer > 0) {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(u.x, u.y, u.radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Health Bar
    this.renderHealthBar(ctx, u.x, u.y - u.radius - 5, u.hp, u.maxHp, u.radius * 2 + 4, teamColor);

    ctx.restore();
  }

  renderProjectile(ctx, p) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.isSplash ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = p.isSplash ? '#fb923c' : (p.team === 'player' ? '#00f0ff' : '#ff0055');
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  renderHealthBar(ctx, x, y, hp, maxHp, width, color) {
    const h = 4;
    const pct = Math.max(0, Math.min(1, hp / maxHp));

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - width / 2, y, width, h);

    ctx.fillStyle = color;
    ctx.fillRect(x - width / 2, y, width * pct, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - width / 2, y, width, h);
  }
}

// Instantiate engine when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new GameEngine();
});
