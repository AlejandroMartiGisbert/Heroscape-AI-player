var player = 0;
var canbeselected = true;
var gamestart = false;
var appState = 'Idle';
var clickedunit=false;
var unitX = 0;
var unitY = 0;
var unitQ = 0;
var unitR = 0;
var unitS = 0;
var gameunits = 0;
var doublespacedid = 0;
var doublespacepart = true;
var AITURN=false;
var unithasbeenselected=false;
var turn = 1;
var clickCount =0;
const map = "[0,0,1,1],[0,1,1,1],[1,1,1,1,1,0],[1,1,1,1,0],[1,1,1,0,0],[0,0,1,1,],[0,0,1,1,]";
const modal = document.querySelector('#modal1');
const modal2 = document.querySelector('#modal2');
const selectAllhexes = document.getElementById('selectAllhexes');
const generatorbutton = document.getElementById('generatorbutton');
const generateHexGridbutton = document.getElementById('generateHexGrid');
const startgamebutton = document.getElementById('startgame');
const playerfront = document.getElementById('playerfront');
const playerback = document.getElementById('playerback');
const iafront = document.getElementById('iafront');
const iaback = document.getElementById('iaback');
const iacard = document.getElementById('iacard');
const playercard = document.getElementById('playercard');
const modal__paragraph = document.getElementById('modal__paragraph');
const modal__title = document.getElementById('modal__title');
const closeModal = document.querySelector('.modal__close');
const UnitLife = document.getElementById('UnitLife');
const UnitMove = document.getElementById('UnitMove');
const UnitRange = document.getElementById('UnitRange');
const UnitAttack = document.getElementById('UnitAttack');
const UnitDefense = document.getElementById('UnitDefense');
const UnitStatsColumn = document.getElementById('UnitStatsColumn');
const generatorButton = document.getElementById('generatorbutton');
const regenerateButton = document.querySelector('button[onclick="regenerateHexGrid()"]');
const saveButton = document.querySelector('button[onclick="saveContent()"]');
const terraintype = document.getElementById('terraintype');
const terrainheight = document.getElementById('terrainheight');
const terraineditor = document.getElementById('terraineditor');
const modal_versus = document.getElementById('modal_versus');
const modal_dice = document.getElementById('modal_dice');
let unitdata = [];

// Load the JSON data
fetch('spreadsheet.json')
    .then(response => response.json())
    .then(data => {
		unitdata = data.values.slice(1).map(unit => ({
			name: unit[0],
			standardCost: unit[1],
			deltaClassicCost: unit[2],
			deltaClassicUpdated: unit[3],
			deltaVCCost: unit[4],
			deltaVCUpdated: unit[5],
			figures: unit[6],
			hexes: unit[7],
			uniqueness: unit[8],
			squadHero: unit[9],
			vcMarvelAoA: unit[10],
			homeworld: unit[11],
			species: unit[12],
			class: unit[13],
			personality: unit[14],
			power1Name: unit[15],
			power1Text: unit[16],
			power2Name: unit[17],
			power2Text: unit[18],
			power3Name: unit[19],
			power3Text: unit[20],
			power4Name: unit[21],
			power4Text: unit[22],
			life: unit[23],
			move: unit[24],
			range: unit[25],
			attack: unit[26],
			defense: unit[27],
			image: unit[28],
			general: unit[29],
			size: unit[30],
			height: unit[31],
			hSersLink: unit[32],
			oEAOPowerRanking: unit[33],
			dokPowerRanking: unit[34],
			set: unit[35],
			setReleaseDate: unit[36]
		}));


        const select = document.getElementById('armyselectorhuman');
        unitdata.forEach(unit => {
			if(unit.vcMarvelAoA== "")
			{
				const option = document.createElement('option');
				option.value = unit.name;
				option.textContent = capitalizeFirstLetter(unit.name);
				select.appendChild(option);
			}
        });

        const select2 = document.getElementById('armyselectorAI');
        unitdata.forEach(unit => {
		if(unit.vcMarvelAoA == "")
		{
			const option = document.createElement('option');
			option.value = unit.name;
			option.textContent = capitalizeFirstLetter(unit.name);
			select2.appendChild(option);
		}
        });

        $('.selector').selectize({
            sortField: 'text'
        });
        $('.selector2').selectize({
            sortField: 'text'
        });
    })
    .catch(error => console.error('Error loading JSON data:', error));


const hexBoard = {
    '1': ['2', '4', '5', '', '', ''],
    '2': ['1', '5', '6', '', '', ''],
    '3': ['4', '8', '9', '', '', ''],
    '4': ['1', '3', '5', '9', '10', ''],
    '5': ['1', '2', '4', '6', '10', '11'],
    '6': ['2', '5', '11', '', '', ''],
};

let armyexample = [
  {
    name: "MajorQ9",
    changePriority: function(p) { this.priority += p; },
    isEngaged: function() { return false; },
    getRarety: function() { return "unique"; },
    getType: function() { return "hero"; },
    getNoOfFigs: function() { return 1; },
    getDefaultNoOfFigs: function() { return 1; },
    getLife: function() { return 5; },
    getLifeRemaining: function() { return 5; },
    getPoints: function() { return 180; },
    getPriority: function() { return this.priority; },
    priority: 0
  },
  {
    name: "Deathreaver",
    changePriority: function(p) { this.priority += p; },
    isEngaged: function() { return true; },
    getRarety: function() { return "common"; },
    getType: function() { return "squad"; },
    getNoOfFigs: function() { return 4; },
    getDefaultNoOfFigs: function() { return 4; },
    getLife: function() { return 1; },
    getLifeRemaining: function() { return 1; },
    getPoints: function() { return 30; },
    getPriority: function() { return this.priority; },
    priority: 0
  }
];
const hexGrid = {};
var number = 0;

