var puedeatacar = false;
let arraypriority;
var movement = false;
var current_dice = 0;
var remainingMoves = 0;
var turn = 0;
var duplicate =0;
var duplicateremoved =0;
function findSuitablePlayerUnit(unidadIA) {
    let suitablePlayerUnit = null;
    let bestScore = -Infinity;

    document.querySelectorAll('.playerUnit').forEach(playerUnit => {
        const playerHex = findClosestHex(playerUnit);
        const playerQ = parseInt(playerHex.getAttribute('data-q'));
        const playerR = parseInt(playerHex.getAttribute('data-r'));
        const playerS = parseInt(playerHex.getAttribute('data-s'));

        const iaHex = unidadIA.closest('.hex');
        const iaQ = parseInt(iaHex.getAttribute('data-q'));
        const iaR = parseInt(iaHex.getAttribute('data-r'));
        const iaS = parseInt(iaHex.getAttribute('data-s'));

        const distance = Math.abs(playerQ - iaQ) + Math.abs(playerR - iaR) + Math.abs(playerS - iaS);
        const cost = parseInt(playerUnit.getAttribute('data-standard-cost'));
        const dataFigures = parseInt(playerUnit.getAttribute('data-figures'));
        const currentHealth = parseInt(playerUnit.getAttribute('data-health'));
        const maxHealth = parseInt(playerUnit.getAttribute('data-life'));

        let figures = document.querySelectorAll(`.AIUnit[data-name='${playerUnit.getAttribute('data-name')}']`).length;
        let damageScore = 0;

        if (dataFigures > 1) {
            damageScore = (dataFigures - figures) * 10; // You can adjust the weight here
        } else {
            damageScore = (maxHealth - currentHealth) * 10; // You can adjust the weight here
        }

        let score = -distance + cost + damageScore;

        if (score > bestScore) {
            bestScore = score;
            suitablePlayerUnit = playerUnit;
        }
    });

    return suitablePlayerUnit;
}

function distanceToClosestPlayerUnit(unidadIA) {
    let closestPlayerUnit = null;
    let shortestDistance = Infinity;

    document.querySelectorAll('.playerUnit').forEach(playerUnit => {
        const playerHex = findClosestHex(playerUnit);
        const playerQ = parseInt(playerHex.getAttribute('data-q'));
        const playerR = parseInt(playerHex.getAttribute('data-r'));
        const playerS = parseInt(playerHex.getAttribute('data-s'));

        const iaHex = unidadIA.closest('.hex');
        const iaQ = parseInt(iaHex.getAttribute('data-q'));
        const iaR = parseInt(iaHex.getAttribute('data-r'));
        const iaS = parseInt(iaHex.getAttribute('data-s'));

        const distance = Math.abs(playerQ - iaQ) + Math.abs(playerR - iaR) + Math.abs(playerS - iaS);

        if (distance < shortestDistance) {
            shortestDistance = distance;
            closestPlayerUnit = playerUnit;
        }
    });

    return shortestDistance;
}

