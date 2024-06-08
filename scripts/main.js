document.addEventListener("DOMContentLoaded", function () {
	const cardsContainer = document.getElementById("cards");
	const drawings = JSON.parse(localStorage.getItem("drawings")) || [];

	drawings.forEach((drawing) => {
		const li = document.createElement("li");
		li.classList.add("card");
		li.innerHTML = `
		<img class="art" src="${drawing.dataURL}" alt="${drawing.title}" />
		<img class="frame" src="./images/frame.png" alt="Frame" />
		<div class="caption"><label class="caption_title">${drawing.title}</label><hr style="margin:3px" /><div class="caption_detail"><label>pixel on canvas</label>
		<label>600 x 415.03 px</label><label>2024</label></div></div>
	  `;
		li.addEventListener("click", () => showModal(drawing.dataURL));
		cardsContainer.appendChild(li);
	});

	const audio = document.getElementById("bgm");
	audio.volume = 0.1;

	document.addEventListener("scroll", function () {
		const cards = document.querySelectorAll(".card");
		const layers = document.querySelectorAll(".layer");
		const logo = document.getElementById("logo");

		const scrollY = window.scrollY;
		const viewportHeight = window.innerHeight;

		// 로고 효과
		const scaleFactor = Math.min(1 + scrollY / (viewportHeight / 2), 5); // 비율을 크게 조정
		logo.style.width = `${90 * scaleFactor}px`;

		// 패럴랙스 효과
		layers.forEach((layer, index) => {
			const depth = index === 0 ? 1 : 100;
			const scale = 1 + (scrollY / (viewportHeight * 5)) * depth;
			layer.style.transform = `scale(${scale})`;
		});

		// 카드 상태 업데이트
		cards.forEach((card) => {
			const cardPosition = card.getBoundingClientRect().top;
			const cardHeight = card.offsetHeight;
			const cardCenter = cardPosition + cardHeight / 2;
			const viewportCenter = viewportHeight / 2;

			// 현재 상태 초기화
			card.classList.remove("previous", "next");

			if (Math.abs(cardCenter - viewportCenter) < cardHeight / 4) {
				card.classList.remove("previous", "next");
			} else if (cardCenter < viewportCenter - cardHeight / 4) {
				card.classList.add("previous");
			} else if (cardCenter > viewportCenter + cardHeight / 4) {
				card.classList.add("next");
			}
		});

		// 커튼 효과
		const leftCurtain = document.querySelector(".curtain-left");
		const rightCurtain = document.querySelector(".curtain-right");
		const startScroll = viewportHeight;
		const endScroll = viewportHeight * 1.5;

		if (scrollY >= startScroll && scrollY <= endScroll) {
			const progress = (scrollY - startScroll) / (endScroll - startScroll);
			const offset = 100 * progress;

			leftCurtain.style.transform = `translateX(${offset}%)`;
			rightCurtain.style.transform = `translateX(${-offset}%)`;
		} else if (scrollY < startScroll) {
			leftCurtain.style.transform = "translateX(-100%)";
			rightCurtain.style.transform = "translateX(100%)";
		} else if (scrollY > endScroll) {
			leftCurtain.style.transform = "translateX(100%)";
			rightCurtain.style.transform = "translateX(-100%)";
		}
	});

	// 스크롤 스냅 함수
	function snapToCard() {
		const cards = document.querySelectorAll(".card");
		const viewportHeight = window.innerHeight;
		const viewportCenter = viewportHeight / 2;
		let closestCard = null;
		let minDistance = Number.MAX_VALUE;

		cards.forEach((card) => {
			const cardPosition = card.getBoundingClientRect().top;
			const cardHeight = card.offsetHeight;
			const cardCenter = cardPosition + cardHeight / 2;
			const distance = Math.abs(cardCenter - viewportCenter);

			if (distance < minDistance) {
				minDistance = distance;
				closestCard = card;
			}
		});

		if (closestCard) {
			closestCard.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}

	// 스크롤 이벤트가 끝났을 때 스냅을 호출
	let isScrolling;
	window.addEventListener("scroll", function () {
		const mainContainer = document.querySelector(".main-container");
		const mainContainerHeight = mainContainer.offsetHeight;
		const scrollY = window.scrollY;

		// main-container가 지나고 난 후에만 스냅 기능이 작동하도록 조건 추가
		if (scrollY > mainContainerHeight) {
			window.clearTimeout(isScrolling);
			isScrolling = setTimeout(snapToCard, 50); // 스냅 트리거 시간을 줄여 빠르게 반응하도록 설정
		}
	});
});

function showLoaderAndNavigate() {
	const loader = document.getElementById("loader");
	loader.classList.remove("hidden");

	setTimeout(() => {
		document.body.classList.add("reveal");

		setTimeout(() => {
			window.location.href = "./pages/canvas.html";
		}, 1300);
	}, 100); // 100ms 후에 reveal 클래스를 추가하여 애니메이션 시작
}

function showModal(imageSrc) {
	const modal = document.getElementById("modal");
	const modalArt = modal.querySelector(".modal-content");
	const modalArts = modal.querySelector(".modalArt");

	modalArts.src = imageSrc;
	modal.classList.add("visible");

	modalArt.onmousemove = (e) => {
		const rect = modalArts.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		const lightX = 100 - x;
		const lightY = 100 - y;
		requestAnimationFrame(() => {
			modalArt.style.setProperty("--mouseX", `${x}%`);
			modalArt.style.setProperty("--mouseY", `${y}%`);
			modalArt.style.setProperty("--lightX", `${lightX}%`);
			modalArt.style.setProperty("--lightY", `${lightY}%`);
			modalArt.style.transform = `perspective(1000px) rotateY(${(x - 50) / 5}deg) rotateX(${
				-(y - 50) / 5
			}deg)`;
		});
	};

	modalArt.onmouseleave = () => {
		modalArt.style.setProperty("--mouseX", "50%");
		modalArt.style.setProperty("--mouseY", "50%");
		modalArt.style.setProperty("--lightX", "50%");
		modalArt.style.setProperty("--lightY", "50%");
		modalArt.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
	};

	modal.addEventListener("mousemove", handleMouseMove);
	modal.addEventListener("mouseleave", handleMouseLeave);
}

function hideModal(event) {
	const modal = document.getElementById("modal");
	if (event.target === modal) {
		modal.classList.remove("visible");
	}
}