function generateHexGrid() {
    appState = 'generation';
	generateHexGridbutton.disabled = false;
	regenerateHexGrid.disabled = false;
	selectAllhexes.disabled = false;
	regenerateButton.disabled = false;
    const number = parseInt(document.getElementById('inputNumber').value);
    const container = document.getElementById('inicial');
    container.innerHTML = ''; // Clear previous content

    let hexId = 1;
    const hexGrid = {};

    // Generate the hex grid using cube coordinates
    for (let q = -number; q <= number; q++) {
        for (let r = Math.max(-number, -q - number); r <= Math.min(number, -q + number); r++) {
            const s = -q - r;
            const id = `hex-${hexId}`;
            hexGrid[hexId] = { id, q, r, s };
            hexId++;
        }
    }

    // Generate the grid with coordinates
    hexId = 1; // Reset hexId for generating the HTML

    for (let q = -number; q <= number; q++) {
        for (let r = Math.max(-number, -q - number); r <= Math.min(number, -q + number); r++) {
            const s = -q - r;
            const id = `hex-${hexId}`;
            const hex = hexGrid[hexId];
            container.innerHTML += `<div class="hex canhover" id="${id}" data-q="${hex.q}" data-r="${hex.r}" data-s="${hex.s}" onclick="toggleHex(${hexId})"></div>`;
            hexId++;
        }
        container.innerHTML += '<br>';
    }

    return hexGrid; // Return the hexGrid for further use
}
function generateStaggeredGrid() {
    appState = 'generation';
    generateHexGridbutton.disabled = false;
    regenerateHexGrid.disabled = false;
    selectAllhexes.disabled = false;
    regenerateButton.disabled = false;

    const number = parseInt(document.getElementById('inputNumber').value);
    const container = document.getElementById('inicial');
    container.innerHTML = ''; // Clear previous content

    let hexId = 1;
    const hexGrid = {};

    // Step 1: Generate the hex grid coordinates using cube coordinates (from generateHexGrid)
    for (let q = -number; q <= number; q++) {
        for (let r = Math.max(-number, -q - number); r <= Math.min(number, -q + number); r++) {
            const s = -q - r;
            const id = `hex-${hexId}`;
            hexGrid[hexId] = { id, q, r, s };
            hexId++;
        }
    }

    // Step 2: Generate the staggered grid layout while using the coordinates from hexGrid
    hexId = 1; // Reset hexId for generating the HTML
    
    for (let row = 0; row < number; row++) {
        for (let col = 0; col < number; col++) {
            const q = row;
            const r = col;
            const s = -row - col;
            const id = `hex-${hexId}`;
            const hex = `<div class="hex canhover ground" id="${id}" data-q="${q}" data-r="${r}" data-s="${s}" onclick="toggleHex(${hexId})"></div>`;
            if (row % 2 === 0 || col !== 0) {
                container.innerHTML += hex;
                hexId++;
            }
        }
        container.innerHTML += '<br>';
    }
    
    return hexGrid; // Return the hexGrid for further use or debugging
}




function toggleHex(id) {
    const hex = document.getElementById(`hex-${id}`);
    hex.classList.toggle('selected');
}




function regenerateHexGrid() {
	startgamebutton.disabled = false;
	saveButton.disabled = false;
	terraineditor.disabled = false;
    appState = 'regeneration';
    const container = document.getElementById('inicial');
    const hexes = container.querySelectorAll('.hex');

    // Iterate through all hex elements
    hexes.forEach(hex => {
        if (hex.classList.contains('selected')) {
            // Remove the 'selected' class from selected hexes
            hex.classList.remove('selected');
            hex.classList.add('ground');
            hex.setAttribute('data-height', '1');
            hex.classList.add('grass');
			hex.setAttribute('data-type', 'grass');
			
        } else {
            // Replace 'hex' class with 'spacer' class for unselected hexes
            hex.classList.replace('hex', 'spacer');
        }
    });
}

function calculateNeighbors(q, r) {
    const directions = [{
            dq: 1,
            dr: 0
        },
        {
            dq: 1,
            dr: -1
        },
        {
            dq: 0,
            dr: -1
        },
        {
            dq: -1,
            dr: 0
        },
        {
            dq: -1,
            dr: 1
        },
        {
            dq: 0,
            dr: 1
        }
    ];

    const neighbors = directions.map(direction => {
        return {
            q: q + direction.dq,
            r: r + direction.dr
        };
    });

    return neighbors;
}


function getHexId(row, col) {
    // Implement logic to get hex ID based on row and col
    // This is a placeholder and needs to be adjusted based on your grid structure
    return `hex-${row}-${col}`;
}

function toggleHex(id) {
    if (canbeselected) {
        if (!gamestart) {
            const hex = document.getElementById(`hex-${id}`);
            hex.classList.toggle('selected');
        }

    }
}
function selectAll()
{
	 const hexes = document.querySelectorAll('.hex');
    hexes.forEach(hex => {
		hex.classList.add("selected");
	})
}

function editTerrain() {
    appState = 'terrain';
    // Get the buttons
    
    terraintype.disabled = !terraintype.disabled;
    terrainheight.disabled = !terrainheight.disabled;
    // Toggle the disabled state of the buttons
    // Change the onclick function for all elements with the class 'hex'
    const hexes = document.querySelectorAll('.hex');
    hexes.forEach(hex => {
		if (checkHex(hex))
		{
				const currentOnClick = hex.getAttribute('onclick');
				if (currentOnClick.includes('toggleHex')) {
					hex.setAttribute('onclick', currentOnClick.replace('toggleHex', 'changeTerrain'));
				} else {
					hex.setAttribute('onclick', currentOnClick.replace('changeTerrain', 'toggleHex'));
				}
		}
	});
}

function changeTerrain(id) {
    const hex = document.getElementById(`hex-${id}`);
    var clase = document.getElementById(`terraintype`).value;
    var height = document.getElementById(`terrainheight`).value;
	if(clase == "water")
		{
			height = 0;
		}
    height2 = height;
    hex.className = '';
    hex.classList.add('hex');
    hex.classList.add('ground');
    hex.classList.add(clase);
	 height2 = "h" + height;
	  hex.classList.add(height2);
    if (height == 1) {
        hex.classList.remove('h1');
        hex.classList.remove('h2');
        hex.classList.remove('h3');
        hex.classList.remove('h4');
        hex.classList.remove('h5');
        hex.innerHTML = '';
        hex.setAttribute('data-height', '1');
		hex.setAttribute('data-type', clase);
		 hex.classList.add("canhover");
    } else {
		
		hex.setAttribute('data-type', clase);
        hex.setAttribute('data-height', height);
        addBordersingle(hex, height, clase);
    }
    hex.classList.add('ground');
    checkAllBorders(); // Call checkAllBorders after changing the terrain
}