function findClosestPlayerUnit(unidadIA) 
{
    let closestPlayerUnit = null;
    let shortestDistance = Infinity;

    document.querySelectorAll('.playerUnit').forEach(playerUnit => {
        const playerHex = findClosestHex(playerUnit);
        const playerQ = parseInt(playerHex.getAttribute('data-q'));
        const playerR = parseInt(playerHex.getAttribute('data-r'));
        const playerS = parseInt(playerHex.getAttribute('data-s'));

        const iaHex = unidadIA.closest('.hex');
        const iaQ = parseInt(iaHex.getAttribute('data-q'));
        const iaR = parseInt(iaHex.getAttribute('data-r'));
        const iaS = parseInt(iaHex.getAttribute('data-s'));

        const distance = Math.abs(playerQ - iaQ) + Math.abs(playerR - iaR) + Math.abs(playerS - iaS);

        if (distance < shortestDistance) {
            shortestDistance = distance;
            closestPlayerUnit = playerUnit;
        }
    });

    return closestPlayerUnit;
}
function moverUnidadIA(unidadIA, unidadJugadorCercana) {
    const iaHex = findClosestHex(unidadIA);
    const iaQ = parseInt(iaHex.getAttribute('data-q'));
    const iaR = parseInt(iaHex.getAttribute('data-r'));
    const iaS = parseInt(iaHex.getAttribute('data-s'));
    let distanceToTarget2;
			let previousstep = null;
    const playerHex = findClosestHex(unidadJugadorCercana);
    const playerQ = parseInt(playerHex.getAttribute('data-q'));
    const playerR = parseInt(playerHex.getAttribute('data-r'));
    const playerS = parseInt(playerHex.getAttribute('data-s'));
	let nextStep = findClosestHex(unidadIA);
    const path = findShortestPath(iaQ, iaR, iaS, playerQ, playerR, playerS);
    let moveRange = parseInt(unidadIA.getAttribute('data-move'));
    const attackRange = parseInt(unidadIA.getAttribute('data-range'));
    console.log("movement : (" + moveRange + ")");
    const reachableHexes = findReachableHexes(iaQ, iaR, iaS, moveRange).map(hex => hex.element);
	if(remainingMoves < moveRange)
	{
		moveRange =  remainingMoves;
	}
	
    let targetStep = path.length > moveRange ? path[moveRange] : path[path.length - 1];

    if (attackRange > 1) {
        for (let i = 0; i <= path.length - 1; i++) {
            const step = path[i];
            const stepHex = step.hex;
            const stepQ = parseInt(stepHex.getAttribute('data-q'));
            const stepR = parseInt(stepHex.getAttribute('data-r'));
            const stepS = parseInt(stepHex.getAttribute('data-s'));

            var distanceToTarget = getDistance(stepQ, stepR, stepS, playerQ, playerR, playerS);
            console.log("Current distance : (" + distanceToTarget + ")");
            if (distanceToTarget <= attackRange) {
                targetStep = path[i - (attackRange - distanceToTarget)];
            } else if (i >= moveRange) {
                targetStep = step;
                puedeatacar = false;
                break;
            }
            if (distanceToTarget <= attackRange) {
                puedeatacar = true;
                console.log(`Unidad IA ataca a la unidad del jugador en (${playerQ}, ${playerR}, ${playerS})`);
				if(comprobarAtaque(unidadIA))
				{
					battle(unidadIA.getAttribute('data-name'), unidadJugadorCercana.getAttribute('data-name'));
				}
                break;
            }
        }
        console.log("ranged : (" + attackRange + ")");
        if (targetStep) {
            unidadIA.setAttribute('data-previousweight', playerHex.getAttribute('data-height'));
            targetStep.hex.appendChild(unidadIA);
            targetStep.hex.setAttribute('data-previousweight', targetStep.hex.getAttribute('data-height'));
			//iaHex.setAttribute('data-height',  unidadIA.getAttribute('data-previousweight'));
            //targetStep.hex.setAttribute('data-height',100);
			targetStep = null;
        }
    }

    if (targetStep) {
        let targetQ, targetR, targetS; // Declare variables outside the loop

        for (let i = Math.min(path.length - 1, moveRange); i >= 0; i--) {
            if (reachableHexes.includes(path[i].hex)) {
                nextStep = path[i];
                const targetHex = nextStep.hex;
                targetQ = parseInt(targetHex.getAttribute('data-q'));
                targetR = parseInt(targetHex.getAttribute('data-r'));
                targetS = parseInt(targetHex.getAttribute('data-s'));

                if (targetHex.querySelector('.unit') || nextStep.hex.querySelector('.unit')) {
                    if (i - 1 >= 0) {
                        nextStep = path[i - 1];
						if(path.length > 2){previousstep = path[i - 2];}else{nextStep=path[i - 2];{previousstep = path[i - 3];}}
                    } else {
                        nextStep = null; // Handle case where there's no previous step
                    }
                }
                break;
            }
        }

        distanceToTarget2 = getDistance(targetQ, targetR, targetS, playerQ, playerR, playerS);
        if (distanceToTarget - 1 === attackRange) {
            nextStep = null;
            console.log("DISPARO: " + (distanceToTarget - 1) + " range: " + attackRange);
        }
        if (nextStep) {
			//iaHex.setAttribute('data-height',  unidadIA.getAttribute('data-previousweight'));
            unidadIA.setAttribute('data-previousweight', nextStep.hex.getAttribute('height'));
            nextStep.hex.appendChild(unidadIA);
            //nextStep.hex.setAttribute('data-height', 100);
        }
        console.log(`new distance: (${distanceToTarget2}) / movement: (${moveRange}) / range: (${attackRange})`);
    }
	 if (distanceToTarget2 <= 0) 
	 {
		 unidadIA.classList.add("engaged");
		 unidadJugadorCercana.classList.add("engaged");
	 }
	 else
	 {
		 unidadIA.classList.remove("engaged");
	 }
    if (distanceToTarget2 <= attackRange) {
        puedeatacar = true;
        console.log(`Unidad IA ataca a la unidad del jugador en (${playerQ}, ${playerR}, ${playerS})`);
        if(comprobarAtaque(unidadIA))
		{
			battle(unidadIA.getAttribute('data-name'), unidadJugadorCercana.getAttribute('data-name'));
		}
    }
		//Comprobar 2 espacios
	if (unidadIA.hasAttribute("data-doublespaceid") && nextStep) {
				const id = unidadIA.getAttribute("data-doublespaceid");
				const allUnits = document.querySelectorAll(`[data-doublespaceid="${id}"]`);
				allUnits.forEach(unit => {
					if (unit !== selectedUnit) {
						//previousstep.hex.appendChild(unit);
					}
				});
			}
	remainingMoves = remainingMoves - (path.length - 1);
}


