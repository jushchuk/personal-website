// guided by https://webdevtrick.com/infinite-image-cards-scrolling/

document.addEventListener("DOMContentLoaded",() => {
    let imgGrid = new ImageGrid({ id: "one" });
});
 
class ImageGrid {
	constructor(args) {
		this.container = document.querySelector(`#${args.id}`);
		this.blockClass = "image-grid";
		this.cardContent = null;
		this.status = null;
		this.page = 1;
		this.imagesPerRequest = 100;
		this.observer = new IntersectionObserver(
		(entries, self) => {
		entries.forEach(entry => {
		if (entry.isIntersecting) {
		// since only the last loaded image should be observed, there will be “baton passing” of being observed
		self.unobserve(entry.target);
 
		// keep adding cards until all images on have been loaded
		let cards = this.getCards(),
		cardCount = cards.length,
		cardsAtPageStart = (this.page - 1) * this.imagesPerRequest,
		contentIndex = cardCount - cardsAtPageStart;
 
		if (cardCount < cardsAtPageStart + this.cardContent.length) {
		this.addCard(this.cardContent[contentIndex]);
		// observe the next card
		cards = this.getCards();
		self.observe(cards[cardCount]);
 
		} else {
		++this.page;
		this.requestImages(this.imagesPerRequest,this.page);
		}
		}
		});
		},
		{
		root: null,
		rootMargin: "0px 0px 0px 0px",
		threshold: 0.99
		}
		);
		this.createStatus();
		this.requestImages(this.imagesPerRequest);
	}
	createStatus() {
		// status container
		this.status = document.createElement("div");
		this.status.className = `${this.blockClass}__status`;
		this.container.appendChild(this.status);
 
		// preloader and status text
		let preloader = document.createElement("div"),
		statusMsg = document.createElement("p"),
		statusMsgText = document.createTextNode("Loading…");
 
		preloader.className = "pl pl-fade";
		this.status.appendChild(preloader);
		this.status.appendChild(statusMsg);
		statusMsg.appendChild(statusMsgText);
	}
	setStatus(msg) {
		if (this.status !== null) {
		let preloader = this.status.querySelector(".pl"),
		statusMsg = this.status.querySelector("p");
 
		// remove the preloader
		this.status.removeChild(this.status.firstChild);
 
		// set the status text
		statusMsg.innerHTML = msg;
		}
	}
	killStatus() {
		// remove both the preloader and status text
		if (this.status !== null) {
		let parent = this.status.parentElement;
		parent.removeChild(parent.firstChild);
		this.status = null;
		}
	}
	requestImages(perPage = 20,page = 1) {
		// hard limits set by the Pixabay API
		if (perPage < 3)
		perPage = 3;
		else if (perPage > 200)
		perPage = 200;
 
		if (page < 1)
		page = 1;
 
		// parameters of request
		let APIKey = "REDACTED",
		query = "castle",
		minWidth = 270,
		minHeight = 180,
		url = `https://pixabay.com/api/?key=${APIKey}&q=${query}&image_type=photo&min_width=${minWidth}&min_height=${minHeight}&per_page=${perPage}&page=${page}&safesearch=true`;
 
		// send request
		this.requestJSON(url).then(items => {
		this.cardContent = items;
		// first card of request, removing status if necessary
		if (this.cardContent !== null && this.cardContent.length) {
		this.killStatus();
		this.addCard(this.cardContent[0]);
 
		let firstCard = this.container.lastChild;
		this.observer.observe(firstCard);
 
		} else {
		// …or no cards (set status if first request)
		this.setStatus("Nothing to show here…");
		}
 
		}).catch(msg => {
		this.setStatus(msg);
		});
	}
	requestJSON(resource) {
		return new Promise((resolve,reject) => {
		let request = new XMLHttpRequest();
 
		request.open("GET",resource,true);
		request.onload = function() {
		let items = null;
		// atttempt to supply items
		try {
		let response = JSON.parse(this.response);
		items = [...response.hits];
 
		} catch (err) {
		items = [];
		}
		resolve(items);
		};
		request.onerror = () => {
		reject("It appears you’re offline. Check your connection and try again.");
		};
		request.send();
		});
	}
	addCard(content) {
		let data = {
		title: content.tags || "untitled",
		link: content.pageURL || "#0",
		thumbnail: content.webformatURL.replace("640.jpg","180.jpg") || "https://i.ibb.co/6Whjrmx/placeholder.png",
		thumbWidth: content.webformatWidth / 2 || 1,
		thumbHeight: content.webformatHeight / 2 || 1
		},
		card = document.createElement("div"),
		thumbLink = document.createElement("a"),
		thumb = document.createElement("img"),
		cardTitle = document.createElement("span"),
		cardTitleText = document.createTextNode(data.title);
 
		// card itself
		card.className = `${this.blockClass}__card`;
		this.container.appendChild(card);
 
		// thumbnail link
		thumbLink.href = data.link;
		thumbLink.rel = "noopener noreferrer";
		thumbLink.target = "_blank";
		card.appendChild(thumbLink);
 
		thumb.className = `${this.blockClass}__card-thumb`;
		// allow portrait images to touch the left and right side of cards
		if (data.thumbWidth < data.thumbHeight)
		thumb.classList.add(`${this.blockClass}__card-thumb--portrait`);
 
		thumb.src = data.thumbnail;
		thumb.width = data.thumbWidth;
		thumb.height = data.thumbHeight;
		thumb.alt = data.title;
		thumbLink.appendChild(thumb);
 
		// card title
		cardTitle.className = `${this.blockClass}__card-title`;
		cardTitle.title = data.title;
		card.appendChild(cardTitle);
		cardTitle.appendChild(cardTitleText);
	}
	getCards() {
		return this.container.querySelectorAll(`.${this.blockClass}__card`);
	}
}