function checkBorders(id, height) {
    const hex = document.getElementById(`hex-${id}`);
    const q = parseInt(hex.getAttribute('data-q'));
    const r = parseInt(hex.getAttribute('data-r'));
    const s = parseInt(hex.getAttribute('data-s'));
    const neighbors = getHexNeighbors(q, r, s);
    neighbors.forEach((neighbor, index) => {
        const neighborHex = document.querySelector(`[data-q="${neighbor.q}"][data-r="${neighbor.r}"][data-s="${neighbor.s}"]`);
        if (neighborHex) {
            const neighborHeight = parseInt(neighborHex.getAttribute('data-height'));
            let borderImg = hex.querySelector(`img[data-border-id="${id}-${index}"]`);

            if (!borderImg) {
                borderImg = createBorderImg(id, index);
                hex.appendChild(borderImg);
            }

            if (neighborHeight < height) {
                borderImg.style.display = 'block';
            } else {
                borderImg.style.display = 'none';
            }
        }
    });
}

function createBorderImg(id, index) {
    const borderImg = document.createElement('img');
    borderImg.src = 'assets/sprites/hex5.png';
    borderImg.style.position = 'absolute';
    borderImg.style.top = '50%';
    borderImg.style.left = '50%';
    borderImg.style.transform = `translate(-50%, -50%) rotate(${getRotation(index)}deg)`;
    borderImg.style.width = '5vw';
    borderImg.style.zIndex = '1';
    borderImg.setAttribute('data-border-id', `${id}-${index}`);
	borderImg.style.pointerEvents = 'none';
    return borderImg;
}

function getRotation(index) {
    const rotations = [300, 240, 180, 120, 60, 0]; // Adjust these values as needed
    return rotations[index];
}


function checkAllBorders() {
    const hexagons = document.querySelectorAll('.hex');
    hexagons.forEach(hex => {
        const id = hex.id.split('-')[1];
        const height = parseInt(hex.getAttribute('data-height'));
        checkBorders(id, height);
    });
}



function addBordersingle(hex, height, clase) {
    height2 = "h" + height;
  //  hex.classList.add('inferior');
    const newDiv = document.createElement('div');
    const hclass = 'hex2';
    hex.innerHTML = '';
    newDiv.className = 'grass border';
    newDiv.classList.add(hclass);
    newDiv.classList.add(height2);
    newDiv.classList.add(clase);
    hex.classList.remove('ground');
    newDiv.classList.add('ground');
	hex.setAttribute('data-type', clase);
	hex.classList.add('canhover');
	// Create the shadow element
	
	const shadow = document.createElement('img');

	// Set the attributes for the shadow element
	shadow.src = 'assets/sprites/hex-background.png';
	shadow.style.position = 'absolute';
	shadow.style.top = '50%';
	shadow.style.left = '50%';
	shadow.style.transform = 'translate(-50%, -50%)';
	shadow.style.width = '5vw';
	shadow.style.zIndex = '1';
	shadow.style.pointerEvents = 'none';

// Append

	// Append the shadow element to the hex element
	//hex.appendChild(newDiv);
	//hex.appendChild(shadow);
}

function openNav() {
	const hexes = document.querySelectorAll('.hex');
    hexes.forEach(hex => {
		if (checkHex(hex))
		{
			hex.classList.remove('selected');
			const currentOnClick = hex.getAttribute('onclick');
			if (currentOnClick.includes('changeTerrain')) {
				hex.setAttribute('onclick', currentOnClick.replace('changeTerrain', 'toggleHex'));
			}
		}
	});
	 const hexElements = document.querySelectorAll('.hex');
    // Iterate over each element and remove the 'selected' class
    hexElements.forEach(element => {
       

		//element.classList.remove('canhover');
		//element.removeAttribute('onclick');
    });
    document.getElementById("menus").style.display = "none";
    document.getElementById("mySidebar").style.width = "17vw";
	 document.getElementById("gamemenus").style.display = "block";
	
    document.getElementById("sidebarplayer2").style.width = "17vw";
}

function closeNav() {
    document.getElementById("menus").style.display = "block";
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("sidebarplayer2").style.width = "0";
	//document.getElementById("sidebarplayer2").style.border = "0px solid transparent";
	//document.getElementById("mySidebar").style.border = "0px solid transparent";
}