function findClosestHex(element) {
    while (element && !element.classList.contains('hex')) {
        element = element.parentElement;
    }
    return element;
}
function comprobarAtaque(unidadIA) {
    let puedeatacar = false;
    var iaHex = findClosestHex(unidadIA);
    var iaQ = parseInt(iaHex.getAttribute('data-q'));
    var iaR = parseInt(iaHex.getAttribute('data-r'));
    var iaS = parseInt(iaHex.getAttribute('data-s'));
    var attackRange = parseInt(unidadIA.getAttribute('data-range'));
	var distance = 1000;
    document.querySelectorAll('.playerUnit').forEach(playerUnit => {
        var playerHex = playerUnit.closest('.hex');
        var playerQ = parseInt(playerHex.getAttribute('data-q'));
        var playerR = parseInt(playerHex.getAttribute('data-r'));
        var playerS = parseInt(playerHex.getAttribute('data-s'));

        let distance = Math.max( Math.abs(playerQ - iaQ), Math.abs(playerR - iaR), Math.abs(playerS - iaS) );
		
        if (distance <= attackRange) {
            puedeatacar = true;
          //  console.log(`Unidad IA ataca a la unidad del jugador en (${playerQ}, ${playerR}, ${playerS})`);
        }
    });

    if (!puedeatacar) {
       // console.log('La unidad IA no puede atacar a ninguna unidad del jugador.' + distance + " - " + attackRange);
    }

    return true;
}

// Function to duplicate an element with a new ID
function duplicateElement(element, index) {
    if (turn < 1) {
        const clone = element.cloneNode(true);
        const newId = element.id + duplicate; // Append a unique suffix for each duplicate
        clone.id = newId;
        clone.classList.add("duplicated");
        element.parentNode.appendChild(clone);
        duplicate += 1; // Increment duplicate counter
    }
}

function turnoIA() {
    current_dice = Math.floor(Math.random() * 20) + 1;
    remainingMoves = current_dice;
    var unidadesIA = document.querySelectorAll('.AIUnit');
    var seenIds = new Map();
    var uniqueUnits = [];
    unidadesIA.forEach(unit => {
        var doubleSpaceId = unit.getAttribute('data-doublespaceid');
        var unitId = unit.id;

        if (seenIds.has(doubleSpaceId)) {
            var existingUnit = seenIds.get(doubleSpaceId);
            if (unitId < existingUnit.id) {
                seenIds.set(doubleSpaceId, unit);
            }
        } else {
            seenIds.set(doubleSpaceId, unit);
        }
    });

    seenIds.forEach((unit, doubleSpaceId) => {
        uniqueUnits.push(unit);
    });
    
    selectedUnit = false;
    AITURN = true;
    alert(turn);

     if (turn === 0) {
    // Determine priority
    arraypriority = determinePriority(unidadesIA);
    alert("priority");

    // Count occurrences of each unit in the priority array
    const unitCounts = {};
    arraypriority.forEach(unidad => {
        unitCounts[unidad] = (unitCounts[unidad] || 0) + 1;
    });

    // Iterate over each unit type based on their count in arraypriority
    Object.keys(unitCounts).forEach(unidad => {
        const count = unitCounts[unidad];
        const unidades_turno = document.querySelector(`.AIUnit[data-name="${unidad}"]`); // Get only one element per unique unit

        if (unidades_turno) {
            // Generate the element's id
            const elementId = `${unidades_turno.getAttribute("data-name")}10M0`;
            const element = document.getElementById(elementId);
            
            if (element) {
                // First instance, just remove 'hidden' class
                element.classList.remove('hidden');

                // For additional instances, duplicate the element
                for (let i = 1; i < count; i++) {
                    duplicateElement(element, i);
                }
            }
        }
    });
}

    console.log("Content of arraypriority: ", arraypriority);

    if (turn > 0) {
        let unidad = arraypriority[turn - 1];
        console.log("TURNO DE " + unidad);
        const unidades_turno = document.querySelectorAll(`.AIUnit[data-name="${unidad}"]`);
		var toremove = duplicate - turn + 1
        unidades_turno.forEach((unidadIA) => {
            let x = turn;
            if (x == 4) { x = "X"; }
            const cardid = unidadIA.getAttribute("data-name") + "10M" + x;
            const cardid2 = unidadIA.getAttribute("data-name") + "10M0";
            document.getElementById(cardid)?.classList.remove("hidden");
			if (document.getElementById(cardid2)?.classList.contains("hidden")) {
				var number = cardid2 + (toremove - 1).toString();
				console.log("REMOVE" + number);

				const parentElement = document.getElementById(cardid).parentElement;
				const elementToRemove = parentElement.querySelector('.duplicated');

				if (elementToRemove) {
					console.log('Removing element:', elementToRemove);
					elementToRemove.remove();
				} else {
					console.log('No duplicated element found to remove.');
				}
			} else {
				document.getElementById(cardid2)?.classList.add("hidden");
			}

            hacerturno(unidadIA);
        });
    }

    selectedUnit = false;
    AITURN = false;  
    if (turn == 4) {
        const elements = document.querySelectorAll('.indicador');
        elements.forEach(element => {
            element.classList.add('hidden');
        });
        turn = 0;
        alert("new round");
    } else {
        turn = turn + 1;
        startgame();
    }
}


