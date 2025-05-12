function determinePriority(unidadesIA) {
    let priorityArray = [];
    let uniqueNames = new Set();

    let size = unidadesIA.length;
    for (let looper = 0; looper < size; looper++) {
        let unidad = unidadesIA[looper];
        let priority = 0;

        // Extract data from HTML attributes
        let name = unidad.getAttribute('data-name');
        let rarity = unidad.getAttribute('data-uniqueness');
        let type = unidad.getAttribute('data-squad-hero');
        let engaged = unidad.classList.contains('engaged');
        let life = parseInt(unidad.getAttribute('data-life'));
        let figures = document.querySelectorAll(`.AIUnit[data-name='${name}']`).length;
        let defaultFigures = unidad.getAttribute('data-figures');
        let points = parseInt(unidad.getAttribute('data-standard-cost'));
		let range = parseInt(unidad.getAttribute('data-range'));
		let IGPV  = parseInt(unidad.getAttribute('data-IGPV'));
		let distance = distanceToClosestPlayerUnit(unidad);
		if(distance <= range)
		{
			engaged = true;
		}
        // Determine priority based on extracted data
        if (name === "Major Q9") priority += 4;
        if (rarity === "Common" && type === "Squad") {
            if (figures > 2 * defaultFigures) {
                priority += 10;
            } else if (figures > defaultFigures) {
                priority += 4;
            }
        }
        if (rarity !== "Common" && type === "Hero") {
            if (life >= 4 && life === 1) {
                priority += (name === "Krug" || name === "Hulk") ? -1 : -3;
            } else if (life >= 4 && life === 2) {
                priority += (name === "Krug" || name === "Hulk") ? -1 : -2;
            } else if (life === 3 && life === 1) {
                priority += -3;
            }
        }
        if (type === "Squad") {
            if (defaultFigures === 4) {
                if (figures === 2) {
                    priority += -2;
                } else if (figures <= 1) {
                    priority += -3;
                }
            } else if (defaultFigures === 3 && figures <= 1) {
                priority += -3;
            }
        }
		if(range > 1)
		{
			if(distance <= range){priority += 5;}
			else if(distance == 0){priority -= 5;}
		}
		else
		{
			if(distance <= range){priority += 5;}
			else if(distance == 0){priority -= 5;}
		}
		if (engaged){ priority += 5;}else{priority -= 5;}
        if (points <= 35) priority += -2;
        if (rarity === "Common" && type === "Hero") priority += -1;
        if (engaged && name === "Deathreavers") priority += -20;
		let randomFactor = Math.random() * 2 - 1; // Random value between -1 and 1
        priority += randomFactor;
		if(priority > IGPV){priority += 1;}
		else{priority -= 1;}
		unidad.setAttribute('data-IGPV',priority)
        if (!uniqueNames.has(name)) {
            uniqueNames.add(name);
            priorityArray.push({ name, priority, unidad });
        }
    }

    // Sort by priority in descending order
    priorityArray.sort((a, b) => b.priority - a.priority);

    // Create modifiedPriorityArray with repetitions based on priority gaps
    const modifiedPriorityArray = [];
    const highestPriority = priorityArray[0]?.priority || 0;

    priorityArray.forEach(item => {
        const { name, priority } = item;
        // If priority is close to the highest, add the unit multiple times
        if (priority >= highestPriority * 0.8) {
            modifiedPriorityArray.push(name, name); // Add twice if close to the top priority
        } else {
            modifiedPriorityArray.push(name);
        }
    });

    // If fewer than 3 units, repeat highest-priority units to fill
    while (modifiedPriorityArray.length < 3) {
        modifiedPriorityArray.push(modifiedPriorityArray[0]);
    }

    return modifiedPriorityArray.slice(0, 3); // Limit to 3 entries
}


function isEngaged(unidad) {
    return false;
  }
function checkForBonding(army) {
    let size = army.length;
    for (let looper = 0; looper < size; looper++) {
        let unidad = army[looper];
        // Extract data from HTML attributes
        let name = unidad.getAttribute('data-name');
        let rarity = unidad.getAttribute('data-uniqueness');
        let type = unidad.getAttribute('data-squad-hero');
        let engaged = unidad.classList.contains('engaged');
        let life = parseInt(unidad.getAttribute('data-currentlife'));
        let figures = document.querySelectorAll(`.AIUnit[data-name='${name}']`).length;
        let defaultFigures = unidad.getAttribute('data-figures');
        let points = parseInt(unidad.getAttribute('data-standard-cost'));

        if (type === "hero") {
            if (life > 1) {
                if (name === "KatoKatsuro") {
                    katoKatsurosCommand(army);
                } else if (name === "Ulginesh") {
                    mindLink(army);
                } else if (name === "Kurrok") {
                    masterOfTheElements(army);
                } else if (name === "RedSkull") {
                    masterManipulator(army);
                } else if (name === "MarroHive") {
                    hiveMind(army);
                }
            }
        } else {
            if (figures > 1) {
                if (name === "MinionsOfUtgar") {
                    utgarsOrders(army);
                } else if (name === "Axegrinders") {
                    dwarvenStrategicBonding(army);
                } else if (name === "CapuanGladiators") {
                    humanGladiatorHeroBonding(army);
                } else if (name === "HeavyGruts") {
                    orcChampionBonding(army);
                } else if (name === "WolvesOfBadru") {
                    darklordBonding(army);
                } else if (name === "MacdirkWarriors") {
                    humanChampionBonding(army);
                } else if (name === "ArrowGruts") {
                    beastBonding(army);
                } else if (name === "BladeGruts") {
                    orcChampionBonding(army);
                } else if (name === "RomanLegionnaires") {
                    warlordBonding(army);
                } else if (name === "MarrdenNagrubs") {
                    hivelordLifeBonding(army);
                } else if (name === "FyorlagSpiders") {
                    predatorBonding(army);
                } else if (name === "KnightsOfWeston") {
                    humanChampionBonding(army);
                } else if (name === "ArmocVipers") {
                    ullarWarlordBonding(army);
                } else if (name === "SacredBand") {
                    einarWarlordBonding(army);
                } else if (name === "GreenscaleWarriors") {
                    lizardKingBonding(army);
                } else if (name === "DeathChasers") {
                    taskmasterBonding(army);
                } else if (name === "GrokRiders") {
                    marroWarlordBonding(army);
                }
            }

            if (name === "DeathKnights") {
                unholyBonding(army);
            }
        }
    }
}
//Bonding fucntions:
function katoKatsurosCommand(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        if( unidad.getAttribute('data-class') == "samurai" ||  unidad.getAttribute('data-class') == "ashigaru" )
		{
			hacerturno(unidad);
		}
    }
}