function menushow(id) {
    const object = document.getElementById(id);
    if (object.style.display = "block") {
        object.style.display = "block";
    } else {
        object.style.display = "none";
    }
    if (id == 'armyselectorAI') {
        player = 1;
        // Select all elements with the class 'hex'
        const hexElements = document.querySelectorAll('.ground');

        // Iterate over each element and remove the 'selected' class
        hexElements.forEach(element => {
            element.classList.remove('selected');
        });
        // Add the event listener to each element
        hexElements.forEach(element => {
            element.addEventListener('click', handleClick);
        });
    }
    if (id == 'armyselectorhuman') {
	object.parentElement.classList.remove('hidden');
        player = 0;
        // Select all elements with the class 'hex'
        const hexElements = document.querySelectorAll('.ground');

        // Iterate over each element and remove the 'selected' class
        hexElements.forEach(element => {
            element.classList.remove('selected');
        });
        // Add the event listener to each element
        hexElements.forEach(element => {
            element.addEventListener('click', handleClick);
        });
    }


document.addEventListener('click', function(event) {
    // Check if the clicked element has the class 'path'
  if (event.target.classList.contains('path') || (event.target.parentElement && event.target.parentElement.classList.contains('path'))) {
    // Move the parent of the selected unit to be a child of the clicked element
    const selectedUnit = document.querySelector('.playerUnit.selected');
    if (selectedUnit && !AITURN && unithasbeenselected)  {
        // Check if height > 1
        if (selectedUnit.getAttribute('data-height') > 1) {
            // If true, append to the first child of the clicked element
            if (event.target.firstChild) {
                event.target.appendChild(selectedUnit);
            } else {
                event.target.appendChild(selectedUnit);
            }
			document.querySelectorAll('.playerUnit.selected').forEach(selectedUnit => {
            selectedUnit.classList.remove('selected');
        });
			if (selectedUnit.hasAttribute("data-doublespaceid")) {
				const id = selectedUnit.getAttribute("data-doublespaceid");
				const allUnits = document.querySelectorAll(`[data-doublespaceid="${id}"]`);
				
				allUnits.forEach(unit => {
					if (unit !== selectedUnit) {
						var apthend = document.getElementById("pathend2");
						if(apthend)
						{
							apthend.appendChild(unit);
							apthend.classList.remove("short-path");
						}
					}
				});
			}
			document.querySelectorAll('.short-path').forEach(hex => {
				hex.remove();
				hex.innerHTML = '';
			});
			console.log('highheigh');
        } else {
		console.log('noheight');
            // If not, append directly to the clicked element
            event.target.appendChild(selectedUnit);
        }
    }
} else {
	console.log('nopath');
	 document.querySelectorAll('.hex').forEach(element => {
        element.classList.remove('selected');
    });
        // Remove the class 'path' from all elements that have it
        document.querySelectorAll('.hex.path').forEach(hex => {
            hex.classList.remove('path');
			
        });
		document.querySelectorAll('.hex').forEach(hex => {
				hex.classList.remove('darken');
			});
		document.querySelectorAll('.pathfinding').forEach(hex => {
			hex.remove();
        });
		unithasbeenselected=false;
    }
}, true);

}
document.addEventListener('mouseover', function(event) {  
	const selectedUnit = document.querySelector('.playerUnit.selected');
	if (event.target.classList.contains('hex')) 
	{
		if (selectedUnit && !AITURN && unithasbeenselected) 
		{
			//console.log("finding path");
			const parentHex = selectedUnit.closest('.hex');
			const startQ = parseInt(parentHex.getAttribute('data-q'));
			const startR = parseInt(parentHex.getAttribute('data-r'));
			const startS = parseInt(parentHex.getAttribute('data-s'));
			
			unitQ=startQ;
			unitR=startR;
			unitS=startS;
			// Get the target coordinates
			const targetQ = parseInt(event.target.getAttribute('data-q'));
			const targetR = parseInt(event.target.getAttribute('data-r'));
			const targetS = parseInt(event.target.getAttribute('data-s'));
			// Find the shortest path
		  const shortestPath =  findShortestPath(startQ, startR, startS, targetQ, targetR, targetS)

			// Append image to each hex in the path
			document.querySelectorAll('.short-path').forEach(path => {
				path.style.display = 'none';
				path.removeAttribute('id');
			});
			shortestPath.forEach((step, index) => {
			 const { hex, direction } = step;
			const img = document.createElement('img');
			const imageContainer = document.createElement('div');
				if (index === shortestPath.length - 1 && index != 0) {
					imageContainer.classList.add('image-container');
					imageContainer.classList.add('short-path');
					imageContainer.id = 'pathend1';
					img.src = 'assets/sprites/destination.png';
					imageContainer.appendChild(img);
					img.classList.add('pathfinding');
					hex.appendChild(imageContainer);
				}
				else if (index === shortestPath.length - 2 && index != 0 && selectedUnit.hasAttribute("data-doublespaceid"))
				{
					imageContainer.classList.add('image-container');
					imageContainer.classList.add('short-path');
					img.src = 'assets/sprites/destination.png';
					imageContainer.id = 'pathend2';
					imageContainer.appendChild(img);
					img.classList.add('pathfinding');
					hex.appendChild(imageContainer);
				}
				else if (index == 0)
				{
					return;
				}
				else
				{
					 if (direction !== null) {
						const imageContainer = document.createElement('div');
						imageContainer.classList.add('image-container', 'short-path');
						const img = document.createElement('img');
						img.src = 'assets/sprites/arrow.png';
						img.classList.add('pathfinding');
						img.style.transform = `rotate(${direction}deg)`;
						imageContainer.appendChild(img);
						hex.appendChild(imageContainer);
					}
				}
				hex.style.display = '';
			});
		}
		else
		{
			//console.log("VARIABLES:");
			//console.log(selectedUnit);
			//console.log(AITURN);
			//console.log(unithasbeenselected);
		}
	}
	else if(event.target.classList.contains('hex'))
	{
	}
}, true);
function playerTurnEnd()
{
	
    const sidebar = document.getElementById('mySidebar');
	const sidebarplayer2 = document.getElementById('sidebarplayer2');
	AITURN = true;
	document.querySelectorAll('.hex.path').forEach(hex => {
		hex.classList.remove('path');
	});
	document.querySelectorAll('.image-container').forEach(container => {
		if (!container.hasChildNodes() || Array.from(container.children).some(child => child.classList.contains('pathfinding'))) {
			container.remove();
		}
	});
//	toggleLinks(sidebar,false);
	//toggleLinks(sidebarplayer2,true);
	//Now we edit stats
	//editstats()
	//We should have applied evrything that happened in the physical world
	//Now its the AI turn
}
function AIturn()
{
	//turn = turn +1;
	//Primer paso :Obtener unidades
	var AIunits = document.querySelector('.AIUnit');
	//Poner indicadores
	//Ver quien empieza
	//Si empieza AI, empezar con indicador(1)
	//paracada figura de indicador1 hacer:
	//findReachableHexes(startQ, startR, startS, maxDistance) 
	//
}
function toggleLinks(sidebar,enable) {
    const links = sidebar.querySelectorAll('a');

    links.forEach(link => {
        if (enable) {
            link.setAttribute('href', link.dataset.href);
        } else {
            link.setAttribute('data-href', link.getAttribute('href'));
            link.removeAttribute('href');
        }
    });
}
// Function to handle the click event
function handleClick(event) {
	const element = event.target;
	let elementId = element.id;
	let heightedhex = false;
	if (!elementId) {
		const parentElement = element.parentElement;
		elementId = parentElement ? parentElement.id : null;
		heightedhex = true;
	}
	else
	{
		heightedhex = false;
	}

    if (!gamestart) {
        canbeselected = false;
        // Check if the element has the class 'selected'
        if (element.classList.contains('selected') || element.parentElement.classList.contains('selected')) 
		{
            // Remove the 'selected' class
            // Create a div to hold the image
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('unit-container');
            imageDiv.classList.add('unit');
            // Create the image element
            const image = document.createElement('img');
            if (player == 0) {
                imageDiv.classList.add('playerUnit');
                image.src = 'assets/sprites/Jandar_Symbol.webp';
                image.alt = 'Jandar Symbol';
            } else {
                imageDiv.classList.add('AIUnit');
                image.src = 'assets/sprites/Einar_Symbol.webp';
                image.alt = 'Einar_Symbol';
            }
            image.classList.add('unit');
			imageDiv.id = "unit-" + gameunits;
			var namespan = document.createElement('span')
			namespan.classList.add("tooltip-text");
			if (player == 0) 
			{
				namespan.innerHTML = document.getElementById('armyselectorhuman').value;
			}
			else
			{
				namespan.innerHTML = document.getElementById('armyselectorAI').value;
			}
			imageDiv.appendChild(namespan);
			//Add unit values
			if (player == 0) 
			{
				const selectedUnitName = document.getElementById('armyselectorhuman').value;
				const selectedUnit = unitdata.find(unit => unit.name === selectedUnitName);
	
				if (selectedUnit) {
					for (const key in selectedUnit) {
						if (selectedUnit.hasOwnProperty(key)) {
							imageDiv.dataset[key] = selectedUnit[key];
							if (key === "life") {
								imageDiv.dataset["currentlife"] = selectedUnit[key];
							}
						}
					}
					if(selectedUnit.hexes == 2 && selectedUnit.figures == 1)
					{
						var doublespacedid = Math.floor(clickCount / 2);
						imageDiv.setAttribute('data-doublespaceid', doublespacedid)
						if(doublespacepart) {
							image.src = 'assets/sprites/Jandar_Symbol.webp';
							$('#armyselectorhuman')[0].selectize.disable();
							$('#armyselectorAI')[0].selectize.disable();
							$("#mySidebar :input, #mySidebar a").prop("disabled", true).addClass("disabled-link");
							$("#sidebarplayer2 :input, #sidebarplayer2 a").prop("disabled", true).addClass("disabled-link");
						}
						else
						{
							image.src = 'assets/sprites/Jandar3.png';
							$('#armyselectorhuman')[0].selectize.enable(); 
							$('#armyselectorAI')[0].selectize.enable(); 
							$("#mySidebar :input, #mySidebar a").prop("disabled", false).removeClass("disabled-link");
							$("#sidebarplayer2 :input, #sidebarplayer2 a").prop("disabled", false).removeClass("disabled-link");
						}
						doublespacepart = !doublespacepart
						clickCount++;
					}
				}
			}
			else
			{
				const selectedUnitName = document.getElementById('armyselectorAI').value;
				const selectedUnit = unitdata.find(unit => unit.name === selectedUnitName);
				
				imageDiv.setAttribute("data-previousweight",element.getAttribute('data-height'));
				if (selectedUnit) {
					for (const key in selectedUnit) {
						if (selectedUnit.hasOwnProperty(key)) {
							imageDiv.dataset[key] = selectedUnit[key];
						}
					}
					if(selectedUnit.hexes == 2 && selectedUnit.figures == 1)
					{
						var doublespacedid = Math.floor(clickCount / 2);
						imageDiv.setAttribute('data-doublespaceid', doublespacedid)
						if(doublespacepart) {
							image.src = 'assets/sprites/Einar_Symbol.webp';
							$('#armyselectorhuman')[0].selectize.disable();
							$('#armyselectorAI')[0].selectize.disable();
							$("#mySidebar :input, #mySidebar a").prop("disabled", true).addClass("disabled-link");
							$("#sidebarplayer2 :input, #sidebarplayer2 a").prop("disabled", true).addClass("disabled-link");
						}
						else
						{
							image.src = 'assets/sprites/einar3.png';
							$('#armyselectorhuman')[0].selectize.enable(); 
							$('#armyselectorAI')[0].selectize.enable(); 
							$("#mySidebar :input, #mySidebar a").prop("disabled", false).removeClass("disabled-link");
							$("#sidebarplayer2 :input, #sidebarplayer2 a").prop("disabled", false).removeClass("disabled-link");
						}
						doublespacepart = !doublespacepart
						clickCount++;
					}
				}
			}
			
				imageDiv.appendChild(image);
            
			if (player == 0) {
				image.addEventListener('click', function(event) {
					if (!gamestart) {
						event.target.parentElement.remove();
					}
				});
			}
			imageDiv.setAttribute('data-IGPV', imageDiv.getAttribute('data-standard-cost'))
			imageDiv.setAttribute('data-health', imageDiv.getAttribute('data-life'))
            element.appendChild(imageDiv);
			
			if(elementId== null)
			{
				console.log('sdwdwda');
			}
			else
			{
				var unitdiv = document.createElement('div');
				unitdiv.classList.add('unitpadding');
				var actioncontainer = document.createElement('div');
				actioncontainer.classList.add('button-container');
				var button1 = document.createElement('button');
				button1.classList.add('actionbuttons');
				button1.innerHTML = "Info";
				var button2 = document.createElement('button');
				button2.classList.add('actionbuttons');
				button2.innerHTML = "Modify Unit";
				if (player == 0) 
				{
					const name = document.getElementById('armyselectorhuman').value;
					var currentUnits = gameunits;
					console.log(`1Element with ID ${elementId} was selected.`);
					var imagecard = document.createElement('img');
					imagecard.src = 'assets/cards/' + document.getElementById('armyselectorhuman').value + "_b.jpg";
					imagecard.alt = document.getElementById('armyselectorhuman').value + player;
					imagecard.classList.add("armycard");
					imagecard.id = "card" + currentUnits;
					imagecard.addEventListener('click', function() {
					});
					var unitinfospace = document.getElementById('unitinfospace');
					var existingImage = Array.from(unitinfospace.getElementsByTagName('img')).find(img => img.alt === imagecard.alt);
					unitdiv.appendChild(imagecard);
					actioncontainer.appendChild(button1);
					actioncontainer.appendChild(button2);
					unitdiv.appendChild(actioncontainer);
					if (!existingImage) {
						unitinfospace.appendChild(unitdiv);
					}else{console.log("exists");}
					//button1.onclick = onbuttonclicked;
					button1.addEventListener('click', function() {
						showcard(name);
					});

					button2.addEventListener('click', function() {
						modal.classList.add('modal--show');
						playerfront.src = "assets/cards/Breakable Wall Section_b.jpg";
						
						// Assuming the selected unit's name is stored in a variable
						const selectedUnitName = document.getElementById('armyselectorhuman').value;
						const selectedUnit = unitdata.find(unit => unit.name === selectedUnitName);
						
						if (selectedUnit) {
							UnitLife.innerHTML = selectedUnit.life;
							UnitMove.innerHTML = selectedUnit.move;
							UnitRange.innerHTML = selectedUnit.range;
							UnitAttack.innerHTML = selectedUnit.attack;
							UnitDefense.innerHTML = selectedUnit.defense;
							modal__paragraph.innerHTML = `${selectedUnit.power1Name}<br>${selectedUnit.power1Text}<br>${selectedUnit.power2Name}<br>${selectedUnit.power2Text}<br>${selectedUnit.power3Name}<br>${selectedUnit.power3Text}<br>`;
							modal__title.innerHTML = selectedUnit.name;
						}
					});

				//	console.log("dfefjdkhe");
				}
				else
				{
					var imagecard = document.createElement('img');
					imagecard.src = 'assets/cards/' + document.getElementById('armyselectorAI').value + "_b.jpg";
					imagecard.alt = document.getElementById('armyselectorAI').value + player;
					imagecard.id = "card" + currentUnits;
					imagecard.addEventListener('click', function() {
					});
					var aiInfoSpace = document.getElementById('AIinfospace');
					var existingImage = Array.from(aiInfoSpace.getElementsByTagName('img')).find(img => img.alt === imagecard.alt);
					unitdiv.appendChild(imagecard);
					actioncontainer.appendChild(button1);
					actioncontainer.appendChild(button2);
					unitdiv.appendChild(actioncontainer);
					var individualdiv = document.createElement('div');
					individualdiv.id = document.getElementById('armyselectorAI').value + player;
					if (!existingImage) {
					// Create the HTML string
					
					const htmlContent = `
						<div class="image-containerindicator">
							<img src="assets/sprites/Markers/OM0.png" id='`+individualdiv.id+"0M0"+`' class='hidden indicador indicador0' alt="Image 1">
							<img src="assets/sprites/Markers/OM1.png" id='`+individualdiv.id+"0M1"+`' class='hidden indicador indicador1' alt="Image 2">
							<img src="assets/sprites/Markers/OM2.png" id='`+individualdiv.id+"0M2"+`' class='hidden indicador indicador2 indicador1' alt="Image 3">
							<img src="assets/sprites/Markers/OM3.png" id='`+individualdiv.id+"0M3"+`' class='hidden indicador indicador3' alt="Image 4">
							<img src="assets/sprites/Markers/OMX.png" id='`+individualdiv.id+"0MX"+`' class='hidden indicador indicadorx' alt="Image 4">
						</div>
					`;
					const butoncontainer = `<div class="button-container"><button class="actionbuttons">Info</button><button class="actionbuttons">Modify Unit</button></div>`;
					// Get the element by ID

					// Append the HTML content
					individualdiv.insertAdjacentHTML('beforeend', htmlContent);

					individualdiv.appendChild(imagecard);
					individualdiv.insertAdjacentHTML('beforeend', butoncontainer);
					
					aiInfoSpace.appendChild(individualdiv);
					}else{console.log("exists");}
					
					button1.onclick = function() {
						modal.classList.add('modal--show');
						cardimage.src = imagecard.src;
						// Assuming the selected unit's name is stored in a variable
						const selectedUnitName = document.getElementById('armyselectorAI').value;
						const selectedUnit = unitdata.find(unit => unit.name === selectedUnitName);
						if (selectedUnit) {
							UnitLife.innerHTML = selectedUnit.life;
							UnitMove.innerHTML = selectedUnit.move;
							UnitRange.innerHTML = selectedUnit.range;
							UnitAttack.innerHTML = selectedUnit.attack;
							UnitDefense.innerHTML = selectedUnit.defense;
							modal__paragraph.innerHTML = selectedUnit.power1Name + "<br>" + selectedUnit.power1Text + "<br>" + selectedUnit.power2Name + "<br>"+ selectedUnit.power2Text + "<br>" + selectedUnit.power3Name+ selectedUnit.power3Text + "<br>";
							modal__title.innerHTML = selectedUnit.name;
						}
					};
				}

				button2.onclick = function(){
					//modal.classList.add('modal--show');
				}
			}
			gameunits = gameunits + 1;
			
        }
        canbeselected = true;
		}
	else
	{
		if(heightedhex)
		{
			if(element.classList.contains("path"))
			{
				document.querySelectorAll('.hex.path').forEach(hex => {
					hex.classList.remove('path');
				});
				console.log("Distance")
				clickedunit = false;
			}
		}
	//	showNeightbours(element.getAttribute('data-x'),element.getAttribute('data-y'));
		console.log(`2Element with ID ${elementId} was selected.`);
		
		console.log("VARIABLES:");
		//console.log(selectedUnit);
		console.log(AITURN);
		console.log(unithasbeenselected);
			
		   // document.getElementById("unitinfo").classList.remove("hidden");
		unithasbeenselected=true;
	}
	
}
function showcard(name)
{
	modal.classList.add('modal--show');
	playerfront.src = "assets/cards/"+name+"_a.jpg";
	playerback.src = "assets/cards/"+name+"_b.jpg";
	// Assuming the selected unit's name is stored in a variable
	const selectedUnitName = document.getElementById('armyselectorhuman').value;
	const selectedUnit = unitdata.find(unit => unit.name === selectedUnitName);
	if (selectedUnit) {
		UnitLife.innerHTML = selectedUnit.life;
		UnitMove.innerHTML = selectedUnit.move;
		UnitRange.innerHTML = selectedUnit.range;
		UnitAttack.innerHTML = selectedUnit.attack;
		UnitDefense.innerHTML = selectedUnit.defense;
		modal__paragraph.innerHTML = selectedUnit.power1Name + "<br>" + selectedUnit.power1Text + "<br>" + selectedUnit.power2Name + "<br>"+ selectedUnit.power2Text + "<br>" + selectedUnit.power3Name+ selectedUnit.power3Text + "<br>";
		modal__title.innerHTML = selectedUnit.name;
	}
}
function startgame() {
    const hexElements = document.querySelectorAll('.ground');
    const hexElements2 = document.querySelectorAll('.hex');
    // Iterate over each element and remove the 'selected' class
    hexElements.forEach(element => {
        element.classList.remove('selected');
		element.classList.remove('canhover');
    });
    gamestart = true;
    document.getElementById('initialmenu1').classList.add("hidden");
    document.getElementById('initialmenu2').classList.add("hidden");
    document.getElementById('gamemenu1').classList.remove("hidden");
    document.getElementById('gamemenu2').classList.remove("hidden");
	AITURN=false;
    unithasbeenselected=false;
	document.querySelectorAll('.playerUnit').forEach(unit => {
//	alert("selected");
    unit.addEventListener('click', function(event) {
	
		var piecerest = document.getElementById("pathend2");
		if(piecerest != null){piecerest.id='';}
	    console.log("playerUnit SELECTED");
		unitselected = true;
        // Remove 'selected' class from any previously selected unit
        document.querySelectorAll('.playerUnit.selected').forEach(selectedUnit => {
            selectedUnit.classList.remove('selected');
        });

        // Add 'selected' class to the clicked unit
        this.classList.add('selected');
		if(!AITURN) 
		{
			// Get the parent hex element
			const parentHex = this.closest('.hex');
			var startQ = parseInt(parentHex.getAttribute('data-q'));
			var startR = parseInt(parentHex.getAttribute('data-r'));
			 var startS = parseInt(parentHex.getAttribute('data-s'));
			 console.log("CAMINO");
			//showNeightbours(startX,startY);
			// Perform A* pathfinding to find reachable hexes within 5 movements
			document.querySelectorAll('.short-path').forEach(path => {
				path.style.display = 'none';
				path.removeAttribute('id');
				path.remove();
			});
			
			
			
			var reachableHexes = findReachableHexes(startQ, startR,startS, unit.getAttribute('data-move'));

			// Add 'path' class to reachable hexes and set data-distance attribute
			document.querySelectorAll('.hex.path').forEach(hex => {
				hex.classList.remove('path');
			});
			document.querySelectorAll('.hex').forEach(hex => {
				hex.classList.add('darken');
			});
			reachableHexes.forEach(hex => {
				if (checkHex(hex.element)) {
					hex.element.classList.add('path');
					hex.element.setAttribute('data-distance', hex.distance);
				}
			});
		}
    });
});
}
function getDistance(startQ, startR, startS, targetQ, targetR, targetS) {
    // Calculate the differences in each coordinate
    const dq = Math.abs(startQ - targetQ);
    const dr = Math.abs(startR - targetR);
    const ds = Math.abs(startS - targetS);

    // The distance is the maximum of these differences
    return Math.max(dq, dr, ds);
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function findReachableHexes(startQ, startR, startS, maxDistance) {

    const startHex = document.querySelector(`.hex[data-q="${startQ}"][data-r="${startR}"][data-s="${startS}"]`);
    const startHeight = parseInt(startHex.getAttribute('data-height'));

    const queue = [{
        q: startQ,
        r: startR,
        s: startS,
        distance: 0,
        height: startHeight
    }];
    const visited = new Map();
    const reachableHexes = [];

    while (queue.length > 0) {
        const { q, r, s, distance, height } = queue.shift();
        const key = `${q},${r},${s}`;

        if (visited.has(key) && visited.get(key) <= distance) {
            continue;
        }

        visited.set(key, distance);
        reachableHexes.push({
            element: document.querySelector(`.hex[data-q="${q}"][data-r="${r}"][data-s="${s}"]`),
            distance: distance
        });

        if (distance < maxDistance) {
            const neighbors = getHexNeighbors(q, r, s);
            neighbors.forEach(neighbor => {
                const neighborElement = document.querySelector(`.hex[data-q="${neighbor.q}"][data-r="${neighbor.r}"][data-s="${neighbor.s}"]`);
                
                if (neighborElement) {
                    const neighborHeight = parseInt(neighborElement.getAttribute('data-height'));
					const neighbortype = parseInt(neighborElement.getAttribute('data-type'));
					const heightDifference = neighborHeight - height;
					const movementCost = heightDifference > 0 ? heightDifference + 1 : 1;

                    if (distance + movementCost <= maxDistance) {
                        queue.push({
                            q: neighbor.q,
                            r: neighbor.r,
                            s: neighbor.s,
                            distance: distance + movementCost,
                            height: neighborHeight
                        });
                    }
                }
            });
        }
    }
    return reachableHexes;
}

function showNeightbours(x,y)
{
	const neighbors = getHexNeighbors(x, y);
	neighbors.forEach(neighbor => {
		console.log("Neightbour of (" + x + "," + y+") :(" + neighbor.x + "," + neighbor.y + ") ");
	});
}

function getHexNeighbors(q, r, s) {
    // Define neighbor directions in cube coordinates
    const directions = [
        { dq: 1, dr: -1, ds: 0 },  // Right-Up
        { dq: 1, dr: 0, ds: -1 },  // Right-Down
        { dq: 0, dr: 1, ds: -1 },  // Down
        { dq: -1, dr: 1, ds: 0 },  // Left-Down
        { dq: -1, dr: 0, ds: 1 },  // Left-Up
        { dq: 0, dr: -1, ds: 1 }   // Up
    ];

    // Calculate and return the neighbor coordinates
    return directions.map(dir => ({
        q: q + dir.dq,
        r: r + dir.dr,
        s: s + dir.ds
    }));
}

function checkHex(hex) {
    if (hex) {
        return true;
    }
    return false;
}
function findShortestPath(startQ, startR, startS, targetQ, targetR, targetS) {
    const startHex = document.querySelector(`.hex[data-q="${startQ}"][data-r="${startR}"][data-s="${startS}"]`);
    const targetHex = document.querySelector(`.hex[data-q="${targetQ}"][data-r="${targetR}"][data-s="${targetS}"]`);
    const distances = {};
    const previous = {};
    const queue = new PriorityQueue();
    // Initialize distances and queue
    document.querySelectorAll('.hex').forEach(hex => {
        const q = parseInt(hex.getAttribute('data-q'));
        const r = parseInt(hex.getAttribute('data-r'));
        const s = parseInt(hex.getAttribute('data-s'));
        const key = `${q},${r},${s}`;
        distances[key] = Infinity;
        previous[key] = null;
        queue.enqueue({ q, r, s }, Infinity);
    });
    distances[`${startQ},${startR},${startS}`] = 0;
    queue.enqueue({ q: startQ, r: startR, s: startS }, 0);

    while (!queue.isEmpty()) {
        const { q, r, s } = queue.dequeue().element;
        const key = `${q},${r},${s}`;
        if (q === targetQ && r === targetR && s === targetS) {
            break;
        }
        const neighbors = getHexNeighbors(q, r, s);
        neighbors.forEach(neighbor => {
            const neighborElement = document.querySelector(`.hex[data-q="${neighbor.q}"][data-r="${neighbor.r}"][data-s="${neighbor.s}"]`);
            if (neighborElement) {
                const neighborHeight = parseInt(neighborElement.getAttribute('data-height'));
				const neighbortype = parseInt(neighborElement.getAttribute('data-type'));
				if(neighborHeight < 100)
				{
				//	console.log("HEX : (" + startQ + ","+startR + ","+startS + ")");
				//	console.log("HEX ID: " + startHex.id);
					const heightDifference = Math.abs(neighborHeight - parseInt(startHex.getAttribute('data-height')));
					const movementCost = heightDifference > 0 ? heightDifference + 1 : 1;
					const alt = distances[key] + movementCost;
					
					const neighborKey = `${neighbor.q},${neighbor.r},${neighbor.s}`;
					if (alt < distances[neighborKey]) {
						distances[neighborKey] = alt;
						previous[neighborKey] = { q, r, s };
						queue.enqueue({ q: neighbor.q, r: neighbor.r, s: neighbor.s }, alt);
					}
				}
            }
        });
    }

    // Reconstruct the shortest path with directions
    const path = [];
    let step = { q: targetQ, r: targetR, s: targetS };
    while (step) {
        const hex = document.querySelector(`.hex[data-q="${step.q}"][data-r="${step.r}"][data-s="${step.s}"]`);
        const prevStep = previous[`${step.q},${step.r},${step.s}`];
        if (prevStep) {
            const direction = calculateAngle(prevStep, step);
            path.unshift({ hex, direction });
        } else {
            path.unshift({ hex, direction: null });
        }
        step = prevStep;
    }
    return path;
}

function calculateAngle(currentHex, nextHex) {
    const deltaQ = nextHex.q - currentHex.q;
    const deltaR = nextHex.r - currentHex.r;
    const deltaS = nextHex.s - currentHex.s;

    if (deltaQ === 1 && deltaR === -1 && deltaS === 0) return 30;  // Right-Up
    if (deltaQ === 1 && deltaR === 0 && deltaS === -1) return 330;  // Right-Down
    if (deltaQ === 0 && deltaR === 1 && deltaS === -1) return 270; // Down
    if (deltaQ === -1 && deltaR === 1 && deltaS === 0) return 210; // Left-Down
    if (deltaQ === -1 && deltaR === 0 && deltaS === 1) return 150; // Left-Up
    if (deltaQ === 0 && deltaR === -1 && deltaS === 1) return 90; // Up

    return 0; // Default angle
}


// Priority Queue implementation
class PriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        if (this.isEmpty()) {
            this.collection.push(queueElement);
        } else {
            let added = false;
            for (let i = 0; i < this.collection.length; i++) {
                if (queueElement.priority < this.collection[i].priority) {
                    this.collection.splice(i, 0, queueElement);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.collection.push(queueElement);
            }
        }
    }

    dequeue() {
        return this.collection.shift();
    }

    isEmpty() {
        return this.collection.length === 0;
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    const inicial = document.getElementById('inicial');
    let scale = 1;
    let rotate = 0;
    let startX, startY, initialRotate;
    let isDragging = false;
    let dragStartX, dragStartY;
    let translateX = 0, translateY = 0;

    // Mouse wheel zoom
    inicial.addEventListener('wheel', (e) => {
        e.preventDefault();
        scale += e.deltaY * -0.0005;
        scale = Math.min(Math.max(.125, scale), 4);
        inicial.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
    });

    // Mouse drag move
    inicial.addEventListener('mousedown', (e) => {
        if (e.shiftKey) {
            // Rotating
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            initialRotate = rotate;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        } else {
            // Dragging
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', onDragEnd);
        }
    });

    function onMouseMove(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        rotate = initialRotate + dx * 0.1;
        inicial.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    function onDragMove(e) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        translateX += dx;
        translateY += dy;
        inicial.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    }

    function onDragEnd() {
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        isDragging = false;
    }

    // Touch pinch zoom and rotate
    let initialDistance = 0;
    let initialAngle = 0;

    inicial.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDistance = getDistance(e.touches);
            initialAngle = getAngle(e.touches);
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        }
    });

    function onTouchMove(e) {
        if (e.touches.length === 2) {
            const currentDistance = getDistance(e.touches);
            const currentAngle = getAngle(e.touches);
            scale *= currentDistance / initialDistance;
            rotate += currentAngle - initialAngle;
            inicial.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            initialDistance = currentDistance;
            initialAngle = currentAngle;
        }
    }

    function onTouchEnd() {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    }

    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function getAngle(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.atan2(dy, dx) * (180 / Math.PI);
    }
});