function hacerturno(unidadIA)
{
		let unidadJugadorCercana = choosePlayerUnit(unidadIA);
		console.log("Mover " + unidadIA.getAttribute('id') + " hacia " + unidadJugadorCercana.id);
		moverUnidadIA(unidadIA, unidadJugadorCercana);
}

function choosePlayerUnit(unidadIA) {
    const probability = Math.random();
    let unidadJugadorCercana;

    // Adjust this threshold to balance how often the AI picks each option
    const threshold = 0.7; // 70% chance to choose the suitable unit

    const distanceToClosest = distanceToClosestPlayerUnit(unidadIA);
    const attackRange = parseInt(unidadIA.getAttribute('data-range'));

	if (probability < threshold) {
		unidadJugadorCercana = findSuitablePlayerUnit(unidadIA);
	} else {
		unidadJugadorCercana = findClosestPlayerUnit(unidadIA);
	}

    return unidadJugadorCercana;
}
	
function findAdvancedPosition(unidadIA) {
    const iaHex = findClosestHex(unidadIA);
    const iaQ = parseInt(iaHex.getAttribute('data-q'));
    const iaR = parseInt(iaHex.getAttribute('data-r'));
    const iaS = parseInt(iaHex.getAttribute('data-s'));

    let bestPosition = null;
    let bestScore = -Infinity;

    document.querySelectorAll('.hex').forEach(hex => {
        const hexQ = parseInt(hex.getAttribute('data-q'));
        const hexR = parseInt(hex.getAttribute('data-r'));
        const hexS = parseInt(hex.getAttribute('data-s'));

        const path = findShortestPath(iaQ, iaR, iaS, hexQ, hexR, hexS);
        const moveRange = parseInt(unidadIA.getAttribute('data-move'));
        const attackRange = parseInt(unidadIA.getAttribute('data-range'));

        // Check if the position is reachable
        if (path.length <= moveRange) {
            let score = 0;

            // Check for advantageous height
            const height = parseInt(hex.getAttribute('data-height'));
            if (height > parseInt(iaHex.getAttribute('data-height'))) {
                score += 5;
            }

            // Check for attack opportunities
            document.querySelectorAll('.playerUnit').forEach(playerUnit => {
                const playerHex = findClosestHex(playerUnit);
                const playerQ = parseInt(playerHex.getAttribute('data-q'));
                const playerR = parseInt(playerHex.getAttribute('data-r'));
                const playerS = parseInt(playerHex.getAttribute('data-s'));

                const distanceToPlayer = getDistance(hexQ, hexR, hexS, playerQ, playerR, playerS);
                if (distanceToPlayer <= attackRange) {
                    score += 10;
                }
            });

            // Calculate distance to the closest player unit
            const closestPlayerUnit = findClosestPlayerUnit(unidadIA);
            const playerHex = findClosestHex(closestPlayerUnit);
            const playerQ = parseInt(playerHex.getAttribute('data-q'));
            const playerR = parseInt(playerHex.getAttribute('data-r'));
            const playerS = parseInt(playerHex.getAttribute('data-s'));

            const distanceToTarget = getDistance(hexQ, hexR, hexS, playerQ, playerR, playerS);
            score -= distanceToTarget; // Closer positions get higher score

            if (score > bestScore) {
                bestScore = score;
                bestPosition = hex;
            }
        }
    });

    return bestPosition;
}
