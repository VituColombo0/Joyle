/**
 * JOYLE DEEP TECH — Bioactive Molecules Animation
 *
 * Diverse molecule visualization with:
 * - Dopamine (motivation & reward)
 * - Serotonin (happiness & wellbeing)
 * - Caffeine (focus & energy)
 * - Capsaicin (intensity/spice)
 * - Vanillin (vanilla aroma)
 * - Resveratrol (wine & longevity)
 *
 * Mouse interaction: cursor repels nearby atoms.
 */

const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    // ── Configuration ──────────────────────────────────────────────────────
    const CONFIG = {
        // Molecule settings
        moleculeCount: 10,

        // Atom radii
        carbonRadius: 2.5,
        oxygenRadius: 3,
        nitrogenRadius: 2.8,
        hydrogenRadius: 1.5,
        sulfurRadius: 3.2,

        // Colors
        carbonColor: 'rgba(0, 230, 118,',
        oxygenColor: 'rgba(255, 107, 107,',
        nitrogenColor: 'rgba(130, 170, 255,',
        hydrogenColor: 'rgba(224, 224, 224,',
        sulfurColor: 'rgba(255, 230, 80,',


        // Interaction
        mouseRadius: 150,
        mouseForce: 0.15,
        speed: 0.08,
    };

    // Molecule definitions
    const MOLECULES = [
        {
            id: 'dopamine',
            name: 'Dopamina',
            subtitle: 'Motivação e Recompensa',
            color: 'rgba(255, 82, 82,',
            structure: 'benzene-catechol-amine'
        },
        {
            id: 'serotonin',
            name: 'Serotonina',
            subtitle: 'Felicidade e Bem-estar',
            color: 'rgba(156, 39, 176,',
            structure: 'indole'
        },
        {
            id: 'caffeine',
            name: 'Cafeína',
            subtitle: 'Foco e Energia',
            color: 'rgba(255, 193, 7,',
            structure: 'purine'
        },
        {
            id: 'capsaicin',
            name: 'Capsaicina',
            subtitle: 'Intensidade',
            color: 'rgba(255, 87, 34,',
            structure: 'benzene-amide-chain'
        },
        {
            id: 'vanillin',
            name: 'Vanilina',
            subtitle: 'Aroma de Baunilha',
            color: 'rgba(139, 69, 19,',
            structure: 'benzene-branched'
        },
        {
            id: 'resveratrol',
            name: 'Resveratrol',
            subtitle: 'Longevidade',
            color: 'rgba(183, 28, 28,',
            structure: 'stilbene'
        },
        {
            id: 'dopamine2',
            name: 'Dopamina',
            subtitle: 'Motivação e Recompensa',
            color: 'rgba(255, 82, 82,',
            structure: 'benzene-catechol-amine'
        },
        {
            id: 'serotonin2',
            name: 'Serotonina',
            subtitle: 'Felicidade e Bem-estar',
            color: 'rgba(156, 39, 176,',
            structure: 'indole'
        },
        {
            id: 'caffeine2',
            name: 'Cafeína',
            subtitle: 'Foco e Energia',
            color: 'rgba(255, 193, 7,',
            structure: 'purine'
        },
        {
            id: 'resveratrol2',
            name: 'Resveratrol',
            subtitle: 'Longevidade',
            color: 'rgba(183, 28, 28,',
            structure: 'stilbene'
        }
    ];

    // ── State ───────────────────────────────────────────────────────────────
    let molecules = [];
    let mouse = { x: -9999, y: -9999 };
    let rafId = null;
    let prevWidth, prevHeight, resizeInitialized = false;

    // ── Atom Class ─────────────────────────────────────────────────────────
    class Atom {
        constructor(x, y, element, color = null) {
            this.x = x;
            this.y = y;
            this.element = element;
            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;
            this.color = color || this.getElementColor(element);
            this.radius = this.getElementRadius(element);
        }

        getElementColor(element) {
            switch (element) {
                case 'C': return CONFIG.carbonColor;
                case 'O': return CONFIG.oxygenColor;
                case 'N': return CONFIG.nitrogenColor;
                case 'H': return CONFIG.hydrogenColor;
                case 'S': return CONFIG.sulfurColor;
                default: return CONFIG.carbonColor;
            }
        }

        getElementRadius(element) {
            switch (element) {
                case 'C': return CONFIG.carbonRadius;
                case 'O': return CONFIG.oxygenRadius;
                case 'N': return CONFIG.nitrogenRadius;
                case 'H': return CONFIG.hydrogenRadius;
                case 'S': return CONFIG.sulfurRadius;
                default: return CONFIG.carbonRadius;
            }
        }

        update() {
            this.vx += (Math.random() - 0.5) * 0.005;
            this.vy += (Math.random() - 0.5) * 0.005;
            this.vx *= 0.98;
            this.vy *= 0.98;

            const maxSpeed = CONFIG.speed * 2;
            this.vx = Math.max(-maxSpeed, Math.min(maxSpeed, this.vx));
            this.vy = Math.max(-maxSpeed, Math.min(maxSpeed, this.vy));

            this.x += this.vx;
            this.y += this.vy;

            // Mouse interaction
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.mouseRadius && dist > 0) {
                const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
                this.x += (dx / dist) * force * 15;
                this.y += (dy / dist) * force * 15;
            }

            this.wrapEdges();
        }

        wrapEdges() {
            const margin = 50;
            if (this.x < -margin) this.x = canvas.width + margin;
            if (this.x > canvas.width + margin) this.x = -margin;
            if (this.y < -margin) this.y = canvas.height + margin;
            if (this.y > canvas.height + margin) this.y = -margin;
        }

        draw() {
            const pulse = 0.8 + 0.2 * Math.sin(Date.now() * 0.003 + this.x * 0.1);

            // Glow
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
            gradient.addColorStop(0, `${this.color}0.5)`);
            gradient.addColorStop(0.5, `${this.color}0.15)`);
            gradient.addColorStop(1, `${this.color}0)`);

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Atom
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}0.95)`;
            ctx.fill();
        }
    }

    // ── Bond Class ─────────────────────────────────────────────────────────
    class Bond {
        constructor(atom1, atom2, type = 'single') {
            this.atom1 = atom1;
            this.atom2 = atom2;
            this.type = type; // 'single', 'double'
        }

        draw(moleculeColor) {
            const color = moleculeColor + '0.6)';

            ctx.strokeStyle = color;
            ctx.lineWidth = this.type === 'double' ? 2.5 : 1.5;

            if (this.type === 'double') {
                // Draw two parallel lines for double bond
                const dx = this.atom2.x - this.atom1.x;
                const dy = this.atom2.y - this.atom1.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                if (len === 0) return;

                const ux = -dy / len * 2;
                const uy = dx / len * 2;

                ctx.beginPath();
                ctx.moveTo(this.atom1.x + ux, this.atom1.y + uy);
                ctx.lineTo(this.atom2.x + ux, this.atom2.y + uy);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(this.atom1.x - ux, this.atom1.y - uy);
                ctx.lineTo(this.atom2.x - ux, this.atom2.y - uy);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(this.atom1.x, this.atom1.y);
                ctx.lineTo(this.atom2.x, this.atom2.y);
                ctx.stroke();
            }
        }
    }

    // ── Molecule Class ────────────────────────────────────────────────────
    class Molecule {
        constructor(def, x, y) {
            this.id = def.id;
            this.name = def.name;
            this.subtitle = def.subtitle;
            this.color = def.color;
            this.structure = def.structure;
            this.x = x;
            this.y = y;
            this.atoms = [];
            this.bonds = [];
            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;

            this.buildStructure();
        }

        buildStructure() {
            const cx = this.x;
            const cy = this.y;
            const scale = 0.8;

            switch (this.structure) {
                case 'benzene-catechol-amine':
                    this.buildDopamine(cx, cy, scale);
                    break;
                case 'indole':
                    this.buildSerotonin(cx, cy, scale);
                    break;
                case 'purine':
                    this.buildCaffeine(cx, cy, scale);
                    break;
                case 'benzene-amide-chain':
                    this.buildCapsaicin(cx, cy, scale);
                    break;
                case 'benzene-branched':
                    this.buildVanillin(cx, cy, scale);
                    break;
                case 'stilbene':
                    this.buildResveratrol(cx, cy, scale);
                    break;
                default:
                    this.buildBenzene(cx, cy, scale);
            }
        }

        // Dopamine: Benzene + catechol (2 OH) + chain to amine
        buildDopamine(cx, cy, scale) {
            // Benzene ring
            const ringRadius = 20 * scale;
            const benzeneAtoms = [];

            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 6) + (i * Math.PI / 3);
                const x = cx + Math.cos(angle) * ringRadius;
                const y = cy + Math.sin(angle) * ringRadius;
                const atom = new Atom(x, y, 'C', this.color);
                this.atoms.push(atom);
                benzeneAtoms.push(atom);
            }

            // Benzene bonds (aromatic)
            for (let i = 0; i < 6; i++) {
                this.bonds.push(new Bond(benzeneAtoms[i], benzeneAtoms[(i + 1) % 6], 'double'));
            }

            // Inner aromatic circle
            this.innerCircle = { x: cx, y: cy, radius: ringRadius * 0.5 };

            // Catechol: two OH groups on positions 0 and 1
            const oh1Angle = (Math.PI / 6);
            const oh2Angle = (Math.PI / 6) + Math.PI / 3;

            const oh1 = new Atom(
                cx + Math.cos(oh1Angle) * (ringRadius + 15 * scale),
                cy + Math.sin(oh1Angle) * (ringRadius + 15 * scale),
                'O', CONFIG.oxygenColor
            );
            const oh2 = new Atom(
                cx + Math.cos(oh2Angle) * (ringRadius + 15 * scale),
                cy + Math.sin(oh2Angle) * (ringRadius + 15 * scale),
                'O', CONFIG.oxygenColor
            );

            this.atoms.push(oh1, oh2);
            this.bonds.push(new Bond(benzeneAtoms[0], oh1));
            this.bonds.push(new Bond(benzeneAtoms[1], oh2));

            // Chain to amine (position 3)
            const chainStart = benzeneAtoms[3];
            const chainX = cx + Math.cos(oh2Angle + Math.PI) * ringRadius;
            const chainY = cy + Math.sin(oh2Angle + Math.PI) * ringRadius;

            const c1 = new Atom(chainX + 12 * scale, chainY, 'C', this.color);
            const c2 = new Atom(chainX + 24 * scale, chainY + 8 * scale, 'C', this.color);
            const n = new Atom(chainX + 36 * scale, chainY + 16 * scale, 'N', CONFIG.nitrogenColor);

            this.atoms.push(c1, c2, n);
            this.bonds.push(new Bond(chainStart, c1));
            this.bonds.push(new Bond(c1, c2));
            this.bonds.push(new Bond(c2, n));
        }

        // Serotonin: Indole (fused 5+6 rings) + hydroxyl + amine
        buildSerotonin(cx, cy, scale) {
            // 6-membered ring (benzene part)
            const ringRadius = 18 * scale;
            const benzeneAtoms = [];

            // Benzene ring
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 6) + (i * Math.PI / 3);
                const x = cx + Math.cos(angle) * ringRadius - 8 * scale;
                const y = cy + Math.sin(angle) * ringRadius;
                const atom = new Atom(x, y, 'C', this.color);
                this.atoms.push(atom);
                benzeneAtoms.push(atom);
            }

            // Bonds in benzene
            for (let i = 0; i < 5; i++) {
                this.bonds.push(new Bond(benzeneAtoms[i], benzeneAtoms[i + 1], 'double'));
            }
            this.bonds.push(new Bond(benzeneAtoms[5], benzeneAtoms[0], 'double'));

            // Inner circle for benzene
            this.innerCircle = { x: benzeneAtoms[0].x + 4 * scale, y: cy, radius: ringRadius * 0.5 };

            // 5-membered ring (pyrrole part) fused to benzene at atoms 3 and 4
            const pyrroleCenterX = cx + ringRadius * 0.5 + 8 * scale;
            const pyrroleCenterY = cy;
            const pyrroleRadius = 12 * scale;

            const p1 = new Atom(cx + ringRadius * 0.3, cy - pyrroleRadius * 0.8, 'C', this.color);
            const p2 = new Atom(cx + ringRadius * 0.8 + 6 * scale, cy - pyrroleRadius * 0.3, 'C', this.color);
            const p3 = new Atom(cx + ringRadius * 0.8 + 6 * scale, cy + pyrroleRadius * 0.3, 'C', this.color);
            const p4 = new Atom(cx + ringRadius * 0.3, cy + pyrroleRadius * 0.8, 'C', this.color);
            const p5 = new Atom(cx - 2 * scale, cy, 'N', CONFIG.nitrogenColor);

            this.atoms.push(p1, p2, p3, p4, p5);

            // Pyrrole bonds
            this.bonds.push(new Bond(benzeneAtoms[3], p1));
            this.bonds.push(new Bond(benzeneAtoms[4], p4));
            this.bonds.push(new Bond(p1, p2, 'double'));
            this.bonds.push(new Bond(p2, p3));
            this.bonds.push(new Bond(p3, p4, 'double'));
            this.bonds.push(new Bond(p4, p5));
            this.bonds.push(new Bond(p5, p1));

            // Hydroxyl on position 5 of benzene
            const ohAngle = (5 * Math.PI / 3) + Math.PI / 6;
            const oh = new Atom(
                benzeneAtoms[5].x + Math.cos(ohAngle) * 14 * scale,
                benzeneAtoms[5].y + Math.sin(ohAngle) * 14 * scale,
                'O', CONFIG.oxygenColor
            );
            this.atoms.push(oh);
            this.bonds.push(new Bond(benzeneAtoms[5], oh));

            // Chain to amine (from N)
            const n = new Atom(p5.x - 12 * scale, p5.y + 20 * scale, 'N', CONFIG.nitrogenColor);
            const c1 = new Atom(p5.x - 20 * scale, p5.y + 28 * scale, 'C', this.color);
            const c2 = new Atom(p5.x - 32 * scale, p5.y + 28 * scale, 'C', this.color);

            this.atoms.push(n, c1, c2);
            this.bonds.push(new Bond(p5, n));
            this.bonds.push(new Bond(n, c1));
            this.bonds.push(new Bond(c1, c2));
        }

        // Caffeine: Purine (fused 5+6 rings) + methyl groups
        buildCaffeine(cx, cy, scale) {
            const r = 16 * scale;

            // 6-membered ring (pyrimidine)
            const pyrimidineAtoms = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 6) + (i * Math.PI / 3);
                const x = cx + Math.cos(angle) * r - 5 * scale;
                const y = cy + Math.sin(angle) * r;
                const element = (i === 1 || i === 3) ? 'N' : 'C';
                const color = (i === 1 || i === 3) ? CONFIG.nitrogenColor : this.color;
                const atom = new Atom(x, y, element, color);
                this.atoms.push(atom);
                pyrimidineAtoms.push(atom);
            }

            // Pyrimidine bonds (alternating double)
            for (let i = 0; i < 6; i++) {
                const bondType = (i === 0 || i === 2 || i === 4) ? 'double' : 'single';
                this.bonds.push(new Bond(pyrimidineAtoms[i], pyrimidineAtoms[(i + 1) % 6], bondType));
            }

            // Inner circle
            this.innerCircle = { x: pyrimidineAtoms[0].x + 3 * scale, y: cy, radius: r * 0.5 };

            // 5-membered ring (imidazole) fused
            const imidazoleAtoms = [];
            const imCenterX = cx + r * 0.6 + 8 * scale;
            const imCenterY = cy;
            const imRadius = 11 * scale;

            imidazoleAtoms.push(pyrimidineAtoms[3]); // Shared with pyrimidine
            const im1 = new Atom(cx + r * 0.4, cy - imRadius * 0.9, 'N', CONFIG.nitrogenColor);
            const im2 = new Atom(cx + r * 0.9 + 6 * scale, cy, 'C', this.color);
            const im3 = new Atom(cx + r * 0.4, cy + imRadius * 0.9, 'C', this.color);
            imidazoleAtoms.push(im1, im2, im3, pyrimidineAtoms[4]);

            this.atoms.push(im1, im2, im3);

            // Imidazole bonds
            this.bonds.push(new Bond(pyrimidineAtoms[3], im1, 'double'));
            this.bonds.push(new Bond(im1, im2, 'single'));
            this.bonds.push(new Bond(im2, im3, 'double'));
            this.bonds.push(new Bond(im3, pyrimidineAtoms[4], 'single'));
            this.bonds.push(new Bond(pyrimidineAtoms[4], pyrimidineAtoms[3], 'single'));

            // Methyl groups
            const methyl1 = new Atom(pyrimidineAtoms[0].x + 14 * scale, pyrimidineAtoms[0].y - 6 * scale, 'C', this.color);
            const methyl2 = new Atom(im2.x, im2.y - 14 * scale, 'C', this.color);
            const methyl3 = new Atom(im3.x + 12 * scale, im3.y + 8 * scale, 'C', this.color);

            this.atoms.push(methyl1, methyl2, methyl3);
            this.bonds.push(new Bond(pyrimidineAtoms[0], methyl1));
            this.bonds.push(new Bond(im2, methyl2));
            this.bonds.push(new Bond(im3, methyl3));
        }

        // Capsaicin: Benzene + amide bridge + long chain
        buildCapsaicin(cx, cy, scale) {
            const r = 18 * scale;

            // Benzene ring
            const benzeneAtoms = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 6) + (i * Math.PI / 3);
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                const atom = new Atom(x, y, 'C', this.color);
                this.atoms.push(atom);
                benzeneAtoms.push(atom);
            }

            for (let i = 0; i < 6; i++) {
                this.bonds.push(new Bond(benzeneAtoms[i], benzeneAtoms[(i + 1) % 6], 'double'));
            }
            this.innerCircle = { x: cx, y: cy, radius: r * 0.5 };

            // Amide group (-NH-CH2- connected to benzene at position 1)
            const nh = new Atom(cx + r + 10 * scale, cy - 5 * scale, 'N', CONFIG.nitrogenColor);
            const amideC = new Atom(cx + r + 22 * scale, cy, 'C', this.color);

            this.atoms.push(nh, amideC);
            this.bonds.push(new Bond(benzeneAtoms[1], nh));
            this.bonds.push(new Bond(nh, amideC, 'double'));

            // Long hydrophobic chain (zigzag)
            let chainX = amideC.x + 12 * scale;
            let chainY = amideC.y + 8 * scale;

            const chainAtoms = [];
            for (let i = 0; i < 8; i++) {
                const c = new Atom(chainX, chainY, 'C', this.color);
                this.atoms.push(c);
                chainAtoms.push(c);
                chainX += 12 * scale;
                chainY += (i % 2 === 0 ? 6 : -6) * scale;
            }

            // Connect chain
            this.bonds.push(new Bond(amideC, chainAtoms[0]));
            for (let i = 0; i < chainAtoms.length - 1; i++) {
                this.bonds.push(new Bond(chainAtoms[i], chainAtoms[i + 1]));
            }

            // Terminal methyl
            const terminalMethyl = new Atom(chainX, chainY - 6 * scale, 'C', this.color);
            this.atoms.push(terminalMethyl);
            this.bonds.push(new Bond(chainAtoms[chainAtoms.length - 1], terminalMethyl));
        }

        // Vanillin: Benzene + aldehyde, hydroxyl, methoxy
        buildVanillin(cx, cy, scale) {
            const r = 18 * scale;

            // Benzene ring
            const benzeneAtoms = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 6) + (i * Math.PI / 3);
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                const atom = new Atom(x, y, 'C', this.color);
                this.atoms.push(atom);
                benzeneAtoms.push(atom);
            }

            for (let i = 0; i < 6; i++) {
                this.bonds.push(new Bond(benzeneAtoms[i], benzeneAtoms[(i + 1) % 6], 'double'));
            }
            this.innerCircle = { x: cx, y: cy, radius: r * 0.5 };

            // Position 0: Aldehyde (-CHO)
            const aldehydeC = new Atom(cx - r - 10 * scale, cy, 'C', this.color);
            const aldehydeO = new Atom(cx - r - 20 * scale, cy - 10 * scale, 'O', CONFIG.oxygenColor);
            const aldehydeH = new Atom(cx - r - 15 * scale, cy + 10 * scale, 'H', CONFIG.hydrogenColor);

            this.atoms.push(aldehydeC, aldehydeO, aldehydeH);
            this.bonds.push(new Bond(benzeneAtoms[0], aldehydeC));
            this.bonds.push(new Bond(aldehydeC, aldehydeO, 'double'));
            this.bonds.push(new Bond(aldehydeC, aldehydeH));

            // Position 1: Hydroxyl (-OH)
            const ohAngle = Math.PI / 3 + Math.PI / 6;
            const oh = new Atom(
                cx + Math.cos(ohAngle) * (r + 14 * scale),
                cy + Math.sin(ohAngle) * (r + 14 * scale),
                'O', CONFIG.oxygenColor
            );
            this.atoms.push(oh);
            this.bonds.push(new Bond(benzeneAtoms[1], oh));

            // Position 2: Methoxy (-OCH3)
            const methoxyO = new Atom(
                cx + Math.cos(2 * Math.PI / 3 + Math.PI / 6) * (r + 10 * scale),
                cy + Math.sin(2 * Math.PI / 3 + Math.PI / 6) * (r + 10 * scale),
                'O', CONFIG.oxygenColor
            );
            const methoxyC = new Atom(
                cx + Math.cos(2 * Math.PI / 3 + Math.PI / 6) * (r + 24 * scale),
                cy + Math.sin(2 * Math.PI / 3 + Math.PI / 6) * (r + 24 * scale),
                'C', this.color
            );

            this.atoms.push(methoxyO, methoxyC);
            this.bonds.push(new Bond(benzeneAtoms[2], methoxyO));
            this.bonds.push(new Bond(methoxyO, methoxyC));
        }

        // Resveratrol: Two aromatic rings + double bond bridge
        buildResveratrol(cx, cy, scale) {
            const r = 16 * scale;
            const gap = 30 * scale;

            // Left benzene ring
            const leftAtoms = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 6) + (i * Math.PI / 3);
                const x = cx - gap + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                const atom = new Atom(x, y, 'C', this.color);
                this.atoms.push(atom);
                leftAtoms.push(atom);
            }

            for (let i = 0; i < 6; i++) {
                this.bonds.push(new Bond(leftAtoms[i], leftAtoms[(i + 1) % 6], 'double'));
            }

            // Right benzene ring
            const rightAtoms = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 6) + (i * Math.PI / 3);
                const x = cx + gap + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                const atom = new Atom(x, y, 'C', this.color);
                this.atoms.push(atom);
                rightAtoms.push(atom);
            }

            for (let i = 0; i < 6; i++) {
                this.bonds.push(new Bond(rightAtoms[i], rightAtoms[(i + 1) % 6], 'double'));
            }

            // Inner circles
            this.innerCircle = { x: cx - gap, y: cy, radius: r * 0.5 };
            this.innerCircle2 = { x: cx + gap, y: cy, radius: r * 0.5 };

            // Double bond bridge (trans)
            const bridgeC1 = new Atom(cx - 5 * scale, cy + 8 * scale, 'C', this.color);
            const bridgeC2 = new Atom(cx + 5 * scale, cy - 8 * scale, 'C', this.color);

            this.atoms.push(bridgeC1, bridgeC2);
            this.bonds.push(new Bond(leftAtoms[3], bridgeC1, 'double'));
            this.bonds.push(new Bond(rightAtoms[3], bridgeC2, 'double'));
            this.bonds.push(new Bond(bridgeC1, bridgeC2));

            // Hydroxyl on left ring (position 0)
            const oh1 = new Atom(leftAtoms[0].x - 14 * scale, leftAtoms[0].y, 'O', CONFIG.oxygenColor);
            this.atoms.push(oh1);
            this.bonds.push(new Bond(leftAtoms[0], oh1));

            // Hydroxyl on right ring (position 0)
            const oh2 = new Atom(rightAtoms[0].x + 14 * scale, rightAtoms[0].y, 'O', CONFIG.oxygenColor);
            this.atoms.push(oh2);
            this.bonds.push(new Bond(rightAtoms[0], oh2));

            // Hydroxyl on right ring (position 4)
            const oh3 = new Atom(rightAtoms[4].x, rightAtoms[4].y + 14 * scale, 'O', CONFIG.oxygenColor);
            this.atoms.push(oh3);
            this.bonds.push(new Bond(rightAtoms[4], oh3));
        }

        // Simple benzene fallback
        buildBenzene(cx, cy, scale) {
            const r = 20 * scale;
            const atoms = [];

            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 6) + (i * Math.PI / 3);
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                const atom = new Atom(x, y, 'C', this.color);
                this.atoms.push(atom);
                atoms.push(atom);
            }

            for (let i = 0; i < 6; i++) {
                this.bonds.push(new Bond(atoms[i], atoms[(i + 1) % 6], 'double'));
            }

            this.innerCircle = { x: cx, y: cy, radius: r * 0.5 };
        }

        update() {
            this.vx += (Math.random() - 0.5) * 0.005;
            this.vy += (Math.random() - 0.5) * 0.005;
            this.vx *= 0.98;
            this.vy *= 0.98;

            const maxSpeed = CONFIG.speed * 2;
            this.vx = Math.max(-maxSpeed, Math.min(maxSpeed, this.vx));
            this.vy = Math.max(-maxSpeed, Math.min(maxSpeed, this.vy));

            this.x += this.vx;
            this.y += this.vy;

            // Move all atoms with the molecule
            const dx = this.x - (this.atoms[0]?.x || 0);
            const dy = this.y - (this.atoms[0]?.y || 0);

            this.atoms.forEach(atom => {
                atom.x += this.vx;
                atom.y += this.vy;
                atom.update();
            });
        }

        draw() {
            // Draw bonds first
            this.bonds.forEach(bond => bond.draw(this.color));

            // Draw inner aromatic circles
            if (this.innerCircle) {
                const innerColor = this.color + '0.25)';
                ctx.strokeStyle = innerColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(this.innerCircle.x, this.innerCircle.y, this.innerCircle.radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (this.innerCircle2) {
                const innerColor = this.color + '0.25)';
                ctx.strokeStyle = innerColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(this.innerCircle2.x, this.innerCircle2.y, this.innerCircle2.radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw atoms
            this.atoms.forEach(atom => atom.draw());
        }
    }

    // ── Initialization ─────────────────────────────────────────────────────
    function init() {
        // Prevent duplicate initialization
        if (resizeInitialized) return;

        // Initialize dimensions after DOM is ready
        prevWidth = window.innerWidth;
        prevHeight = window.innerHeight;

        molecules = [];

        // Create diverse molecules
        MOLECULES.forEach((molDef, index) => {
            const x = 100 + Math.random() * (canvas.width - 200);
            const y = 80 + Math.random() * (canvas.height - 160);
            molecules.push(new Molecule(molDef, x, y));
        });

        // Mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        // Handle window resize with debouncing (only once)
        const dpr = window.devicePixelRatio || 1;

        // Initialize canvas to window size with proper DPI support
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);

        if (!resizeInitialized) {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const newWidth = window.innerWidth;
                    const newHeight = window.innerHeight;
                    const scaleX = prevWidth > 0 ? newWidth / prevWidth : 1;
                    const scaleY = prevHeight > 0 ? newHeight / prevHeight : 1;

                    // Scale molecule positions proportionally (only if molecules exist)
                    if (molecules.length > 0) {
                        molecules.forEach(mol => {
                            mol.x *= scaleX;
                            mol.y *= scaleY;
                        });
                    }

                    // Handle high DPI displays - reset transform first to avoid compounding
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    canvas.width = newWidth * dpr;
                    canvas.height = newHeight * dpr;
                    canvas.style.width = newWidth + 'px';
                    canvas.style.height = newHeight + 'px';
                    ctx.scale(dpr, dpr);

                    prevWidth = newWidth;
                    prevHeight = newHeight;
                }, 150);
            });
            resizeInitialized = true;
        }

        // Start animation
        animate();
    }

    // ── Animation Loop ──────────────────────────────────────────────────────
    function animate() {
        // Skip rendering if canvas is removed from DOM (display: none via CSS is intentional for background)
        // The canvas still renders but is hidden - useful if future features need it visible again
        const isCanvasInDOM = canvas.offsetParent !== null;

        if (isCanvasInDOM) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw molecules
            molecules.forEach(mol => {
                mol.update();
                mol.draw();
            });
        }

        rafId = requestAnimationFrame(animate);
    }

    // ── Start ───────────────────────────────────────────────────────────────
    if (canvas.width > 0 && canvas.height > 0) {
        init();
    } else {
        canvas.addEventListener('load', init);
    }
}