closeModal.addEventListener('click', (e)=>{
	e.preventDefault();
	modal1.classList.remove('modal--show');
	UnitStatsColumn.classList.remove('hidden');
	iacard.parentElement.classList.add('hidden');
	modal_versus.classList.remove('two-images');
});

function battle(unitname1,unitname2)
{
	iacard.parentElement.classList.remove('hidden');
	playercard.classList.remove('hidden');
	UnitStatsColumn.classList.remove('hidden');
	modal_versus.classList.add('two-images');
	modal1.classList.add('modal--show');
	playerback.src = "assets/cards/"+unitname1+"_a.jpg";
	playerfront.src = "assets/cards/"+unitname1+"_b.jpg";
	UnitStatsColumn.classList.add('hidden');
	UnitLife.innerHTML = selectedUnit.life;
	UnitMove.innerHTML = selectedUnit.move;
	UnitRange.innerHTML = selectedUnit.range;
	UnitAttack.innerHTML = selectedUnit.attack;
	UnitDefense.innerHTML = selectedUnit.defense;
	modal__paragraph.innerHTML = unitname1 + " is attacking " + unitname2;
	modal__title.innerHTML =  unitname1 + " vs " +unitname2;
	iafront.src = "assets/cards/"+unitname2+"_b.jpg";
	iaback.src = "assets/cards/"+unitname2+"_a.jpg";
}
/*
if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape-primary').catch(function(error) {
        console.error('Orientation lock failed: ', error);
    });
}*/
// Function to show the modal2 and load new content

// Function to close the modal and restore the original content


const modalContent = document.getElementById("modalcontent");
function showDiceModal(dice) {
    modal2.classList.add('modal--show');
    

    let url = dice === 20 ? 'Dice/20/index.html' : 'Dice/6/index.html';

    fetch(url)
        .then(response => response.text())
        .then(data => {
            modalContent.innerHTML = data;
            // Reinitialize scripts
            reinitializeScripts(modalContent);
        })
        .catch(error => {
            console.error('Error loading the content:', error);
        });
}
function closeModal2() {
    modal2.classList.remove('modal--show');
    if (modalContent) {
        modalContent.innerHTML = ''; // Clear the content of the modal
    }
}
function reinitializeScripts(modalContent2) {
    const scripts = modalContent2.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
        document.body.removeChild(newScript);
    });
}



document.getElementById("closemodal").addEventListener('click', (e)=>{
    e.preventDefault();
    modal2.classList.remove('modal--show');
});
// Add event listener to the close button
//document.getElementById('close-modal2').addEventListener('click', closeModal);
