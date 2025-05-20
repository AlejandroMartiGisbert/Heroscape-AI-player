let selectedMap = 1;

function updateSelection(mapNumber, imageSrc) {
	selectedMap = mapNumber;
	document.getElementById('display-image').src = imageSrc;
	document.getElementById('dynamic-button').style.display = "block";
}

function redirect() {
	if (selectedMap) {
		window.location.href = "https://alejandromartigisbert.github.io/Heroscape-AI-player/editor.html?selectedmap=" + selectedMap;
	}
}
	var pause = false;
function toggleFullscreen()
{
	const elem = document.documentElement; // Fullscreen the entire document

	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) { /* Safari */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE11 */
		elem.msRequestFullscreen();
	}
}
const playimage = document.getElementById('iconimage');
const audioElement = document.getElementById('background-music'); const playButton = document.getElementById('play-button'); const isPlayingKey = 'isPlaying';
function togglePlayPause() {
    if (audioElement.paused) {
        audioElement.play();
        playButton.firstChild.classList.add("fa-volume-xmark");
        playButton.firstChild.classList.remove("fa-volume-high");
    } else {
        audioElement.pause();
        playButton.firstChild.classList.remove("fa-volume-xmark");
        playButton.firstChild.classList.add("fa-volume-high");
    }
}

document.getElementById('background-music').volume = 0.5; // Adjust volume as needed
document.getElementById('background-music').muted = false
const slideshowContainer = document.querySelector('.slideshow-container');
const images = [
    'menu/Heroscape1.jpg',
    'menu/Heroscape2.jpg',
    'menu/Heroscape3.jpg',
	'menu/Heroscape4.jpg',
	'menu/Heroscape5.jpg',
	'menu/Heroscape6.jpeg',
];

let currentIndex = 0;

function changeBackgroundImage() {
	if (!pause)
	{
		slideshowContainer.style.backgroundImage = `url(${images[currentIndex]})`;

		currentIndex = (currentIndex + 1) % images.length;
	}
}
function toggleBackgroundPause()
{
	pause = !pause;
	if(pause)
	{
		playimage.firstChild.classList.add("fa-play");
		playimage.firstChild.classList.remove("fa-pause");
	}
	else
	{
		playimage.firstChild.classList.remove("fa-play");
		playimage.firstChild.classList.add("fa-pause");
	}
}
setInterval(changeBackgroundImage, 3000); // Change image every 3 seconds

// Initial call to set the first image
changeBackgroundImage();

	var menu_changed = false;
        // Store initial content for undo functionality
        const initialContent = document.getElementById('initial_menu').innerHTML;
		function changeMenu(target)
		{
		target = target + ".html";
			if(menu_changed)
			{
				undoReplaceContent();
			}
			else
			{
				replaceContent(target);
			}
			menu_changed = !menu_changed;
		}
        // Function to replace content with Honeycomb.html content
		function replaceContent(target) {
			const menuDiv = document.getElementById('initial_menu');
			if (!menuDiv) {
				console.error('Element with ID "initial_menu" not found.');
				return;
			}

			menuDiv.style.opacity = 0; // Start fade-out transition

			setTimeout(() => {
				fetch(target) // Load the target HTML file
					.then(response => {
						if (!response.ok) {
							throw new Error(`HTTP error! Status: ${response.status}`);
						}
						return response.text();
					})
					.then(data => {
						menuDiv.innerHTML = data;
						menuDiv.style.opacity = 1; // Fade-in transition
					})
					.catch(error => console.error('Error fetching content:', error));
			}, 500); // Match the transition duration
		}

        // Function to undo the content replacement
        function undoReplaceContent() {
            const menuDiv = document.getElementById('initial_menu');
            menuDiv.style.opacity = 0; // Start fade out transition

            setTimeout(() => {
                menuDiv.innerHTML = initialContent;
                menuDiv.style.opacity = 1; // Fade in transition
            }, 500); // Match the transition duration
        }

        function savePreferences() {
            let bgColor = document.getElementById('bgColor').value;
            let textColor = document.getElementById('textColor').value;

            localStorage.setItem('bgColor', bgColor);
            localStorage.setItem('textColor', textColor);

            applyPreferences();
        }

        function applyPreferences() {
            let bgColor = localStorage.getItem('bgColor');
            let textColor = localStorage.getItem('textColor');

            if (bgColor) document.body.style.backgroundColor = bgColor;
            if (textColor) document.body.style.color = textColor;
        }

        // Apply preferences when the page loads
        window.onload = applyPreferences;

        let selectedMap = null;

        function updateSelection(mapNumber, imageSrc) {
            selectedMap = mapNumber;
            document.getElementById('display-image').src = imageSrc;
            document.getElementById('dynamic-button').style.display = "block";
        }

        function redirect() {
            if (selectedMap) {
                window.location.href = `Heroscape/editor.html?selectedmap=${selectedMap}`;
            }
        }