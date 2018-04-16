import AnimeNotifier from "../AnimeNotifier"
import { findAllInside } from "../Utils";
import { showSearchResults } from "./Search"

// newAnimeDiffIgnore
export function newAnimeDiffIgnore(arn: AnimeNotifier, button: HTMLButtonElement) {
	if(!confirm("Are you sure you want to permanently ignore this difference?")) {
		return
	}

	let id = button.dataset.id
	let hash = button.dataset.hash

	arn.post(`/api/new/ignoreanimedifference`, {
		id,
		hash
	})
	.then(() => {
		arn.reloadContent()
	})
	.catch(err => arn.statusMessage.showError(err))
}

// Import Kitsu anime
export async function importKitsuAnime(arn: AnimeNotifier, button: HTMLButtonElement) {
	let newTab = window.open()
	let animeId = button.dataset.id
	let response = await fetch(`/api/import/kitsu/anime/${animeId}`, {
		method: "POST",
		credentials: "same-origin"
	})

	if(response.ok) {
		newTab.location.href = `/kitsu/anime/${animeId}`
		arn.reloadContent()
	} else {
		arn.statusMessage.showError(await response.text())
	}
}

// Multi-search anime
export async function multiSearchAnime(arn: AnimeNotifier, textarea: HTMLTextAreaElement) {
	let results = document.getElementById("multi-search-anime") as HTMLDivElement
	let animeTitles = textarea.value.split("\n")
	let animeIDs = new Array<string>(animeTitles.length)

	results.innerHTML = ""

	for(let i = 0; i < animeTitles.length; i++) {
		console.log(animeTitles[i])
		let response = await fetch("/_/anime-search/" + animeTitles[i])
		let html = await response.text()
		results.innerHTML += "<h3>" + animeTitles[i] + "</h3>" + html
	}

	results.classList.remove("hidden")
	showSearchResults(arn, results)
}