function mindLink(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function masterOfTheElements(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function masterManipulator(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function hiveMind(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function utgarsOrders(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function dwarvenStrategicBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function humanGladiatorHeroBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function orcChampionBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function darklordBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function humanChampionBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function beastBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function warlordBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function hivelordLifeBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function predatorBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function ullarWarlordBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function einarWarlordBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        if (unidad.getAttribute('data-general') == 'einar' && unidad.getAttribute('data-class') == 'warlord') {
            // Add your logic here
        }
    }
}

function lizardKingBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function taskmasterBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function marroWarlordBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function unholyBonding(army) {
    for (let looper = 0; looper < army.length; looper++) {
        let unidad = army[looper];
        // Add your logic here
    }
}

function placeOM1(army) {
    if (!specialRuleOrnak(army)) {
        let place = getRandomPlace();
        let fig = army[place];
        while (!fig.canGetOMs()) {
            place = getRandomPlace();
            fig = army[place];
        }
        fig.giveOM(1);
    }
}

function placeOM2(army) {
    let allMostlyDead = true;
    for (let figure of army) {
        if (!figure.isMostlyDead()) {
            allMostlyDead = false;
            break;
        }
    }

    let place = getRandomPlace();
    let fig = army[place];

    if (!allMostlyDead && Math.random() < 0.4) {
        while (fig.isMostlyDead()) {
            place = getRandomPlace();
            fig = army[place];
        }
    }

    fig.giveOM(2);
}

function placeOM3(army) {
    let allMostlyDead = true;
    for (let figure of army) {
        if (!figure.isMostlyDead()) {
            allMostlyDead = false;
            break;
        }
    }

    let place = getRandomPlace();
    let fig = army[place];

    if (!allMostlyDead && Math.random() < 0.7) {
        while (fig.isMostlyDead()) {
            place = getRandomPlace();
            fig = army[place];
        }
    }

    fig.giveOM(3);
}

function placeOMX(army) {
    if (!specialRuleXOM(army)) {
        let place = getRandomPlace();
        let fig = army[place];

        if (army.length > 1 && Math.random() < 0.5) {
            while (fig.hasOM3()) {
                place = getRandomPlace();
                fig = army[place];
            }
        }

        fig.giveOM(4);
    }
}


// Assuming getRandomPlace, specialRuleOrnak, specialRuleXOM, and Figure methods are defined elsewhere
function getRandomPlace(pScale) {
    const x = Math.floor(pScale.length * Math.random());
    const y = pScale[x];
    return y;
}

function specialRuleOrnak(army) {
    let utgarHeroes = 0;
    let ornakInArmy = false;
    let ornak = null;
	document.querySelectorAll(`.AIUnit[data-name="${unidad}"]`);
    army.forEach(fig => {
        if (fig.dataset.general === "utgar" && 
            fig.dataset.uniqueness !== "common" && 
            fig.dataset.squadHero === "hero" && 
            fig.dataset.name !== "ornak") {
            utgarHeroes++;
        }

        if (fig.dataset.name("Ornak")) {
            ornakInArmy = true;
            ornak = fig;
        }
    });

    if (utgarHeroes >= 2 && ornakInArmy) {
        ornak.giveOM(1);
        return true;
    }

    return false;
}
function specialRuleXOM(army) {
    let siegeNeedsXOM = false;
    let evarNeedsXOM = false;
    let mogrimmNeedsXOM = false;

    let siege = null;
    let evar = null;
    let mogrimm = null;

    let count = 0;

    army.forEach(fig => {
        if (fig.classList.contains("Mogrimm")) {
            if (!fig.hasOM1() && !fig.hasOM2() && !fig.hasOM3()) {
                mogrimmNeedsXOM = true;
                mogrimm = fig;
                count++;
            }
        } else if (fig.classList.contains("Siege")) {
            if (fig.hasOM1() || fig.hasOM2() || fig.hasOM3()) {
                siegeNeedsXOM = true;
                siege = fig;
                count++;
            }
        } else if (fig.classList.contains("EvarScarcarver") && 
                   (fig.hasOM1() || fig.hasOM2() || fig.hasOM3())) {
            evarNeedsXOM = true;
            evar = fig;
            count++;
        }
    });

    if (count > 0) {
        let place = 0;
        const figs = new Array(count);

        if (siegeNeedsXOM) {
            figs[place] = siege;
            place++;
        }

        if (evarNeedsXOM) {
            figs[place] = evar;
            place++;
        }

        if (mogrimmNeedsXOM) {
            figs[place] = mogrimm;
            place++;
        }

        const random = Math.floor(count * Math.random());
        figs[random].giveOM(4);
        if (!figs[random].classList.contains("Mogrimm")) {
            figs[random].revealOMX();
        }
        return true;
    }

    return false;
}
